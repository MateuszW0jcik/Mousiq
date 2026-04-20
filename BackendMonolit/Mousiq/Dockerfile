FROM eclipse-temurin:21-jre-alpine
COPY target/Mousiq-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-Xms1g", "-Xmx2g", "-jar", "app.jar"]