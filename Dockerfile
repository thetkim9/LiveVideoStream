FROM pytorch/pytorch:1.5.1-cuda10.1-cudnn7-devel
ENV LANG C.UTF-8
RUN apt-get update
RUN apt-get -y install build-essential
RUN conda install gxx_linux-64=7.3
RUN conda install -c menpo opencv
RUN conda install -c anaconda cython
RUN conda install -c anaconda numpy
RUN conda install git pip
RUN pip install flask
RUN pip install flask_socketio
RUN pip install flask_cors
RUN pip install imutils
RUN pip install Pillow
COPY . .
EXPOSE 5000
CMD python app.py