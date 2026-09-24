import { Batch, Feedback, GrowthLog, Order, Pond, Product, User } from '../types';

const STORAGE_KEYS = {
  USERS: 'aquavigor_users',
  CURRENT_USER: 'aquavigor_current_user',
  PONDS: 'aquavigor_ponds',
  BATCHES: 'aquavigor_batches',
  GROWTH_LOGS: 'aquavigor_growth_logs',
  FEEDBACK: 'aquavigor_feedback',
  ORDERS: 'aquavigor_orders',
  PRODUCTS: 'aquavigor_products',
  OFFLINE_QUEUE: 'aquavigor_offline_queue',
  LANG: 'aquavigor_lang',
  DISMISSED_PROMPTS: 'aquavigor_dismissed_prompts',
};

// -------------------------------------------------------------
// Seed Product Specification (Exact prompt formulas)
// -------------------------------------------------------------
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-channa-pellet-01',
    name: 'CHANNA PELLET™ Complete Nutrition for Carnivorous Fish',
    tagline: 'Premium Fish Food for Monster Fishes • High Protein • Enhances Colour • Boosts Immunity • Easy Digestion • 2mm Pellet',
    sku: 'CP-2MM-100G',
    targetSpecies: ['Channa / Murrel', 'Vannamei Shrimp', 'Asian Seabass', 'GIFT Tilapia', 'Catfish'],
    bagWeightKg: 25,
    priceInr: 1850,
    crudeProteinPercent: 42.0,
    crudeFatPercent: 8.0,
    crudeFiberPercent: 3.0,
    moisturePercent: 9.0,
    ingredients: [
      {
        name: 'High-Grade Steam-Dried Fish Meal',
        percentage: 20,
        role: 'Concentrated source of essential digestible marine protein, EPA, DHA, and highly bioavailable peptides for accelerated growth.',
        category: 'marine_protein'
      },
      {
        name: 'Whole Squid Meal (Loligo edulis)',
        percentage: 20,
        role: 'Potent chemo-attractant, natural sterols, and cellular growth catalyst that stimulates continuous feed consumption and hepatopancreas health.',
        category: 'marine_protein'
      },
      {
        name: 'Jawla Meal (Acetes indicus)',
        percentage: 10,
        role: 'Natural source of astaxanthin carotenoids for deep vivid body pigmentation and prebiotic chitin for cuticle hardness and immune defense.',
        category: 'marine_protein'
      },
      {
        name: 'De-oiled Groundnut Cake Powder',
        role: 'High-density, low-fiber digestible vegetable protein with balanced arginine profile supporting steady muscle accretion.',
        category: 'plant_protein'
      },
      {
        name: 'Dehulled Soya Bean Meal (Hi-Pro)',
        role: 'Core amino acid balancer supplying critical lysine and methionine equivalents for optimal protein retention efficiency.',
        category: 'plant_protein'
      },
      {
        name: 'Gelatinized Rice Flour & Extruded Corn Flour',
        role: 'Hydrothermally processed binding matrix guaranteeing over 3.5 hours of underwater pellet stability without nutrient leaching.',
        category: 'plant_protein'
      },
      {
        name: 'Multi-Enzyme Complex (Protease, Amylase, Lipase, Phytase)',
        role: 'Enhances hydrolytic breakdown of complex proteins and carbohydrates, lowering FCR and significantly reducing bottom sludge.',
        category: 'functional_additive'
      },
      {
        name: 'Coated Essential Amino Acids (L-Lysine, DL-Methionine)',
        role: 'Eliminates growth-limiting amino acid gaps, boosting muscle synthesis and daily weight gain.',
        category: 'functional_additive'
      },
      {
        name: 'Chelated Mineral & Fortified Vitamin Premix',
        role: 'Bioavailable Zinc, Selenium, Magnesium, Vitamin C (Stay-C), and Vitamin E to maximize stress resilience and disease immunity against WSSV/Vibrio.',
        category: 'micronutrient'
      }
    ],
    benefits: [
      {
        id: 'b-growth',
        title: 'Accelerated 45-Day Harvest',
        description: 'Reduces culture period from standard 60 days down to 45 days, saving 15 days of operating overhead, aeration electricity, and labor.',
        metric: '15 Days Faster',
        icon: 'Zap'
      },
      {
        id: 'b-colour',
        title: 'Lustrous Natural Colouration',
        description: 'Rich in organic astaxanthin from 10% Jawla meal and squid sterols, fetching a 15-20% price premium at harvest auctions.',
        metric: '4.8/5 Color Index',
        icon: 'Sparkles'
      },
      {
        id: 'b-survival',
        title: 'Superior >92% Survival Rate',
        description: 'Chitin-rich bioactives and clean water stability suppress pathogenic bacterial proliferation, drastically cutting juvenile mortality.',
        metric: '93.4% Avg Survival',
        icon: 'ShieldCheck'
      },
      {
        id: 'b-immunity',
        title: 'Robust Disease Immunity & Vigor',
        description: 'Chelated trace minerals and multi-enzymes reinforce gut microflora integrity and stress resistance against temperature fluctuations.',
        metric: '1.18 Target FCR',
        icon: 'Activity'
      }
    ],
    feedingStages: [
      {
        stage: 'Starter (Nursery to Juvenile)',
        bodyWeightRange: '0.5g – 4.0g',
        feedCode: 'AV-Crumb-01',
        feedType: 'Crumble 0.8mm – 1.2mm',
        feedingRatePercent: '7.0% – 5.5% of body weight',
        frequencyPerDay: 4
      },
      {
        stage: 'Grower (Mid-Culture Rapid Phase)',
        bodyWeightRange: '4.0g – 18.0g',
        feedCode: 'AV-Pellet-02',
        feedType: 'Short Pellet 1.5mm',
        feedingRatePercent: '4.8% – 3.2% of body weight',
        frequencyPerDay: 4
      },
      {
        stage: 'Finisher (Pre-Harvest Prime)',
        bodyWeightRange: '18.0g – 32.0g',
        feedCode: 'AV-Pellet-03',
        feedType: 'Firm Extruded Pellet 1.8mm – 2.0mm',
        feedingRatePercent: '2.8% – 2.2% of body weight',
        frequencyPerDay: 3
      }
    ]
  }
];

// -------------------------------------------------------------
// Seed Farmers and Admin Users (15 Farmers across TN)
// -------------------------------------------------------------
export const INITIAL_USERS: User[] = [
  {
    id: 'user-farmer-01',
    role: 'farmer',
    name: 'Murugan Ramanathan',
    phone: '+91 98401 23456',
    email: 'murugan.aqua@gmail.com',
    district: 'Nagapattinam',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 4,
    primarySpecies: 'Vannamei Shrimp',
    createdAt: '2026-06-10T10:00:00Z'
  },
  {
    id: 'user-admin-01',
    role: 'admin',
    name: 'Dr. S. Anbarasan (Connected Minds)',
    phone: '+91 94440 99999',
    email: 'admin@aquavigor.agri',
    district: 'Chennai',
    state: 'Tamil Nadu',
    preferredLang: 'en',
    pondCount: 0,
    primarySpecies: 'All Species',
    createdAt: '2026-05-01T08:00:00Z'
  },
  {
    id: 'user-farmer-02',
    role: 'farmer',
    name: 'K. Selvakumar',
    phone: '+91 98402 34567',
    email: 'selvakumar.farms@gmail.com',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 3,
    primarySpecies: 'Vannamei Shrimp',
    createdAt: '2026-06-12T11:00:00Z'
  },
  {
    id: 'user-farmer-03',
    role: 'farmer',
    name: 'R. Veeramani',
    phone: '+91 98403 45678',
    email: 'veeramani.shrimp@gmail.com',
    district: 'Cuddalore',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 5,
    primarySpecies: 'Vannamei Shrimp',
    createdAt: '2026-06-15T09:30:00Z'
  },
  {
    id: 'user-farmer-04',
    role: 'farmer',
    name: 'S. Muthuvel',
    phone: '+91 98404 56789',
    email: 'muthuvel.aquaculture@yahoo.com',
    district: 'Ramanathapuram',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 2,
    primarySpecies: 'Asian Seabass',
    createdAt: '2026-06-18T14:15:00Z'
  },
  {
    id: 'user-farmer-05',
    role: 'farmer',
    name: 'Thirunavukkarasu P.',
    phone: '+91 98405 67890',
    email: 'thiru.aqua@gmail.com',
    district: 'Mayiladuthurai',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 6,
    primarySpecies: 'Vannamei Shrimp',
    createdAt: '2026-06-20T16:00:00Z'
  },
  {
    id: 'user-farmer-06',
    role: 'farmer',
    name: 'G. Arumugam',
    phone: '+91 98406 78901',
    email: 'arumugam.tilapia@gmail.com',
    district: 'Thoothukudi',
    state: 'Tamil Nadu',
    preferredLang: 'en',
    pondCount: 3,
    primarySpecies: 'GIFT Tilapia',
    createdAt: '2026-06-22T10:20:00Z'
  },
  {
    id: 'user-farmer-07',
    role: 'farmer',
    name: 'M. Palanisamy',
    phone: '+91 98407 89012',
    email: 'palanisamy.fish@gmail.com',
    district: 'Tiruvallur',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 4,
    primarySpecies: 'Catfish',
    createdAt: '2026-06-25T11:45:00Z'
  },
  {
    id: 'user-farmer-08',
    role: 'farmer',
    name: 'D. Senthamarai',
    phone: '+91 98408 90123',
    email: 'senthamarai.farms@rediffmail.com',
    district: 'Pudukkottai',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 2,
    primarySpecies: 'Vannamei Shrimp',
    createdAt: '2026-06-28T09:10:00Z'
  },
  {
    id: 'user-farmer-09',
    role: 'farmer',
    name: 'J. Sivakumar',
    phone: '+91 98409 01234',
    email: 'sivakumar.aqua@gmail.com',
    district: 'Villupuram',
    state: 'Tamil Nadu',
    preferredLang: 'en',
    pondCount: 3,
    primarySpecies: 'Vannamei Shrimp',
    createdAt: '2026-07-02T13:00:00Z'
  },
  {
    id: 'user-farmer-10',
    role: 'farmer',
    name: 'V. Rajeshwari',
    phone: '+91 98410 12345',
    email: 'rajeshwari.aquafarm@gmail.com',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 2,
    primarySpecies: 'GIFT Tilapia',
    createdAt: '2026-07-05T08:40:00Z'
  },
  {
    id: 'user-farmer-11',
    role: 'farmer',
    name: 'K. Balaji',
    phone: '+91 98411 23456',
    email: 'balaji.shrimp@gmail.com',
    district: 'Nagapattinam',
    state: 'Tamil Nadu',
    preferredLang: 'en',
    pondCount: 4,
    primarySpecies: 'Vannamei Shrimp',
    createdAt: '2026-07-08T15:30:00Z'
  },
  {
    id: 'user-farmer-12',
    role: 'farmer',
    name: 'T. Krishnan',
    phone: '+91 98412 34567',
    email: 'krishnan.ponds@gmail.com',
    district: 'Tiruvarur',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 3,
    primarySpecies: 'Catfish',
    createdAt: '2026-07-10T12:00:00Z'
  },
  {
    id: 'user-farmer-13',
    role: 'farmer',
    name: 'A. Vijay Anand',
    phone: '+91 98413 45678',
    email: 'vijay.anand.aqua@gmail.com',
    district: 'Cuddalore',
    state: 'Tamil Nadu',
    preferredLang: 'en',
    pondCount: 5,
    primarySpecies: 'Black Tiger Shrimp',
    createdAt: '2026-07-12T14:50:00Z'
  },
  {
    id: 'user-farmer-14',
    role: 'farmer',
    name: 'N. Soundararajan',
    phone: '+91 98414 56789',
    email: 'soundar.aqua@gmail.com',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 3,
    primarySpecies: 'Asian Seabass',
    createdAt: '2026-07-15T10:15:00Z'
  },
  {
    id: 'user-farmer-15',
    role: 'farmer',
    name: 'P. Manikandan',
    phone: '+91 98415 67890',
    email: 'mani.aqua@gmail.com',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    preferredLang: 'ta',
    pondCount: 4,
    primarySpecies: 'Vannamei Shrimp',
    createdAt: '2026-07-18T09:00:00Z'
  }
];

// -------------------------------------------------------------
// Seed Ponds for Demo Farmer (Murugan)
// -------------------------------------------------------------
export const INITIAL_PONDS: Pond[] = [
  {
    id: 'pond-01',
    userId: 'user-farmer-01',
    pondNumber: 'P-1',
    name: 'North Estuary Pond 1',
    areaAcres: 1.2,
    depthMeters: 1.5,
    waterType: 'brackish',
    createdAt: '2026-06-10T10:30:00Z'
  },
  {
    id: 'pond-02',
    userId: 'user-farmer-01',
    pondNumber: 'P-2',
    name: 'Coastal Main Pond 2 (Active Trial)',
    areaAcres: 1.5,
    depthMeters: 1.6,
    waterType: 'brackish',
    createdAt: '2026-06-10T10:35:00Z'
  },
  {
    id: 'pond-03',
    userId: 'user-farmer-01',
    pondNumber: 'P-3',
    name: 'Bio-Floc Nursery Pond 3',
    areaAcres: 0.8,
    depthMeters: 1.4,
    waterType: 'brackish',
    createdAt: '2026-06-10T10:40:00Z'
  },
  {
    id: 'pond-04',
    userId: 'user-farmer-01',
    pondNumber: 'P-4',
    name: 'Finisher Pond 4 (Control Baseline)',
    areaAcres: 1.0,
    depthMeters: 1.5,
    waterType: 'brackish',
    createdAt: '2026-06-10T10:45:00Z'
  }
];

// Helper to generate realistic dates relative to current demo
function getDateDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// -------------------------------------------------------------
// Seed Batches (30 realistic batches)
// -------------------------------------------------------------
export const INITIAL_BATCHES: Batch[] = [
  // Murugan's Batches
  {
    id: 'batch-01',
    pondId: 'pond-02',
    userId: 'user-farmer-01',
    pondName: 'Coastal Main Pond 2',
    batchName: 'Pond 2 - CHANNA PELLET 45d Fast Batch',
    species: 'Vannamei Shrimp',
    stockingDate: getDateDaysAgo(32), // Currently Day 32! Triggers Day 30 Feedback Prompt!
    targetHarvestDate: getDateDaysAgo(-13), // 45 days total
    stockingCount: 60000,
    feedType: 'aquavigor',
    initialWeightG: 0.6,
    targetWeightG: 30.0,
    status: 'active',
    currentWeightG: 22.4,
    currentSurvivalRate: 94.2,
    currentFCR: 1.16,
    createdAt: getDateDaysAgo(32)
  },
  {
    id: 'batch-02',
    pondId: 'pond-01',
    userId: 'user-farmer-01',
    pondName: 'North Estuary Pond 1',
    batchName: 'Pond 1 - Completed CHANNA PELLET Cycle 1',
    species: 'Vannamei Shrimp',
    stockingDate: getDateDaysAgo(55),
    targetHarvestDate: getDateDaysAgo(10),
    actualHarvestDate: getDateDaysAgo(10), // Harvested in 45 days!
    stockingCount: 50000,
    feedType: 'aquavigor',
    initialWeightG: 0.5,
    targetWeightG: 28.5,
    status: 'harvested',
    currentWeightG: 29.2,
    currentSurvivalRate: 95.1,
    currentFCR: 1.14,
    createdAt: getDateDaysAgo(55)
  },
  {
    id: 'batch-03',
    pondId: 'pond-04',
    userId: 'user-farmer-01',
    pondName: 'Finisher Pond 4',
    batchName: 'Pond 4 - Standard Commercial Feed (Control)',
    species: 'Vannamei Shrimp',
    stockingDate: getDateDaysAgo(40),
    targetHarvestDate: getDateDaysAgo(-20), // 60 days standard
    stockingCount: 50000,
    feedType: 'other',
    initialWeightG: 0.5,
    targetWeightG: 28.0,
    status: 'active',
    currentWeightG: 18.2, // notice slower weight gain!
    currentSurvivalRate: 83.5,
    currentFCR: 1.58,
    createdAt: getDateDaysAgo(40)
  },
  {
    id: 'batch-04',
    pondId: 'pond-03',
    userId: 'user-farmer-01',
    pondName: 'Bio-Floc Nursery Pond 3',
    batchName: 'Pond 3 - Nursery Juvenile Run',
    species: 'Vannamei Shrimp',
    stockingDate: getDateDaysAgo(14),
    targetHarvestDate: getDateDaysAgo(-31),
    stockingCount: 80000,
    feedType: 'aquavigor',
    initialWeightG: 0.2,
    targetWeightG: 5.0,
    status: 'active',
    currentWeightG: 4.8,
    currentSurvivalRate: 96.5,
    currentFCR: 1.08,
    createdAt: getDateDaysAgo(14)
  },
  // Remaining batches across other 14 farmers
  ...Array.from({ length: 26 }).map((_, idx) => {
    const farmerIdx = (idx % 14) + 2; // farmers 2 to 15
    const farmer = INITIAL_USERS[farmerIdx];
    const isAquaVigor = idx % 4 !== 0; // 75% AquaVigor, 25% control
    const isHarvested = idx < 12;
    const speciesList = ['Vannamei Shrimp', 'Black Tiger Shrimp', 'GIFT Tilapia', 'Catfish', 'Asian Seabass'] as const;
    const species = speciesList[idx % speciesList.length];
    const stockingDaysAgo = isHarvested ? (isAquaVigor ? 50 + idx : 70 + idx) : (10 + (idx * 2));
    const targetHarvestDays = isAquaVigor ? 45 : 60;
    
    return {
      id: `batch-${(idx + 5).toString().padStart(2, '0')}`,
      pondId: `pond-farm-${farmerIdx}-p1`,
      userId: farmer.id,
      pondName: `${farmer.district} Farm Pond ${(idx % 3) + 1}`,
      batchName: `${species} Batch #${idx + 5} (${isAquaVigor ? 'AquaVigor' : 'Commercial'})`,
      species: species,
      stockingDate: getDateDaysAgo(stockingDaysAgo),
      targetHarvestDate: getDateDaysAgo(stockingDaysAgo - targetHarvestDays),
      actualHarvestDate: isHarvested ? getDateDaysAgo(stockingDaysAgo - (isAquaVigor ? 45 : 62)) : undefined,
      stockingCount: 40000 + (idx * 1500),
      feedType: isAquaVigor ? ('aquavigor' as const) : ('other' as const),
      initialWeightG: 0.5,
      targetWeightG: species === 'Asian Seabass' ? 500 : (species === 'Catfish' ? 400 : (species === 'GIFT Tilapia' ? 350 : 30)),
      status: isHarvested ? ('harvested' as const) : ('active' as const),
      currentWeightG: isAquaVigor ? 24.5 : 19.8,
      currentSurvivalRate: isAquaVigor ? Number((92 + (idx % 5) * 0.8).toFixed(1)) : Number((80 + (idx % 6) * 0.7).toFixed(1)),
      currentFCR: isAquaVigor ? Number((1.15 + (idx % 4) * 0.03).toFixed(2)) : Number((1.55 + (idx % 4) * 0.05).toFixed(2)),
      createdAt: getDateDaysAgo(stockingDaysAgo)
    };
  })
];

// -------------------------------------------------------------
// Seed Growth Logs for Batch 1 (AquaVigor) & Batch 3 (Other)
// -------------------------------------------------------------
export const INITIAL_GROWTH_LOGS: GrowthLog[] = [
  // Murugan Batch 1 (AquaVigor 45-day curve: Days 7, 14, 21, 28, 32)
  {
    id: 'log-01-01',
    batchId: 'batch-01',
    logDate: getDateDaysAgo(25),
    dayNumber: 7,
    averageWeightG: 3.2,
    mortalityCount: 220,
    feedFedKg: 180,
    colourScore: 4,
    waterTempC: 28.5,
    dissolvedOxygenPpm: 6.4,
    notes: 'Shrimp actively eating crumbles, excellent appetite after transition.',
    createdAt: getDateDaysAgo(25)
  },
  {
    id: 'log-01-02',
    batchId: 'batch-01',
    logDate: getDateDaysAgo(18),
    dayNumber: 14,
    averageWeightG: 7.8,
    mortalityCount: 185,
    feedFedKg: 420,
    colourScore: 4,
    waterTempC: 29.0,
    dissolvedOxygenPpm: 6.2,
    notes: 'Good molting synchronization. Shell hardening is swift thanks to jawla meal chitin.',
    createdAt: getDateDaysAgo(18)
  },
  {
    id: 'log-01-03',
    batchId: 'batch-01',
    logDate: getDateDaysAgo(11),
    dayNumber: 21,
    averageWeightG: 13.5,
    mortalityCount: 140,
    feedFedKg: 780,
    colourScore: 5,
    waterTempC: 28.2,
    dissolvedOxygenPpm: 6.1,
    notes: 'Noticeable red-orange pigmentation on tail fans and antenna. Zero check tray leftovers.',
    createdAt: getDateDaysAgo(11)
  },
  {
    id: 'log-01-04',
    batchId: 'batch-01',
    logDate: getDateDaysAgo(4),
    dayNumber: 28,
    averageWeightG: 19.8,
    mortalityCount: 110,
    feedFedKg: 1250,
    colourScore: 5,
    waterTempC: 28.6,
    dissolvedOxygenPpm: 6.0,
    notes: 'On track to hit 30g target before Day 45! Incredible growth acceleration.',
    createdAt: getDateDaysAgo(4)
  },
  {
    id: 'log-01-05',
    batchId: 'batch-01',
    logDate: getDateDaysAgo(0),
    dayNumber: 32,
    averageWeightG: 22.4,
    mortalityCount: 85,
    feedFedKg: 620,
    colourScore: 5,
    waterTempC: 28.4,
    dissolvedOxygenPpm: 6.3,
    notes: 'Day 30 milestone crossed smoothly. Gut fullness 100% on random net sampling.',
    createdAt: getDateDaysAgo(0)
  },

  // Murugan Batch 2 (Completed 45-day cycle logs)
  {
    id: 'log-02-01',
    batchId: 'batch-02',
    logDate: getDateDaysAgo(48),
    dayNumber: 7,
    averageWeightG: 3.1,
    mortalityCount: 200,
    feedFedKg: 175,
    colourScore: 4,
    waterTempC: 28.2,
    dissolvedOxygenPpm: 6.3,
    createdAt: getDateDaysAgo(48)
  },
  {
    id: 'log-02-02',
    batchId: 'batch-02',
    logDate: getDateDaysAgo(41),
    dayNumber: 14,
    averageWeightG: 7.9,
    mortalityCount: 160,
    feedFedKg: 390,
    colourScore: 4,
    waterTempC: 28.5,
    dissolvedOxygenPpm: 6.1,
    createdAt: getDateDaysAgo(41)
  },
  {
    id: 'log-02-03',
    batchId: 'batch-02',
    logDate: getDateDaysAgo(34),
    dayNumber: 21,
    averageWeightG: 14.1,
    mortalityCount: 130,
    feedFedKg: 750,
    colourScore: 5,
    waterTempC: 28.0,
    dissolvedOxygenPpm: 6.0,
    createdAt: getDateDaysAgo(34)
  },
  {
    id: 'log-02-04',
    batchId: 'batch-02',
    logDate: getDateDaysAgo(27),
    dayNumber: 28,
    averageWeightG: 20.2,
    mortalityCount: 105,
    feedFedKg: 1180,
    colourScore: 5,
    waterTempC: 28.5,
    dissolvedOxygenPpm: 6.2,
    createdAt: getDateDaysAgo(27)
  },
  {
    id: 'log-02-05',
    batchId: 'batch-02',
    logDate: getDateDaysAgo(20),
    dayNumber: 35,
    averageWeightG: 24.8,
    mortalityCount: 90,
    feedFedKg: 1450,
    colourScore: 5,
    waterTempC: 28.8,
    dissolvedOxygenPpm: 6.1,
    createdAt: getDateDaysAgo(20)
  },
  {
    id: 'log-02-06',
    batchId: 'batch-02',
    logDate: getDateDaysAgo(10),
    dayNumber: 45,
    averageWeightG: 29.2,
    mortalityCount: 75,
    feedFedKg: 1720,
    colourScore: 5,
    waterTempC: 28.3,
    dissolvedOxygenPpm: 6.3,
    notes: 'Harvest completed at Day 45! Buyers paid A-grade premium for intense tail colour.',
    createdAt: getDateDaysAgo(10)
  },

  // Batch 3 (Competitor Feed Control - slower growth to Day 40)
  {
    id: 'log-03-01',
    batchId: 'batch-03',
    logDate: getDateDaysAgo(33),
    dayNumber: 7,
    averageWeightG: 2.3,
    mortalityCount: 380,
    feedFedKg: 195,
    colourScore: 3,
    waterTempC: 28.5,
    dissolvedOxygenPpm: 6.1,
    createdAt: getDateDaysAgo(33)
  },
  {
    id: 'log-03-02',
    batchId: 'batch-03',
    logDate: getDateDaysAgo(26),
    dayNumber: 14,
    averageWeightG: 5.6,
    mortalityCount: 340,
    feedFedKg: 460,
    colourScore: 3,
    waterTempC: 28.6,
    dissolvedOxygenPpm: 5.9,
    createdAt: getDateDaysAgo(26)
  },
  {
    id: 'log-03-03',
    batchId: 'batch-03',
    logDate: getDateDaysAgo(19),
    dayNumber: 21,
    averageWeightG: 9.8,
    mortalityCount: 310,
    feedFedKg: 890,
    colourScore: 3,
    waterTempC: 28.4,
    dissolvedOxygenPpm: 5.8,
    createdAt: getDateDaysAgo(19)
  },
  {
    id: 'log-03-04',
    batchId: 'batch-03',
    logDate: getDateDaysAgo(12),
    dayNumber: 28,
    averageWeightG: 14.1,
    mortalityCount: 290,
    feedFedKg: 1390,
    colourScore: 3,
    waterTempC: 28.5,
    dissolvedOxygenPpm: 5.7,
    createdAt: getDateDaysAgo(12)
  },
  {
    id: 'log-03-05',
    batchId: 'batch-03',
    logDate: getDateDaysAgo(0),
    dayNumber: 40,
    averageWeightG: 18.2,
    mortalityCount: 260,
    feedFedKg: 1850,
    colourScore: 3,
    waterTempC: 28.3,
    dissolvedOxygenPpm: 5.8,
    notes: 'Noticeable difference compared to AquaVigor pond. Water turbidity is higher, FCR running at 1.58.',
    createdAt: getDateDaysAgo(0)
  }
];

// -------------------------------------------------------------
// Seed Feedback & Rating System (50 realistic feedback entries)
// -------------------------------------------------------------
export const INITIAL_FEEDBACK: Feedback[] = [
  {
    id: 'fb-01',
    batchId: 'batch-02',
    batchName: 'Pond 1 - Completed AquaVigor Cycle 1',
    userId: 'user-farmer-01',
    farmerName: 'Murugan Ramanathan',
    district: 'Nagapattinam',
    species: 'Vannamei Shrimp',
    overallRating: 5,
    growthRating: 5,
    colourRating: 5,
    survivalRating: 5,
    immunityRating: 5,
    valueRating: 5,
    comment: 'அதிசயமான வளர்ச்சி! 45 நாட்களில் 29.2 கிராம் எடையை எட்டிவிட்டோம். வழக்கமாக 60 நாட்கள் ஆகும். ஜாவ்லா தூளின் நிறம் இறாலுக்கு அபாரமான சிகப்பு பிரகாசத்தை தந்துள்ளது. வியாபாரிகள் கிலோவுக்கு ₹15 கூடுதல் விலை கொடுத்தார்கள்!',
    voiceTranscript: 'Very good growth rate. In 45 days reached 29 grams weight. Shrimp colour is dark and attractive.',
    photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    reducedCulturePeriod: true,
    wouldRecommend: true,
    sentiment: 'positive',
    status: 'resolved',
    replies: [
      {
        id: 'reply-01',
        feedbackId: 'fb-01',
        adminUserId: 'user-admin-01',
        adminName: 'Dr. S. Anbarasan (Connected Minds)',
        replyText: 'வணக்கம் திரு. முருகன்! உங்கள் 45 நாள் அறுவடை வெற்றிக்கு வாழ்த்துகள். 20% ஸ்க்விட் மீல் மற்றும் 10% ஜாவ்லா மீல் இணைந்து இயற்கையான அஸ்டாக்சாந்தின் நிறமியை வழங்கியதன் விளைவு இது. அடுத்த பயிருக்கும் எங்கள் பரிந்துரைக்கப்பட்ட ஃபீடிங் சார்ட்டை பின்பற்றவும்.',
        createdAt: getDateDaysAgo(8)
      }
    ],
    createdAt: getDateDaysAgo(9)
  },
  {
    id: 'fb-02',
    batchId: 'batch-05',
    batchName: 'Tilapia Batch #5 (AquaVigor)',
    userId: 'user-farmer-06',
    farmerName: 'G. Arumugam',
    district: 'Thoothukudi',
    species: 'GIFT Tilapia',
    overallRating: 5,
    growthRating: 5,
    colourRating: 4,
    survivalRating: 5,
    immunityRating: 5,
    valueRating: 4,
    comment: 'Tilapia growth is rapid and mortality dropped to less than 4%. The pellet does not dissolve even after 3 hours in water, so pond bottom remains remarkably clean.',
    voiceTranscript: 'Tilapia water stability is great. Clean pond bottom.',
    reducedCulturePeriod: true,
    wouldRecommend: true,
    sentiment: 'positive',
    status: 'reviewed',
    replies: [
      {
        id: 'reply-02',
        feedbackId: 'fb-02',
        adminUserId: 'user-admin-01',
        adminName: 'Dr. S. Anbarasan (Connected Minds)',
        replyText: 'Glad to hear Arumugam! Our gelatinized extrusion process ensures 3+ hour water stability to prevent nutrient leaching.',
        createdAt: getDateDaysAgo(14)
      }
    ],
    createdAt: getDateDaysAgo(15)
  },
  {
    id: 'fb-03',
    batchId: 'batch-06',
    batchName: 'Vannamei Batch #6 (AquaVigor)',
    userId: 'user-farmer-03',
    farmerName: 'R. Veeramani',
    district: 'Cuddalore',
    species: 'Vannamei Shrimp',
    overallRating: 4,
    growthRating: 5,
    colourRating: 5,
    survivalRating: 4,
    immunityRating: 4,
    valueRating: 4,
    comment: 'வளர்ச்சி மிக நன்று. ஆனால் தென் கடலோர பகுதியில் டெலிவரிக்கு இரண்டு நாட்கள் ஆனது. ஸ்டாக் முன்கூட்டியே அனுப்பினால் உதவியாக இருக்கும்.',
    voiceTranscript: 'Feed is excellent, but delivery took 48 hours to Cuddalore.',
    reducedCulturePeriod: true,
    wouldRecommend: true,
    sentiment: 'neutral',
    status: 'reviewed',
    replies: [
      {
        id: 'reply-03',
        feedbackId: 'fb-03',
        adminUserId: 'user-admin-01',
        adminName: 'Dr. S. Anbarasan (Connected Minds)',
        replyText: 'நன்றி வீரமணி அவர்களே. கடலூரில் புதிய நேரடி விநியோக முனையம் அமைத்துள்ளோம், இனி 24 மணி நேரத்திற்குள் டெலிவரி செய்யப்படும்.',
        createdAt: getDateDaysAgo(10)
      }
    ],
    createdAt: getDateDaysAgo(12)
  },
  {
    id: 'fb-04',
    batchId: 'batch-07',
    batchName: 'Asian Seabass Batch #7 (AquaVigor)',
    userId: 'user-farmer-04',
    farmerName: 'S. Muthuvel',
    district: 'Ramanathapuram',
    species: 'Asian Seabass',
    overallRating: 5,
    growthRating: 5,
    colourRating: 4,
    survivalRating: 5,
    immunityRating: 5,
    valueRating: 5,
    comment: 'கொடுவா மீன்கள் வழக்கமாக தீவனத்தை சீக்கிரம் எடுக்காது. ஆனால் இதில் உள்ள 20% கணவாய் தூள் நறுமணத்தால் தீவிரமாக சாப்பிடுகிறது! FCR 1.22 வந்துள்ளது.',
    voiceTranscript: 'Seabass accepts the feed aggressively because of squid meal aroma.',
    reducedCulturePeriod: true,
    wouldRecommend: true,
    sentiment: 'positive',
    status: 'resolved',
    replies: [],
    createdAt: getDateDaysAgo(18)
  },
  {
    id: 'fb-05',
    batchId: 'batch-08',
    batchName: 'Catfish Batch #8 (AquaVigor)',
    userId: 'user-farmer-07',
    farmerName: 'M. Palanisamy',
    district: 'Tiruvallur',
    species: 'Catfish',
    overallRating: 5,
    growthRating: 4,
    colourRating: 4,
    survivalRating: 5,
    immunityRating: 5,
    valueRating: 5,
    comment: 'Catfish survival rate was 96.2%, highest I have ever seen in my 8 years of farming. Disease resistance is noticeably superior during heavy rains.',
    voiceTranscript: 'Highest survival rate in 8 years of catfish farming.',
    reducedCulturePeriod: true,
    wouldRecommend: true,
    sentiment: 'positive',
    status: 'resolved',
    replies: [],
    createdAt: getDateDaysAgo(20)
  },
  // Generate remaining 45 realistic feedback entries to complete 50 records
  ...Array.from({ length: 45 }).map((_, i) => {
    const farmerIdx = (i % 14) + 1;
    const farmer = INITIAL_USERS[farmerIdx];
    const isFive = i % 5 !== 0;
    const isNegative = i === 18 || i === 33; // 2 realistic negative issues for balance
    const rating = isNegative ? 2 : (isFive ? 5 : 4);
    const species = farmer.primarySpecies;
    const daysAgo = 2 + (i * 2);

    const commentsPool = [
      `Excellent feed conversion ratio. Harvested shrimp had a beautiful natural golden hue.`,
      `வழக்கமான 60 நாள் சுழற்சி 44 நாட்களிலேயே முடிந்தது. தீவன செலவில் ₹45,000 மிச்சமானது.`,
      `Squid meal aroma drives instant feeding response within 10 minutes in the check tray.`,
      `இறப்பு விகிதம் வெகுவாக குறைந்துள்ளது. குஞ்சு விட்டதில் இருந்து நோய் தாக்குதல் இல்லை.`,
      `Great results on GIFT Tilapia weight gain. Flesh firmness is high grade.`,
      `Coloration scored top marks at the local auction. Buyer specifically asked what feed we used.`,
      `Enzymes make a clear difference in pond sludge reduction. Water quality stayed stable throughout.`,
      `The 25kg moisture barrier bags are sturdy and easy to handle in wet weather.`,
      `Price per bag is slightly higher, but the 15-day shorter culture period saves more than double that cost.`
    ];

    const comment = isNegative
      ? (i === 18 ? 'Heavy rains delayed the truck delivery by 3 days. Feed quality is 5-star, but logistics need backup.' : 'Pellet size was slightly uneven in one 50kg bag lot. Agronomist came and inspected promptly.')
      : commentsPool[i % commentsPool.length];

    const sentiment = isNegative ? 'negative' : (rating === 4 ? 'neutral' : 'positive');

    return {
      id: `fb-${(i + 6).toString().padStart(2, '0')}`,
      batchId: `batch-${((i % 20) + 1).toString().padStart(2, '0')}`,
      batchName: `${species} Pond Batch #${(i % 10) + 1}`,
      userId: farmer.id,
      farmerName: farmer.name,
      district: farmer.district,
      species: species,
      overallRating: rating,
      growthRating: isNegative ? 3 : (isFive ? 5 : 4),
      colourRating: isNegative ? 3 : (isFive ? 5 : 4),
      survivalRating: isNegative ? 2 : 5,
      immunityRating: isNegative ? 3 : 5,
      valueRating: isNegative ? 2 : (isFive ? 5 : 4),
      comment: comment,
      voiceTranscript: isFive ? 'Very satisfied with AquaVigor results and feed quality.' : 'Good feed, timely response needed.',
      reducedCulturePeriod: !isNegative,
      wouldRecommend: !isNegative,
      sentiment: sentiment as 'positive' | 'neutral' | 'negative',
      status: (i % 3 === 0 ? 'resolved' : (i % 2 === 0 ? 'reviewed' : 'new')) as 'new' | 'reviewed' | 'resolved',
      replies: i % 2 === 0 ? [
        {
          id: `reply-gen-${i}`,
          feedbackId: `fb-${(i + 6).toString().padStart(2, '0')}`,
          adminUserId: 'user-admin-01',
          adminName: 'Dr. S. Anbarasan (Connected Minds)',
          replyText: isNegative
            ? 'We sincerely apologize for the delay. We have routed your region to our direct warehouse and refunded the express freight fee.'
            : 'Thank you for your valuable feedback! We are proud to support your farm with sustainable high-efficiency nutrition.',
          createdAt: getDateDaysAgo(Math.max(1, daysAgo - 1))
        }
      ] : [],
      createdAt: getDateDaysAgo(daysAgo)
    };
  })
];

// -------------------------------------------------------------
// Seed Orders
// -------------------------------------------------------------
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-01',
    userId: 'user-farmer-01',
    farmerName: 'Murugan Ramanathan',
    contactPhone: '+91 98401 23456',
    district: 'Nagapattinam',
    productId: 'prod-aquavigor-01',
    productName: 'AquaVigor™ High-Performance Functional Feed',
    quantityBags: 20,
    bagSizeKg: 25,
    totalPriceInr: 37000,
    deliveryAddress: 'Survey No. 42/B, Estuary Road, Velankanni Taluk, Nagapattinam',
    status: 'delivered',
    notes: 'Delivered in 24 hours. Gate contact: Murugan.',
    createdAt: getDateDaysAgo(15)
  },
  {
    id: 'ord-02',
    userId: 'user-farmer-01',
    farmerName: 'Murugan Ramanathan',
    contactPhone: '+91 98401 23456',
    district: 'Nagapattinam',
    productId: 'prod-aquavigor-01',
    productName: 'AquaVigor™ High-Performance Functional Feed',
    quantityBags: 30,
    bagSizeKg: 25,
    totalPriceInr: 55500,
    deliveryAddress: 'Survey No. 42/B, Estuary Road, Velankanni Taluk, Nagapattinam',
    status: 'dispatched',
    notes: 'Vehicle on route: TN-51-AB-4021. Driver Babu.',
    createdAt: getDateDaysAgo(2)
  },
  {
    id: 'ord-03',
    userId: 'user-farmer-03',
    farmerName: 'R. Veeramani',
    contactPhone: '+91 98403 45678',
    district: 'Cuddalore',
    productId: 'prod-aquavigor-01',
    productName: 'AquaVigor™ High-Performance Functional Feed',
    quantityBags: 40,
    bagSizeKg: 25,
    totalPriceInr: 74000,
    deliveryAddress: 'Killai Coastal Farm, Chidambaram, Cuddalore',
    status: 'confirmed',
    createdAt: getDateDaysAgo(1)
  },
  {
    id: 'ord-04',
    userId: 'user-farmer-04',
    farmerName: 'S. Muthuvel',
    contactPhone: '+91 98404 56789',
    district: 'Ramanathapuram',
    productId: 'prod-aquavigor-01',
    productName: 'AquaVigor™ High-Performance Functional Feed',
    quantityBags: 15,
    bagSizeKg: 25,
    totalPriceInr: 27750,
    deliveryAddress: 'Mandapam Seashore Ponds, Ramanathapuram',
    status: 'requested',
    createdAt: getDateDaysAgo(0)
  }
];

// -------------------------------------------------------------
// Storage Engine & Offline Sync Queue
// -------------------------------------------------------------
class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PONDS)) {
      localStorage.setItem(STORAGE_KEYS.PONDS, JSON.stringify(INITIAL_PONDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BATCHES)) {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GROWTH_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.GROWTH_LOGS, JSON.stringify(INITIAL_GROWTH_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(INITIAL_FEEDBACK));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to demo farmer (Murugan)
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    }
  }

  // --- Users & Auth ---
  public getUsers(): User[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  public getCurrentUser(): User {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) return JSON.parse(stored);
    return INITIAL_USERS[0];
  }

  public setCurrentUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  public registerUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);

    // Automatically create ponds for the new farmer
    const ponds = this.getPonds();
    for (let i = 1; i <= Math.max(1, userData.pondCount || 1); i++) {
      ponds.push({
        id: `pond-${Date.now()}-${i}`,
        userId: newUser.id,
        pondNumber: `P-${i}`,
        name: `Pond ${i} (${userData.district})`,
        areaAcres: 1.0,
        depthMeters: 1.5,
        waterType: 'brackish',
        createdAt: new Date().toISOString()
      });
    }
    localStorage.setItem(STORAGE_KEYS.PONDS, JSON.stringify(ponds));

    return newUser;
  }

  // --- Ponds ---
  public getPonds(userId?: string): Pond[] {
    const allPonds: Pond[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PONDS) || '[]');
    if (userId) {
      return allPonds.filter(p => p.userId === userId);
    }
    return allPonds;
  }

  // --- Batches ---
  public getBatches(userId?: string): Batch[] {
    const allBatches: Batch[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BATCHES) || '[]');
    if (userId) {
      return allBatches.filter(b => b.userId === userId);
    }
    return allBatches;
  }

  public addBatch(batch: Omit<Batch, 'id' | 'createdAt'>): Batch {
    const batches = this.getBatches();
    const newBatch: Batch = {
      ...batch,
      id: `batch-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    batches.unshift(newBatch);
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
    return newBatch;
  }

  public updateBatch(id: string, updates: Partial<Batch>): Batch | null {
    const batches = this.getBatches();
    const index = batches.findIndex(b => b.id === id);
    if (index === -1) return null;
    batches[index] = { ...batches[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
    return batches[index];
  }

  // --- Growth Logs ---
  public getGrowthLogs(batchId?: string): GrowthLog[] {
    const allLogs: GrowthLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.GROWTH_LOGS) || '[]');
    if (batchId) {
      return allLogs.filter(l => l.batchId === batchId).sort((a, b) => a.dayNumber - b.dayNumber);
    }
    return allLogs;
  }

  public addGrowthLog(log: Omit<GrowthLog, 'id' | 'createdAt'>): GrowthLog {
    const logs = this.getGrowthLogs();
    const isOnline = navigator.onLine;

    const newLog: GrowthLog = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isOfflinePending: !isOnline
    };
    logs.push(newLog);
    localStorage.setItem(STORAGE_KEYS.GROWTH_LOGS, JSON.stringify(logs));

    // Update batch current weight and survival rate
    const batch = this.getBatches().find(b => b.id === log.batchId);
    if (batch) {
      const allBatchLogs = logs.filter(l => l.batchId === log.batchId);
      const totalMortality = allBatchLogs.reduce((acc, curr) => acc + curr.mortalityCount, 0);
      const survivalRate = Math.max(0, Number((((batch.stockingCount - totalMortality) / batch.stockingCount) * 100).toFixed(1)));
      
      const totalFeedKg = allBatchLogs.reduce((acc, curr) => acc + curr.feedFedKg, 0);
      const totalBiomassGainKg = ((log.averageWeightG - batch.initialWeightG) * (batch.stockingCount - totalMortality)) / 1000;
      const fcr = totalBiomassGainKg > 0 ? Number((totalFeedKg / totalBiomassGainKg).toFixed(2)) : batch.currentFCR;

      this.updateBatch(batch.id, {
        currentWeightG: log.averageWeightG,
        currentSurvivalRate: survivalRate,
        currentFCR: fcr
      });
    }

    if (!isOnline) {
      this.enqueueOfflineItem('growth_log', newLog);
    }

    return newLog;
  }

  // --- Feedback ---
  public getFeedback(): Feedback[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]');
  }

  public addFeedback(fb: Omit<Feedback, 'id' | 'createdAt' | 'status' | 'replies'>): Feedback {
    const list = this.getFeedback();
    const isOnline = navigator.onLine;

    // Automatic sentiment classification
    let sentiment: 'positive' | 'neutral' | 'negative' = 'positive';
    if (fb.overallRating <= 2 || fb.comment.toLowerCase().includes('bad') || fb.comment.toLowerCase().includes('slow') || fb.comment.toLowerCase().includes('death') || fb.comment.toLowerCase().includes('delay')) {
      sentiment = 'negative';
    } else if (fb.overallRating === 3) {
      sentiment = 'neutral';
    }

    const newFeedback: Feedback = {
      ...fb,
      id: `fb-${Date.now()}`,
      status: 'new',
      sentiment: sentiment,
      replies: [],
      createdAt: new Date().toISOString(),
      isOfflinePending: !isOnline
    };

    list.unshift(newFeedback);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));

    if (!isOnline) {
      this.enqueueOfflineItem('feedback', newFeedback);
    }

    return newFeedback;
  }

  public addFeedbackReply(feedbackId: string, replyText: string, adminUser: User): Feedback | null {
    const list = this.getFeedback();
    const index = list.findIndex(f => f.id === feedbackId);
    if (index === -1) return null;

    list[index].replies.push({
      id: `reply-${Date.now()}`,
      feedbackId: feedbackId,
      adminUserId: adminUser.id,
      adminName: adminUser.name,
      replyText: replyText,
      createdAt: new Date().toISOString()
    });

    list[index].status = 'reviewed';
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));
    return list[index];
  }

  public updateFeedbackStatus(feedbackId: string, status: 'new' | 'reviewed' | 'resolved'): Feedback | null {
    const list = this.getFeedback();
    const index = list.findIndex(f => f.id === feedbackId);
    if (index === -1) return null;
    list[index].status = status;
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));
    return list[index];
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  }

  public addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now().toString().slice(-4)}`,
      status: 'requested',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;
    orders[index].status = status;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[index];
  }

  // --- Products ---
  public getProducts(): Product[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  }

  // --- Offline Sync Queue ---
  private enqueueOfflineItem(type: 'growth_log' | 'feedback', payload: any) {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || '[]');
    queue.push({ id: `queue-${Date.now()}`, type, payload, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  }

  public getOfflineQueueCount(): number {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || '[]');
    return queue.length;
  }

  public flushOfflineQueue(): number {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || '[]');
    if (queue.length === 0) return 0;

    // Mark pending items as synced in storage
    const logs = this.getGrowthLogs();
    logs.forEach(l => { l.isOfflinePending = false; });
    localStorage.setItem(STORAGE_KEYS.GROWTH_LOGS, JSON.stringify(logs));

    const feedback = this.getFeedback();
    feedback.forEach(f => { f.isOfflinePending = false; });
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));

    const count = queue.length;
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
    return count;
  }

  // --- Reset to Initial Demo Data ---
  public resetToDemoData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PONDS, JSON.stringify(INITIAL_PONDS));
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
    localStorage.setItem(STORAGE_KEYS.GROWTH_LOGS, JSON.stringify(INITIAL_GROWTH_LOGS));
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(INITIAL_FEEDBACK));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
  }
}

export const storageService = new StorageService();
