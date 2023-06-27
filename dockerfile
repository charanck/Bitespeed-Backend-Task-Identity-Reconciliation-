FROM node:20

WORKDIR /app

COPY ./package*.json /app/
COPY . /app/

RUN npm install
RUN npm install typescript

RUN npm run build

EXPOSE 3000

CMD [ "node","dist/index.js" ]





