import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
