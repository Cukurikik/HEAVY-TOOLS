FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Start the server
CMD ["node", "server.js"]
