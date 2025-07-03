# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 10082
CMD ["nginx", "-g", "daemon off;"]