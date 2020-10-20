"""Usage: 
train.py <model> <dataset> [options]

Options:
-h --help    show this
--output=FILE    Output file [default: ~/.visualnn/temp.h5].
--loss=LOSS      loss type [default: categorical_crossentropy]
--shape=SHAPE    preprocessing's shape.

"""
import time
from load_data import load_buildin_dataset
from preprocessing import preprocess_buildin_dataset
from keras import optimizers
from keras.models import model_from_json
from keras.callbacks import TensorBoard


def buildModel(modelPath):
	modelFile = open(modelPath, 'r')
	model = modelFile.read()
	modelFile.close()
	model = model_from_json(model)
	return model
def load(path):
    f = np.load(path)
    x_train, y_train = f['x_train'], f['y_train']
    x_test, y_test = f['x_test'], f['y_test']
    f.close()
    return (x_train, y_train), (x_test, y_test)

def start_train_model(model_path, dataset, output_path, batch_size, epochs, lr, opt, optPara):
    print('model path:', model_path)
    loss = 'categorical_crossentropy'
    print(loss)
    model = buildModel(model_path)
    (x_train, y_train), (x_test, y_test) = load_buildin_dataset(dataset)
    # Switch by dataset
    if dataset == 'mnist':
        print('Using mnist dataset.')
        x_train, y_train, x_test, y_test = preprocess_buildin_dataset(x_train, y_train, x_test, y_test, dataset, '-1, 28, 28, 1')
    elif dataset == 'cifar10':
        print('Using cifar10 dataset.')
        x_train, y_train, x_test, y_test = preprocess_buildin_dataset(x_train, y_train, x_test, y_test, dataset)
    elif dataset == 'imdb':
        print('Using imdb dataset.')

    print("dataset preprocess finished")
    optimizer = optimizers.RMSprop(lr=lr)
    # Set optimizer
    print("Using optimizer ", opt)
    if opt == "SGD":
        print("sgd, momentum=", optPara['momentum'])
        optimizer = optimizers.SGD(lr=lr, momentum=optPara['momentum'], nesterov=False)
    elif opt == "RMSprop":
        print("rmsprop, rho=", optPara['rho'])
        optimizer = optimizers.RMSprop(lr=lr, rho=optPara['rho'])
    elif opt == "Adagrad":
        print("adagrad")
        optimizer = optimizers.Adagrad(lr=lr)
    elif opt == "Adadelta":
        print("adadelta")
        optimizer = optimizers.Adadelta(lr=lr, rho=optPara['rho'])
    elif opt == "Adam":
        print("adam")
        print("beta1=", optPara['beta1'])
        print("beta2=", optPara['beta2'])
        optimizer = optimizers.Adam(lr=lr, beta_1=optPara['beta1'], beta_2=optPara['beta2'])
    elif opt == "Adamax":
        print("adamax")
        print("beta1=", optPara['beta1'])
        print("beta2=", optPara['beta2'])
        optimizer = optimizers.Adamax(lr=lr, beta_1=optPara['beta1'], beta_2=optPara['beta2'])
    elif opt == "Nadam":
        print("nadam")
        print("beta1=", optPara['beta1'])
        print("beta2=", optPara['beta2'])
        optimizer = optimizers.Nadam(lr=lr, beta_1=optPara['beta1'], beta_2=optPara['beta2'])
    
    model.compile(loss=loss,optimizer=optimizer,metrics=['accuracy'])
    print('compile finished')
    timeStamp = time.strftime('%Y%m%d-%H%M%S', time.localtime(time.time()))
    tb = TensorBoard(log_dir=output_path+'/logs/'+timeStamp)		# configure tensorboard

    history = model.fit(x_train, y_train, batch_size=batch_size, 
        epochs=epochs, verbose=1, validation_data=(x_test, y_test), callbacks=[tb])
    score = model.evaluate(x_test, y_test, verbose=0)
    print('Test loss:', score[0])
    print('Test accuracy:', score[1])
    model.save_weights(output_path)


