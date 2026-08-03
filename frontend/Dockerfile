# Build stage
FROM node:22-alpine AS build
WORKDIR /app/frontend
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY frontend/package*.json ./
RUN npm ci
COPY openapi ../openapi
COPY frontend ./
RUN npm run generate:api
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]