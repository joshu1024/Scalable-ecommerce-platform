import { toolName } from "@anthropic-ai/sdk/lib/tools/BetaRunnableTool.js";
import Groq from "groq-sdk";
import { Stream } from "groq-sdk/core/streaming.mjs";
import { z } from "zod";
import prisma from "../config/prisma.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const DescriptionSchema = z.object({
  title: z.string(),
  description: z.string(),
  bulletPoints: z.array(z.string()),
  seoTags: z.array(z.string()),
});
const SYSTEM_PROMPT =
  "You are a helpful shopping assistant for SneakerZone, an online sneaker store. You help customers find products, check availability, and answer questions about orders. Always be concise, friendly, and specific. Never make up product details, prices, or stock levels. If you cannot find what the customer needs, say so honestly. The store carries these brands: Nike, Adidas, Puma. Categories are: Men, Women, Kids. All prices are in dollars.";

const FEW_SHOT_EXAMPLES = [
  {
    role: "user",
    content: "do you have any Nike shoes?",
  },
  {
    role: "assistant",
    content:
      "Yes! We carry several Nike styles including Air Max, Pegasus, Dunk Low, and more across Men, Women, and Kids categories. What are you looking for?",
  },
  {
    role: "user",
    content: "what brands do you carry?",
  },
  {
    role: "assistant",
    content:
      "We carry three brands — Nike, Adidas, and Puma — across Men, Women, and Kids categories. Would you like me to search for something specific?",
  },
  {
    role: "user",
    content: "show me women's shoes under $70",
  },
  {
    role: "assistant",
    content: "Let me search our women's collection under $70 for you.",
  },
];
const tools = [
  {
    type: "function",
    function: {
      name: "searchProducts",
      description:
        "Search products by name, category, brand, or price range. Use this when the user asks about products, availability, or wants recommendations.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Product category e.g. Sneakers, Boots, Sandals",
            nullable: true,
          },
          brand: {
            type: "string",
            description: "Product brand e.g. Nike, Adidas, Puma",
            nullable: true,
          },
          maxPrice: {
            type: "number",
            description: "Maximum price in dollars (newPrice field)",
            nullable: true,
          },
          minPrice: {
            type: "number",
            description: "Minimum price in dollars (newPrice field)",
            nullable: true,
          },
          nameContains: {
            type: "string",
            description: "Keyword to search in product name",
            nullable: true,
          },
          inStockOnly: {
            type: "boolean",
            description:
              "If true, only return products with stock greater than 0. Only use this if the user specifically asks about stock availability.",
            nullable: true,
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getProductById",
      description:
        "Get full details of a single product by its ID. Use this when the user asks about a specific product.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The product ID",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getOrderStatus",
      description:
        "Get order status and items for the logged-in user by order ID.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The order ID to look up",
          },
        },
        required: ["orderId"],
      },
    },
  },
];
export const promptMessage = async (req, res) => {
  const { message } = req.body;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
        ...FEW_SHOT_EXAMPLES,
        ...messages,
      },
    ],
  });

  res.json({ reply: response.choices[0].message.content });
};
export const streamChat = async (req, res) => {
  try {
    const { messages } = req.body;
    const userId = req.user?.id || null;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.ALLOWED_ORIGINS?.split(",")[0] || "http://localhost:5173",
    );
    res.flushHeaders();

    const firstResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1024,
      tools,
      tool_choice: "auto",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...FEW_SHOT_EXAMPLES,
        ...messages,
      ],
    });

    const firstMessage = firstResponse.choices[0].message;

    if (firstMessage.tool_calls && firstMessage.tool_calls.length > 0) {
      const toolCall = firstMessage.tool_calls[0];
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      const toolResult = await executeTool(toolName, toolArgs, userId);

      const stream = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...FEW_SHOT_EXAMPLES,
          ...messages,
          firstMessage,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
          },
        ],
      });

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (token) {
          res.write(`data:${JSON.stringify({ token })}\n\n`);
        }
      }

      res.write("data:[DONE]\n\n");
      res.end();
      return;
    }
    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      stream: true,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...FEW_SHOT_EXAMPLES,
        ...messages,
      ],
    });
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        res.write(`data:${JSON.stringify({ token })}\n\n`);
      }
    }
    res.write("data:[DONE]\n\n");
    res.end();
  } catch (error) {
    console.log("stream chat error", error);
    res.write(`data:${JSON.stringify({ error: "stream failed" })}`);
  }
};
export const generateProductDescription = async (req, res) => {
  try {
    const { name, category, brand, oldPrice, newPrice } = req.body;
    console.log("Request body:", req.body);
    console.log("Fields:", { name, category, brand, oldPrice, newPrice });
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a product copywriter for an ecommerce store.
          You must respond with ONLY a valid JSON object, no markdown, no backticks, no explanation.
          The JSON must have exactly these fields:
          {
            "title": "string",
            "description": "string (2-3 sentences)",
            "bulletPoints": ["string", "string", "string"],
            "seoTags": ["string", "string", "string"]
          }
          `,
        },
        {
          role: "user",
          content: `Create a product listing for:
          Name: Nike Air MAx,
          Category:Men,
          Brand:Nike,
          Original Price: $58,
          New Price:$53
          `,
        },
        {
          role: "assistant",
          content: JSON.stringify({
            title: "Nike Air Max",
            description:
              "The Nike Air Max combines iconic style with responsive cushioning for everyday comfort. Featuring a sleek, athletic design and signature Air cushioning technology, these sneakers are built to keep you comfortable while making a statement.",
            bulletPoints: [
              "Signature Air cushioning for responsive comfort",
              "Iconic Nike design with a sleek, athletic silhouette",
              "Durable construction for everyday wear",
            ],
            seoTags: [
              "Nike Air Max",
              "Men's Nike Sneakers",
              "Air Cushioning Shoes",
            ],
          }),
        },
        {
          role: "user",
          content: `Generate a product listing for:
          Name:Nike Air Force 1,
          Category:Women,
          Brand:Nike,
          Original Price:$78,
          New Price:$72
          `,
        },
        {
          role: "assistant",
          content: JSON.stringify({
            title: "Nike Air Force 1 — Classic Sneakers",
            description:
              "The iconic Nike Air Force 1 combines timeless style with all-day comfort. Featuring a durable leather upper and Air-Sole cushioning, these sneakers are built to last. Perfect for casual wear or streetwear styling.",
            bulletPoints: [
              "Durable leather upper for long-lasting wear",
              "Air-Sole unit for lightweight cushioning",
              "Classic low-top silhouette for versatile styling",
            ],
            seoTags: [
              "Nike Air Force 1",
              "Classic White Sneakers",
              "Men's Casual Shoes",
            ],
          }),
        },
        {
          role: "user",
          content: `Generate a product listing for :
          Name: ${name}
          Category: ${category}
          Brand: ${brand}
          Original price: $${oldPrice}
          Sale price: $${newPrice}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    const raw = response.choices[0].message.content.trim();
    const parsed = JSON.parse(raw);
    const validated = DescriptionSchema.parse(parsed);
    res.json(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ error: "AI returned invalid structure" });
    }
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }
    res.status(500).json({ error: "Failed to generate description" });
  }
};

export const executeTool = async (toolName, args, userId) => {
  if (toolName === "searchProducts") {
    const products = await prisma.product.findMany({
      where: {
        ...(args.category && {
          category: { contains: args.category, mode: "insensitive" },
        }),
        ...(args.brand && {
          brand: { contains: args.brand, mode: "insensitive" },
        }),
        ...(args.nameContains && {
          name: { contains: args.nameContains, mode: "insensitive" },
        }),
        ...(args.inStockOnly === true && { stock: { gt: 0 } }),
        ...((args.minPrice || args.maxPrice) && {
          newPrice: {
            ...(args.maxPrice && { lte: args.maxPrice }),
            ...(args.minPrice && { lte: args.minPrice }),
          },
        }),
      },
      take: 5,
      select: {
        id: true,
        name: true,
        category: true,
        brand: true,
        newPrice: true,
        oldPrice: true,
        stock: true,
        images: true,
      },
    });
    return products;
  }
  if (toolName === "getProductById") {
    const product = await prisma.product.findUnique({
      where: { id: args.id },
    });
    return product;
  }
  if (toolName === "getOrderStatus") {
    const order = await prisma.order.findFirst({
      where: {
        id: args.orderId,
        userId, // scoped to logged-in user — AI can never access another user's order
      },
      include: { items: true },
    });
    return order;
  }

  return { error: "Unknown tool" };
};
export const chatWithTools = async (req, res) => {
  try {
    const { messages } = req.body;
    const userId = req.user?.id || null;

    const firstResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1024,
      tool_choice: "auto",
      tools,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...FEW_SHOT_EXAMPLES,
        ...messages,
      ],
    });

    const firstMessage = firstResponse.choices[0].message;
    if (firstMessage.tool_calls && firstMessage.tool_calls.length > 0) {
      const toolCall = firstMessage.tool_calls[0];
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      const toolResult = await executeTool(toolName, toolArgs, userId);

      const secondResponse = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 1024,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...FEW_SHOT_EXAMPLES,
          ...messages,
          firstMessage,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
          },
        ],
      });
      return res.json({
        reply: secondResponse.choices[0].message.content,
        toolUsed: toolName,
        toolArgs,
      });
    }
    res.json({ reply: firstMessage.content });
  } catch (error) {
    console.error("chatWithTools error:", error);
    res
      .status(500)
      .json({ error: "Failed to get a response. Please try again." });
  }
};
