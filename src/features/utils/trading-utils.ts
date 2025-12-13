// ============================================================================
// TRADING UTILITY FUNCTIONS
// ============================================================================

import type { CandlestickData } from "../types/trading";
import { KOREAN_MARKET, STOCK_BRAND_COLORS } from "../types/constants";

export function formatCurrency(value: number, currency = "KRW"): string {
  if (currency === "KRW") {
    return `₩${value.toLocaleString()}`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function calculateChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

export function hashPassword(password: string): string {
  return btoa(password);
}

export function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

export function generatePriceHistory(
  basePrice: number,
  days: number,
  volatility = 0.02
): { date: string; price: number; volume: number }[] {
  const history: { date: string; price: number; volume: number }[] = [];
  let price = basePrice * (1 - volatility * days * 0.1);
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, basePrice * 0.5);
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    history.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });
  }

  if (history.length > 0) {
    history[history.length - 1].price = basePrice;
  }

  return history;
}

export function simulatePriceMovement(currentPrice: number, volatility = 0.005): number {
  const trend = 0.0001;
  const dynamicVolatility = volatility * (0.8 + Math.random() * 0.4);
  const randomComponent = (Math.random() - 0.5) * 2 * dynamicVolatility * currentPrice;
  const trendComponent = trend * currentPrice;
  const fatTail = Math.random() > 0.95 ? (Math.random() - 0.5) * 0.02 * currentPrice : 0;
  const change = randomComponent + trendComponent + fatTail;
  return Math.round(Math.max(currentPrice + change, currentPrice * 0.9));
}

export function generateCandlestickData(
  basePrice: number,
  days: number,
  volatility = 0.02
): CandlestickData[] {
  const history: CandlestickData[] = [];
  let prevClose = basePrice * (1 - volatility * days * 0.05);
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const dailyVolatility = volatility * (0.5 + Math.random());
    const direction = Math.random() > 0.45 ? 1 : -1;

    const open = prevClose * (1 + (Math.random() - 0.5) * 0.005);
    const change = direction * dailyVolatility * prevClose * Math.random();
    const close = Math.max(open + change, prevClose * 0.95);

    const intradayRange = Math.abs(close - open) + prevClose * volatility * 0.5 * Math.random();
    const high = Math.max(open, close) + intradayRange * Math.random();
    const low = Math.min(open, close) - intradayRange * Math.random();

    history.push({
      date: date.toISOString().split("T")[0],
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(Math.max(low, prevClose * 0.9)),
      close: Math.round(close),
      volume: Math.floor(Math.random() * 1500000) + 200000,
    });

    prevClose = close;
  }

  if (history.length > 0) {
    history[history.length - 1].close = basePrice;
  }

  return history;
}

export function calculateSMA(data: CandlestickData[], period: number): (number | null)[] {
  const sma: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      sma.push(Math.round(sum / period));
    }
  }
  return sma;
}

export function calculateRSI(data: CandlestickData[], period = 14): (number | null)[] {
  const rsi: (number | null)[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      rsi.push(null);
      continue;
    }

    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);

    if (i < period) {
      rsi.push(null);
    } else {
      const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(Math.round(100 - (100 / (1 + rs))));
      }
    }
  }
  return rsi;
}

export function calculateMACD(data: CandlestickData[]): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } {
  const ema12: number[] = [];
  const ema26: number[] = [];
  const macdLine: (number | null)[] = [];
  const signalLine: (number | null)[] = [];
  const histogram: (number | null)[] = [];

  const multiplier12 = 2 / (12 + 1);
  const multiplier26 = 2 / (26 + 1);
  const signalMultiplier = 2 / (9 + 1);

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      ema12.push(data[i].close);
      ema26.push(data[i].close);
    } else {
      ema12.push((data[i].close - ema12[i - 1]) * multiplier12 + ema12[i - 1]);
      ema26.push((data[i].close - ema26[i - 1]) * multiplier26 + ema26[i - 1]);
    }

    if (i < 25) {
      macdLine.push(null);
      signalLine.push(null);
      histogram.push(null);
    } else {
      const macd = ema12[i] - ema26[i];
      macdLine.push(Math.round(macd));

      if (i === 25) {
        signalLine.push(Math.round(macd));
      } else {
        const prevSignal = signalLine[i - 1] || macd;
        const signal = (macd - prevSignal) * signalMultiplier + prevSignal;
        signalLine.push(Math.round(signal));
      }

      const currentSignal = signalLine[i];
      histogram.push(currentSignal !== null ? Math.round(macd - currentSignal) : null);
    }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}

export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = now - time;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function isKoreanMarketOpen(): { isOpen: boolean; status: string; nextEvent: string } {
  const now = new Date();
  const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: KOREAN_MARKET.timezone }));
  const hours = koreaTime.getHours();
  const minutes = koreaTime.getMinutes();
  const day = koreaTime.getDay();

  const currentMinutes = hours * 60 + minutes;
  const openMinutes = KOREAN_MARKET.openHour * 60;
  const closeMinutes = KOREAN_MARKET.closeHour * 60 + KOREAN_MARKET.closeMinute;

  if (day === 0 || day === 6) {
    return {
      isOpen: false,
      status: "Closed",
      nextEvent: `Opens Mon ${KOREAN_MARKET.openHour}:00 KST`
    };
  }

  if (currentMinutes < openMinutes) {
    const minsUntilOpen = openMinutes - currentMinutes;
    const hoursUntilOpen = Math.floor(minsUntilOpen / 60);
    const remainingMins = minsUntilOpen % 60;
    return {
      isOpen: false,
      status: "Pre-market",
      nextEvent: hoursUntilOpen > 0 ? `Opens in ${hoursUntilOpen}h ${remainingMins}m` : `Opens in ${remainingMins}m`
    };
  }

  if (currentMinutes >= closeMinutes) {
    return {
      isOpen: false,
      status: "After-hours",
      nextEvent: day === 5 ? "Opens Mon 9:00 KST" : "Opens tomorrow 9:00 KST"
    };
  }

  const minsUntilClose = closeMinutes - currentMinutes;
  const hoursUntilClose = Math.floor(minsUntilClose / 60);
  const remainingMins = minsUntilClose % 60;
  return {
    isOpen: true,
    status: "Open",
    nextEvent: hoursUntilClose > 0 ? `Closes in ${hoursUntilClose}h ${remainingMins}m` : `Closes in ${remainingMins}m`
  };
}

export function getStockBrandColors(symbol: string): { primary: string; secondary: string; logo: string } {
  return STOCK_BRAND_COLORS[symbol] || { primary: "#7B61FF", secondary: "#4A90E2", logo: symbol[0] };
}

export function generateBTCAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let address = "bc1q";
  for (let i = 0; i < 38; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

export function generateReferenceCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HYBE-${date}-${random}`;
}
