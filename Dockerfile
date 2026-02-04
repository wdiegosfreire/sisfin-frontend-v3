FROM node:20.19.5
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8180
CMD [ "npm", "run", "dev" ]