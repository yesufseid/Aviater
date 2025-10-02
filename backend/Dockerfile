# Use Node 18 slim image
FROM node:18-slim

# Install Chromium and dependencies for Puppeteer
RUN apt-get update && \
    apt-get install -y chromium \
    fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
    libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 \
    libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
    xdg-utils --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Set environment variables (optional)
ENV NODE_ENV=production
ENV PORT=10000

# Expose port
EXPOSE 10000

# Start the app
CMD ["node", "app.js"]
