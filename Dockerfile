FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24

WORKDIR /app

COPY assets ./assets
COPY node_modules ./node_modules
COPY .nais ./.nais
COPY dist ./dist
COPY frontend_production ./frontend_production
COPY package.json .

ENV NODE_ENV production

EXPOSE 8020
CMD ["--import=./dist/backend/register.js", "--es-module-specifier-resolution=node", "dist/backend/server.js"]