package com.seuprojeto.carmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Permitir todas as origens durante o desenvolvimento (substitua com a URL do frontend quando em produção)
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // URL do frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true) // Adicionando suporte a cookies ou autenticação (se necessário)
                .maxAge(3600); // Tempo máximo de cache das permissões CORS
    }
}
