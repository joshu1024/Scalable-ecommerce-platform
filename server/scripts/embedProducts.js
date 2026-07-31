import "dotenv/config";
import { embedAllProducts } from "../services/embedding.service.js";
import prisma from "../config/prisma.js";

async function main() {
  await prisma.$connect();
  console.log("Connected to database");
  await embedAllProducts();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
