import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const DescriptionSchema = z.object({
  title: z.string(),
  description: z.string(),
  bulletPoints: z.array(z.string()),
  seoTags: z.array(z.string()),
});

export const promptMessage = async (req, res) => {
  const { message } = req.body;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are a helpful shopping assistant for an ecommerce store.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  res.json({ reply: response.choices[0].message.content });
};

export const generateProductDescription = async (req, res) => {
  try {
    const { name, category, brand, oldPrice, newPrice } = req.body;
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
