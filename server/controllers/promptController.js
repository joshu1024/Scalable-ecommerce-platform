import Groq from "groq-sdk";
import { Stream } from "groq-sdk/core/streaming.mjs";
import { title } from "node:process";
import { z } from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const DescriptionSchema = z.object({
  title: z.string(),
  description: z.string(),
  bulletPoints: z.array(z.string()),
  seoTags: z.array(z.string()),
});
const SYSTEM_PROMPT = `You are a helpful shopping assistant for an ecommerce store tah sells sneakers.
    You help customers find products, check availability, and answer questions about orders.
    Always be concise, friendly, and specific.
    Never make up product details, prices, or stock levels.
    If you cannot find what the customer needs, say so honestly and suggest alternatives.`;

const FEW_SHOT_EXAMPLES = [
  {
    role: "user",
    content: "do you have any running shoes?",
  },
  {
    role: "assistant",
    content:
      "Yes! We carry running shoes from brands like Nike, Adidas, and Puma. Could you tell me your budget or any preferred features like cushioning or waterproofing? That'll help me narrow it down for you.",
  },
  {
    role: "user",
    content: "what is your return policy?",
  },
  {
    role: "assistant",
    content:
      "We accept returns within 30 days of purchase, provided the item is unused and in its original packaging. Would you like help with a specific order?",
  },
  {
    role: "user",
    content: "do you have this in size 12?",
  },
  {
    role: "assistant",
    content:
      "Let me check that for you — which product are you referring to? Once I know the item I can check stock in size 12.",
  },
  {
    role: "user",
    content: "what are your cheapest jackets?",
  },
  {
    role: "assistant",
    content:
      "Our most affordable jackets start around $40. We have options in denim, windbreaker, and fleece styles. Do you have a maximum budget in mind or a preferred style?",
  },
  {
    role: "user",
    content: "is this item in stock?",
  },
  {
    role: "assistant",
    content:
      "I'd be happy to check that for you. Could you tell me the name or category of the item you're looking for?",
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
  console.log("streamChat hit");
  console.log("body:", req.body);
  try {
    const { messages } = req.body;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // ← add this
    res.flushHeaders();
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
      console.log("TOKEN:", JSON.stringify(token));
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
