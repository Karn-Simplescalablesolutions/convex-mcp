FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ตั้งค่า ENV ไว้ที่นี่ (Railway จะเอาค่าจาก Dashboard มาทับตัวนี้ให้เอง)
ENV CONVEX_DEPLOY_KEY="" 
ENV PORT=8080

EXPOSE 8080

# ใช้คำสั่งรันตรงๆ ไม่ต้องผ่าน sh -c
CMD ["npm", "start"]