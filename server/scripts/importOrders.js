import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";

async function main() {
  const ordersData = JSON.parse(
    fs.readFileSync(path.resolve("./migration-data/orders.json"), "utf-8"),
  );

  for (const order of ordersData) {
    const user = await prisma.user.findUnique({
      where: { email: order.userEmail },
    });

    if (!user) {
      console.warn(`⚠️ Skipping order, user not found: ${order.userEmail}`);
      continue;
    }

    // Map items by product name
    const itemsData = [];
    for (const item of order.items) {
      const product = await prisma.product.findFirst({
        where: { name: item.name },
      });

      if (!product) {
        console.warn(`⚠️ Skipping item, product not found: ${item.name}`);
        continue;
      }

      itemsData.push({
        productId: product.id, // Use PostgreSQL UUID
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    }

    if (itemsData.length === 0) continue;

    await prisma.order.create({
      data: {
        total: order.total,
        status: order.status,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        userId: user.id,
        items: { create: itemsData },
      },
    });
  }

  console.log("✅ Orders imported successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
