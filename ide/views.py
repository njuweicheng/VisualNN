import os
import sys
import yaml
import copy
import json
from caffe_app.models import Network, NetworkVersion, NetworkUpdates
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from utils.shapes import get_shapes, get_layer_shape, handle_concat_layer
from scripts.train_model import start_train_model
#from scripts.train import vision

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def index(request):
    return render(request, 'index.html')


@csrf_exempt
def fetch_layer_shape(request):
    if request.method == 'POST':
        net = yaml.safe_load(request.POST.get('net'))
        layerId = request.POST.get('layerId')
        try:
            net[layerId]['shape'] = {}
            net[layerId]['shape']['input'] = None
            net[layerId]['shape']['output'] = None
            dataLayers = ['ImageData', 'Data', 'HDF5Data', 'Input', 'WindowData', 'MemoryData', 'DummyData']

            # Obtain input shape of new layer
            if (net[layerId]['info']['type'] == "Concat"):
                for parentLayerId in net[layerId]['connection']['input']:
                    # Check if parent layer have shapes
                    if (net[parentLayerId]['shape']['output']):
                        net[layerId]['shape']['input'] = handle_concat_layer(net[layerId], net[parentLayerId])
            elif (not (net[layerId]['info']['type'] in dataLayers)):
                if (len(net[layerId]['connection']['input']) > 0):
                    parentLayerId = net[layerId]['connection']['input'][0]
                    # Check if parent layer have shapes
                    if (net[parentLayerId]['shape']['output']):
                        net[layerId]['shape']['input'] = net[parentLayerId]['shape']['output'][:]

            # Obtain output shape of new layer
            if (net[layerId]['info']['type'] in dataLayers):
                # handling Data Layers separately
                if ('dim' in net[layerId]['params'] and len(net[layerId]['params']['dim'])):
                    # layers with empty dim parameter can't be passed
                    net[layerId]['shape']['input'], net[layerId]['shape']['output'] =\
                            get_layer_shape(net[layerId])
                elif ('dim' not in net[layerId]['params']):
                    # shape calculation for layers with no dim param
                    net[layerId]['shape']['input'], net[layerId]['shape']['output'] =\
                            get_layer_shape(net[layerId])
            else:
                if (net[layerId]['shape']['input']):
                    net[layerId]['shape']['output'] = get_layer_shape(net[layerId])
        except BaseException:
            return JsonResponse({
                'result': 'error', 'error': str(sys.exc_info()[1])})
        return JsonResponse({'result': 'success', 'net': net})


@csrf_exempt
def calculate_parameter(request):
    if request.method == 'POST':
        net = yaml.safe_load(request.POST.get('net'))
        try:
            # While calling get_shapes we need to remove the flag
            # added in frontend to show the parameter on pane
            netObj = copy.deepcopy(net)
            for layerId in netObj:
                for param in netObj[layerId]['params']:
                    netObj[layerId]['params'][param] = netObj[layerId]['params'][param][0]
            # use get_shapes method to obtain shapes of each layer
            netObj = get_shapes(netObj)
            for layerId in net:
                net[layerId]['shape'] = {}
                net[layerId]['shape']['input'] = netObj[layerId]['shape']['input']
                net[layerId]['shape']['output'] = netObj[layerId]['shape']['output']
        except BaseException:
            return JsonResponse({
                'result': 'error', 'error': str(sys.exc_info()[1])})
        return JsonResponse({'result': 'success', 'net': net})


@csrf_exempt
def save_to_db(request):
    print("In function save_to_db")
    if request.method == 'POST':
        net = request.POST.get('net')
        net_name = request.POST.get('net_name')
        user_id = request.POST.get('user_id')
        next_layer_id = request.POST.get('nextLayerId')
        public_sharing = True
        user = None
        if net_name == '':
            net_name = 'Net'
        try:
            # making model sharing public by default for now
            # TODO: Prvilege on Sharing
            if user_id:
                user_id = int(user_id)
                user = User.objects.get(id=user_id)

            # create a new model on share event
            model = Network(name=net_name, public_sharing=public_sharing, author=user)
            model.save()
            # create first version of model
            model_version = NetworkVersion(network=model, network_def=net)
            model_version.save()
            # create initial update for nextLayerId
            model_update = NetworkUpdates(network_version=model_version,
                                          updated_data=json.dumps({'nextLayerId': next_layer_id}),
                                          tag='ModelShared')
            model_update.save()

            return JsonResponse({'result': 'success', 'id': model.id})
        except:
            return JsonResponse({'result': 'error', 'error': str(sys.exc_info()[1])})


def create_network_version(network_def, updates_batch):
    network_def = yaml.safe_load(network_def)
    next_layer_id = 0

    for network_update in updates_batch:
        updated_data = json.loads(network_update.updated_data)
        tag = network_update.tag

        if 'nextLayerId' in updated_data:
            next_layer_id = updated_data['nextLayerId']

        if tag == 'UpdateParam':
            # Update Param UI event handling
            param = updated_data['param']
            layer_id = updated_data['layerId']
            value = updated_data['value']

            if updated_data['isProp']:
                network_def[layer_id]['props'][param] = value
            else:
                network_def[layer_id]['params'][param][0] = value

        elif tag == 'DeleteLayer':
            # Delete layer UI event handling
            layer_id = updated_data['layerId']
            input_layer_ids = network_def[layer_id]['connection']['input']
            output_layer_ids = network_def[layer_id]['connection']['output']

            for input_layer_id in input_layer_ids:
                network_def[input_layer_id]['connection']['output'].remove(layer_id)

            for output_layer_id in output_layer_ids:
                network_def[output_layer_id]['connection']['input'].remove(layer_id)

            del network_def[layer_id]

        elif tag == 'AddLayer':
            # Add layer UI event handling
            prev_layer_id = updated_data['prevLayerId']
            new_layer_id = updated_data['layerId']

            if isinstance(prev_layer_id, list):
                for layer_id in prev_layer_id:
                    network_def[layer_id]['connection']['output'].append(new_layer_id)
            else:
                network_def[prev_layer_id]['connection']['output'].append(new_layer_id)
            network_def[new_layer_id] = updated_data['layer']

        elif tag == 'AddComment':
            layer_id = updated_data['layerId']
            comment = updated_data['comment']

            if ('comments' not in network_def[layer_id]):
                network_def[layer_id]['comments'] = []
            network_def[layer_id]['comments'].append(comment)

    return {
        'network': network_def,
        'next_layer_id': next_layer_id
    }


def get_network_version(netObj):
    network_version = NetworkVersion.objects.filter(network=netObj).order_by('-created_on')[0]
    updates_batch = NetworkUpdates.objects.filter(network_version=network_version).order_by('created_on')

    return create_network_version(network_version.network_def, updates_batch)


def get_checkpoint_version(netObj, checkpoint_id):
    network_update = NetworkUpdates.objects.get(id=checkpoint_id)
    network_version = network_update.network_version

    updates_batch = NetworkUpdates.objects.filter(network_version=network_version)\
                                          .filter(created_on__lte=network_update.created_on)\
                                          .order_by('created_on')
    return create_network_version(network_version.network_def, updates_batch)


@csrf_exempt
def load_from_db(request):
    if request.method == 'POST':
        if 'proto_id' in request.POST:
            try:
                model = Network.objects.get(id=int(request.POST['proto_id']))
                version_id = None
                data = {}

                if 'version_id' in request.POST and request.POST['version_id'] != '':
                    # added for loading any previous version of model
                    version_id = int(request.POST['version_id'])
                    data = get_checkpoint_version(model, version_id)
                else:
                    # fetch the required version of model
                    data = get_network_version(model)

                net = data['network']
                next_layer_id = data['next_layer_id']

                # authorizing the user for access to model
                if not model.public_sharing:
                    return JsonResponse({'result': 'error',
                                         'error': 'Permission denied for access to model'})
            except Exception:
                return JsonResponse({'result': 'error',
                                     'error': 'No network file found'})
            return JsonResponse({'result': 'success', 'net': net, 'net_name': model.name,
                                 'next_layer_id': next_layer_id})

    if request.method == 'GET':
        return index(request)


@csrf_exempt
def fetch_model_history(request):
    if request.method == 'POST':
        try:
            network_id = int(request.POST['net_id'])
            network = Network.objects.get(id=network_id)
            network_versions = NetworkVersion.objects.filter(network=network).order_by('created_on')

            modelHistory = {}
            for version in network_versions:
                network_updates = NetworkUpdates.objects.filter(network_version=version)\
                                                        .order_by('created_on')
                for update in network_updates:
                    modelHistory[update.id] = update.tag

            return JsonResponse({
                'result': 'success',
                'data': modelHistory
            })
        except Exception:
            return JsonResponse({
                'result': 'error',
                'error': 'Unable to load model history'
            })


@csrf_exempt
def upload_training_data(request):
    print('In function upload_training_data.\n')
    USER_DATA_DIR = os.path.join(BASE_DIR, 'user_data')
    if request.method == 'POST':
        try:

            uploadedFile = request.FILES.get('file')

            fileName = uploadedFile.name
            # print(file_name)
            username = request.POST.get('username')
            userDir = os.path.join(USER_DATA_DIR, username)
            saveDir = os.path.join(userDir, 'data')

            if not os.path.exists(saveDir):
                os.makedirs(saveDir)     
            savePath = os.path.join(saveDir, fileName)       
            print("Uploading file %s to %s"%(fileName, savePath))
            with open(savePath, 'wb+') as destination:
                for chunk in uploadedFile.chunks():
                    destination.write(chunk) 
            return JsonResponse({
                'result': 'success'
            })
        except Exception, e:
            print(e)
            return JsonResponse({
                'result': 'error',
                'error': 'Fail to upload files'
            })

@csrf_exempt
def start_training(request):
    USER_DATA_DIR = os.path.join(BASE_DIR, 'user_data')

    if request.method == 'GET':
        try:
            print("start training...")
            batch_size = int(request.GET['batch_size'])
            epoch_times = int(request.GET['epoch_times'])
            lr = float(request.GET['lr'])
            username = str(request.GET['username'])
            dataSet = str(request.GET['dataSet'])
            
            optSelected = str(request.GET['optSelected'])
            print(optSelected)

            optPara = {}
            optPara['rho'] = float(request.GET['rho'])
            optPara['momentum'] = float(request.GET['momentum'])
            optPara['beta1'] = float(request.GET['beta1'])
            optPara['beta2'] = float(request.GET['beta2'])
            print(optPara)

            USER_DIR = os.path.join(USER_DATA_DIR, username)

            DATA_DIR = os.path.join(USER_DIR, 'data')
            MODEL_DIR = os.path.join(USER_DIR, 'model')

            index_file_path = os.path.join(MODEL_DIR, 'index.txt')
            if not os.path.exists(index_file_path):
                return JsonResponse({
                    'result': 'error',
                    'error': 'Index file does not exist.'
                })
            f = open(index_file_path, 'r')
            cur_model_name = f.readlines()[-1][:-1] + '.json'

            model_path = os.path.join(MODEL_DIR, cur_model_name)	# set spcifically for each user account
            # print("Current model file path: %s"%(model_path))

            # data_path = os.path.join(DATA_DIR, dataSet)		# use uploaded data and choose by user
            result_path = os.path.join(USER_DATA_DIR, username, 'result')         
            start_train_model(model_path, dataSet, result_path, batch_size, epoch_times, lr, optSelected, optPara) 
            
            # webdriver.Firefox().get(url='http://ubuntu:6006')		# default port to show tensorboard

            #vision.train_model(model_path, data_path, result_path, batch_size, epoch_times, lr, optSelected, optPara)
            return JsonResponse({
                'result': 'success'
            })
        except Exception, e:
            print("Error in start training!")
            return JsonResponse({
                'result': 'error',
                'error': 'Fail to start training'
            })


@csrf_exempt
def get_training_data(request):
    USER_DATA_DIR = os.path.join(BASE_DIR, 'user_data')
    if request.method == 'GET':
        try:
            print("start getting training data sets...")
            userName = str(request.GET['username'])
            print(userName)
            USER_DIR = os.path.join(USER_DATA_DIR, userName)
            DATA_DIR = os.path.join(USER_DIR, 'data')

            dataSets = os.listdir(DATA_DIR)
            print(dataSets)
            
            return JsonResponse({
                'result': 'success',
                'dataSets': dataSets
            })
        except Exception, e:
            print("Error in getting training data sets!")
            return JsonResponse({
                'result': 'error',
                'error': 'Fail to get training data sets'
            })
