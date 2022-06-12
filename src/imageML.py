from tensorflow.keras.models import load_model
import os
import sys
import numpy as np
import tensorflow as tf

model_dir = '../models/'

fileLocation = sys.argv[2]

# disable stderr
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
image = tf.keras.preprocessing.image
sys.stderr = stderr  # re-enable stderr
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Disable log except errors

type = sys.argv[1]

model_file = ''

if type == 'fruit':
    model_file = 'model.h5'
else:
    model_file = 'fruit.h5'

model = load_model(f"{model_dir}{model_file}")


model.compile(optimizer='adam', loss='binary_crossentropy',
              metrics=['accuracy'])


def predict(path):
    print('predicting...')
    test_image = image.load_img(path,
                                target_size=(256, 256))
    test_image = np.expand_dims(test_image, axis=0)
    result = np.argmax(model.predict(test_image))
    return result


print(predict(fileLocation))
