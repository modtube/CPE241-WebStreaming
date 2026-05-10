FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json yarn.lock* ./

# Install dependencies (No need to install yarn globally)
RUN yarn install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the TypeScript code
RUN yarn build

# Start the server
EXPOSE 5000
CMD ["yarn", "start"]