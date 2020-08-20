# Live Video Streaming
Javascript client and python server (flask flask_socketio and javascript socket.io).

As you can see from the dependencies, the streaming service is exclusively for computer vision tasks.

## What it does
1. Client sends to the server a video frame created from client's webcam.

2. Server receives the frame, does inner processing, and sends back the frame to the client.

3. Client receives the frame and displays it on the webpage.

4. Steps 1~3 happen repeatedly. You can set the rate of the above process by setting the fps at stream.js.

## How to run
1. Build the docker image through the dockerfile provided or pull docker image 'tkim9/livevideostream' from dockerhub.

2. Run the docker container with the docker image.

