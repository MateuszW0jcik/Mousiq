FROM eclipse-temurin:21-jre-alpine
COPY target/api-gateway-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-Xms512m", "-Xmx1g", "-jar", "app.jar"]