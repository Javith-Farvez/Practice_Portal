import bcrypt from 'bcryptjs';
import { initDatabase, pool } from '../config/db';

const seedAccounts = async () => {
  try {
    console.log('🔄 Initializing database schema...');
    await initDatabase();

    console.log('🌱 Seeding initial accounts (Admin & Student)...');
    const farvezPasswordHash = await bcrypt.hash('Farvez@0011', 10);
    const kamalikaPasswordHash = await bcrypt.hash('Kamalika@2006', 10);
    const studentPasswordHash = await bcrypt.hash('Student@123456', 10);

    const users = [
      {
        name: 'Mohammed Javith Farvez',
        email: 'mohammedjavithfarvezsk07@gmail.com',
        password_hash: farvezPasswordHash,
        role: 'ADMIN',
      },
      {
        name: 'Kamalika Y S',
        email: 'yskamalika09@gmail.com',
        password_hash: kamalikaPasswordHash,
        role: 'ADMIN',
      },
      {
        name: 'Kamalika Y S',
        email: 'yskamalika09@gamil.com',
        password_hash: kamalikaPasswordHash,
        role: 'ADMIN',
      },
      {
        name: 'Portal Admin',
        email: 'admin@placementportal.com',
        password_hash: farvezPasswordHash,
        role: 'ADMIN',
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@student.com',
        password_hash: studentPasswordHash,
        role: 'STUDENT',
      },
      {
        name: 'Priya Patel',
        email: 'priya@student.com',
        password_hash: studentPasswordHash,
        role: 'STUDENT',
      },
    ];

    for (const u of users) {
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name,
           role = EXCLUDED.role,
           password_hash = EXCLUDED.password_hash`,
        [u.name, u.email, u.password_hash, u.role]
      );
      console.log(`✅ Seeded account: ${u.email} [${u.role}]`);
    }

    console.log('🎉 Database initialization and seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedAccounts();
