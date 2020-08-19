
var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");

var socket;

startButton.onclick = () => {
    socket = io('http://127.0.0.1:5000');
    socket.on('connect', function(){
        console.log("Connected...!", socket.connected)
    });
    socket.on('response_back', function(data){
        const arrayBufferView = new Uint8Array(data.buff);
        const blob = new Blob([arrayBufferView], {type: 'image/jpeg'});
        const imageUrl = URL.createObjectURL(blob);
        document.getElementById('image').src = imageUrl;
    });
}

stopButton.onclick = () => {
    socket.on('disconnect', function(){
        console.log("Disconnected...", socket.disconnected)
    });
    socket.disconnect();
}

const video = document.querySelector("#videoElement");

video.width = 500;
video.height = 375;

var canvas = document.getElementById("canvasOutput");
var context = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 375;

canvas.style.display = 'none';
video.style.display = 'none';

var drawer;

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
        video.srcObject = stream;
        video.addEventListener('loadeddata', function() {
            video.play();
            drawer = setInterval(videoLoop, 1000 / 30);
        });
        video.play();
    })
    .catch(function (err0r) {
        console.log(err0r)
        console.log("Something went wrong!");
    });
}

let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
let cap = new cv.VideoCapture(video);

const FPS = 100;

var emitter;

emitter = setInterval(() => {
    cap.read(src);
    var type = "image/png"
    var data = canvas.toDataURL(type);
    data = data.replace('data:' + type + ';base64,', '');
    if (socket!=null) {
        socket.emit('image', data);
    }
}, 10000/FPS);

function videoLoop() {
    context.drawImage(video, 0, 0, video.width, video.height);
}