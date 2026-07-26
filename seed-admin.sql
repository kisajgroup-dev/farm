INSERT OR REPLACE INTO Admin (id, email, name, passwordHash, role, createdAt, updatedAt)
VALUES ('admin-id-1', 'admin', 'Farm Admin', '$2a$10$L25e4ZVdxCJofbbiT7opX.BrJIhfUHpRQXDRZ3HK2MJ.epjWgpjxq', 'SUPERADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT OR REPLACE INTO Setting (id, comingSoonMode, siteTitle, tagline, description, whatsappNumber, email, addressText, mapLat, mapLng, updatedAt)
VALUES ('singleton', 1, 'GreenRoots Organic Farm', 'Fresh organic vegetables, from our farm to your family.', 'A small organic farm in Kalmunai, Sri Lanka growing fresh vegetables the natural way.', '+94770000000', 'hello@greenroots.lk', 'Palamunai, Kalmunai, Sri Lanka', 7.4167, 81.8167, CURRENT_TIMESTAMP);