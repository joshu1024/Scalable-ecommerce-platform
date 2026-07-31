import { CohereClient } from "cohere-ai";
import prisma from "../config/prisma.js";

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

export const generateEmbedding = async (text) => {
  const response = await cohere.embed({
    texts: [text.trim().toLowerCase()],
    model: "embed-english-v3.0",
    inputType: "search_document",
  });

  return response.embeddings[0];
};

const productToText = (product) =>
  `${product.name} ${product.brand} ${product.category} $${product.newPrice}`.trim();

export const embedProduct = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error(`Product ${productId} not found`);

  const embedding = await generateEmbedding(productToText(product));

  await prisma.$executeRaw`
    INSERT INTO "ProductEmbedding" ("id", "productId", "embedding", "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(),
      ${productId},
      ${`[${embedding.join(",")}]`}::vector,
      NOW(),
      NOW()
    )
    ON CONFLICT ("productId")
    DO UPDATE SET
      "embedding" = ${`[${embedding.join(",")}]`}::vector,
      "updatedAt" = NOW()
  `;

  return embedding;
};

export const embedAllProducts = async () => {
  const products = await prisma.product.findMany();
  console.log(`Embedding ${products.length} products...`);

  let done = 0;
  for (const product of products) {
    await embedProduct(product.id);
    done++;
    console.log(`${done}/${products.length} — ${product.name}`);
  }

  console.log("Done embedding all products.");
};

export const semanticSearchProducts = async (query, limit = 5) => {
  const queryEmbedding = await generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(",")}]`;

  const results = await prisma.$queryRaw`
    SELECT
      p.id,
      p.name,
      p.brand,
      p.category,
      p."newPrice",
      p."oldPrice",
      p.stock,
      p.images,
      1 - (pe.embedding <=> ${vectorString}::vector) AS similarity
    FROM "ProductEmbedding" pe
    JOIN "Product" p ON p.id = pe."productId"
    ORDER BY pe.embedding <=> ${vectorString}::vector
    LIMIT ${limit}
  `;

  return results;
};
