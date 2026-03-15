FROM node:18-alpine

# Install FFmpeg and ImageMagick for media processing natively in Alpine
RUN apk update && \
    apk add --no-cache ffmpeg imagemagick bash curl

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY index.js .

CMD ["node", "index.js"]
