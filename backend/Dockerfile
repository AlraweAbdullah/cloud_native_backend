# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install


# Copy the rest of your application's source code to the container
COPY . .

# Expose the port your application is listening on
EXPOSE 3000
# Start your application
CMD [ "sh", "container-start.sh" ]