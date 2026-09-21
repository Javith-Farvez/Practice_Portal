-- Placement Practice Portal - PostgreSQL Seed Data
-- Default Admin & Student accounts (hashed with bcrypt 10 rounds)
-- Core Subjects & Track definitions

-- ============================================================================
-- 1. SEED DEFAULT ACCOUNTS
-- Password for all accounts: Placement@2026 (or Admin@123456 / Student@123456)
-- Hash below is standard bcrypt for Admin@123456 & Student@123456
-- ============================================================================

INSERT INTO users (name, email, password_hash, role)
VALUES 
('Mohammed Javith Farvez (Admin)', 'mohammedjavithfarvezsk07@gmail.com', '$2b$10$ljJpCWpterh/eadb8UoKjue0RuBNXOEF7NJm841E1TNfG41ClFttS', 'ADMIN'),
('Kamalika Y S (Admin)', 'yskamalika09@gmail.com', '$2b$10$nj3KDbZcBCSJp0.VNnqpFeyQPnNalfOtqqLLjRcVkQkBdJPh8zgbe', 'ADMIN'),
('Kamalika Y S (Admin)', 'yskamalika09@gamil.com', '$2b$10$nj3KDbZcBCSJp0.VNnqpFeyQPnNalfOtqqLLjRcVkQkBdJPh8zgbe', 'ADMIN'),
('Portal Admin', 'admin@placementportal.com', '$2b$10$ljJpCWpterh/eadb8UoKjue0RuBNXOEF7NJm841E1TNfG41ClFttS', 'ADMIN'),
('Rahul Sharma', 'rahul@student.com', '$2b$10$8c1vQv3oO6XvD5Pj4R5pbeIhzJ0lQo.0z1R8T.6P3Yq9hQ5Fp0BqO', 'STUDENT'),
('Priya Patel', 'priya@student.com', '$2b$10$8c1vQv3oO6XvD5Pj4R5pbeIhzJ0lQo.0z1R8T.6P3Yq9hQ5Fp0BqO', 'STUDENT')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- 2. SEED CORE SUBJECTS
-- ============================================================================

INSERT INTO subjects (slug, name, description, icon, color_gradient, order_index)
VALUES 
('java', 'Java', 'Master Java from core syntax to OOP, Collections, Multithreading, and interview problem sets.', 'Coffee', 'from-amber-500 to-orange-600', 1),
('python', 'Python', 'Learn Python programming, data manipulation, OOP principles, and campus placement problem solving.', 'Terminal', 'from-blue-500 to-cyan-600', 2),
('dsa', 'DSA', 'Data Structures and Algorithms foundation with high-frequency interview patterns and algorithmic paradigms.', 'Binary', 'from-purple-500 to-indigo-600', 3),
('aptitude', 'Aptitude', 'Quantitative aptitude, logical reasoning, and verbal practice designed for campus placement assessment rounds.', 'BrainCircuit', 'from-emerald-500 to-teal-600', 4)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color_gradient = EXCLUDED.color_gradient,
    order_index = EXCLUDED.order_index,
    updated_at = CURRENT_TIMESTAMP;
