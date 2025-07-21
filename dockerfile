FROM nginx:alpine

# Copia la build real
COPY dist/canchapro/browser /usr/share/nginx/html

# Configura NGINX para rutas Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
