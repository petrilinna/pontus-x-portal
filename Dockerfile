FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-factor 2 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
