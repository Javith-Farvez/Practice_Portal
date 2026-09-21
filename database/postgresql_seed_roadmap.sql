-- Placement Practice Portal - PostgreSQL Seed Roadmap SQL
-- Exports subjects and core topic mappings for direct SQL execution

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
