# This is the docker file to create docker image for Next.js client
FROM node:23-alpine

WORKDIR /app 

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Install serve to run the application
RUN npm install -g next

# Expose port
EXPOSE 3000

CMD ["npm", "start"]