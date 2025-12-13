// ============================================================================
// TRADING TYPES & CONSTANTS
// ============================================================================

export type AppView =
  | "splash"
  | "login"
  | "register"
  | "forgot-password"
  | "onboarding"
  | "portfolio"
  | "trade"
  | "markets"
  | "account"
  | "stock-detail"
  | "exclusive"
  | "education"
  | "notifications"
  | "transaction-history"
  | "portfolio-analytics"
  | "leaderboard"
  | "security-settings"
  | "price-alerts"
  | "fan-vestor"
  | "weverse-wallet"
  | "nft-collectibles"
  | "agm-voting"
  | "recurring-buys"
  | "fandom-analytics"
  | "sell-shares"
  | "settlement-status"
  | "withdraw-funds"
  | "convert-to-fiat"
  | "payment-methods"
  | "settings"
  | "profile-settings"
  | "display-settings"
  | "trading-preferences"
  | "privacy-settings"
  | "help-support";

export type TimeFrame = "1D" | "1W" | "1M" | "1Y" | "All";

export type ChartType = "line" | "candlestick" | "area";

export interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceAlert {
  id: string;
  stockId: string;
  symbol: string;
  targetPrice: number;
  condition: "above" | "below";
  isActive: boolean;
  createdAt: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  portfolioValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  rank: number;
  trades: number;
  winRate: number;
  country: string;
  countryCode: string;
  withdrawnAmount: number;
  joinedDate: string;
  avatarUrl: string;
  bio: string;
  favoriteArtist: string;
  isVerified: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  category: "earnings" | "tour" | "release" | "market" | "general";
  sentiment: "positive" | "negative" | "neutral";
  relatedStocks: string[];
}

export interface RiskQuestion {
  question: string;
  options: { label: string; value: number }[];
}

// Fan-Vestor Tier System
export interface ShareholderTier {
  name: string;
  minShares: number;
  color: string;
  badge: string;
  benefits: string[];
}

// Recurring Buy Triggers
export interface RecurringBuyConfig {
  id: string;
  artistGroup: string;
  triggerType: "album_release" | "concert_announce" | "weekly" | "monthly";
  amount: number;
  isActive: boolean;
  createdAt: string;
}

// NFT Collectible
export interface NFTCollectible {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  rarity: "common" | "rare" | "legendary";
  acquiredDate: string;
  quarter: string;
  description: string;
}

// AGM Voting Proposal
export interface AGMProposal {
  id: string;
  title: string;
  description: string;
  category: "board" | "compensation" | "strategy" | "other";
  deadline: string;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  userVote?: "yes" | "no" | "abstain";
  reward: string;
}

// Weverse Wallet Integration
export interface WeverseWallet {
  cashBalance: number;
  pendingDividends: number;
  lastDividendDate?: string;
  dividendPreference: "cash" | "weverse_cash" | "nft";
}

// Fandom Analytics Data
export interface FandomMetric {
  date: string;
  albumSales: number;
  streamingCount: number;
  socialMentions: number;
  stockPrice: number;
  correlation: number;
}

// Sell Order Status for tracking through settlement
export type SellOrderStatus = "EXECUTED" | "PENDING_SETTLEMENT" | "SETTLED" | "CANCELLED";

// Withdrawal Request Status
export type WithdrawalStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

// Sell Order tracking with settlement info
export interface SellOrderRecord {
  id: string;
  userId: string;
  stockId: string;
  stockSymbol: string;
  sharesQuantity: number;
  executedPrice: number;
  totalProceeds: number;
  status: SellOrderStatus;
  executionDate: string;
  settlementDate: string;
  settlementCompleted: boolean;
}

// Payment method types
export type PaymentMethodType = "bank_account" | "credit_card" | "debit_card";

// User's payment method (bank, credit card, or debit card)
export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  bankName?: string;
  accountNumberMasked?: string;
  routingNumber?: string;
  cardBrand?: string;
  cardLastFour?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  nickname?: string;
  isPrimary: boolean;
  isVerified: boolean;
  addedAt: string;
}

// Cash balance tracking
export interface CashBalanceInfo {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: string;
}

// Withdrawal request record
export interface WithdrawalRequestRecord {
  id: string;
  userId: string;
  paymentMethodId: string;
  paymentMethodName: string;
  amount: number;
  status: WithdrawalStatus;
  initiatedAt: string;
  completedAt: string | null;
  transferFee: number;
  currencyConversionRate: number | null;
}

// Deposit method types
export type DepositMethod = "btc" | "hybe_office";

// Deposit status
export type DepositStatus = "PENDING" | "CONFIRMED" | "FAILED";

// BTC Deposit record
export interface BTCDepositRecord {
  id: string;
  userId: string;
  btcAddress: string;
  btcAmount: number;
  usdAmount: number;
  krwAmount: number;
  txHash: string | null;
  status: DepositStatus;
  createdAt: string;
  confirmedAt: string | null;
  confirmations: number;
}

// HYBE Office Cash Deposit record
export interface HYBEOfficeDepositRecord {
  id: string;
  userId: string;
  referenceCode: string;
  amount: number;
  currency: string;
  status: DepositStatus;
  createdAt: string;
  confirmedAt: string | null;
  officeLocation: string;
}

// Account activation status
export interface AccountActivation {
  isActivated: boolean;
  activatedAt: string | null;
  signupBonus: number;
  depositedBalance: number;
  totalDeposited: number;
  firstDepositDate: string | null;
}

// BTC Wallet Address (generated per user for deposits)
export interface BTCWalletInfo {
  address: string;
  qrCodeUrl: string;
  createdAt: string;
}
