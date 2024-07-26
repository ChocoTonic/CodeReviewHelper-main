FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS web

COPY web /temp/web
RUN cd /temp/web && bun install
RUN cd /temp/web && bun run build

FROM base AS release

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=web /temp/web/dist web/dist
COPY ./src ./src
COPY ./prompt.txt ./prompt.txt
COPY ./package.json .

ENV NODE_ENV=production
ENV PORT=4040
ENV LOG_LEVEL=debug

USER bun
EXPOSE 4040/tcp
ENTRYPOINT [ "bun", "run", "src/main.ts" ]
