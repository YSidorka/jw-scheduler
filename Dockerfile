FROM node:16.19.1-alpine
WORKDIR /usr/app

USER root
RUN mkdir /.npm
RUN chmod 777 /.npm

COPY ./package*.json ./
RUN npm install --omit=dev
COPY ./ ./

RUN chmod -R 777 /usr/app/modules

RUN npm -v
RUN node -v

CMD ["npm", "start"]
