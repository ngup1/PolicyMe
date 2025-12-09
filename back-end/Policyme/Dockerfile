# --- Stage 1: Build JAR ---
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Run JAR ---
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy the built JAR
COPY --from=build /app/target/*.jar app.jar

# Expose backend port (8081 from your properties)
EXPOSE 8081

# Environment variables (can be overridden in Docker Compose)
ENV SPRING_PROFILES_ACTIVE=prod
ENV MONGO_URL=mongodb://mongo:27017/congressDB

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
