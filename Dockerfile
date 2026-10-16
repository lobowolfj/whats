FROM node:18

RUN apt-get update && apt-get install -y \
    libnss3 libatk-bridge2.0-0 libgtk-3-0 libasound2 libxshmfence1 libgbm1 chromium

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
