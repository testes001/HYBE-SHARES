-- ============================================================================
-- HYBE TRADING APP - SEED DATA
-- ============================================================================
-- This migration script populates the database with initial hardcoded data

-- ============================================================================
-- 1. CLEAR EXISTING DATA (for idempotency)
-- ============================================================================

DELETE FROM featured_stocks WHERE stock_id IN (SELECT id FROM stocks WHERE symbol IN ('HYBE', 'SM', 'JYP', 'YG', 'CUBE', 'STARSHIP', 'FNC', 'PLEDIS'));
DELETE FROM stocks WHERE symbol IN ('HYBE', 'SM', 'JYP', 'YG', 'CUBE', 'STARSHIP', 'FNC', 'PLEDIS');
DELETE FROM educational_content WHERE title IN ('Introduction to Stock Trading', 'Understanding P/E Ratios', 'HYBE''s Business Model Explained', 'The K-Pop Industry Ecosystem', 'Technical Analysis for Beginners', 'Risk Management Strategies', 'Market Orders vs Limit Orders', 'Fan Economy and Stock Performance');
DELETE FROM exclusive_content WHERE title IN ('BTS: Behind the Scenes of ''Dynamite''', 'SEVENTEEN Practice Room Session', 'TXT Photo Shoot Gallery', 'HYBE Q3 2024 Shareholder Letter', 'NewJeans Documentary: The Beginning', 'LE SSERAFIM Exclusive Interview');

-- ============================================================================
-- 2. INSERT STOCKS WITH DETAILED INFORMATION
-- ============================================================================

INSERT INTO stocks (id, symbol, name, current_price, previous_close, volume, market_cap, pe_ratio, description)
VALUES
  ('stock_hybe', 'HYBE', 'HYBE Inc.', 234500, 232000, 1200000, 9800000000000, 45.2, 'HYBE is a South Korean entertainment company known for managing BTS, SEVENTEEN, TXT, and other K-pop artists.'),
  ('stock_sm', 'SM', 'SM Entertainment', 89500, 88200, 850000, 2100000000000, 28.5, 'SM Entertainment is one of the largest entertainment companies in South Korea, home to EXO, NCT, aespa, and Red Velvet.'),
  ('stock_jyp', 'JYP', 'JYP Entertainment', 78200, 79500, 620000, 3200000000000, 32.1, 'JYP Entertainment manages TWICE, Stray Kids, ITZY, and NMIXX, among others.'),
  ('stock_yg', 'YG', 'YG Entertainment', 52300, 51800, 420000, 960000000000, 25.8, 'YG Entertainment is known for BLACKPINK, TREASURE, and legendary acts like BIGBANG.'),
  ('stock_cube', 'CUBE', 'Cube Entertainment', 18500, 18200, 180000, 280000000000, 18.2, 'Cube Entertainment manages (G)I-DLE, PENTAGON, and other rising K-pop groups.'),
  ('stock_starship', 'STARSHIP', 'Starship Entertainment', 24800, 24500, 210000, 450000000000, 22.5, 'Starship Entertainment is home to IVE, MONSTA X, and WJSN.'),
  ('stock_fnc', 'FNC', 'FNC Entertainment', 8200, 8350, 95000, 180000000000, 15.2, 'FNC Entertainment manages SF9, Cherry Bullet, and P1Harmony.'),
  ('stock_pledis', 'PLEDIS', 'Pledis Entertainment', 45600, 44800, 320000, 620000000000, 35.8, 'Pledis Entertainment (subsidiary of HYBE) manages SEVENTEEN and fromis_9.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. INSERT FEATURED STOCKS (first 3 stocks)
-- ============================================================================

INSERT INTO featured_stocks (id, stock_id, position, description)
VALUES
  ('featured_1', 'stock_hybe', 1, 'HYBE Inc. - Leading K-pop entertainment company'),
  ('featured_2', 'stock_sm', 2, 'SM Entertainment - One of the big three entertainment companies'),
  ('featured_3', 'stock_jyp', 3, 'JYP Entertainment - Home of TWICE and Stray Kids')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. INSERT EDUCATIONAL CONTENT
-- ============================================================================

INSERT INTO educational_content (id, title, category, content_type, difficulty, description, content_url)
VALUES
  ('edu_1', 'Introduction to Stock Trading', 'Basics', 'Article', 'Beginner', 'Learn the basics of buying and selling stocks', 'https://example.com/intro-trading'),
  ('edu_2', 'Understanding P/E Ratios', 'Fundamentals', 'Video', 'Intermediate', 'How to evaluate stocks using price-to-earnings ratios', 'https://example.com/pe-ratio'),
  ('edu_3', 'HYBE''s Business Model Explained', 'HYBE', 'Article', 'Beginner', 'Deep dive into how HYBE generates revenue', 'https://example.com/hybe-business'),
  ('edu_4', 'The K-Pop Industry Ecosystem', 'KPOP', 'Video', 'Beginner', 'Understanding the K-pop entertainment business landscape', 'https://example.com/kpop-ecosystem'),
  ('edu_5', 'Technical Analysis for Beginners', 'Strategies', 'Video', 'Intermediate', 'Reading charts and identifying trends', 'https://example.com/technical-analysis'),
  ('edu_6', 'Risk Management Strategies', 'Strategies', 'Article', 'Advanced', 'Protecting your portfolio from major losses', 'https://example.com/risk-management'),
  ('edu_7', 'Market Orders vs Limit Orders', 'Basics', 'Video', 'Beginner', 'Choosing the right order type for your trades', 'https://example.com/order-types'),
  ('edu_8', 'Fan Economy and Stock Performance', 'KPOP', 'Article', 'Intermediate', 'How fandom activity impacts entertainment stocks', 'https://example.com/fan-economy')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. INSERT EXCLUSIVE CONTENT
-- ============================================================================

INSERT INTO exclusive_content (id, title, content_type, description, content_url)
VALUES
  ('excl_1', 'BTS: Behind the Scenes of ''Dynamite''', 'Video', 'Exclusive footage from the making of the hit single', 'https://example.com/bts-dynamite-bts'),
  ('excl_2', 'SEVENTEEN Practice Room Session', 'Video', 'Watch SEVENTEEN perfect their choreography', 'https://example.com/svt-practice'),
  ('excl_3', 'TXT Photo Shoot Gallery', 'Photo', 'Exclusive photos from the latest album shoot', 'https://example.com/txt-photos'),
  ('excl_4', 'HYBE Q3 2024 Shareholder Letter', 'Announcement', 'CEO''s message to shareholders with insights on company direction', 'https://example.com/hybe-shareholder-letter'),
  ('excl_5', 'NewJeans Documentary: The Beginning', 'Video', 'The untold story of NewJeans'' debut journey', 'https://example.com/nj-documentary'),
  ('excl_6', 'LE SSERAFIM Exclusive Interview', 'Article', 'Members discuss their upcoming world tour', 'https://example.com/lsf-interview')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. INSERT STOCK PRICE HISTORY (sample data for the last 30 days)
-- ============================================================================

-- HYBE historical prices
INSERT INTO stock_prices_history (stock_id, price, volume, timestamp)
VALUES
  ('stock_hybe', 220000, 1100000, NOW() - INTERVAL '30 days'),
  ('stock_hybe', 222000, 1150000, NOW() - INTERVAL '29 days'),
  ('stock_hybe', 225000, 1200000, NOW() - INTERVAL '28 days'),
  ('stock_hybe', 223000, 1180000, NOW() - INTERVAL '27 days'),
  ('stock_hybe', 228000, 1250000, NOW() - INTERVAL '26 days'),
  ('stock_hybe', 230000, 1220000, NOW() - INTERVAL '25 days'),
  ('stock_hybe', 232000, 1200000, NOW() - INTERVAL '1 day'),
  ('stock_hybe', 234500, 1200000, NOW())
ON CONFLICT DO NOTHING;

-- SM historical prices
INSERT INTO stock_prices_history (stock_id, price, volume, timestamp)
VALUES
  ('stock_sm', 82000, 800000, NOW() - INTERVAL '30 days'),
  ('stock_sm', 83000, 820000, NOW() - INTERVAL '29 days'),
  ('stock_sm', 85000, 850000, NOW() - INTERVAL '28 days'),
  ('stock_sm', 84500, 840000, NOW() - INTERVAL '27 days'),
  ('stock_sm', 86000, 860000, NOW() - INTERVAL '26 days'),
  ('stock_sm', 87000, 870000, NOW() - INTERVAL '25 days'),
  ('stock_sm', 88200, 850000, NOW() - INTERVAL '1 day'),
  ('stock_sm', 89500, 850000, NOW())
ON CONFLICT DO NOTHING;

-- JYP historical prices
INSERT INTO stock_prices_history (stock_id, price, volume, timestamp)
VALUES
  ('stock_jyp', 75000, 600000, NOW() - INTERVAL '30 days'),
  ('stock_jyp', 76000, 610000, NOW() - INTERVAL '29 days'),
  ('stock_jyp', 77000, 615000, NOW() - INTERVAL '28 days'),
  ('stock_jyp', 78000, 620000, NOW() - INTERVAL '27 days'),
  ('stock_jyp', 79000, 625000, NOW() - INTERVAL '26 days'),
  ('stock_jyp', 79500, 620000, NOW() - INTERVAL '1 day'),
  ('stock_jyp', 78200, 620000, NOW())
ON CONFLICT DO NOTHING;

-- YG historical prices
INSERT INTO stock_prices_history (stock_id, price, volume, timestamp)
VALUES
  ('stock_yg', 50000, 400000, NOW() - INTERVAL '30 days'),
  ('stock_yg', 50500, 405000, NOW() - INTERVAL '29 days'),
  ('stock_yg', 51000, 410000, NOW() - INTERVAL '28 days'),
  ('stock_yg', 51500, 415000, NOW() - INTERVAL '27 days'),
  ('stock_yg', 51800, 418000, NOW() - INTERVAL '1 day'),
  ('stock_yg', 52300, 420000, NOW())
ON CONFLICT DO NOTHING;

-- CUBE historical prices
INSERT INTO stock_prices_history (stock_id, price, volume, timestamp)
VALUES
  ('stock_cube', 17500, 170000, NOW() - INTERVAL '30 days'),
  ('stock_cube', 17800, 175000, NOW() - INTERVAL '29 days'),
  ('stock_cube', 18000, 178000, NOW() - INTERVAL '28 days'),
  ('stock_cube', 18200, 180000, NOW() - INTERVAL '1 day'),
  ('stock_cube', 18500, 180000, NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED DATA INSERTION COMPLETE
-- ============================================================================

COMMIT;
