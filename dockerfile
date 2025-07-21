FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir app Angular con NGINX
FROM nginx:alpine

# Copia archivos del build a nginx
COPY --from=build /app/dist/canchapro /usr/share/nginx/html

# Opcional: reemplaza la config de nginx si quieres
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
