FROM node:14

WORKDIR /colab-code

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8080

CMD ["yarn", "serve"]