const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email(),
  display_name: z.string().min(2).max(50),
  password: z.string().min(8).max(100)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const albumCreateSchema = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  release_year: z.number().int().min(1900).max(2100).optional(),
  genre: z.string().max(100).optional()
});

const reviewCreateSchema = z.object({
  album_id: z.number().int(),
  score: z.number().int().min(1).max(10),
  review_text: z.string().max(2000).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  albumCreateSchema,
  reviewCreateSchema
};
