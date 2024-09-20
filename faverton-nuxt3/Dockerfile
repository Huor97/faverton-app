FROM node:18-alpine AS base

RUN npm i -g pnpm

WORKDIR /faverton-nuxt3/app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM base AS deploy
COPY --from=build /app/.output ./.output

ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]