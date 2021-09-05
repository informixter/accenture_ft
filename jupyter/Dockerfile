FROM python:3.7-slim-buster
USER root
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN mkdir /root/output
WORKDIR /root/airflow/notebooks