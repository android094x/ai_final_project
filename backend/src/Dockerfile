FROM python:3.6-buster 
RUN pip3 install Flask numpy
RUN pip3 install pymongo[srv] 
RUN mkdir code
#ADD ./main.py /code
WORKDIR /code
COPY ./requirements.txt .
RUN pip3 install -r requirements.txt
ENV FLASK_APP=main2.py

ENV FLASK_ENV=development

CMD flask run --host=0.0.0.0 