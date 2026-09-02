-- Migration: Add Adat Jawa Motion template (template_id = 9)
-- Run this in Supabase SQL Editor

INSERT INTO templates (id, name, category, description, preview_image_url, is_active)
VALUES (
  9,
  'Adat Jawa Motion',
  'wedding',
  'Template undangan pernikahan bergaya tradisional Jawa dengan ornamen Gunungan, palet warna emas-coklat, animasi scroll yang elegan, countdown timer, galeri foto, love story timeline, dan musik latar.',
  '/templates/adat-jawa/gunungan.jpg',
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  preview_image_url = EXCLUDED.preview_image_url,
  is_active = EXCLUDED.is_active;
