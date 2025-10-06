package org.ranthas;

import org.ranthas.service.DataLoader;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        System.out.println("Select one option:");
        System.out.println("1- Create new clean SQLite database");
        System.out.println("2- Generate CSV file with selected set cards");
        System.out.println("3- Close and exit");

        DataLoader dataLoader = new DataLoader();
        Scanner scanner = new Scanner(System.in);
        int option = scanner.nextInt();
        scanner.nextLine();

        switch (option) {
            case 1:
                dataLoader.createNewDatabase();
                break;
            case 2:
                System.out.println("Introduce the set code:");
                String setCode = scanner.nextLine();
                dataLoader.createSetCardsCsv(setCode);
                break;
            case 3:
                System.exit(0);
        }
    }
}