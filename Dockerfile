FROM oven/bun
WORKDIR /reversi
COPY package.json bun.lock ./
RUN bun install
COPY bunfig.toml build.ts ./
COPY ./src ./src
RUN bun build.ts
 
FROM nginx:alpine
COPY --from=0 /reversi/dist /usr/share/nginx/html
