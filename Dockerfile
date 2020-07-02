FROM node:10
RUN mkdir -p /usr/src/node-image-processing/node_modules && chown -R node:node /usr/src/node-image-processing
WORKDIR /usr/src/node-image-processing
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "npm run prod" ]
