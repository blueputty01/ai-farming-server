import os
import sys

fileLocation = sys.argv[1]

# disable stderr
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
# image = tf.keras.preprocessing.image
sys.stderr = stderr # re-enable stderr
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' # Disable log except errors

# model = load_model('model.h5')
# model.compile(optimizer = 'adam', loss = 'binary_crossentropy',
#                   metrics = ['accuracy'])
# img = cv2.imread(sys.argv[1])
def predict(path): 
    # test_image = image.load_img(path,
    #                            target_size = (64, 64))
    # test_image = np.expand_dims(test_image, axis = 0)
    # result = model.predict(test_image)
    # if result[0][0] == 1:
    #    prediction = 'Recyclable'
    # else:
    #    prediction = 'Organic'
    return 'apple'
    sys.stdout.flush()
    
print(predict(fileLocation))