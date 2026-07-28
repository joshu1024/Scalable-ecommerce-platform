import rateLimit from "express-rate-limit";
import { error } from "node:console";
const INJECTION_PATTERNS = [
  /ignore (previous|all|above) instructions/i,
  /you are now/i,
  /pretend (you are|to be)/i,
  /forget (your|all) (instructions|rules|system prompt)/i,
  /act as (a|an|if)/i,
  /jailbreak/i,
  /do anything now/i,
];
const BLOCKED_OUTPUT_PATTERNS = [
  /\b(bomb|weapon|explosiv)/i,
  /\b(kill|murder|assault)\b/i,
  /\b(credit.?card.?number|cvv|ssn|social.security)\b/i,
];
export const aiRateLimiter = await rateLimit({
  windowMs: 15 * 60 * 100,
  max: 20,
  message: {
    error: "Too many AI requests : Please wait for 15 minutes and try again",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export const checkTokenQuota = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) return next();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { aiTokensUsed: true, aiTokensResetAt: true, role: true },
    });

    if (!user) return next();

    if (user.role === "admin") return next();

    const now = new Date();
    const resetAt = new Date(user.aiTokensResetAt || 0);
    const isNewMonth =
      now.getMonth() !== resetAt.getMonth() ||
      now.getFullYear() !== resetAt.getFullYear();

    if (isNewMonth) {
      await prisma.user.update({
        where: { id: userId },
        data: { aiTokensUsed: 0, aiTokensResetAt: now },
      });
      return next();
    }

    const FREE_TIER_LIMIT = 50000;
    if (user.aiTokensUsed >= FREE_TIER_LIMIT) {
      return res.status(429).json({
        error:
          "Monthly AI quota reached. Upgrade to continue using AI features.",
        tokensUsed: user.aiTokensUsed,
        limit: FREE_TIER_LIMIT,
      });
    }

    next();
  } catch (error) {
    console.error("checkTokenQuota error:", error);
    next();
  }
};

export const recordTokenUsage = async (userId, tokensUsed) => {
  if (!userId || !tokensUsed) return;

  await prisma.user.update({
    where: { id: userId },
    data: { aiTokensUsed: { increment: tokensUsed } },
  });
};
export const validateAiInput = async (req, res) => {
  try {
    const { message, messages } = req.body;

    const userText =
      message ||
      (Array.isArray(messages)
        ? messages.filter((m) => m.role === "user").at(-1)
        : null);
    if (!userText) {
      return res.status(400).json({
        error: "Message is required",
      });
    }
    if (userText > 1000) {
      res.status(400).json({
        error: "Message too long: Please dont type more than 1000 words",
      });
    }

    const isInjection = INJECTION_PATTERNS.some((pattern) =>
      pattern.test(userText),
    );
    if (isInjection) {
      res.status(400).json({ error: "I cant process that request" });
    }
  } catch (error) {
    console.error(error);
  }
};

export const moderateOutput = (text) => {
  if (!text) return { safe: true, text };

  const blocked = BLOCKED_OUTPUT_PATTERNS.some((p) => p.test(text));
  if (blocked) {
    return {
      safe: false,
      text: "I'm sorry, I can't help with that.",
    };
  }

  return { safe: true, text };
};
