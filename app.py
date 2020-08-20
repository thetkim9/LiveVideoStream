from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask import request
import cv2
import imutils
import base64
from PIL import Image
import io
import numpy
from engineio.payload import Payload

Payload.max_decode_packets = 500

app = Flask(__name__, static_url_path="", template_folder="./")
app.config['SECRET_KEY'] = 'taesu'
#app.config['SERVER_NAME'] = 'livevideostream.dev:5000'
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
    open_cv_image = numpy.array(pil_image)

    # Convert RGB to BGR
    frame = open_cv_image[:, :, ::-1].copy()

    # Process the image frame
    frame = imutils.resize(frame, width=700)
    frame = cv2.flip(frame, 1)
    buff = cv2.imencode('.png', frame)[1]
    response = {'image': True, 'buff': io.BytesIO(buff).getvalue()}

    #emit response to client
    emit('response_back', response)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')