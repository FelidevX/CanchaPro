# Etapa 1: Build de Angular
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN grep -r "localhost:3000" ./dist/canchapro/browser || echo "No se encontró localhost:3000 en el build"

# Etapa 2: Servir app Angular con NGINX
FROM nginx:alpine
COPY --from=build /app/dist/canchapro/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
