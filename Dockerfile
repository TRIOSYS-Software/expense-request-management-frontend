FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD /bin/sh -c 'find /usr/share/nginx/html/assets -type f -name "index-*.js" -exec sed -i "s|http://127.0.0.1:5000|${BACKEND_URL}|g" {} \; && nginx -g "daemon off;"'