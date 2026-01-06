PRAGMA foreign_keys = ON;

INSERT INTO users (email, display_name, password_hash, role)
VALUES
('admin@example.com', 'Admin', '$2b$10$PLACEHOLDERHASHCHANGE', 'admin');

INSERT INTO users (email, display_name, password_hash, role)
VALUES
('user@example.com', 'Test User', '$2b$10$PLACEHOLDERHASHCHANGE', 'user');

INSERT INTO albums (title, artist, release_year, genre)
VALUES
('In Rainbows', 'Radiohead', 2007, 'Alternative'),
('Random Access Memories', 'Daft Punk', 2013, 'Electronic'),
('To Pimp a Butterfly', 'Kendrick Lamar', 2015, 'Hip-Hop');
