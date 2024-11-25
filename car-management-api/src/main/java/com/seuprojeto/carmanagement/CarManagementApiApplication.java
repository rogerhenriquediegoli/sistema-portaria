package com.seuprojeto.carmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.seuprojeto.carmanagement.repository")
public class CarManagementApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarManagementApiApplication.class, args);
	}

}
