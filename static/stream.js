var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");

var socket;

const video = document.querySelector("#videoElement");

video.width = 250;
video.height = 186;

var canvas = document.getElementById("canvasOutput");
var context = canvas.getContext("2d");

canvas.width = 250;
canvas.height = 186;

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
    startButton.disabled = true;
    socket = io('/');
    console.log('intermediary stage');
    socket.on('connect', function(){
        console.log("Connected...!", socket.connected);
    });
    socket.on('response_back', function(data){
        const arrayBufferView = new Uint8Array(data);
        const blob = new Blob([arrayBufferView], {type: 'image/jpeg'});
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
        var type = "image/jpeg"
        var url = canvas.toDataURL(type);
        fetch(url)
        .then(res => res.blob())
        .then(blob => {
            if (socket!=null) {
                socket.emit('image', blob);
            }
        })
    }, 1000/FPS);
    stopButton.disabled = false;
}

stopButton.onclick = () => {
    stopButton.disabled = true;
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
    startButton.disabled = false;
}