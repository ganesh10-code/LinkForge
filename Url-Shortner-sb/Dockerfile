# Use a Java 21 JDK image to build the Spring Boot app
FROM eclipse-temurin:21-jdk AS build

# Set the working directory
WORKDIR /app

# Copy Maven wrapper and POM to take advantage of caching
COPY mvnw ./
COPY .mvn/ .mvn/
COPY pom.xml ./

# Ensure the Maven wrapper is executable
RUN chmod +x mvnw

# Download dependencies to cache them
RUN ./mvnw dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Use a Java 23 runtime image to run the application
FROM eclipse-temurin:23-jre

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 9090 for the Spring Boot application
EXPOSE 9090

# Specify the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]


# Build the Docker image
# docker build -t shortify-backend .

# Run the container, mapping port 9090 on host to 9090 in container
# docker run -d -p 9090:9090 --name shortify-backend-container shortify-backend

