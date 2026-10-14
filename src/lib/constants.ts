import { 
  Product, Coupon, Brand, 
  PaymentGatewayItem, DeliveryMethodItem, HeroBannerItem, PromoCardItem, 
  EcomSettings, InstituteInfo, FlashSaleSettings, HighlightSpotlightSettings 
} from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-vb5-repair-serum',
    title: 'VB5 Repair Serum',
    author: 'FANTINE Korea',
    regularPrice: 1800,
    price: 1550,
    discountPercentage: 14,
    stockQuantity: 100,
    category: 'Serums',
    series: 'Ultra Repair Series',
    coverImage: '/uploads/file-1791830876714-429462367.jpg',
    images: [
      '/uploads/file-1791830876714-429462367.jpg',
      '/uploads/file-1791830880605-206422960.jpeg',
      '/uploads/file-1791830885183-155996593.jpeg'
    ],
    additionalImages: [
      '/uploads/file-1791830880605-206422960.jpeg',
      '/uploads/file-1791830885183-155996593.jpeg'
    ],
    description: 'Provitamin B5 (D-Panthenol) intensive calming essence. Relieves itching, eliminates redness, and rapidly reinforces damaged skin barrier.',
    benefitsHighlights: 'High-purity Provitamin B5 • Deep cellular moisture lock • Barrier restoration • Zero irritation',
    howToUse: 'Dispense 2-3 drops after cleansing and toning. Pat gently over face and neck until fully absorbed.',
    badge: 'Best Seller',
    isFeatured: true
  },
  {
    id: 'prod-vc-brightening-serum',
    title: 'VC Brightening Serum',
    author: 'FANTINE Korea',
    regularPrice: 2200,
    price: 1350,
    discountPercentage: 39,
    stockQuantity: 100,
    category: 'Serums',
    series: 'Whitening and Brightening Series',
    coverImage: '/uploads/file-1791830762714-399075316.jpg',
    images: [
      '/uploads/file-1791830762714-399075316.jpg',
      '/uploads/file-1791830766725-465711461.jpeg',
      '/uploads/file-1791830769792-761661464.jpeg'
    ],
    additionalImages: [
      '/uploads/file-1791830766725-465711461.jpeg',
      '/uploads/file-1791830769792-761661464.jpeg'
    ],
    description: `Powerful antioxidant capacity with a high concentration of pure Vitamin C, delivering a true Vitamin C serum.

পণ্যের বিবরণ:
বিশুদ্ধ ভিটামিন সি-এর উচ্চ ঘনত্বের সমন্বয়ে গঠিত এই সিরামটি শক্তিশালী অ্যান্টি-অক্সিডেন্ট কার্যকারিতা প্রদান করে।`,
    benefitsHighlights: `Pure Vitamin C,
Stronger efficacy,
Greater stability,
Easier absorption.

⭐ Overall
• 🎯 Pigmentation/brightening: 8.5/10
• 🛡️ Antioxidant: 9.5/10
• 💧 Hydration: 7/10
• 🧴 Nourishment/barrier: 6/10
• ✨ Texture/pores: 7/10

প্রধান সুবিধাসমূহ:
বিশুদ্ধ ভিটামিন সি,
অধিক কার্যকারিতা,
উন্নত স্থায়িত্ব,
সহজ শোষণ ক্ষমতা।

⭐ সামগ্রিক মূল্যায়ন
🎯 পিগমেন্টেশন/উজ্জ্বলতা বৃদ্ধি: ৮.৫/১০
🛡️ অ্যান্টি-অক্সিডেন্ট: ৯.৫/১০
💧 আর্দ্রতা প্রদান (Hydration): ৭/১০
🧴 পুষ্টি/ত্বকের সুরক্ষা স্তর (Barrier): ৬/১০
✨ টেক্সচার/লোমকূপ: ৭/১০`,
    howToUse: `After cleansing in the morning and evening, use your fingertips to apply three pumps of serum to damp skin. Gently press the serum into the skin with your palms to enhance absorption.

ব্যবহারবিধি:
সকাল ও সন্ধ্যায় ত্বক পরিষ্কার করার পর, আঙুলের সাহায্যে তিন পাম্প পরিমাণ সিরাম ভেজা ত্বকে লাগান। সিরামটি ভালোভাবে শোষিত হতে সাহায্য করার জন্য হাতের তালু দিয়ে আলতোভাবে ত্বকে চেপে দিন।`,
    howToUseIt: `After cleansing in the morning and evening, use your fingertips to apply three pumps of serum to damp skin. Gently press the serum into the skin with your palms to enhance absorption.

ব্যবহারবিধি:
সকাল ও সন্ধ্যায় ত্বক পরিষ্কার করার পর, আঙুলের সাহায্যে তিন পাম্প পরিমাণ সিরাম ভেজা ত্বকে লাগান। সিরামটি ভালোভাবে শোষিত হতে সাহায্য করার জন্য হাতের তালু দিয়ে আলতোভাবে ত্বকে চেপে দিন।`,
    ingredients: `WATER, ETHOXYDIGLYCOL, ASCORBIC ACID, PROPANEDIOL, DIPROPYL-ENE GLYCOL, PEG-8, BETAINE, 1,2-HEXANE-DIOL, PANTHENOL, SODIUM HYDROXIDE, FERULIC ACID, HYDROXYACETOPHENONE, SALICYLIC ACID, XANTHAN GUM OTHER TRACE COMPONENTS: SODIUM HYALURONATE

উপাদানসমূহ: পানি, ইথোক্সিডাইগ্লাইকল, অ্যাসকরবিক অ্যাসিড, প্রোপেনডিওল, ডাইপ্রোপিলিন গ্লাইকল, পিইজি-৮ (PEG-8), বেটেইন, ১,২-হেক্সেনডিওল, প্যানথেনল, সোডিয়াম হাইড্রোক্সাইড, ফেরুলিক অ্যাসিড, হাইড্রোক্সিয়াসিটোফেনন, স্যালিসাইলিক অ্যাসিড, জ্যান্থান গাম। অন্যান্য অতি সামান্য উপাদান: সোডিয়াম হায়ালুরোনেট।`,
    badge: 'Popular',
    isFeatured: true
  },
  {
    id: 'prod-vb3-spot-lightening-essence',
    title: 'VB3 Spot-Lightening Essence',
    author: 'FANTINE Korea',
    regularPrice: 2100,
    price: 1500,
    discountPercentage: 29,
    stockQuantity: 100,
    category: 'Serums',
    series: 'Whitening and Brightening Series',
    coverImage: '/uploads/file-1791830989305-696330059.jpg',
    images: [
      '/uploads/file-1791830989305-696330059.jpg',
      '/uploads/file-1791830994106-62464748.jpeg',
      '/uploads/file-1791830999191-605068443.jpeg'
    ],
    additionalImages: [
      '/uploads/file-1791830994106-62464748.jpeg',
      '/uploads/file-1791830999191-605068443.jpeg'
    ],
    description: 'High-potency Vitamin B3 (Niacinamide) target solution. Eliminates stubborn post-acne dark marks and evens skin complexion.',
    benefitsHighlights: 'Niacinamide active formula • Dark spot correction • Pore refining • Non-sticky velvet finish',
    howToUse: 'Smooth evenly across face, focusing on areas with dark spots and discoloration.',
    badge: 'Trending',
    isFeatured: true
  },
  {
    id: 'prod-super-antioxidant-serum',
    title: 'Super Antioxidant Serum',
    author: 'FANTINE Korea',
    regularPrice: 2300,
    price: 1600,
    discountPercentage: 30,
    stockQuantity: 100,
    category: 'Serums',
    series: 'Ultra Repair Series',
    coverImage: '/uploads/file-1791831243256-923954313.jpg',
    images: [
      '/uploads/file-1791831243256-923954313.jpg',
      '/uploads/file-1791831246663-670212725.jpeg',
      '/uploads/file-1791831250379-772129356.jpeg'
    ],
    additionalImages: [
      '/uploads/file-1791831246663-670212725.jpeg',
      '/uploads/file-1791831250379-772129356.jpeg'
    ],
    description: 'Bio-botanical green tea & phyto-complex defending against urban pollution, reversing oxidative damage, and smoothing fine lines.',
    benefitsHighlights: 'Super antioxidant barrier • Reduces oxidative stress • Youthful firming elasticity • Eco-certified extracts',
    howToUse: 'Massage 2-3 drops into face and neck before heavier face creams.',
    badge: 'Antioxidant',
    isFeatured: true
  },
  {
    id: 'prod-ve-nourishing-serum',
    title: 'VE Nourishing Serum',
    author: 'FANTINE Korea',
    regularPrice: 1950,
    price: 1450,
    discountPercentage: 26,
    stockQuantity: 100,
    category: 'Serums',
    series: 'Deep Hydration Series',
    coverImage: '/uploads/file-1791830588893-187058483.jpg',
    images: [
      '/uploads/file-1791830588893-187058483.jpg',
      '/uploads/file-1791830593541-799200212.jpeg',
      '/uploads/file-1791830597458-464719743.jpeg'
    ],
    additionalImages: [
      '/uploads/file-1791830593541-799200212.jpeg',
      '/uploads/file-1791830597458-464719743.jpeg'
    ],
    description: 'Rich Vitamin E tocopherol concentrate restoring deep lipid hydration to severely dry, flaky, or weather-damaged skin.',
    benefitsHighlights: 'Intense lipid nourishment • Repairs flakiness • Soothing botanical oils • 48h moisture shield',
    howToUse: 'Gently warm 2 drops between palms and press onto face after serum step.',
    badge: 'Moisture Care',
    isFeatured: true
  },
  {
    id: 'prod-rapid-acne-treatment-essence',
    title: 'Rapid Acne Treatment Essence',
    author: 'FANTINE Korea',
    regularPrice: 3000,
    price: 2000,
    discountPercentage: 33,
    stockQuantity: 100,
    category: 'Rapid Acne Treatment Series',
    series: 'Rapid Acne Treatment Series',
    coverImage: '/uploads/file-1791826953559-621616270.jpg',
    images: [
      '/uploads/file-1791826953559-621616270.jpg',
      '/uploads/file-1791826958408-501895547.jpeg',
      '/uploads/file-1791826961577-101639256.jpeg'
    ],
    additionalImages: [
      '/uploads/file-1791826958408-501895547.jpeg',
      '/uploads/file-1791826961577-101639256.jpeg'
    ],
    description: 'Fast-action anti-inflammatory clarifying essence. Deeply clears congested pores, controls excess sebum, and prevents recurrent breakouts.',
    benefitsHighlights: 'Rapid blemish relief • Pores decongested • Oil balancing • Gentle botanical actives',
    howToUse: 'Apply to problem areas or all over face after cleansing.',
    badge: 'Acne Care',
    isFeatured: true
  },
  {
    id: 'prod-aha-exfoliating-essence',
    title: 'AHA Exfoliating Essence',
    author: 'FANTINE Korea',
    regularPrice: 3000,
    price: 2000,
    discountPercentage: 33,
    stockQuantity: 100,
    category: 'Toners',
    series: 'Rapid Acne Treatment Series',
    coverImage: '/uploads/file-1791822354692-346436357.jpg',
    images: [
      '/uploads/file-1791822354692-346436357.jpg',
      '/uploads/file-1791822359176-731563340.webp',
      '/uploads/file-1791822363053-980807663.webp'
    ],
    additionalImages: [
      '/uploads/file-1791822359176-731563340.webp',
      '/uploads/file-1791822363053-980807663.webp'
    ],
    description: 'Gentle fruit acid resurfacing elixir removing dead keratinized cells, smoothing rough texture, and unlocking clean radiant skin.',
    benefitsHighlights: 'Gentle AHA resurfacing • Dissolves dead skin cells • Unclogs comedones • Enhances absorption',
    howToUse: 'Use 2-3 nights per week with a cotton pad on cleansed skin. Follow with hydration.',
    badge: 'Exfoliation',
    isFeatured: true
  },
  {
    id: 'prod-retinol-anti-aging-serum',
    title: 'Retinol Anti-Aging Serum',
    author: 'FANTINE Korea',
    regularPrice: 3200,
    price: 2200,
    discountPercentage: 31,
    stockQuantity: 100,
    category: 'Serums',
    series: 'Ultra Repair Series',
    coverImage: '/uploads/file-1791827320010-515338106.jpg',
    images: [
      '/uploads/file-1791827320010-515338106.jpg',
      '/uploads/file-1791827334201-693066165.jpeg',
      '/uploads/file-1791827334452-792065672.jpeg'
    ],
    additionalImages: [
      '/uploads/file-1791827334201-693066165.jpeg',
      '/uploads/file-1791827334452-792065672.jpeg'
    ],
    description: 'Stabilized Retinol micro-capsules stimulating collagen synthesis, diminishing deep expression lines, and promoting cellular turnover.',
    benefitsHighlights: 'Micro-encapsulated Retinol • Anti-wrinkle firming • Boosts renewal • Safe nocturnal regimen',
    howToUse: 'Apply at night. Start 2 nights per week, gradually increasing frequency as skin adapts.',
    badge: 'Anti-Aging',
    isFeatured: true
  },
  {
    id: 'prod-collagen-elastic-essence',
    title: 'Collagen Elastic Essence',
    author: 'FANTINE Korea',
    regularPrice: 2500,
    price: 1800,
    discountPercentage: 28,
    stockQuantity: 100,
    category: 'Serums',
    series: 'Deep Hydration Series',
    coverImage: '/uploads/file-1791823814770-967689183.jpg',
    images: [
      '/uploads/file-1791823814770-967689183.jpg',
      '/uploads/file-1791823819604-611080923.jpeg',
      '/uploads/file-1791823819691-282589560.jpeg'
    ],
    additionalImages: [
      '/uploads/file-1791823819604-611080923.jpeg',
      '/uploads/file-1791823819691-282589560.jpeg'
    ],
    description: 'Hydrolyzed marine and botanical collagen peptides restoring bounce, plumpling fine dehydration lines, and imparting glass skin finish.',
    benefitsHighlights: 'Hydrolyzed collagen • Plumps skin firmness • Dewy finish • Non-comedogenic',
    howToUse: 'Apply generously to face and neck morning and evening before face cream.',
    badge: 'Elasticity',
    isFeatured: true
  }
];

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'DIS2000',
    title: '2000',
    discount: 2500,
    type: 'fixed',
    status: 'Active',
    visibility: 'Private',
    usageCount: 2,
    usageLimit: 10000,
    updatedAt: '16 days ago'
  },
  {
    id: 'cpn-2',
    code: 'TEST20',
    title: 'TEST20',
    discount: 780,
    type: 'fixed',
    status: 'Active',
    visibility: 'Private',
    usageCount: 1,
    usageLimit: 10,
    updatedAt: '2 months ago'
  },
  {
    id: 'cpn-3',
    code: 'TEST10',
    title: 'TEST10',
    discount: 1990,
    type: 'fixed',
    status: 'Active',
    visibility: 'Private',
    usageCount: 1,
    usageLimit: 100,
    updatedAt: '2 months ago'
  },
  {
    id: 'cpn-4',
    code: 'old790',
    title: 'mobile course',
    discount: 100,
    type: 'percentage',
    status: 'Active',
    visibility: 'Private',
    usageCount: 0,
    usageLimit: 10000,
    updatedAt: '2 months ago'
  }
];

export const DEFAULT_BRANDS: Brand[] = [];

export const DEFAULT_PAYMENT_GATEWAYS: PaymentGatewayItem[] = [
  {
    id: 'gw-1',
    title: 'Cash on Delivery',
    type: 'Cash on Delivery',
    status: 'Active',
    transactionFee: 0,
    discountAmount: 0,
    priority: 1,
    instruction: 'Pay with cash upon delivery of your order.',
    updatedAt: 'Jul 23, 2026',
    accountNumber: ''
  }
];

export const DEFAULT_DELIVERY_METHODS: DeliveryMethodItem[] = [
  {
    id: 'dm-1',
    title: 'Rakibul Hasan - (Inside Dhaka)',
    status: 'Inactive',
    mode: 'Fixed',
    type: 'Fixed',
    minimumCharge: 0,
    maximumCharge: 0,
    deliveryCharge: 60,
    updatedAt: 'Aug 4, 2026'
  },
  {
    id: 'dm-2',
    title: 'SteadFast - (Steadfast)',
    status: 'Inactive',
    mode: 'Fixed',
    type: 'Fixed',
    minimumCharge: 0,
    maximumCharge: 0,
    deliveryCharge: 80,
    updatedAt: 'Jul 23, 2026'
  },
  {
    id: 'dm-3',
    title: 'All bangladesh - (Outside Dhaka)',
    status: 'Active',
    mode: 'Fixed',
    type: 'Fixed',
    minimumCharge: 0,
    maximumCharge: 0,
    deliveryCharge: 110,
    updatedAt: 'Jul 23, 2026'
  }
];

export const DEFAULT_HERO_BANNERS: HeroBannerItem[] = [];

export const DEFAULT_PROMO_CARDS: PromoCardItem[] = [
  {
    id: 'promo-1',
    title: 'PREDATOR HELIOS NEO 16',
    badge: 'PREDATOR',
    subtitle: 'POWER. PRECISION. PREDATOR.',
    discountText: '3,20,000 BDT',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'promo-2',
    title: 'MSI VECTOR A16 HX',
    badge: 'MSI EDITION',
    subtitle: 'POWER. PRECISION. VICTORY.',
    discountText: '2,59,999 BDT',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_ABOUT_SETTINGS: import('../types').AboutPageSettings = {
  title: 'about us',
  subtitle: 'প্রিমিয়াম স্কিনকেয়ার And কোরিয়ান ডার্মাটোলজি এক্সিলেন্স',
  content: `FANTINE-এ আমরা বিশ্বাস করি ত্বকের যত্ন কেবল বাহ্যিক সৌন্দর্য নয়, বরং আত্মবিশ্বাস ও সুস্থতার একT অংশ।

আমরা সরাসরি দক্ষিণ কোরিয়ার আধুনিক ল্যাবরেটরি from সংগৃহীত প্রিমিয়াম হ্যানবাং হার্বাল ফর্মুলেশন ও ক্লিনিক্যাল স্কিনকেয়ার উপাদান সরবরাহ করি। আমাদের প্রতিT প্Roডাক্ট 10০% আসল, ল্যাব-টেস্টেড And নিরাপদ।

আমাদের লক্ষ্য হলো Bangladeshের প্রতিT customerের কাছে সেরা মানের আন্তর্জাতিক স্কিনকেয়ার product সহজলভ্য And নির্ভরযোগ্যভাবে পৌঁছে দেওয়া।`,
  image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600&auto=format&fit=crop&q=85',
  badge: 'CLINICAL K-BEAUTY & BOTANICAL SCIENCE',
  heroTitle: 'The Heritage of Clinical Hanbang & Dermal Science',
  heroSubtitle: 'Forged in Seoul by Brandini Co., Ltd., FANTINE harmonizes centuries-old Korean herbal remedies with cutting-edge active bio-fermentation.',
  heroImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600&auto=format&fit=crop&q=85',
  storyBadge: 'PHILOSOPHY & LEGACY',
  storyTitle: 'Clinical Botanical Purity with Proven Results',
  storySubtitle: 'From Gangnam Research Labs to Global Beauty Aficionados',
  storyParagraph1: 'FANTINE was born out of a profound commitment to restorative dermal health. By fusing high-potency Hanbang botanicals—such as 6-year aged Korean Red Ginseng, Fermented Rice Bran, Camellia Sinensis, and Centella Asiatica—with clinical actives like Niacinamide, Stabilized Vitamin C, and 5-Multi Ceramides, we deliver formulas that deeply replenish without compromising sensitive skin barriers.',
  storyParagraph2: 'Our dedicated laboratories in Seoul adhere to the strictest dermatological standards, ensuring micro-molecular absorption, continuous 72-hour moisture lock, and noticeable clinical fading of hyperpigmentation in 28 days.',
  storyParagraph3: 'Every formulation is 100% cruelty-free, paraben-free, dermatologist-tested, and certified under Korean KFDA clean beauty standards.',
  storyImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&auto=format&fit=crop&q=85',
  pillarsTitle: 'Our Four Pillars of Dermal Excellence',
  pillarsSubtitle: 'Bridging timeless Korean wellness traditions with cutting-edge dermatology',
  pillars: [
    {
      id: 'p1',
      badge: 'HERITAGE',
      title: 'Hanbang Herbal Synergy',
      description: 'Authentic Korean herbal medicine principles blended for cellular vitality, barrier defense, and deep radiant clarity.',
      icon: 'Sprout'
    },
    {
      id: 'p2',
      badge: 'BIOTECH',
      title: 'Micro Bio-Fermentation',
      description: 'Micro-molecular cold fermentation allowing active nutrients to penetrate up to 10 dermal layers deep effortlessly.',
      icon: 'FlaskConical'
    },
    {
      id: 'p3',
      badge: 'CLEAN DERMA',
      title: 'EWG Green & Cruelty-Free',
      description: 'Dermatologist-formulated with zero harsh parabens, artificial fragrances, or sulfates. Safe for the most sensitive skin.',
      icon: 'ShieldCheck'
    },
    {
      id: 'p4',
      badge: 'RESTORATION',
      title: '5-Tier Barrier Defense',
      description: 'Multi-molecular ceramides and phytosphingosine engineered to lock in deep hydration for 72 hours continuously.',
      icon: 'Layers'
    }
  ],
  hqTitle: 'Brandini Co., Ltd. Seoul Headquarters',
  hqSubtitle: 'Global R&D Center & Innovation Hub',
  hqAddress: '9F, Gangnamjeil Bldg, 109, Teheran-ro, Gangnam-gu, Seoul, Republic of Korea',
  hqImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=85',
  missionStatement: 'We sincerely hope we can relieve your tensions and stresses, and give you a healthier and more peaceful life.',
  founderQuote: 'True skin radiance is not an overnight illusion, but a harmonious balance between natural botanical resilience and scientific dermal precision.',
  founderName: 'FANTINE Dermal Research Institute',
  founderTitle: 'Clinical Formulation & Botanical Science Division',
  founderImage: 'https://images.unsplash.com/photo-1594824813589-980f745e69e8?w=800&auto=format&fit=crop&q=85',
  stats: [
    { id: 's1', value: '28 Days', label: 'Skin Renewal Cycle' },
    { id: 's2', value: '100%', label: 'K-Clean Certified' },
    { id: 's3', value: '5-Tier', label: 'Ceramide Barrier Defense' },
    { id: 's4', value: '15+', label: 'Herbal Bio-Actives' }
  ]
};

export const DEFAULT_FLASH_SALE_SETTINGS: FlashSaleSettings = {
  enabled: true,
  productId: '',
  badgeTag: 'BRIGHTENING AND WHITENING SERIES',
  title: 'FANTINE Whitening and Brightening Series',
  subtitle: 'Instantly brightens and revitalizes the skin with just one application. Infused with six powerful botanical whitening extracts for a rosy and radiant complexion.',
  customImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1000&auto=format&fit=crop&q=90',
  flashPrice: 1250,
  originalPrice: 1850,
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  buttonText: 'SHOP NOW',
  showVideoSection: true,
  videoTitle: 'Clinical Hanbang Formulation & Daily Application Ritual',
  videoSubtitle: 'Watch how our Korean active formula penetrates deeply to soothe inflammation, rebuild the skin barrier, and restore glass-skin radiance.',
  videoType: 'file',
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dropper-dropping-oil-into-a-glass-jar-42790-large.mp4'
};

export const DEFAULT_HIGHLIGHT_SPOTLIGHT_SETTINGS: HighlightSpotlightSettings = {
  enabled: true,
  targetType: 'product',
  productId: '',
  categoryName: '',
  badgeTag: '',
  title: '',
  subtitle: '',
  customImage: '',
  buttonText: 'BUY NOW',
  buttonLink: ''
};

export const DEFAULT_ECOM_SETTINGS: EcomSettings = {
  storeName: 'F A И T I И E',
  companyName: 'Brandini Co., Ltd.',
  storeLogo: '/logo_transparent.webp',
  storeTagline: 'Brandini Co., Ltd. • Seoul, Republic of Korea. Clinical Hanbang Skincare & Botanical Whitening Solutions.',
  topAnnouncementText: 'WELCOME TO BRANDINI CO.,LTD',
  contactEmail: 'FANTINE@BRANDINI.CO.KR',
  contactPhone: '+82 (02) 884-9021',
  storeAddress: '9F, Gangnamjeil Bldg, 109, Teheran-ro, Gangnam-gu, Seoul, Republic of Korea',
  footerDescription: 'Brandini Co., Ltd. • Seoul, Republic of Korea. Clinical Hanbang Skincare & Botanical Whitening Solutions.',
  socialLinks: {
    facebook: '',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    twitter: 'https://twitter.com',
    tiktok: 'https://tiktok.com',
    linkedin: 'https://linkedin.com',
    whatsapp: '+82 (02) 884-9021'
  },
  primaryColor: '#93c5fd',
  gtmId: '',
  deliveryChargeInsideDhaka: 0,
  deliveryChargeOutsideDhaka: 0,
  bkashNumber: '',
  nagadNumber: '',
  paymentGateways: DEFAULT_PAYMENT_GATEWAYS,
  deliveryMethods: DEFAULT_DELIVERY_METHODS,
  categories: ['Cleansers', 'Toners', 'Serums', 'Creams', 'Sets', 'Sun Care'],
  heroBanners: [],
  promoCards: DEFAULT_PROMO_CARDS,
  showViewCountOnWebsite: true,
  websiteViewsCount: 14200,
  landingViewsCount: 8900,
  aboutSettings: DEFAULT_ABOUT_SETTINGS,
  flashSale: DEFAULT_FLASH_SALE_SETTINGS,
  highlightSpotlight: DEFAULT_HIGHLIGHT_SPOTLIGHT_SETTINGS
};

export const DEFAULT_INSTITUTE_INFO: InstituteInfo = {
  name: 'Brandini Co., Ltd.',
  logo: '/logo_transparent.webp',
  regNo: '',
  phone: '+82 (02) 884-9021',
  email: 'FANTINE@BRANDINI.CO.KR',
  address: '9F, Gangnamjeil Bldg, 109, Teheran-ro, Gangnam-gu, Seoul, Republic of Korea',
  street: '109, Teheran-ro, Gangnam-gu, Seoul, Korea',
  description: 'Brandini Co., Ltd. • Seoul, Republic of Korea. Clinical Hanbang Skincare & Botanical Whitening Solutions.',
  industry: 'Cosmetics & Skincare',
  bearingRollLocation: 'Seoul'
};

export const DEFAULT_LANDING_PAGE_SETTINGS: import('../types').LandingPageData = {
  id: 'landing-default',
  slug: 'vb5-repair-serum',
  templateTheme: 'luxury_dark',
  bookTitle: 'FAИTIИE VB5 REPAIR SERUM',
  bookSubtitle: 'Provitamin B5 (D-Panthenol) Intensive Calming Essence',
  authorName: 'FANTINE Korea (Brandini Co., Ltd.)',
  authorDesignation: 'Dermatologically Tested • 100% Authentic Korean Hanbang Formulation',
  authorPhoto: '/uploads/file-1791830876714-429462367.jpg',
  mainBookImage: '/uploads/file-1791830876714-429462367.jpg',
  heroBookImage: '/uploads/file-1791830876714-429462367.jpg',
  logoUrl: '/logo_transparent.webp',
  pageCount: '30ml Full Size',
  paperQuality: 'Korea FDA Certified',
  regularPrice: 1800,
  offerPrice: 1550,
  deliveryCharge: 0,
  deliveryChargeOutside: 0,
  deliveryAreaInsideText: 'ঢাকার ভিতরে ফ্রি ডেলিভারি',
  deliveryAreaOutsideText: 'ঢাকার বাইরে ফ্রি ডেলিভারি',
  bannerDeliveryText: 'অরিজিনাল কোরিয়ান স্কিনকেয়ার — ফ্রি হোম ডেলিভারি ও চেক করে পেমেন্ট',
  heroHeadline: 'FAИTIИE VB5 REPAIR SERUM — সংবেদনশীল ও ক্ষতিগ্রস্ত ত্বকের জাদুকরী সমাধান',
  heroDescription: 'উচ্চ ঘনত্বের প্রো-ভিটামিন বি৫ (ডি-প্যান্থেনল) ও কোরিয়ান ভেষজ হানবাং ফর্মুলা। ত্বকের চুলকানি, লালচে ভাব ও র‍্যাশ দূর করে স্কিন ব্যারিয়ারকে করে তোলে শক্তিশালী ও উজ্জ্বল।',
  videoUrl: '',
  campaignBadgeText: 'স্পেশাল ডিসকাউন্ট অফার',
  campaignBannerTitle: 'আজই অর্ডার করুন এবং সম্পূর্ণ ক্যাশ অন ডেলিভারিতে আসল কোরিয়ান স্কিনকেয়ার বুঝে নিন!',
  campaignCouponNote: 'পার্সেল রিসিভ করার সময় পণ্য চেক করে মূল্য পরিশোধের সুযোগ',
  campaignTickerText: '১০০% অরিজিনাল কোরিয়ান প্রোডাক্ট • সারাদেশে ক্যাশ অন ডেলিভারি',
  prizes: [
    { rank: 'গ্যারান্টি', title: '১০০% অরিজিনাল কোরিয়ান ফর্মুলেশন' }
  ],
  variantSectionTitle: 'আপনার পছন্দের প্যাকেজ বেছে নিন',
  variantSectionSubtitle: 'একক বোতল অথবা কম্বো সেটে আকর্ষণীয় সাশ্রয়ী অফার',
  customVariants: [
    {
      id: 'var-single',
      name: 'VB5 Repair Serum — ১ বোতল (৩০ মিলি)',
      image: '/uploads/file-1791830876714-429462367.jpg',
      price: 1550,
      regularPrice: 1800,
      tag: 'Best seller'
    },
    {
      id: 'var-duo',
      name: 'VB5 Repair Serum — ২ বোতল কম্বো প্যাক',
      image: '/uploads/file-1791830880605-206422960.jpeg',
      price: 2900,
      regularPrice: 3600,
      tag: 'Save Tk.700'
    }
  ],
  watchSpecs: [
    { label: 'ফর্মুলেশন', value: 'কোরিয়ান হানবাং বোটানিক্যাল এক্সট্র্যাক্ট' },
    { label: 'প্রধান উপাদান', value: 'প্রো-ভিটামিন বি৫ (ডি-প্যান্থেনল)' },
    { label: 'ত্বকের ধরন', value: 'সংবেদনশীল, শুষ্ক ও ব্রণপ্রবণ সব ত্বকে উপযোগী' },
    { label: 'কার্যকারিতা', value: 'ব্যারিয়ার রিপেয়ার ও ৪৮ ঘণ্টা ময়েশ্চার লক' },
    { label: 'সার্টিফিকেশন', value: 'ডার্মাটোলজিক্যালি টেস্টেড ও নিরাপদ' },
    { label: 'উৎপাদন', value: 'সিউল, দক্ষিণ কোরিয়া' }
  ],
  features: [
    '১০০% খাঁটি ও আসল কোরিয়ান হানবাং ফর্মুলেশন',
    'ত্বকের লালচে ভাব, চুলকানি ও অ্যালার্জি দ্রুত উপশম করে',
    'ক্ষতিগ্রস্ত স্কিন ব্যারিয়ারকে ভেতর থেকে পুনর্গঠন করে',
    'নন-স্টিকি ও দ্রুত ত্বকে শোষিত হওয়ার হালকা টেক্সচার',
    'পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য পরিশোধের সুবিধা'
  ],
  reviews: [
    { name: 'ফারহানা চৌধুরী', comment: 'সিরামটা ব্যবহার করে আমার ত্বকের রেডনেস একদম কমে গেছে। খুবই হালকা এবং দ্রুত স্কিনে মিশে যায়। ১০০% রেকমেন্ডেড!', rating: 5 },
    { name: 'নুসরাত জাহান', comment: 'অরিজিনাল কোরিয়ান প্রোডাক্ট পেয়ে খুবই সন্তুষ্ট। ডেলিভারিও খুব দ্রুত ছিল।', rating: 5 },
    { name: 'তাসনিম কবির', comment: 'আমার সেনসিটিভ স্কিনের জন্য একদম পারফেক্ট। কোনো জ্বালাপোড়া নেই, ত্বক একদম হাইড্রেটেড থাকে।', rating: 5 }
  ],
  relatedProductIds: [],
  galleryImages: [
    '/uploads/file-1791830876714-429462367.jpg',
    '/uploads/file-1791830880605-206422960.jpeg',
    '/uploads/file-1791830885183-155996593.jpeg'
  ],
  paymentMethodDefault: 'COD',
  onlyCashOnDelivery: true,
  vintageTag: 'কোরিয়ান বিউটি কেয়ার',
  vintageTitle: 'ঐতিহ্যবাহী সিউল হানবাং হারবাল রহস্য',
  vintageDescription: 'কোরিয়ান আধুনিক বিজ্ঞান ও হাজার বছরের ভেষজ ফর্মুলার অপূর্ব সমন্বয়ে তৈরি।',
  vintageFeatures: [
    { id: 'vf-1', title: 'ব্যারিয়ার রিস্টোরেশন', subtitle: 'ত্বকের প্রাকৃতিক সুরক্ষা কবচ', icon: 'ShieldCheck' },
    { id: 'vf-2', title: 'গ্লাস স্কিন গ্লো', subtitle: 'প্রাকৃতিক উজ্জ্বলতা ও স্নিগ্ধতা', icon: 'Sparkles' },
    { id: 'vf-3', title: '৪৮ ঘণ্টা হাইড্রেশন', subtitle: 'গভীর থেকে আর্দ্রতা ধরে রাখে', icon: 'Zap' },
    { id: 'vf-4', title: 'সকল ত্বকে নিরাপদ', subtitle: 'কোনো ক্ষতিকর কেমিক্যাল নেই', icon: 'CheckCircle2' }
  ],
  gallerySectionTag: 'গ্যালারি',
  gallerySectionTitle: 'আসল কোরিয়ান কোয়ালিটি ও প্যাকেজিং',
  qualitySectionTag: 'কেন ফ্যান্টিন?',
  qualitySectionTitle: 'প্রিমিয়াম কোরিয়ান কোয়ালিটি, সাশ্রয়ী দাম',
  qualityItems: [
    { id: 'qi-1', title: 'ক্লিনিক্যালি পরীক্ষিত', subtitle: 'ল্যাবরেটরি গ্রেড বিশুদ্ধতা', icon: 'Settings' },
    { id: 'qi-2', title: 'আন্তর্জাতিক মান', subtitle: 'কোরিয়া সরকারের মাননিয়ন্ত্রণ সনদপ্রাপ্ত', icon: 'Trophy' }
  ],
  luckyDrawTag: 'স্পেশাল গ্যারান্টি',
  luckyDrawTitle: 'নিরাপদ শপিং নিশ্চয়তা',
  luckyDrawSteps: [
    'ওয়েবসাইটে আপনার নাম, ফোন ও ঠিকানা দিয়ে অর্ডার কনফার্ম করুন',
    'ডেলিভারি রাইডার আপনার বাসায় প্রোডাক্ট পৌঁছে দেবে',
    'পার্সেল খুলে প্রোডাক্ট দেখে নিশ্চিত হয়ে মূল্য পরিশোধ করুন'
  ],
  grandPrizeTitle: '১০০% অরিজিনাল গ্যারান্টি',
  grandPrizeSubtitle: 'প্রোডাক্ট অপছন্দ হলে তাৎক্ষণিক রিটার্নের সুবিধা',
  grandPrizeLiveTag: 'ORIGINAL CERTIFIED',
  colorSectionTag: 'প্যাকেজ সিলেকশন',
  colorSectionTitle: 'আপনার পছন্দের প্যাকেজ সিলেক্ট করে নিচে অর্ডার ফর্ম পূরণ করুন'
};

export const createDefaultLandingForProduct = (product: Product): import('../types').LandingPageData => {
  const slug = product.slug || product.id;
  const prodImg = product.coverImage || product.image || (product.images && product.images[0]) || '/uploads/file-1791830876714-429462367.jpg';
  const additionalImgs = product.additionalImages || product.images || [prodImg];
  
  return {
    id: `landing-${product.id}`,
    slug: slug,
    isEnabled: true,
    productId: product.id,
    productIds: [product.id],
    templateTheme: 'luxury_dark',
    relatedProductIds: [],
    bookTitle: product.title,
    bookSubtitle: product.subtitle || product.shortSummary || `${product.title} — 100% Authentic Korean Skincare`,
    authorName: product.authorName || product.author || 'FANTINE Korea',
    authorDesignation: '100% Original Korean Hanbang Formulation',
    authorPhoto: prodImg,
    mainBookImage: prodImg,
    heroBookImage: prodImg,
    logoUrl: '/logo_transparent.webp',
    regularPrice: product.regularPrice || Math.round(product.price * 1.3),
    offerPrice: product.price,
    deliveryCharge: 0,
    deliveryChargeOutside: 0,
    deliveryAreaInsideText: 'ঢাকার ভিতরে ফ্রি ডেলিভারি',
    deliveryAreaOutsideText: 'ঢাকার বাইরে ফ্রি ডেলিভারি',
    bannerDeliveryText: '১০০% অরিজিনাল কোরিয়ান স্কিনকেয়ার — ক্যাশ অন ডেলিভারি',
    heroHeadline: product.title,
    heroDescription: product.description || product.shortSummary || 'কোরিয়ান আধুনিক ল্যাবরেটরি টেস্টেড হানবাং ফর্মুলা। ত্বকের সুরক্ষা ও প্রাকৃতিক উজ্জ্বলতা নিশ্চিত করে।',
    videoUrl: product.pdfUrl || '',
    campaignBadgeText: 'স্পেশাল অফার',
    campaignBannerTitle: 'আজই অর্ডার করুন এবং ১০০% আসল কোরিয়ান প্রোডাক্ট বুঝে নিন!',
    campaignCouponNote: 'পার্সেল চেক করে সম্পূর্ণ মূল্য পরিশোধের সুবিধা',
    campaignTickerText: '১০০% অরিজিনাল কোরিয়ান স্কিনকেয়ার • ফ্রি ডেলিভারি সারাদেশে',
    prizes: [
      { rank: 'সার্টিফিকেশন', title: '100% Authentic Korean Product' }
    ],
    variantSectionTitle: 'আপনার পছন্দের প্যাকেজ বেছে নিন',
    variantSectionSubtitle: 'একক বোতল অথবা কম্বো সেটে আকর্ষণীয় সাশ্রয়ী অফার',
    customVariants: product.variants && product.variants.length > 0
      ? product.variants.map((v, i) => ({
          id: v.id || `var-${i}`,
          name: v.name,
          image: v.image || additionalImgs[i % additionalImgs.length] || prodImg,
          price: v.price || product.price,
          regularPrice: v.regularPrice || product.regularPrice,
          tag: i === 0 ? 'Best seller' : 'popular'
        }))
      : [
          {
            id: 'var-1',
            name: `${product.title} — ১টি রেগুলার প্যাক`,
            image: prodImg,
            price: product.price,
            regularPrice: product.regularPrice || Math.round(product.price * 1.3),
            tag: 'Best seller'
          },
          {
            id: 'var-2',
            name: `${product.title} — ২টি কম্বো প্যাক (সেভ Tk.৩০০)`,
            image: additionalImgs[1] || prodImg,
            price: Math.round(product.price * 2 - 300),
            regularPrice: Math.round((product.regularPrice || product.price) * 2),
            tag: 'Special Value'
          }
        ],
    features: product.features && product.features.length > 0
      ? product.features
      : [
          '১০০% খাঁটি ও আসল কোরিয়ান হানবাং ফর্মুলেশন',
          'ক্লিনিক্যালি পরীক্ষিত বোটানিক্যাল একটিভ উপাদান',
          'সংবেদনশীল ত্বকে শতভাগ নিরাপদ ও ডার্মাটোলজিস্ট এপ্রুভড',
          '৪৮ ঘণ্টা দীর্ঘস্থায়ী ময়েশ্চার লক ও উজ্জ্বলতা',
          'পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য পরিশোধের সুবিধা'
        ],
    reviews: [
      { name: 'ফারহানা চৌধুরী', comment: 'সিরামটা ব্যবহার করে আমার ত্বকের রেডনেস একদম কমে গেছে। খুবই হালকা এবং দ্রুত স্কিনে মিশে যায়। ১০০% রেকমেন্ডেড!', rating: 5 },
      { name: 'নুসরাত জাহান', comment: 'অরিজিনাল কোরিয়ান প্রোডাক্ট পেয়ে খুবই সন্তুষ্ট। ডেলিভারিও খুব দ্রুত ছিল।', rating: 5 }
    ],
    galleryImages: additionalImgs.length > 0 ? additionalImgs : [prodImg],
    paymentMethodDefault: 'COD',
    onlyCashOnDelivery: true
  };
};
