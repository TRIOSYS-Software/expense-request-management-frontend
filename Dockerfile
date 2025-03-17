FROM node:20 AS BUILD

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx

COPY --from=BUILD /app/dist /usr/share/nginx/html

EXPOSE 80

CMD /bin/sh -c 'find /usr/share/nginx/html/assets -type f -name "index-*.js" -exec sed -i "s|http://127.0.0.1:5000|${BACKEND_URL}|g" {} \; && nginx -g "daemon off;"'