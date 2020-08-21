# Live Video Streaming

Try running the service by clicking the button below!!

[![Run on Ainize](https://ainize.ai/images/run_on_ainize_button.svg)](https://ainize.ai/thetkim9/LiveVideoStream?branch=master)


Javascript client and python server (flask flask_socketio and javascript socket.io).

As you can see from the dependencies, the streaming service is exclusively for computer vision tasks.

Multiple clients are supported. However, your real-time computer vision task might not be able to do so due to the usage of GPU.

## What it does
1. Client sends to the server a video frame created from client's webcam.

2. Server receives the frame, does inner processing, and sends back the frame to the client.

3. Client receives the frame and displays it on the webpage.

4. Steps 1~3 happen repeatedly.

## How to run
1. Build the docker image through the dockerfile provided or pull docker image 'tkim9/livevideostream' from dockerhub.

2. Run the docker container with the docker image.

