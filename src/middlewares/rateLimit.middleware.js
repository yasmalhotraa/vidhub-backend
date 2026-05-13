import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Global API protection
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// Auth-specific protection
export const authLimiter = (prefix) =>
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return `${prefix}:${ipKeyGenerator(req.ip)}`;
    },
    message: {
      success: false,
      message: "Too many authentication attempts. Please try again later.",
    },
  });
