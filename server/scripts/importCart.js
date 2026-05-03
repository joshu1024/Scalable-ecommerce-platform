// scripts/importCart.js
import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";

async function main() {
  const cartsData = JSON.parse(
    fs.readFileSync(path.resolve("./migration-data/carts.json"), "utf-8"),
  );

  for (const cart of cartsData) {
    // find user by email
    const user = await prisma.user.findUnique({
      where: { email: cart.userEmail },
    });

    if (!user) {
      console.warn(`⚠️ Skipping cart, user not found: ${cart.userId}`);
      continue;
    }

    // ✅ PUT THE CODE HERE
    const validItems = [];

    for (const item of cart.items) {
      const product = await prisma.product.findUnique({
        where: { mongoId: item.productId }, // match Mongo ID
      });

      if (!product) {
        console.warn(`⚠️ Skipping item, product not found: ${item.productId}`);
        continue;
      }

      validItems.push({
        productId: product.id, // use Postgres UUID
        quantity: item.quantity,
      });
    }

    if (validItems.length === 0) continue;

    // create cart
    await prisma.cart.create({
      data: {
        id: cart.id,
        userId: user.id,
        items: {
          create: validItems,
        },
      },
    });
  }

  console.log("✅ Carts imported successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
