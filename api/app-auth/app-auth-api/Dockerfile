#syntax=docker/dockerfile:1
FROM node:16.13-alpine 

WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

RUN ls -l

EXPOSE 33458

CMD ["npm", "run", "start:prod"]
