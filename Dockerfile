FROM node:slim

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli@^18.1.2

RUN npm install

CMD ["ng", "serve", "--poll", "500", "--host", "0.0.0.0"]
