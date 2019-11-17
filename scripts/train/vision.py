# -*- coding: utf-8 -*-
import time
import numpy as np
from keras.models import model_from_json
from keras.utils import np_utils
from keras import optimizers
from keras.callbacks import TensorBoard

# batch_size = 128	# set by user from param window
# epochs = 5		# set by user from param window

# data_path = 'mnist.npz'	# set by user from file selector

# lr = 0.0001		# set by user from param window

# model_path = 'model.json' # set by system when start training
# result_path = 'result'    # set by system when finish training

# TODO: 脚本的普遍适用性: 加载真正的图片数据集，由用户指定train/test比例，而不是像mnist这种已经分好了的数据集
# TODO: 用户可选optimizer和loss类型
# TODO: 用户指定分类的类别数 (?)
# TODO: 训练结果可视化(非实时)

def load(path):
    f = np.load(path)
    x_train, y_train = f['x_train'], f['y_train']
    x_test, y_test = f['x_test'], f['y_test']
    f.close()
    return (x_train, y_train), (x_test, y_test)

def buildModel(modelPath):
    modelFile = open(modelPath, 'r')
    model = modelFile.read()
    modelFile.close()
    model = model_from_json(model)
    return model


def train_model(model_path, data_path, result_path, batch_size, epochs, lr):
    model = buildModel(model_path)
    (x_train, y_train), (x_test, y_test) = load(data_path)
    reshape = x_train[0].shape[0] * x_train[0].shape[1]
    x_train = np.reshape(x_train,(x_train.shape[0], reshape))
    x_test = np.reshape(x_test, (x_test.shape[0], reshape))
    y_train = np_utils.to_categorical(y_train, 10)
    y_test = np_utils.to_categorical(y_test, 10)

    optimizer = optimizers.rmsprop(lr=lr)

    model.compile(loss='categorical_crossentropy',
                  optimizer=optimizer,
                  metrics=['accuracy'])

    timeStamp = time.strftime('%Y%m%d-%H%M%S', time.localtime(time.time()))
    tb = TensorBoard(log_dir=result_path+'/logs/'+timeStamp)
    history = model.fit(x_train, y_train,
                    batch_size=batch_size,
                    epochs=epochs,
                    verbose=1,
                    validation_data=(x_test, y_test),
                    callbacks=[tb])
    score = model.evaluate(x_test, y_test, verbose=0)
    print('Test loss:', score[0])
    print('Test accuracy:', score[1])
    model.save(result_path + '/' + timeStamp + '.h5')

