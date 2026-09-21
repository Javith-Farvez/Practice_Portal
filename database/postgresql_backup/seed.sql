-- Placement Practice Portal - PostgreSQL Backup Seed Data
-- Converted for complete PostgreSQL compatibility
-- Default Admin and Student accounts for testing

INSERT INTO users (name, email, password_hash, role)
VALUES 
('Mohammed Javith Farvez (Admin)', 'mohammedjavithfarvezsk07@gmail.com', '$2b$10$ljJpCWpterh/eadb8UoKjue0RuBNXOEF7NJm841E1TNfG41ClFttS', 'ADMIN'),
('Kamalika Y S (Admin)', 'yskamalika09@gmail.com', '$2b$10$nj3KDbZcBCSJp0.VNnqpFeyQPnNalfOtqqLLjRcVkQkBdJPh8zgbe', 'ADMIN'),
('Rahul Sharma', 'rahul@student.com', '$2b$10$8c1vQv3oO6XvD5Pj4R5pbeIhzJ0lQo.0z1R8T.6P3Yq9hQ5Fp0BqO', 'STUDENT')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = CURRENT_TIMESTAMP;
