FROM node:18.18.0
LABEL authors="simon9116"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DEV_PORT=8080

EXPOSE 8080

CMD ["npm", "start"]