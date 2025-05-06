import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  // 1. Seed Skills
  const skill1 = await prisma.skill.upsert({
    where: { id: "b9b7dc69-f59a-4b60-bb3e-687c8984e821" },
    update: {},
    create: { name: "JavaScript" }
  });

  const skill2 = await prisma.skill.upsert({
    where: { id: "eba18dcc-cf60-4a0a-ade5-c7b8afcc2a3a" },
    update: {},
    create: { name: "TypeScript" }
  });

  const skill3 = await prisma.skill.upsert({
    where: { id: "c0df8a58-3382-4384-9274-3f79107393bc" },
    update: {},
    create: { name: "Node.js" }
  });

  // 2. Seed User
  const user = await prisma.user.upsert({
    where: { email: 'jeff@example.com' },
    update: {},
    create: {
      username: 'jeff_dev',
      email: 'jeff@example.com',
      password: 'jeff@123',
      skills: {
        connect: allSkills.map(skill => ({ id: skill.id })),
      },
    },
  });

  // 3. Seed Company
  const company = await prisma.company.upsert({
    where: { name: "Echoverse Inc" },  // Unique name, now allowed
    update: {},
    create: {
      name: "Echoverse Inc",
      description: "Building the AI-native future of work.",
      website: "https://echoverse.ai",
      jobs: {
        create: [
          {
            title: "Full Stack Developer",
            description: "Join us to build modular AI systems.",
            location: "Remote",
            skills: {
              connect: [
                { id: skill1.id },
                { id: skill2.id },
                { id: skill3.id }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("Seeded company and jobs:", company);
}

  // 4. Seed Application
  const job = await prisma.job.findFirst({
    where: { companyId: company.id },
  });

  if (job) {
    await prisma.application.upsert({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId: job.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        jobId: job.id,
        status: 'PENDING',
      },
    });
  }

  console.log('✅ Seed complete.');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
