# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY lolstreamers-app/package*.json ./
RUN npm ci
COPY lolstreamers-app/ ./

# Build the app
RUN npm run build:prod -- --base-href=/lolstreamers/

# Production stage
FROM nginx:alpine
# Copy files from the browser directory where the actual app files are located
COPY --from=build /app/dist/lolstreamers-app/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]