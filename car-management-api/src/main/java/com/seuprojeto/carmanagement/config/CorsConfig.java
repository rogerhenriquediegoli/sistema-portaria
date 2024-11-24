package com.seuprojeto.carmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Permitir todas as origens (caso esteja em desenvolvimento, substitua com a URL do frontend posteriormente)
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // Substitua pelo endereço do seu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
