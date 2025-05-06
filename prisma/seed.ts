import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed the "users" table with sample data

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123', // In a real scenario, this should be a hashed password
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'hashedpassword456', // In a real scenario, this should be a hashed password
    },
  });

  console.log('Created users:', user1, user2);

  // Seed other models as needed (example with a 'posts' table)
  const post1 = await prisma.post.create({
    data: {
      title: 'First Post',
      content: 'This is the first post!',
      published: true,
      authorId: user1.id, // Foreign key reference to the user table
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Second Post',
      content: 'This is the second post!',
      published: false,
      authorId: user2.id, // Foreign key reference to the user table
    },
  });

  console.log('Created posts:', post1, post2);

  // If you have more models, continue seeding them as well
  // For example:
  // await prisma.category.create({
  //   data: {
  //     name: 'Technology',
  //   },
  // });

  console.log('Seeding complete!');
}

// Execute the seeding process
main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
