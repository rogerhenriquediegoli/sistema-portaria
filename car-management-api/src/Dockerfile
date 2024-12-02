# Use uma imagem base do OpenJDK
FROM openjdk:17-jdk-slim

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo pom.xml para o diretório de trabalho do container
COPY pom.xml .

# Baixe as dependências do Maven (sem compilar a aplicação ainda)
RUN mvn dependency:go-offline

# Copie o código fonte para dentro do container
COPY src /app/src

# Compile a aplicação com Maven
RUN mvn clean package -DskipTests

# Exponha a porta que a aplicação vai rodar (ajuste conforme necessário)
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["java", "-jar", "/app/target/car-management-api-0.0.1-SNAPSHOT.jar"]
