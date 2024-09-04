# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the necessary dependencies
RUN npm install

# Copy the bot script and any other files to the container
COPY . .

# Run the bot
CMD ["npm", "start"]
