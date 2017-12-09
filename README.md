# PrettyPrism: GraphQL Server

GraphQL API on Node.js, Express & Mongo (ES6 w/ Babel)
http://api.prettyprism.com/playground

### Project setup

1. Download the dependencies `yarn install`

2. Create a `.env` file with environment variables:

```
PORT=8282
DATABASE_URL=...
JWT_SECRET=...
JWT_EXPIRY=7d
ENV=...
ACCESS_KEY_ID=...
SECRET_ACCESS_KEY=...
BUCKET=...
REGION=...
```

3. Run `yarn run dev`

### Playground

GraphiQL interface is available at http://localhost:8282/playground for
reference and testing queries.

### Nginx configuration

This configuration is required to establish a websocket connection with GraphQL
Subscriptions.

`/etc/nginx/nginx.conf`

```
http {
        ...

        map $http_upgrade $connection_upgrade {
                default upgrade;
                '' close;
        }

        ...
}
```

`/etc/nginx/sites-available/api.prettyprism.com`

```
server {
        server_name api.prettyprism.com;
        access_log /var/www/api/logs/access.log;
        error_log /var/www/api/logs/error.log;

        location / {
                proxy_set_header Host $http_host;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://127.0.0.1:8080;
                proxy_redirect off;
        }

        location /subscriptions {
                proxy_pass http://127.0.0.1:8080/subscriptions;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
        }

}
```
