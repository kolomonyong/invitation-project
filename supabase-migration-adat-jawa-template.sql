-- Migration: Add Adat Jawa Motion template (template_id = 9)
-- Run this in Supabase SQL Editor

INSERT INTO templates (id, name, category, preview_image_url, structure_json)
VALUES (
  9,
  'Adat Jawa Motion',
  'wedding',
  '/templates/adat-jawa/gunungan.jpg',
  '{"fields":[{"name":"coupleNames","type":"text","label":"Couple Names (e.g. \"Ahmad & Fatimah\")","required":true},{"name":"openingQuote","type":"text","label":"Opening Quote / Quranic Verse"},{"name":"openingQuoteSource","type":"text","label":"Quote Source (e.g. \"QS. Ar-Rum : 21\")"},{"name":"groomPhoto","type":"image","label":"Groom Photo"},{"name":"groomFullName","type":"text","label":"Groom Full Name","required":true},{"name":"groomNickname","type":"text","label":"Groom Nickname"},{"name":"groomParents","type":"text","label":"Groom Parents (e.g. \"Putra dari Bapak & Ibu\")"},{"name":"bridePhoto","type":"image","label":"Bride Photo"},{"name":"brideFullName","type":"text","label":"Bride Full Name","required":true},{"name":"brideNickname","type":"text","label":"Bride Nickname"},{"name":"brideParents","type":"text","label":"Bride Parents (e.g. \"Putri dari Bapak & Ibu\")"},{"name":"countdownTarget","type":"date","label":"Countdown Target Date","required":true},{"name":"akadDate","type":"date","label":"Akad Nikah Date","required":true},{"name":"akadTime","type":"text","label":"Akad Nikah Time (e.g. \"08:00 - 10:00 WIB\")"},{"name":"akadVenue","type":"text","label":"Akad Nikah Venue"},{"name":"akadAddress","type":"text","label":"Akad Nikah Address"},{"name":"akadMapsUrl","type":"text","label":"Akad Nikah Google Maps URL"},{"name":"receptionDate","type":"date","label":"Resepsi Date"},{"name":"receptionTime","type":"text","label":"Resepsi Time (e.g. \"11:00 - 17:00 WIB\")"},{"name":"receptionVenue","type":"text","label":"Resepsi Venue"},{"name":"receptionAddress","type":"text","label":"Resepsi Address"},{"name":"receptionMapsUrl","type":"text","label":"Resepsi Google Maps URL"},{"name":"livestreamUrl1","type":"text","label":"Live Streaming URL"},{"name":"galleryPhoto1","type":"image","label":"Gallery Photo 1"},{"name":"galleryPhoto2","type":"image","label":"Gallery Photo 2"},{"name":"galleryPhoto3","type":"image","label":"Gallery Photo 3"},{"name":"galleryPhoto4","type":"image","label":"Gallery Photo 4"},{"name":"galleryPhoto5","type":"image","label":"Gallery Photo 5"},{"name":"galleryPhoto6","type":"image","label":"Gallery Photo 6"},{"name":"giftBankName","type":"text","label":"Bank Name for Gift (e.g. \"BCA\")"},{"name":"giftBankAccount","type":"text","label":"Bank Account Number"},{"name":"giftAccountHolder","type":"text","label":"Bank Account Holder Name"},{"name":"giftRecipientName","type":"text","label":"Physical Gift Recipient Name"},{"name":"giftAddress","type":"text","label":"Physical Gift Address"},{"name":"closingMessage","type":"text","label":"Closing Message"},{"name":"backgroundMusicUrl","type":"text","label":"Background Music URL (.mp3 link)"}]}'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  preview_image_url = EXCLUDED.preview_image_url,
  structure_json = EXCLUDED.structure_json;
