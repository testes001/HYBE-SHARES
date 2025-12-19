-- ============================================================================
-- HYBE TRADING APP - DATABASE SCHEMA
-- ============================================================================
-- This migration script creates all necessary tables for the HYBE trading app

-- ============================================================================
-- 1. HYBE PERMIT LICENSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS hybe_permits (
  id SERIAL PRIMARY KEY,
  permit_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hybe_permits_code ON hybe_permits(permit_code);
CREATE INDEX idx_hybe_permits_email ON hybe_permits(email);

-- ============================================================================
-- 2. STOCKS & MARKET DATA
-- ============================================================================

CREATE TABLE IF NOT EXISTS stocks (
  id VARCHAR(50) PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  current_price DECIMAL(18, 4) NOT NULL DEFAULT 0,
  previous_close DECIMAL(18, 4) DEFAULT 0,
  volume BIGINT DEFAULT 0,
  market_cap BIGINT,
  pe_ratio DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stocks_symbol ON stocks(symbol);

CREATE TABLE IF NOT EXISTS stock_prices_history (
  id SERIAL PRIMARY KEY,
  stock_id VARCHAR(50) NOT NULL,
  price DECIMAL(18, 4) NOT NULL,
  volume BIGINT DEFAULT 0,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

CREATE INDEX idx_stock_prices_stock_id ON stock_prices_history(stock_id);
CREATE INDEX idx_stock_prices_timestamp ON stock_prices_history(timestamp);

-- ============================================================================
-- 3. USER PORTFOLIOS & HOLDINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_portfolios (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  total_value DECIMAL(18, 4) DEFAULT 0,
  cash_balance DECIMAL(18, 4) DEFAULT 10000000,
  virtual_currency VARCHAR(10) DEFAULT 'KRW',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_portfolios_user_id ON user_portfolios(user_id);

CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id VARCHAR(50) PRIMARY KEY,
  portfolio_id VARCHAR(50) NOT NULL,
  stock_id VARCHAR(50) NOT NULL,
  quantity INT DEFAULT 0,
  average_cost DECIMAL(18, 4) DEFAULT 0,
  current_value DECIMAL(18, 4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES user_portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

CREATE INDEX idx_portfolio_holdings_portfolio_id ON portfolio_holdings(portfolio_id);
CREATE INDEX idx_portfolio_holdings_stock_id ON portfolio_holdings(stock_id);

-- ============================================================================
-- 4. USER TRADES & ORDERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_trades (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  portfolio_id VARCHAR(50) NOT NULL,
  stock_id VARCHAR(50) NOT NULL,
  side VARCHAR(10) NOT NULL CHECK (side IN ('BUY', 'SELL')),
  quantity INT NOT NULL,
  price DECIMAL(18, 4) NOT NULL,
  total_amount DECIMAL(18, 4) NOT NULL,
  status VARCHAR(20) DEFAULT 'EXECUTED' CHECK (status IN ('PENDING', 'EXECUTED', 'CANCELLED', 'FAILED')),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  FOREIGN KEY (portfolio_id) REFERENCES user_portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_trades_user_id ON user_trades(user_id);
CREATE INDEX idx_user_trades_portfolio_id ON user_trades(portfolio_id);
CREATE INDEX idx_user_trades_timestamp ON user_trades(timestamp);

CREATE TABLE IF NOT EXISTS user_orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  portfolio_id VARCHAR(50) NOT NULL,
  stock_id VARCHAR(50) NOT NULL,
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('MARKET', 'LIMIT')),
  side VARCHAR(10) NOT NULL CHECK (side IN ('BUY', 'SELL')),
  quantity INT NOT NULL,
  price DECIMAL(18, 4),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'EXECUTED', 'CANCELLED', 'FAILED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  FOREIGN KEY (portfolio_id) REFERENCES user_portfolios(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_orders_user_id ON user_orders(user_id);
CREATE INDEX idx_user_orders_portfolio_id ON user_orders(portfolio_id);
CREATE INDEX idx_user_orders_status ON user_orders(status);

-- ============================================================================
-- 5. USER ACTIVITY & NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_sessions(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);

CREATE TABLE IF NOT EXISTS user_transactions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  amount DECIMAL(18, 4) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'COMPLETED',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_sessions(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_transactions_user_id ON user_transactions(user_id);
CREATE INDEX idx_user_transactions_timestamp ON user_transactions(timestamp);

-- ============================================================================
-- 6. LEADERBOARD
-- ============================================================================

CREATE TABLE IF NOT EXISTS leaderboard (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  portfolio_value DECIMAL(18, 4) DEFAULT 0,
  total_return DECIMAL(18, 4) DEFAULT 0,
  total_return_percent DECIMAL(8, 2) DEFAULT 0,
  rank INT,
  trades INT DEFAULT 0,
  win_rate DECIMAL(5, 2) DEFAULT 0,
  country VARCHAR(100),
  country_code VARCHAR(2),
  withdrawn_amount DECIMAL(18, 4) DEFAULT 0,
  joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  avatar_url TEXT,
  bio TEXT,
  favorite_artist VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_sessions(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX idx_leaderboard_portfolio_value ON leaderboard(portfolio_value DESC);

-- ============================================================================
-- 7. ADMIN DATA - FEATURED STOCKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS featured_stocks (
  id VARCHAR(50) PRIMARY KEY,
  stock_id VARCHAR(50) NOT NULL,
  position INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

CREATE INDEX idx_featured_stocks_position ON featured_stocks(position);

-- ============================================================================
-- 8. EDUCATIONAL CONTENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS educational_content (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  content_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_educational_content_category ON educational_content(category);
CREATE INDEX idx_educational_content_difficulty ON educational_content(difficulty);

CREATE TABLE IF NOT EXISTS user_content_progress (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  content_id VARCHAR(50) NOT NULL,
  progress_percent INT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES educational_content(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_content_progress_user_id ON user_content_progress(user_id);
CREATE INDEX idx_user_content_progress_completed ON user_content_progress(completed);

-- ============================================================================
-- 9. EXCLUSIVE CONTENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS exclusive_content (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  content_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exclusive_content_type ON exclusive_content(content_type);

-- ============================================================================
-- 10. WATCHLIST
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_watchlist (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  stock_id VARCHAR(50) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  position INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
  UNIQUE(user_id, stock_id)
);

CREATE INDEX idx_user_watchlist_user_id ON user_watchlist(user_id);

-- ============================================================================
-- 11. PRICE ALERTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS price_alerts (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  stock_id VARCHAR(50) NOT NULL,
  target_price DECIMAL(18, 4) NOT NULL,
  condition VARCHAR(20) NOT NULL CHECK (condition IN ('ABOVE', 'BELOW')),
  is_active BOOLEAN DEFAULT true,
  triggered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_sessions(user_id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_is_active ON price_alerts(is_active);

-- ============================================================================
-- INSERT SAMPLE DATA - HYBE PERMITS
-- ============================================================================

INSERT INTO hybe_permits (permit_code, name, email, is_active)
VALUES
  ('HYBH4CEX464RW', 'Jennifer Wollenmann', 'wollenmannj@yahoo.com', true),
  ('HYB10250GB0680', 'Elisabete Magalhaes', 'bettamagalhaes@gmail.com', true),
  ('HYB59371A4C9F2', 'Meghana Vaishnavi', 'vrsingh9910@gmail.com', true),
  ('B07200EF6667', 'Radhika Verma', 'vrsingh9910@gmail.com', true),
  ('HYB07280EF6207', 'Aneeta Varghese', 'aneetatheresa@gmail.com', true)
ON CONFLICT (permit_code) DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE DATA - STOCKS
-- ============================================================================

INSERT INTO stocks (id, symbol, name, current_price, previous_close, volume, market_cap, pe_ratio)
VALUES
  ('stock_hybe', 'HYBE', 'HYBE Inc.', 140000, 135000, 5000000, 14000000000, 25.5),
  ('stock_sm', 'SM', 'SM Entertainment', 85000, 82000, 3200000, 8500000000, 18.2),
  ('stock_jyp', 'JYP', 'JYP Entertainment', 95000, 92000, 2100000, 9500000000, 22.1),
  ('stock_yg', 'YG', 'YG Entertainment', 75000, 73000, 1800000, 7500000000, 19.8),
  ('stock_cube', 'CUBE', 'Cube Entertainment', 32000, 31000, 1200000, 3200000000, 14.5)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX idx_stocks_updated_at ON stocks(updated_at);
CREATE INDEX idx_stock_prices_created_at ON stock_prices_history(created_at);
