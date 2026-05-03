import path from "path";
import prisma from "../config/prisma.js";
import fs from "fs";

async function main() {
  const productsData = JSON.parse(
    fs.readFileSync(path.resolve("./migration-data/products.json"), "utf-8"),
  );

  for (const product of productsData) {
    const existing = await prisma.product.findUnique({
      where: { mongoId: product._id?.$oid },
    });

    if (existing) {
      console.log(`Skipping existing product: ${product.name}`);
      continue;
    }
    await prisma.product.create({
      data: {
        id: undefined, // let Prisma generate a new UUID
        mongoId: product._id.$oid, // store original Mongo _id
        name: product.name,
        category: product.category,
        brand: product.brand,
        oldPrice: product.oldPrice,
        newPrice: product.newPrice,
        images: product.images,
        stock: product.stock,
        createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
        updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
      },
    });
  }
  console.log("✅ Products imported successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
