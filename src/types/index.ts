export type UserRole = 'farmer' | 'admin';

export type Language = 'en' | 'ta';

export type ProductCategory = 'fish' | 'carnivorous' | 'shrimp' | 'animals' | 'pets';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  district: string;
  state: string;
  preferredLang: Language;
  pondCount: number;
  primarySpecies: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Pond {
  id: string;
  userId: string;
  pondNumber: string;
  name: string;
  areaAcres: number;
  depthMeters: number;
  waterType: 'brackish' | 'freshwater' | 'saline';
  createdAt: string;
}

export interface GrowthLog {
  id: string;
  batchId: string;
  logDate: string;
  dayNumber: number;
  averageWeightG: number;
  mortalityCount: number;
  feedFedKg: number;
  colourScore: number; // 1 to 5
  waterTempC: number;
  dissolvedOxygenPpm: number;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
  isOfflinePending?: boolean;
}

export interface Batch {
  id: string;
  pondId: string;
  userId: string;
  pondName: string;
  batchName: string;
  species: 'Vannamei Shrimp' | 'Black Tiger Shrimp' | 'GIFT Tilapia' | 'Tilapia' | 'Catfish' | 'Asian Seabass';
  stockingDate: string;
  targetHarvestDate: string;
  actualHarvestDate?: string;
  stockingCount: number;
  feedType: 'aquavigor' | 'other';
  initialWeightG: number;
  targetWeightG: number;
  status: 'active' | 'harvested';
  currentWeightG: number;
  currentSurvivalRate: number; // in %
  currentFCR: number;
  createdAt: string;
}

export interface FeedbackReply {
  id: string;
  feedbackId: string;
  adminUserId: string;
  adminName: string;
  replyText: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  batchId: string;
  batchName: string;
  userId: string;
  farmerName: string;
  district: string;
  species: string;
  overallRating: number; // 1 to 5
  growthRating: number; // 1 to 5
  colourRating: number; // 1 to 5
  survivalRating: number; // 1 to 5
  immunityRating: number; // 1 to 5
  valueRating: number; // 1 to 5
  comment: string;
  voiceTranscript?: string;
  photoUrl?: string;
  reducedCulturePeriod: boolean; // Yes/No
  wouldRecommend: boolean; // Yes/No
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'new' | 'reviewed' | 'resolved';
  replies: FeedbackReply[];
  createdAt: string;
  isOfflinePending?: boolean;
}

export interface Ingredient {
  name: string;
  percentage?: number;
  role: string;
  category: 'marine_protein' | 'plant_protein' | 'functional_additive' | 'micronutrient';
}

export interface FeedingStageGuide {
  stage: string;
  bodyWeightRange: string;
  feedCode: string;
  feedType: string;
  feedingRatePercent: string;
  frequencyPerDay: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  sku: string;
  category: ProductCategory;
  targetSpecies: string[];
  packWeightGrams: number; // e.g. 100 for 100g, 1000 for 1kg, 25000 for 25kg
  packSizeLabel: string; // "100g Pack", "250g Pack", "500g Pack", "1kg Pack", "25kg Bulk Bag"
  priceInr: number; // e.g. 130 for 100g pack
  imageUrl?: string;
  crudeProteinPercent: number;
  crudeFatPercent: number;
  crudeFiberPercent: number;
  moisturePercent: number;
  inStock?: boolean;
  pelletSizeMm?: string;
  ingredients: Ingredient[];
  benefits: {
    id: string;
    title: string;
    description: string;
    metric: string;
    icon: string;
  }[];
  feedingStages?: FeedingStageGuide[];
  createdAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  farmerName: string;
  contactPhone: string;
  district: string;
  productId: string;
  productName: string;
  quantityPacks: number; // e.g. 5 packs
  packSizeLabel: string; // e.g. "100g Pack"
  pricePerPackInr: number; // e.g. 130
  totalPriceInr: number;
  deliveryAddress: string;
  status: 'requested' | 'confirmed' | 'dispatched' | 'delivered';
  notes?: string;
  createdAt: string;
}

export interface CalculatorState {
  species: 'shrimp' | 'tilapia' | 'catfish' | 'seabass';
  population: number;
  averageWeightG: number;
  waterTempC: number;
  selectedBatchId?: string;
}

export interface CalculatorResult {
  dailyFeedKg: number;
  dailyFeedGrams: number;
  dailyFeedPacks: number; // number of 100g packs needed daily
  feedsPerDay: number;
  feedingRatePercent: number;
  feedSizeMm: string;
  estimatedDailyCostInr: number;
  estimatedCycleCostInr: number;
  cultureDaysEstimate: number; // 45 days with CHANNA PELLET vs 60 days
}
