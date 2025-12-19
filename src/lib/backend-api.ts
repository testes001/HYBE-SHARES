// ============================================================================
// BACKEND API SERVICE
// ============================================================================
// Service layer to fetch data from the local backend API instead of using local ORMs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============================================================================
// TYPES
// ============================================================================

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  previous_close: number;
  volume: number;
  market_cap: number;
  pe_ratio: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface StockWithPrice extends Stock {
  change?: number;
  changePercent?: number;
}

export interface PriceHistory {
  stock_id: string;
  price: number;
  volume: number;
  timestamp: string;
  created_at: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  category: string;
  content_type: string;
  difficulty: string;
  description: string;
  content_url: string;
  created_at: string;
  updated_at: string;
}

export interface ExclusiveContent {
  id: string;
  title: string;
  content_type: string;
  description: string;
  content_url: string;
  created_at: string;
  updated_at: string;
}

export interface HybePermit {
  permit_code: string;
  name: string;
  email: string;
  is_active?: boolean;
}

export interface Portfolio {
  id: string;
  user_id: string;
  total_value: number;
  cash_balance: number;
  virtual_currency: string;
  created_at: string;
  updated_at: string;
}

export interface Leaderboard {
  id: string;
  user_id: string;
  username: string;
  portfolio_value: number;
  total_return: number;
  total_return_percent: number;
  rank: number;
  trades: number;
  win_rate: number;
  country: string;
  country_code: string;
  withdrawn_amount: number;
  joined_date: string;
  avatar_url: string;
  bio: string;
  favorite_artist: string;
  is_verified: boolean;
  updated_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface FeaturedStock {
  id: string;
  stock_id: string;
  position: number;
  description: string;
  symbol?: string;
  name?: string;
  current_price?: number;
  previous_close?: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API HELPER FUNCTIONS
// ============================================================================

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// STOCKS API
// ============================================================================

/**
 * Fetch all stocks from the database
 */
export async function fetchAllStocks(): Promise<Stock[]> {
  try {
    const response = await fetchApi<{ stocks: Stock[] }>('/api/stocks');
    return response.stocks || [];
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
}

/**
 * Fetch a single stock by ID or symbol
 */
export async function fetchStock(id: string): Promise<Stock | null> {
  try {
    return await fetchApi<Stock>(`/api/stocks/${id}`);
  } catch (error) {
    console.error(`Error fetching stock ${id}:`, error);
    return null;
  }
}

/**
 * Fetch price history for a stock
 */
export async function fetchPriceHistory(stockId: string, limit: number = 30): Promise<PriceHistory[]> {
  try {
    const response = await fetchApi<{ history: PriceHistory[] }>(`/api/stocks/${stockId}/price-history?limit=${limit}`);
    return response.history || [];
  } catch (error) {
    console.error(`Error fetching price history for ${stockId}:`, error);
    return [];
  }
}

/**
 * Fetch featured stocks
 */
export async function fetchFeaturedStocks(): Promise<FeaturedStock[]> {
  try {
    const response = await fetchApi<{ featured_stocks: FeaturedStock[] }>('/api/featured-stocks');
    return response.featured_stocks || [];
  } catch (error) {
    console.error('Error fetching featured stocks:', error);
    return [];
  }
}

// ============================================================================
// EDUCATIONAL CONTENT API
// ============================================================================

/**
 * Fetch educational content with optional filters
 */
export async function fetchEducationalContent(
  category?: string,
  difficulty?: string
): Promise<EducationalContent[]> {
  try {
    let endpoint = '/api/educational-content';
    const params = [];
    
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (difficulty) params.push(`difficulty=${encodeURIComponent(difficulty)}`);
    
    if (params.length > 0) {
      endpoint += '?' + params.join('&');
    }
    
    const response = await fetchApi<{ content: EducationalContent[] }>(endpoint);
    return response.content || [];
  } catch (error) {
    console.error('Error fetching educational content:', error);
    return [];
  }
}

// ============================================================================
// EXCLUSIVE CONTENT API
// ============================================================================

/**
 * Fetch exclusive content
 */
export async function fetchExclusiveContent(): Promise<ExclusiveContent[]> {
  try {
    const response = await fetchApi<{ content: ExclusiveContent[] }>('/api/exclusive-content');
    return response.content || [];
  } catch (error) {
    console.error('Error fetching exclusive content:', error);
    return [];
  }
}

// ============================================================================
// PERMITS API
// ============================================================================

/**
 * Verify a HYBE permit code
 */
export async function verifyPermit(code: string): Promise<HybePermit | null> {
  try {
    return await fetchApi<HybePermit>(`/api/permits/${code}`);
  } catch (error) {
    console.error(`Error verifying permit ${code}:`, error);
    return null;
  }
}

/**
 * Fetch all valid HYBE permits (admin only)
 */
export async function fetchAllPermits(): Promise<HybePermit[]> {
  try {
    const response = await fetchApi<{ permits: HybePermit[] }>('/api/permits');
    return response.permits || [];
  } catch (error) {
    console.error('Error fetching permits:', error);
    return [];
  }
}

// ============================================================================
// PORTFOLIO API
// ============================================================================

/**
 * Fetch user portfolio
 */
export async function fetchUserPortfolio(userId: string): Promise<Portfolio | null> {
  try {
    return await fetchApi<Portfolio>(`/api/portfolio/${userId}`);
  } catch (error) {
    console.error(`Error fetching portfolio for user ${userId}:`, error);
    return null;
  }
}

/**
 * Create a new portfolio for a user
 */
export async function createUserPortfolio(userId: string): Promise<Portfolio | null> {
  try {
    return await fetchApi<Portfolio>(`/api/portfolio/${userId}/create`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  } catch (error) {
    console.error(`Error creating portfolio for user ${userId}:`, error);
    return null;
  }
}

// ============================================================================
// LEADERBOARD API
// ============================================================================

/**
 * Fetch leaderboard with pagination
 */
export async function fetchLeaderboard(limit: number = 100, offset: number = 0): Promise<Leaderboard[]> {
  try {
    const response = await fetchApi<{ leaderboard: Leaderboard[] }>(
      `/api/leaderboard?limit=${limit}&offset=${offset}`
    );
    return response.leaderboard || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

/**
 * Fetch user notifications
 */
export async function fetchUserNotifications(userId: string, limit: number = 50): Promise<UserNotification[]> {
  try {
    const response = await fetchApi<{ notifications: UserNotification[] }>(
      `/api/notifications/${userId}?limit=${limit}`
    );
    return response.notifications || [];
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    return [];
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check if the backend API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await fetchApi<{ status: string }>('/api/health');
    return true;
  } catch (error) {
    console.warn('Backend API is not available:', error);
    return false;
  }
}
