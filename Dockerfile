FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose port 4324 (Astro's default port)
EXPOSE 4324

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4324

# Run the Astro project with explicit host binding
CMD ["sh", "-c", "npm run dev atlagia -- --port 4324 --host 0.0.0.0"] 