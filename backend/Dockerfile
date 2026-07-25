# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY backend/pom.xml ./backend/pom.xml
COPY openapi ./openapi
RUN mvn dependency:go-offline -B -f backend/pom.xml
COPY backend/src ./backend/src
RUN mvn package -DskipTests -f backend/pom.xml

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S amena && adduser -S amena -G amena
RUN apk add --no-cache su-exec
RUN mkdir -p /app/uploads && chown -R amena:amena /app/uploads

COPY --from=build /app/backend/target/*.jar app.jar
COPY backend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
