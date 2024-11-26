package com.seuprojeto.carmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.seuprojeto.carmanagement.repository")
@EnableScheduling
public class CarManagementApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(CarManagementApiApplication.class, args);
	}
}
