package org.ranthas.mtgcmdesktop;

import javax.swing.*;
import java.awt.*;

public class Main {
    public static void main(String[] args) {

        JFrame frame = new JFrame("JFrame title");
        Container contentPane = frame.getContentPane();
        contentPane.setLayout(new BorderLayout());

        JMenuBar menuBar = new JMenuBar();
        JMenu fileMenu = new JMenu("File");
        JMenuItem missingSetsMenu = new JMenuItem("Missing sets");
        JMenuItem importCollectionMenu = new JMenuItem("Import collection");
        JMenuItem exportCollectionMenu = new JMenuItem("Export collection");

        missingSetsMenu.addActionListener(event -> {
            System.out.println("clicked missing sets menu!");
            JDialog dialog = new JDialog(frame, "Test dialog title", true);
            dialog.setVisible(true);
        });

        menuBar.add(fileMenu);
        fileMenu.add(missingSetsMenu);
        fileMenu.addSeparator();
        fileMenu.add(importCollectionMenu);
        fileMenu.add(exportCollectionMenu);

        contentPane.add(menuBar, BorderLayout.PAGE_START);
        contentPane.add(new JButton("LINE_START"), BorderLayout.LINE_START);
        contentPane.add(new JButton("LINE_END"), BorderLayout.LINE_END);
        contentPane.add(new JButton("CENTER"), BorderLayout.CENTER);
        contentPane.add(new JButton("PAGE_END"), BorderLayout.PAGE_END);

        ScryfallApiClient scryfallApiClient = new ScryfallApiClient();
        scryfallApiClient.findAllSets();

        /**
         * try(Session session = HibernateUtils.getSessionFactory().openSession()) {
         *  transaction = session.beginTransaction();
         *  session.save(entity);
         *  transaction.commit();
         * } catch(Exception e) {
         *  transaction.rollback();
         *  e.printStacktrace();
         * }
         *
         * try(Session session = HibernateUtils.getSessionFactory().openSession()) {
         *  Entity entity = session.createQuery("from Entity", Entity.class);
         * } catch(Exception e) {
         *  if(transaction != null) transaction.rollback();
         *  e.printStackTrace();
         * }
         */
    }
}
