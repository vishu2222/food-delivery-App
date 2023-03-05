FROM node:16

ARG PORT
ARG DB_CONN_STRING
ARG MAP_KEY

ENV PORT=${PORT}
ENV DB_CONN_STRING=${DB_CONN_STRING}
ENV MAP_KEY=${MAP_KEY}


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]