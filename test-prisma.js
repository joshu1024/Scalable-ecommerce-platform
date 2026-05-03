import "dotenv/config";
import prisma from "./config/prisma.js";

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
console.log(process.env.DATABASE_URL);
