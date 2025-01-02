# Use a newer Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY src .
COPY dist dist

# Copy prisma schema for client generation
RUN npx prisma generate
# RUN npx prisma migrate deploy 

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]