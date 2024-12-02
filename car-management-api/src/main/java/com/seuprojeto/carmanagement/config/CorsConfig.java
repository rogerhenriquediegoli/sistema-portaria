package com.seuprojeto.carmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Configuração de CORS para a nova URL do frontend
        registry.addMapping("/**")
                .allowedOrigins("https://sistema-portaria-2a5z.onrender.com") // Nova URL do frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true) // Suporte a cookies ou autenticação
                .maxAge(3600); // Tempo máximo de cache das permissões CORS
    }
}
