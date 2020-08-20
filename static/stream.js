var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");

var socket;

const video = document.querySelector("#videoElement");

video.width = 125;
video.height = 93;

var canvas = document.getElementById("canvasOutput");
var context = canvas.getContext("2d");

canvas.width = 125;
canvas.height = 93;

canvas.style.display = 'none';
video.style.display = 'none';

var image = document.getElementById("image");

image.width = 250;
image.height = 186;

var drawer;

let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
let cap = new cv.VideoCapture(video);

const FPS = 5;

var emitter;

function videoLoop() {
    context.drawImage(video, 0, 0, video.width, video.height);
}

startButton.onclick = () => {
    socket = io('/');
    console.log('intermediary stage');
    socket.on('connect', function(){
        console.log("Connected...!", socket.connected);
    });
    socket.on('response_back', function(data){
        const arrayBufferView = new Uint8Array(data.buff);
        const blob = new Blob([arrayBufferView], {type: 'image/png'});
        const imageUrl = URL.createObjectURL(blob);
        document.getElementById('image').src = imageUrl;
    });
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
    emitter = setInterval(() => {
        cap.read(src);
        var type = "image/png"
        var data = canvas.toDataURL(type);
        data = data.replace('data:' + type + ';base64,', '');
        if (socket!=null) {
            socket.emit('image', data);
        }
    }, 1000/FPS);
}

stopButton.onclick = () => {
    if (socket!=null) {
        socket.on('disconnect', function(){
            console.log("Disconnected...", socket.disconnected);
        });
        socket.disconnect();
        if (drawer!=null)
            clearInterval(drawer);
        if (emitter!=null)
            clearInterval(emitter);
    }
}