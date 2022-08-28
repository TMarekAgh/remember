#syntax=docker/dockerfile:1
FROM node:16.13-alpine 

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 33460

CMD ["node", "dist/main"]
