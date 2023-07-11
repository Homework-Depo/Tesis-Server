FROM node:18.16 AS production

WORKDIR /app/api

COPY package*.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]