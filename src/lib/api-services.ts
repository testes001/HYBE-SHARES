// ============================================================================
// API SERVICES - Live Stock Data & News Integration
// ============================================================================

// Polygon.io API for live stock data
// API keys are loaded from environment variables for security
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY || "";
const POLYGON_BASE_URL = "https://api.polygon.io";

// Alpha Vantage API for news
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Warn if API keys are not configured
if (!POLYGON_API_KEY) {
  console.warn("VITE_POLYGON_API_KEY is not set. Stock data API calls will fail.");
}
if (!ALPHA_VANTAGE_API_KEY) {
  console.warn("VITE_ALPHA_VANTAGE_API_KEY is not set. News API calls will fail.");
}

// ============================================================================
// POLYGON.IO TYPES
// ============================================================================

export interface PolygonStockQuote {
  ticker: string;
  c: number; // close price
  h: number; // high price
  l: number; // low price
  o: number; // open price
  pc: number; // previous close
  t: number; // timestamp
  v: number; // volume
}

export interface PolygonAggregateResult {
  ticker: string;
  results: {
    c: number; // close
    h: number; // high
    l: number; // low
    o: number; // open
    v: number; // volume
    vw: number; // volume weighted average
    t: number; // timestamp
    n: number; // number of transactions
  }[];
}

export interface PolygonTickerDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  currency_name: string;
  market_cap?: number;
  description?: string;
  homepage_url?: string;
  total_employees?: number;
  list_date?: string;
  branding?: {
    logo_url?: string;
    icon_url?: string;
  };
}

// ============================================================================
// ALPHA VANTAGE TYPES
// ============================================================================

export interface AlphaVantageNewsItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image?: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: { topic: string; relevance_score: string }[];
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment?: {
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }[];
}

export interface AlphaVantageNewsResponse {
  items: string;
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: AlphaVantageNewsItem[];
}

// ============================================================================
// POLYGON.IO API FUNCTIONS
// ============================================================================

/**
 * Fetch previous day's OHLC for a stock
 */
export async function getStockPreviousClose(ticker: string): Promise<PolygonStockQuote | null> {
  try {
    const response = await fetch(
      `${POLYGON_BASE_URL}/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      console.warn(`Polygon API error for ${ticker}:`, response.status);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        ticker,
        c: result.c,
        h: result.h,
        l: result.l,
        o: result.o,
        pc: result.c, // Use close as previous close
        t: result.t,
        v: result.v,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    return null;
  }
}

/**
 * Fetch aggregated bars for a stock over a date range
 */
export async function getStockAggregates(
  ticker: string,
  multiplier: number = 1,
  timespan: "minute" | "hour" | "day" | "week" | "month" = "day",
  from: string,
  to: string
): Promise<PolygonAggregateResult | null> {
  try {
    const response = await fetch(
      `${POLYGON_BASE_URL}/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      console.warn(`Polygon API error for ${ticker} aggregates:`, response.status);
      return null;
    }

    const data = await response.json();

    return {
      ticker,
      results: data.results || [],
    };
  } catch (error) {
    console.error(`Error fetching aggregates for ${ticker}:`, error);
    return null;
  }
}

/**
 * Fetch real-time quote for a stock
 */
export async function getStockSnapshot(ticker: string): Promise<PolygonStockQuote | null> {
  try {
    const response = await fetch(
      `${POLYGON_BASE_URL}/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      console.warn(`Polygon snapshot API error for ${ticker}:`, response.status);
      return null;
    }

    const data = await response.json();

    if (data.ticker) {
      const t = data.ticker;
      return {
        ticker: t.ticker,
        c: t.day?.c || t.prevDay?.c || 0,
        h: t.day?.h || t.prevDay?.h || 0,
        l: t.day?.l || t.prevDay?.l || 0,
        o: t.day?.o || t.prevDay?.o || 0,
        pc: t.prevDay?.c || 0,
        t: t.updated || Date.now(),
        v: t.day?.v || t.prevDay?.v || 0,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching snapshot for ${ticker}:`, error);
    return null;
  }
}

/**
 * Fetch ticker details
 */
export async function getTickerDetails(ticker: string): Promise<PolygonTickerDetails | null> {
  try {
    const response = await fetch(
      `${POLYGON_BASE_URL}/v3/reference/tickers/${ticker}?apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      console.warn(`Polygon ticker details API error for ${ticker}:`, response.status);
      return null;
    }

    const data = await response.json();
    return data.results || null;
  } catch (error) {
    console.error(`Error fetching ticker details for ${ticker}:`, error);
    return null;
  }
}

/**
 * Search for tickers
 */
export async function searchTickers(query: string, limit: number = 10): Promise<PolygonTickerDetails[]> {
  try {
    const response = await fetch(
      `${POLYGON_BASE_URL}/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&limit=${limit}&apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      console.warn(`Polygon search API error:`, response.status);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error searching tickers:`, error);
    return [];
  }
}

// ============================================================================
// ALPHA VANTAGE NEWS API FUNCTIONS
// ============================================================================

/**
 * Fetch market news and sentiment
 */
export async function getMarketNews(
  tickers?: string[],
  topics?: string[],
  limit: number = 50
): Promise<AlphaVantageNewsItem[]> {
  try {
    let url = `${ALPHA_VANTAGE_BASE_URL}?function=NEWS_SENTIMENT&apikey=${ALPHA_VANTAGE_API_KEY}&limit=${limit}`;

    if (tickers && tickers.length > 0) {
      url += `&tickers=${tickers.join(",")}`;
    }

    if (topics && topics.length > 0) {
      url += `&topics=${topics.join(",")}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Alpha Vantage API error:`, response.status);
      return [];
    }

    const data: AlphaVantageNewsResponse = await response.json();

    return data.feed || [];
  } catch (error) {
    console.error(`Error fetching market news:`, error);
    return [];
  }
}

/**
 * Fetch news for specific topics (entertainment, technology, etc.)
 */
export async function getTopicNews(
  topic: "earnings" | "ipo" | "mergers_and_acquisitions" | "financial_markets" | "economy_fiscal" | "economy_monetary" | "economy_macro" | "energy_transportation" | "finance" | "life_sciences" | "manufacturing" | "real_estate" | "retail_wholesale" | "technology",
  limit: number = 20
): Promise<AlphaVantageNewsItem[]> {
  return getMarketNews(undefined, [topic], limit);
}

/**
 * Fetch news for entertainment/K-pop related stocks
 */
export async function getEntertainmentNews(limit: number = 30): Promise<AlphaVantageNewsItem[]> {
  // Search for entertainment industry news
  return getMarketNews(undefined, ["technology", "retail_wholesale"], limit);
}

// ============================================================================
// HELPER FUNCTIONS FOR K-POP STOCKS
// ============================================================================

// Korean entertainment stock mappings (KRX stocks don't have direct US equivalents)
// We'll use proxy/related tickers for demo purposes
export const KPOP_STOCK_PROXIES: Record<string, { usTicker: string; name: string }> = {
  HYBE: { usTicker: "SONY", name: "Sony Corporation (Music)" }, // Sony has K-pop distribution deals
  SM: { usTicker: "SPOT", name: "Spotify (Streaming)" }, // Streaming platform for K-pop
  JYP: { usTicker: "WMG", name: "Warner Music Group" }, // Major label comparison
  YG: { usTicker: "NFLX", name: "Netflix (Content)" }, // YG has Netflix content
  CUBE: { usTicker: "LYV", name: "Live Nation (Concerts)" }, // Concert/live events
  STARSHIP: { usTicker: "DIS", name: "Disney (Entertainment)" }, // Entertainment conglomerate
  FNC: { usTicker: "PARA", name: "Paramount (Media)" }, // Media company
  PLEDIS: { usTicker: "SONY", name: "Sony Corporation (Music)" }, // HYBE subsidiary
};

/**
 * Get live data for K-pop stocks using US proxies
 */
export async function getKpopStockData(koreanSymbol: string): Promise<PolygonStockQuote | null> {
  const proxy = KPOP_STOCK_PROXIES[koreanSymbol];
  if (!proxy) return null;

  return getStockPreviousClose(proxy.usTicker);
}

/**
 * Convert USD price to KRW (approximate conversion for demo)
 * Using a fixed rate for consistency
 */
export function usdToKrw(usdPrice: number): number {
  const exchangeRate = 1320; // Approximate USD/KRW rate
  return Math.round(usdPrice * exchangeRate);
}

/**
 * Format news timestamp to relative time
 */
export function formatNewsTimestamp(timestamp: string): string {
  // Alpha Vantage format: "20231215T143000"
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(9, 11);
  const minute = timestamp.slice(11, 13);

  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Determine sentiment from score
 */
export function getSentimentFromScore(score: number): "positive" | "negative" | "neutral" {
  if (score >= 0.15) return "positive";
  if (score <= -0.15) return "negative";
  return "neutral";
}
