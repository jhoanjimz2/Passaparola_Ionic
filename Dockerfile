# base image
FROM node:18.18.0-alpine3.18

# create & set working directory
WORKDIR /app

# copy package.json and package-lock.json if available
COPY package*.json ./

# registry capawesome
RUN npm config set @capawesome-team:registry https://npm.registry.capawesome.io
RUN npm config set //npm.registry.capawesome.io/:_authToken POLAR-FB6DF168-25DA-4B96-B1C7-0D9420D2B057

# install dependencies
RUN yarn install

# copy source files
COPY . .

# start app
RUN yarn build

EXPOSE 3105

ENTRYPOINT ["yarn"]
CMD ["ng", "serve", "--host", "0.0.0.0", "--configuration=production", "--disable-host-check", "--port", "3105"]
