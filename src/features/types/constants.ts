// ============================================================================
// CONSTANTS
// ============================================================================

import type { ShareholderTier, RiskQuestion, NFTCollectible, AGMProposal, NewsItem } from "./trading";

export const SHAREHOLDER_TIERS: ShareholderTier[] = [
  {
    name: "Standard",
    minShares: 0,
    color: "#6B7280",
    badge: "Fan",
    benefits: ["Basic app access"]
  },
  {
    name: "Bronze",
    minShares: 1,
    color: "#CD7F32",
    badge: "Shareholder",
    benefits: ["Digital shareholder ID", "Access to basic exclusive content"]
  },
  {
    name: "Silver",
    minShares: 10,
    color: "#C0C0C0",
    badge: "Silver Shareholder",
    benefits: ["5% Weverse Shop discount", "Priority content access", "Silver badge on Weverse"]
  },
  {
    name: "Gold",
    minShares: 50,
    color: "#FFD700",
    badge: "Gold Shareholder",
    benefits: ["10% Weverse Shop discount", "Concert ticket pre-sale access", "Gold badge on Weverse", "Quarterly shareholder reports"]
  },
  {
    name: "Platinum",
    minShares: 100,
    color: "#E5E4E2",
    badge: "Platinum Shareholder",
    benefits: ["15% Weverse Shop discount", "1-hour early ticket access", "IR Town Hall invitations", "Platinum badge on Weverse", "Exclusive NFT drops"]
  }
];

export const HYBE_OFFICE_LOCATIONS = [
  { id: "seoul_hq", name: "HYBE Headquarters", address: "42 Hannam-daero 27-gil, Yongsan-gu, Seoul", hours: "Mon-Fri 9:00-18:00 KST" },
  { id: "seoul_yongsan", name: "HYBE Yongsan Center", address: "191 Hangang-daero, Yongsan-gu, Seoul", hours: "Mon-Fri 10:00-17:00 KST" },
  { id: "busan", name: "HYBE Busan Office", address: "55 APEC-ro, Haeundae-gu, Busan", hours: "Mon-Fri 10:00-16:00 KST" },
];

export const BTC_TO_KRW_RATE = 135000000;
export const BTC_TO_USD_RATE = 100000;

export const ARTIST_GROUPS = [
  { name: "BTS", color: "#7B61FF", members: ["RM", "Jin", "SUGA", "j-hope", "Jimin", "V", "Jung Kook"] },
  { name: "SEVENTEEN", color: "#F8B4D9", members: ["S.Coups", "Jeonghan", "Joshua", "Jun", "Hoshi", "Wonwoo", "Woozi", "DK", "Mingyu", "The8", "Seungkwan", "Vernon", "Dino"] },
  { name: "TXT", color: "#00BFFF", members: ["Soobin", "Yeonjun", "Beomgyu", "Taehyun", "Huening Kai"] },
  { name: "NewJeans", color: "#87CEEB", members: ["Minji", "Hanni", "Danielle", "Haerin", "Hyein"] },
  { name: "LE SSERAFIM", color: "#FF4081", members: ["Sakura", "Kim Chaewon", "Huh Yunjin", "Kazuha", "Hong Eunchae"] },
  { name: "ENHYPEN", color: "#1E90FF", members: ["Jungwon", "Heeseung", "Jay", "Jake", "Sunghoon", "Sunoo", "Ni-ki"] },
  { name: "fromis_9", color: "#FFB6C1", members: ["Saerom", "Hayoung", "Gyuri", "Jiwon", "Jisun", "Seoyeon", "Chaeyoung", "Nagyung", "Jiheon"] },
];

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    question: "How would you describe your investment experience?",
    options: [
      { label: "Beginner - I'm new to investing", value: 1 },
      { label: "Intermediate - I have some experience", value: 2 },
      { label: "Advanced - I'm an experienced investor", value: 3 },
    ],
  },
  {
    question: "How would you react if your portfolio dropped 20% in a month?",
    options: [
      { label: "Sell everything immediately", value: 1 },
      { label: "Hold and wait for recovery", value: 2 },
      { label: "Buy more at the lower prices", value: 3 },
    ],
  },
  {
    question: "What is your investment time horizon?",
    options: [
      { label: "Less than 1 year", value: 1 },
      { label: "1-5 years", value: 2 },
      { label: "More than 5 years", value: 3 },
    ],
  },
  {
    question: "What percentage of your savings are you willing to invest?",
    options: [
      { label: "Less than 25%", value: 1 },
      { label: "25-50%", value: 2 },
      { label: "More than 50%", value: 3 },
    ],
  },
];

export const HYBE_COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  gradientStart: "#7B61FF",
  gradientEnd: "#4A90E2",
  gain: "#00C805",
  loss: "#FF0000",
};

export const STOCK_BRAND_COLORS: Record<string, { primary: string; secondary: string; logo: string }> = {
  HYBE: { primary: "#000000", secondary: "#7B61FF", logo: "H" },
  SM: { primary: "#FF2D78", secondary: "#FFB8D4", logo: "SM" },
  JYP: { primary: "#FF6B00", secondary: "#FFBB8C", logo: "J" },
  YG: { primary: "#000000", secondary: "#FFD700", logo: "YG" },
  CUBE: { primary: "#00C7AE", secondary: "#80E8D9", logo: "C" },
  STARSHIP: { primary: "#1E90FF", secondary: "#87CEEB", logo: "S" },
  FNC: { primary: "#E31C79", secondary: "#FFB6C1", logo: "F" },
  PLEDIS: { primary: "#7B61FF", secondary: "#B8A9FF", logo: "P" },
};

export const KOREAN_MARKET = {
  openHour: 9,
  closeHour: 15,
  closeMinute: 30,
  timezone: "Asia/Seoul",
};

export const PORTFOLIO_COLORS = ["#7B61FF", "#4A90E2", "#00C805", "#FFB800", "#FF6B6B", "#36D7B7", "#9B59B6", "#3498DB"];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "BTS Announces 2025 World Tour Reunion",
    summary: "HYBE shares surge 8% as BTS confirms first group tour since military service completion. Expected to generate record-breaking revenue.",
    source: "K-Pop Daily",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: "tour",
    sentiment: "positive",
    relatedStocks: ["HYBE"],
  },
  {
    id: "2",
    title: "SM Entertainment Reports Record Q3 Earnings",
    summary: "NCT and aespa album sales drive 35% YoY revenue growth. Company raises full-year guidance.",
    source: "Korea Economic Daily",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: "earnings",
    sentiment: "positive",
    relatedStocks: ["SM"],
  },
  {
    id: "3",
    title: "JYP Entertainment's Stray Kids Breaks Billboard Record",
    summary: "Fifth consecutive album to debut at #1 on Billboard 200. Stock reaches 52-week high.",
    source: "Billboard Korea",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: "release",
    sentiment: "positive",
    relatedStocks: ["JYP"],
  },
  {
    id: "4",
    title: "YG Entertainment Faces Delay in BLACKPINK Contract Renewal",
    summary: "Negotiations ongoing as members explore individual opportunities. Investors await clarity.",
    source: "Seoul Finance",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    category: "general",
    sentiment: "negative",
    relatedStocks: ["YG"],
  },
  {
    id: "5",
    title: "K-Pop Industry Market Cap Exceeds $20 Billion",
    summary: "Combined market capitalization of major K-pop entertainment companies reaches all-time high amid global expansion.",
    source: "K-Pop Business Insider",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: "market",
    sentiment: "positive",
    relatedStocks: ["HYBE", "SM", "JYP", "YG"],
  },
  {
    id: "6",
    title: "SEVENTEEN's World Tour Sells Out in Minutes",
    summary: "1.5 million tickets sold across 30 cities. HYBE subsidiary Pledis sees strong booking revenue.",
    source: "Variety Korea",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    category: "tour",
    sentiment: "positive",
    relatedStocks: ["HYBE", "PLEDIS"],
  },
];

export const MOCK_NFTS: NFTCollectible[] = [
  {
    id: "1",
    name: "BTS Dynamite Era",
    artist: "BTS",
    imageUrl: "https://picsum.photos/seed/bts-dynamite/300/300",
    rarity: "legendary",
    acquiredDate: "2024-03-31",
    quarter: "Q1 2024",
    description: "Proof of HODL - 90 days of continuous shareholding"
  },
  {
    id: "2",
    name: "SEVENTEEN MAESTRO",
    artist: "SEVENTEEN",
    imageUrl: "https://picsum.photos/seed/svt-maestro/300/300",
    rarity: "rare",
    acquiredDate: "2024-06-30",
    quarter: "Q2 2024",
    description: "Commemorating SEVENTEEN's MAESTRO comeback"
  },
  {
    id: "3",
    name: "NewJeans Bubble Gum",
    artist: "NewJeans",
    imageUrl: "https://picsum.photos/seed/nj-bubblegum/300/300",
    rarity: "common",
    acquiredDate: "2024-09-30",
    quarter: "Q3 2024",
    description: "Summer vibes from NewJeans"
  }
];

export const MOCK_AGM_PROPOSALS: AGMProposal[] = [
  {
    id: "1",
    title: "Re-election of Board Director Kim",
    description: "Proposal to re-elect Mr. Kim as an independent board director for a 2-year term.",
    category: "board",
    deadline: "2025-03-30",
    yesVotes: 85420,
    noVotes: 12340,
    abstainVotes: 5230,
    reward: "Voting Photocard"
  },
  {
    id: "2",
    title: "Executive Compensation Package",
    description: "Approval of the 2025 executive compensation plan including stock options.",
    category: "compensation",
    deadline: "2025-03-30",
    yesVotes: 72100,
    noVotes: 28450,
    abstainVotes: 8920,
    reward: "Voting Photocard"
  },
  {
    id: "3",
    title: "Global Expansion Strategy",
    description: "Approval of investment in new markets including Latin America and Southeast Asia.",
    category: "strategy",
    deadline: "2025-03-30",
    yesVotes: 95200,
    noVotes: 5800,
    abstainVotes: 3450,
    reward: "Exclusive Digital Poster"
  }
];

export const GLOBAL_FIRST_NAMES = [
  "James", "Emma", "Michael", "Olivia", "William", "Sophia", "Alexander", "Isabella", "Benjamin", "Mia",
  "Lucas", "Charlotte", "Henry", "Amelia", "Sebastian", "Harper", "Jack", "Evelyn", "Aiden", "Abigail",
  "Oliver", "Emily", "Ethan", "Elizabeth", "Mason", "Sofia", "Logan", "Avery", "Daniel", "Ella",
  "Yuki", "Hiroshi", "Sakura", "Takeshi", "Mei", "Wei", "Jing", "Chen", "Lin", "Hana",
  "Soo-Jin", "Min-Ho", "Ji-Yeon", "Hyun-Woo", "Eun-Ji", "Sung-Min", "Ha-Na", "Jae-Won", "Yu-Na", "Dong-Hyun",
  "Carlos", "Maria", "Diego", "Ana", "Luis", "Carmen", "Pablo", "Rosa", "Mateo", "Lucia",
  "Ahmed", "Fatima", "Omar", "Leila", "Hassan", "Yasmin", "Ali", "Sara", "Khalid", "Nour",
  "Kwame", "Amara", "Kofi", "Zara", "Obinna", "Aisha", "Chidi", "Nia", "Emeka", "Adaeze",
  "Pierre", "Marie", "Hans", "Anna", "Giovanni", "Francesca", "Viktor", "Elena", "Nikolai", "Ingrid"
];

export const GLOBAL_LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White",
  "Kim", "Park", "Lee", "Choi", "Jung", "Kang", "Tanaka", "Yamamoto", "Suzuki", "Watanabe",
  "Wang", "Li", "Zhang", "Liu", "Chen", "Yang", "Nguyen", "Tran", "Pham", "Sato",
  "Gonzalez", "Hernandez", "Lopez", "Perez", "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez",
  "Al-Farsi", "Hassan", "Ahmed", "Mohammad", "Khan", "Patel", "Shah", "Malik", "Abbas", "Khalil",
  "Okonkwo", "Mensah", "Diallo", "Toure", "Mbeki", "Nkomo", "Okello", "Adeyemi", "Banda", "Kamau",
  "Mueller", "Schmidt", "Rossi", "Ferrari", "Dubois", "Bernard", "Petrov", "Ivanov", "Johansson", "Nielsen"
];

export const COUNTRIES = [
  { name: "United States", code: "US", flag: "US" },
  { name: "South Korea", code: "KR", flag: "KR" },
  { name: "Japan", code: "JP", flag: "JP" },
  { name: "China", code: "CN", flag: "CN" },
  { name: "United Kingdom", code: "GB", flag: "GB" },
  { name: "Germany", code: "DE", flag: "DE" },
  { name: "France", code: "FR", flag: "FR" },
  { name: "Brazil", code: "BR", flag: "BR" },
  { name: "India", code: "IN", flag: "IN" },
  { name: "Canada", code: "CA", flag: "CA" },
  { name: "Australia", code: "AU", flag: "AU" },
  { name: "Mexico", code: "MX", flag: "MX" },
  { name: "Indonesia", code: "ID", flag: "ID" },
  { name: "Philippines", code: "PH", flag: "PH" },
  { name: "Thailand", code: "TH", flag: "TH" },
  { name: "Vietnam", code: "VN", flag: "VN" },
  { name: "Spain", code: "ES", flag: "ES" },
  { name: "Italy", code: "IT", flag: "IT" },
  { name: "Netherlands", code: "NL", flag: "NL" },
  { name: "Sweden", code: "SE", flag: "SE" },
  { name: "Singapore", code: "SG", flag: "SG" },
  { name: "Malaysia", code: "MY", flag: "MY" },
  { name: "Taiwan", code: "TW", flag: "TW" },
  { name: "Argentina", code: "AR", flag: "AR" },
  { name: "Chile", code: "CL", flag: "CL" },
  { name: "Colombia", code: "CO", flag: "CO" },
  { name: "South Africa", code: "ZA", flag: "ZA" },
  { name: "Nigeria", code: "NG", flag: "NG" },
  { name: "Egypt", code: "EG", flag: "EG" },
  { name: "UAE", code: "AE", flag: "AE" },
  { name: "Saudi Arabia", code: "SA", flag: "SA" },
  { name: "Turkey", code: "TR", flag: "TR" },
  { name: "Russia", code: "RU", flag: "RU" },
  { name: "Poland", code: "PL", flag: "PL" },
  { name: "Norway", code: "NO", flag: "NO" }
];

export const FAVORITE_ARTISTS = ["BTS", "SEVENTEEN", "TXT", "NewJeans", "LE SSERAFIM", "ENHYPEN", "fromis_9", "BLACKPINK", "NCT", "aespa", "Stray Kids", "TWICE", "IVE", "ITZY", "(G)I-DLE"];

export const USER_BIOS = [
  "Long-term HYBE investor since 2020",
  "K-pop fan turned investor",
  "Diversified portfolio enthusiast",
  "Music industry analyst",
  "ARMY since day one",
  "Carat investor and proud shareholder",
  "Entertainment sector specialist",
  "Day trader with K-pop focus",
  "Building wealth through fandom",
  "Global music investor",
  "Former analyst turned fan-vestor",
  "Passive income through dividends",
  "Strategic long-term holder",
  "Multi-agency investor",
  "Weverse enthusiast & trader"
];
