from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import cv2
import imutils
import base64
from PIL import Image
import io
import numpy

app = Flask(__name__, static_url_path="", template_folder="./")
app.config['SECRET_KEY'] = 'taesu'
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

@app.route('/', methods=['POST', 'GET'])
def index():
    print("index.html")
    return render_template('index.html')

@socketio.on('image')
def image(data_image):
    # decode and convert into image
    b = io.BytesIO(base64.b64decode(data_image))
    pil_image = Image.open(b).convert('RGB')
    #pil_image.save("0.png")
    open_cv_image = numpy.array(pil_image)
    #cv2.imwrite("1.png", open_cv_image)
    # Convert RGB to BGR
    frame = open_cv_image[:, :, ::-1].copy()

    # Process the image frame
    frame = imutils.resize(frame, width=700)
    frame = cv2.flip(frame, 1)
    #cv2.imwrite("2.png", frame)
    buff = cv2.imencode('.png', frame)[1]
    emit('response_back', {'image': True, 'buff': io.BytesIO(buff).getvalue()})


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1')