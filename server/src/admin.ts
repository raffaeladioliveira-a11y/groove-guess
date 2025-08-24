import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import rateLimit from "express-rate-limit";

const prisma = new PrismaClient();
export const adminRouter = Router();

const limiter = rateLimit({ windowMs: 60_000, max: 60 });
adminRouter.use(limiter);

// AuthZ placeholder: replace with proper admin auth middleware
adminRouter.use((req, res, next) => {
  // e.g., validate req.headers["x-admin-key"]
  next();
});

// Genres CRUD
const GenreSchema = z.object({ name: z.string().min(1), description: z.string().optional() });
adminRouter.get("/genres", async (_req, res) => {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
  res.json(genres);
});
adminRouter.post("/genres", async (req, res) => {
  const parsed = GenreSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await prisma.genre.create({ data: parsed.data });
  res.status(201).json(created);
});
adminRouter.put("/genres/:id", async (req, res) => {
  const parsed = GenreSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.genre.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});
adminRouter.delete("/genres/:id", async (req, res) => {
  await prisma.genre.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// Albums CRUD
const AlbumSchema = z.object({ name: z.string(), artist: z.string(), genreId: z.string(), coverUrl: z.string().url().optional() });
adminRouter.get("/albums", async (_req, res) => {
  const albums = await prisma.album.findMany({ include: { genre: true } });
  res.json(albums);
});
adminRouter.post("/albums", async (req, res) => {
  const parsed = AlbumSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await prisma.album.create({ data: parsed.data });
  res.status(201).json(created);
});
adminRouter.put("/albums/:id", async (req, res) => {
  const parsed = AlbumSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.album.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});
adminRouter.delete("/albums/:id", async (req, res) => {
  await prisma.album.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// Songs CRUD
const SongSchema = z.object({ title: z.string(), artist: z.string(), albumId: z.string(), youtubeUrl: z.string().url(), duration: z.number().int().optional() });
adminRouter.get("/songs", async (_req, res) => {
  const songs = await prisma.song.findMany({ include: { album: { include: { genre: true } } } });
  res.json(songs);
});
adminRouter.post("/songs", async (req, res) => {
  const parsed = SongSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await prisma.song.create({ data: parsed.data });
  res.status(201).json(created);
});
adminRouter.put("/songs/:id", async (req, res) => {
  const parsed = SongSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.song.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(updated);
});
adminRouter.delete("/songs/:id", async (req, res) => {
  await prisma.song.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// Scoring config
const ScoringSchema = z.object({ basePoints: z.number().int().min(0), speedBonusMultiplier: z.number().int().min(0), autoIncrement: z.boolean() });
adminRouter.get("/scoring", async (_req, res) => {
  const cfg = await prisma.scoringConfig.findFirst();
  res.json(cfg);
});
adminRouter.post("/scoring", async (req, res) => {
  const parsed = ScoringSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const existing = await prisma.scoringConfig.findFirst();
  let saved;
  if (existing) {
    saved = await prisma.scoringConfig.update({ where: { id: existing.id }, data: parsed.data });
  } else {
    saved = await prisma.scoringConfig.create({ data: parsed.data });
  }
  res.json(saved);
});

