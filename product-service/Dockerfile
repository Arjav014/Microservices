FROM node:20.19.4

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose product service port
EXPOSE 5678

# Start the app
CMD ["node", "server.js"]
