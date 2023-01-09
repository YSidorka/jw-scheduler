FROM node:16.17.0-alpine
WORKDIR /usr/app

COPY ./package*.json ./
RUN npm install --omit=dev
COPY ./ ./

RUN npm -v
RUN node -v

CMD ["npm", "start"]
