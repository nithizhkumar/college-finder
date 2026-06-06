// @ts-nocheck
// Seed script — run with: npx prisma db seed
// Requires: npm install -D ts-node
// Note: PrismaClient requires `prisma generate` first with a live DATABASE_URL

async function main() {
  // Dynamic import to avoid type errors when prisma client isn't generated
  const { PrismaClient } = await import("@prisma/client");
  const { MOCK_COLLEGES, MOCK_REVIEWS, MOCK_QUESTIONS } = await import("../lib/data");

  const prisma = new PrismaClient();

  try {
    console.log("🌱 Seeding database...");

    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.review.deleteMany();
    await prisma.savedCollege.deleteMany();
    await prisma.college.deleteMany();
    await prisma.user.deleteMany();

    for (const c of MOCK_COLLEGES) {
      await prisma.college.create({ data: c });
      console.log(`  ✓ ${c.name}`);
    }

    const seedUser = await prisma.user.create({
      data: { id: "seed-user-1", name: "Seed User", email: "seed@collegefinder.in" },
    });

    for (const r of MOCK_REVIEWS) {
      await prisma.review.create({
        data: { id: r.id, collegeId: r.collegeId, userId: seedUser.id, rating: r.rating, text: r.text },
      });
    }

    for (const q of MOCK_QUESTIONS) {
      const created = await prisma.question.create({
        data: { id: q.id, collegeId: q.collegeId, userId: seedUser.id, question: q.question, upvotes: q.upvotes },
      });
      for (const a of q.answers) {
        await prisma.answer.create({
          data: { id: a.id, questionId: created.id, userId: seedUser.id, text: a.text, upvotes: a.upvotes },
        });
      }
    }

    console.log("✅ Database seeded successfully");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
