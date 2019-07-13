FROM python:3.7-slim

MAINTAINER lokmeinmatz <kind.matze@gmail.com>
RUN apt-get update
COPY ./fridger-server ./fridger-server
COPY ./fridger-web/dist ./web-dist

RUN pip install --no-cache-dir -r fridger-server/requirements.txt
ENV FLASK_ENV="docker"
EXPOSE 5000