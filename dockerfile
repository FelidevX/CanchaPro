# Etapa única: Servir build de Angular con NGINX
FROM nginx:alpine

# Copia tu build generado localmente
COPY dist/canchapro /usr/share/nginx/html

# Configura rutas SPA (Angular)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
