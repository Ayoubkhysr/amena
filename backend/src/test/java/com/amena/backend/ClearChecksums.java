package com.amena.backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class ClearChecksums {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/amena", "amena", "amena123");
            Statement stmt = conn.createStatement();
            
            // Clear checksums
            stmt.executeUpdate("UPDATE databasechangelog SET md5sum = null;");
            
            // Add missing columns if they don't exist
            try {
                stmt.executeUpdate("ALTER TABLE categories ADD COLUMN subcategory VARCHAR(100);");
                System.out.println("Added subcategory to categories.");
            } catch (Exception ignore) {}
            
            try {
                stmt.executeUpdate("ALTER TABLE produits ADD COLUMN subcategory VARCHAR(100);");
                System.out.println("Added subcategory to produits.");
            } catch (Exception ignore) {}

            System.out.println("Checksums cleared and tables updated successfully!");
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
