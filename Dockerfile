FROM node:6

# Create open311-api directory
RUN mkdir -p /open311
WORKDIR /open311

# Install
COPY package.json /open311
COPY gulpfile.js /open311
COPY ./src /open311/src

RUN npm install && npm run build

EXPOSE 80
CMD ["gulp", "run"]
