FROM node:23-slim AS base

RUN npm install -g pnpm@10
WORKDIR /app

FROM base AS deps

ARG PORT
ARG PUBLIC_APP_TITLE

ENV PORT=${PORT}
ENV PUBLIC_APP_TITLE=${PUBLIC_APP_TITLE}

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY . .

RUN BUILDING=true pnpm build

FROM build AS prod

COPY --from=build /app /app
ENV NODE_ENV=production

CMD ["pnpm", "start"]

FROM deps AS dev

ENV NODE_ENV=development

CMD ["pnpm", "dev", "--host"]
