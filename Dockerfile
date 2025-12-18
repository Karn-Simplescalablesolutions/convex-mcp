FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "supergateway --stdio \"npx convex mcp start --deployment clear-roadrunner-497\" --port 8080 --key test"]