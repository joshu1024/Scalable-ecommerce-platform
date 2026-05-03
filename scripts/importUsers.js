import prisma from "../config/prisma.js";
import fs from "fs";

const users = JSON.parse(
  fs.readFileSync(new URL("../migration-data/users.json", import.meta.url)),
);

async function main() {
  await prisma.user.createMany({
    data: users.map((user) => ({
      userName: user.userName,
      email: user.email,
      password: user.password,
      role: user.role || "user",
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    })),
    skipDuplicates: true,
  });

  console.log("✅ Users imported successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
