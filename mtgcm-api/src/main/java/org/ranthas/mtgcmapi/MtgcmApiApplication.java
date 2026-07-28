package org.ranthas.mtgcmapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class MtgcmApiApplication {

	public static void main(String[] args) throws IOException {
		SpringApplication.run(MtgcmApiApplication.class, args);
		openHomePage();
	}

	// Abre el navegador directamente.
	// TODO: esto fijo que solo funciona en Windows! Hay que probar el soporte para MacOS
	private static void openHomePage() throws IOException {
		Runtime rt = Runtime.getRuntime();
		rt.exec("rundll32 url.dll,FileProtocolHandler " + "http://localhost:8081");
	}
}
