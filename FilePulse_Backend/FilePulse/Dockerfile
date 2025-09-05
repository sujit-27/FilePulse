# Build stage: Use Maven with Java 21 to build the Spring Boot app
FROM maven:3.9.4-eclipse-temurin-21 AS build

# Set working directory inside container
WORKDIR /app

# Copy only pom.xml first for dependency resolution
COPY FilePulse/pom.xml FilePulse/

# Copy source code
COPY FilePulse/src FilePulse/src/

# Build the package skipping tests to speed up build
RUN mvn -f FilePulse/pom.xml clean package -DskipTests

# Runtime stage: Use lightweight Java 21 JRE image
FROM eclipse-temurin:21-jre

# Set working directory for runtime
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/FilePulse/target/FilePulse-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 on the container
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
