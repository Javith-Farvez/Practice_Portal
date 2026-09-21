import { initDatabase, pool } from '../config/db';
import { SUBJECTS, TOPICS } from '../data/roadmapData';
import { SEED_PROBLEMS } from '../data/problemData';

export const seedPhase2Data = async () => {
  console.log('🚀 [Seed Phase 2] Starting Database Schema & Roadmap Seeding...');
  await initDatabase();

  // 1. Seed Subjects
  console.log('📚 [Seed Phase 2] Seeding 4 core Subjects...');
  for (const sub of SUBJECTS) {
    await pool.query(
      `INSERT INTO subjects (slug, name, description, icon, color_gradient, order_index)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO UPDATE SET 
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         icon = EXCLUDED.icon,
         color_gradient = EXCLUDED.color_gradient,
         order_index = EXCLUDED.order_index`,
      [sub.slug, sub.name, sub.description, sub.icon, sub.color_gradient, sub.order_index]
    );
  }
  console.log(`✅ Seeded ${SUBJECTS.length} Subjects.`);

  // Map subject slug -> id
  const subjectRes = await pool.query<any>('SELECT id, slug FROM subjects');
  const subjectRows = subjectRes.rows;
  const subjectMap = new Map<string, number>();
  subjectRows.forEach((row: any) => subjectMap.set(row.slug, row.id));

  // 2. Seed Topics & Subtopics
  console.log(`📑 [Seed Phase 2] Seeding ${TOPICS.length} Topics across Subjects...`);
  const topicMap = new Map<string, number>();

  for (const topic of TOPICS) {
    const subjectId = subjectMap.get(topic.subjectSlug);
    if (!subjectId) continue;

    await pool.query(
      `INSERT INTO topics (subject_id, name, slug, order_index, description)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (subject_id, slug) DO UPDATE SET 
         name = EXCLUDED.name,
         order_index = EXCLUDED.order_index,
         description = EXCLUDED.description`,
      [subjectId, topic.name, topic.slug, topic.order_index, topic.description]
    );

    // Retrieve topic id
    const topicRes = await pool.query<any>(
      'SELECT id FROM topics WHERE subject_id = $1 AND slug = $2 LIMIT 1',
      [subjectId, topic.slug]
    );
    const topicId = topicRes.rows[0]?.id;
    topicMap.set(`${topic.subjectSlug}:${topic.slug}`, topicId);

    // Seed subtopics
    if (topicId && topic.subtopics && topic.subtopics.length > 0) {
      for (let i = 0; i < topic.subtopics.length; i++) {
        const subName = topic.subtopics[i];
        const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await pool.query(
          `INSERT INTO subtopics (topic_id, name, slug, order_index)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (topic_id, slug) DO UPDATE SET name = EXCLUDED.name, order_index = EXCLUDED.order_index`,
          [topicId, subName, subSlug, i + 1]
        );
      }
    }
  }
  console.log(`✅ Seeded ${TOPICS.length} Topics with modular Subtopics.`);

  // 3. Seed Starter Problems
  console.log(`🧩 [Seed Phase 2] Seeding ${SEED_PROBLEMS.length} curated problems...`);
  let seededCount = 0;
  for (const prob of SEED_PROBLEMS) {
    const subjectId = subjectMap.get(prob.subjectSlug);
    const topicId = topicMap.get(`${prob.subjectSlug}:${prob.topicSlug}`);

    if (!subjectId || !topicId) {
      console.warn(`⚠️ Skipping problem "${prob.title}": Topic ${prob.topicSlug} not found.`);
      continue;
    }

    // Check if problem with same title already exists
    const probCheckRes = await pool.query<any>(
      'SELECT id FROM problems WHERE title = $1 AND subject_id = $2 LIMIT 1',
      [prob.title, subjectId]
    );

    if (probCheckRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO problems (
          title, description, subject_id, topic_id, difficulty, level,
          input_format, output_format, constraints, explanation,
          hints, supported_languages
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          prob.title,
          prob.description,
          subjectId,
          topicId,
          prob.difficulty,
          prob.level,
          prob.input_format,
          prob.output_format,
          prob.constraints,
          prob.explanation,
          JSON.stringify(prob.hints),
          JSON.stringify(prob.supported_languages),
        ]
      );
      seededCount++;
    }
  }
  console.log(`✅ Seeded ${seededCount} realistic, multi-difficulty problems.`);

  console.log('🎉 [Seed Phase 2] Roadmap & Problem foundation database seeded successfully!');
};

// Execute if run directly
if (require.main === module) {
  seedPhase2Data()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Error during Phase 2 seeding:', err);
      await pool.end();
      process.exit(1);
    });
}
