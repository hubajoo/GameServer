FROM node:18.8.0-slim
ADD app.js .
ENTRYPOINT [ "node", "app.js" ]
EXPOSE 8090