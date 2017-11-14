# Use an official Ubuntu Xenial as a parent image
FROM ubuntu:16.04

# Install Node.js 8 and npm 5
RUN apt-get update
RUN apt-get -qq upgrade
RUN apt-get install -y build-essential
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs

# Install app dependencies
COPY package.json /pretty-prism/package.json
COPY package-lock.json /pretty-prism/package-lock.json
RUN cd /pretty-prism; npm install

# Set the working directory to /pretty-prism
WORKDIR /pretty-prism

# Define environment variable

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run `npm start` when the container launches
CMD ["npm", "start"]
