# Build
FROM node:8.16.2-alpine as BUILD
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build --prod

# Distribute
FROM nginx:1.22-alpine
COPY --from=BUILD /app/dist/SolExPortal /usr/share/nginx/html
#EXPOSE 4200

#ENTRYPOINT ["npm","run","start-prod"]
