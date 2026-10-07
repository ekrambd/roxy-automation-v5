import { 
  Product, Coupon, Brand, 
  PaymentGatewayItem, DeliveryMethodItem, HeroBannerItem, PromoCardItem, 
  EcomSettings, InstituteInfo, FlashSaleSettings, HighlightSpotlightSettings 
} from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'fantine-cream',
    title: 'Ultimate Calming Solution Cream',
    author: 'FANTINE Laboratory',
    regularPrice: 24.99,
    price: 20.99,
    discountPercentage: 16,
    stockQuantity: 45,
    category: 'Creams',
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=85',
    description: 'Ultimate Calming Solution Face Cream with Aloe Vera, Centella Asiatica, and botanical Hanbang phyto-extracts. Soothes irritation and locks in 48h continuous hydration.',
    badge: 'Best Seller',
    isFeatured: true
  },
  {
    id: 'fantine-cleanser',
    title: 'Ultimate Calming Solution Face Cleanser',
    author: 'FANTINE Laboratory',
    regularPrice: 14.80,
    price: 12.18,
    discountPercentage: 18,
    stockQuantity: 60,
    category: 'Cleansers',
    coverImage: 'https://images.unsplash.com/photo-1556228722-d9b3be373b5f?w=800&auto=format&fit=crop&q=85',
    description: 'Mild micro-foam foaming cleanser with amino acids and calming tea tree extract. Gently melts impurities while preserving the delicate skin moisture barrier.',
    badge: 'Popular',
    isFeatured: true
  },
  {
    id: 'fantine-toner',
    title: 'Ultimate Calming Solution Toner',
    author: 'FANTINE Laboratory',
    regularPrice: 18.80,
    price: 16.68,
    discountPercentage: 11,
    stockQuantity: 50,
    category: 'Toners',
    coverImage: 'https://images.unsplash.com/photo-1608248597359-0098f98a329d?w=800&auto=format&fit=crop&q=85',
    description: 'Botanical essence toner balancing skin pH with green tea leaf infusion and 8-layer hyaluronic acid for instant dewy glass-skin glow.',
    badge: 'Trending',
    isFeatured: true
  },
  {
    id: 'fantine-essence',
    title: 'Ultimate Calming Solution Essence',
    author: 'FANTINE Laboratory',
    regularPrice: 22.50,
    price: 19.80,
    discountPercentage: 12,
    stockQuantity: 40,
    category: 'Serums',
    coverImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=85',
    description: 'Concentrated antioxidant pearl elixir infused with Korean Red Ginseng and fermented rice extract for cellular renewal and antioxidant barrier shield.',
    badge: 'Hanbang Care',
    isFeatured: true
  },
  {
    id: 'fantine-full-set',
    title: 'Ultimate 4-Piece Hanbang Calming & Brightening Ritual Set',
    author: 'FANTINE Laboratory',
    regularPrice: 84.99,
    price: 59.90,
    discountPercentage: 29,
    stockQuantity: 25,
    category: 'Sets',
    coverImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=85',
    description: 'Complete 4-Step Skincare Regimen: Face Cleanser + Balancing Toner + Radiant Essence + Soothing Cream in luxury gift box.',
    badge: 'Save 29%',
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
  storeLogo: '',
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
  slug: 'casio-ae-1200whl',
  templateTheme: 'luxury_dark',
  bookTitle: 'CASIO ROYALE AE-1200 CHAIN VERSION',
  bookSubtitle: 'CASIO AE-1200 Watch',
  authorName: 'CASIO AE-1200 Watch',
  authorDesignation: '10০% অরিজিনাল ও প্রিমিয়াম কোয়ালিT',
  authorPhoto: '/watch.jpg',
  mainBookImage: '/watch.jpg',
  heroBookImage: '/watch.jpg',
  logoUrl: '',
  pageCount: '10 Year Battery',
  paperQuality: '100M Water Resist',
  regularPrice: 1650,
  offerPrice: 999,
  deliveryCharge: 80,
  deliveryChargeOutside: 130,
  deliveryAreaInsideText: 'ঢাকার ভিতরে ডেলিভারি',
  deliveryAreaOutsideText: 'ঢাকার বাইরে ডেলিভারি',
  bannerDeliveryText: 'Lucky coupon to win Yamaha R15 on order.',
  heroHeadline: 'CASIO ROYALE AE-1200 CHAIN VERSION',
  heroDescription: 'World Time (48 Cities), LED Backlight, Stopwatch (1/100 sec), 5 Daily Alarms, 100M Water Resistance। সাথে প্রতি Lucky coupon to win Yamaha R15 on order.',
  videoUrl: '',
  campaignBadgeText: 'Yamaha R15 জিতুন',
  campaignBannerTitle: 'অর্ডার করলেই আপনি পেয়ে যাবেন একT কুপন কার্ড যার মাধ্যমে আপনিও ক্যাম্পেইনে যুক্ত হয়ে যেতে পারবেন!',
  campaignCouponNote: 'কুপনT অবশ্যই যত্ন সহকারে সংগ্রহ করে রাখবেন',
  campaignTickerText: 'Lucky coupon to win Yamaha R15 on order.',
  prizes: [
    { rank: 'গ্র্যান্ড প্রাইজ', title: 'Yamaha R15 V4' }
  ],
  variantSectionTitle: 'একই feeচার, তিনT ভিন্ন লুক',
  variantSectionSubtitle: 'বেছে নিন যেটা আপনার স্টাইলের সাথে মানায়',
  customVariants: [
    {
      id: 'var-silver',
      name: 'CASIO AE-1200WHL — সিলভার',
      image: '/watch.jpg',
      price: 950,
      regularPrice: 2500,
      tag: 'Best seller'
    },
    {
      id: 'var-black',
      name: 'CASIO AE-1200WHL — ব্ল্যাক',
      image: '/watch.jpg',
      price: 950,
      regularPrice: 2500,
      tag: 'popular'
    },
    {
      id: 'var-gold',
      name: 'CASIO AE-1200WHL — ভিন্টেজ গোল্ড',
      image: '/watch.jpg',
      price: 950,
      regularPrice: 2500,
      tag: 'এক্সক্লুসিভ'
    }
  ],
  watchSpecs: [
    { label: 'ব্যাটারি লাইফ', value: '10 বছর দীর্ঘস্থায়ী ব্যাটারি' },
    { label: 'ওয়াটার রেজিস্ট্যান্স', value: '10০ মিটার (10 Bar) ওয়াটারপ্রুফ' },
    { label: 'ওয়ার্ল্ড টাইম', value: '৪৮T শহর ও ৪T টাইম জোন' },
    { label: 'অ্যালার্ম', value: '৫T ডেইলি অ্যালার্ম সিস্টেম' },
    { label: 'ডিসপ্লে লাইট', value: 'এলইডি লাইট উইথ আফটারগ্লো' },
    { label: 'স্টপওয়াচ ও টাইমার', value: '১/10০ সেকেন্ড প্রিসিশন টাইমার' }
  ],
  features: [
    '10 বছরের ব্যাটারি লাইফ (Long Battery Life)',
    '10০ মিটার ওয়াটার রেজিস্ট্যান্ট (100m Water Resist)',
    'ওয়ার্ল্ড টাইম (৪৮T শহরের সময় ও ৪T টাইম জোন)',
    '৫T ডেইলি অ্যালার্ম ও ঘণ্টা ভিত্তিক সিগন্যাল',
    'এলইডি ব্যাকলাইট ও আফটারগ্লো সুবিধা',
    'ডিজিটাল ও অ্যানালগ এলসিডি ডুয়াল ডিসপ্লে'
  ],
  reviews: [
    { name: 'তানভীর আহমেদ', comment: 'watchT হাতে পাওয়ার পর সত্যি মুগ্ধ হয়েছি। কোয়ালিT ও feeনিশিং অgeneral! কুপন কার্ড পেয়েছি।', rating: 5 },
    { name: 'রাকিব হাসান', comment: 'সিলভার কালারটা নিয়েছি, দেখতে অনেক প্রিমিয়াম লাগে। সময়মতো ডেলিভারি পেয়েছি।', rating: 5 },
    { name: 'মাহমুদুল হক', comment: 'অরিজিনাল লুক And চমৎকার Packaging। 10০% রেকমেন্ডেড!', rating: 5 }
  ],
  relatedProductIds: [],
  galleryImages: [],
  paymentMethodDefault: 'COD',
  onlyCashOnDelivery: true,
  vintageTag: 'For vintage lovers',
  vintageTitle: 'Whose eyes still get stuck on the clocks of yesteryear',
  vintageDescription: 'স্মارتওয়াচের ভিড়ে হারিয়ে যাওয়া আসল সময়ের স্বাদ — এই ক্লাসিক ডিজাইন তাদেরই জন্য।',
  vintageFeatures: [
    { id: 'vf-1', title: 'Classic Dial', subtitle: '40s-90s original look', icon: 'Clock' },
    { id: 'vf-2', title: 'Durable metal body', subtitle: 'Can be used for years', icon: 'Wrench' },
    { id: 'vf-3', title: 'Retro LED backlight', subtitle: 'Brings back old memories', icon: 'Zap' },
    { id: 'vf-4', title: 'Fits all clothes', subtitle: 'Formal or casual', icon: 'Shirt' }
  ],
  gallerySectionTag: 'Gallery',
  gallerySectionTitle: 'Premium from every angle',
  qualitySectionTag: 'Why this watch?',
  qualitySectionTitle: 'Japanese quality, amazing price',
  qualityItems: [
    { id: 'qi-1', title: 'Precise timing', subtitle: 'Original movement design', icon: 'Settings' },
    { id: 'qi-2', title: 'Premium look', subtitle: 'Classic design on metal band', icon: 'Trophy' }
  ],
  luckyDrawTag: 'R15 lucky draw',
  luckyDrawTitle: 'Order, win R15',
  luckyDrawSteps: [
    'Order watch — receive unique lucky coupon code with parcel',
    'Keep the coupon code safe',
    'Winners will be selected by lottery next month',
    'The result will be announced live on Facebook Live'
  ],
  grandPrizeTitle: 'Yamaha R15',
  grandPrizeSubtitle: 'Every order = a new opportunity',
  grandPrizeLiveTag: 'FACEBOOK LIVE STREAM',
  colorSectionTag: 'Color selection',
  colorSectionTitle: 'Click on the color button below to preview the watch and order'
};

export const createDefaultLandingForProduct = (product: Product): import('../types').LandingPageData => {
  const slug = product.slug || product.id;
  
  return {
    id: `landing-${product.id}`,
    slug: slug,
    isEnabled: true,
    productId: product.id,
    productIds: [product.id],
    templateTheme: 'luxury_dark',
    relatedProductIds: [],
    bookTitle: product.title || 'একT watch অর্ডার করলেই Toyota Premio সহ ২T বাইক জেতার সুযোগ',
    bookSubtitle: product.subtitle || product.shortSummary || product.title,
    authorName: product.authorName || product.title,
    authorDesignation: '10০% অরিজিনাল ও প্রিমিয়াম কোয়ালিT',
    authorPhoto: product.image || '',
    mainBookImage: product.image || '',
    heroBookImage: product.image || '',
    logoUrl: product.image || '',
    regularPrice: product.regularPrice || Math.round(product.price * 1.5) || 2500,
    offerPrice: product.price || 950,
    deliveryCharge: 80,
    deliveryChargeOutside: 130,
    deliveryAreaInsideText: 'ঢাকার ভিতরে ডেলিভারি',
    deliveryAreaOutsideText: 'ঢাকার বাইরে ডেলিভারি',
    bannerDeliveryText: 'Lucky coupon to win Yamaha R15 on order.',
    heroHeadline: product.title || 'একT watch অর্ডার করলেই Yamaha R15 জেতার সুযোগ',
    heroDescription: product.description || product.shortSummary || 'প্রিমিয়াম কোয়ালিTর ঘড়ি অর্ডার করলেই আপনি পেয়ে যাচ্ছেন আকর্ষণীয় লাকি ড্র-তে অংশগ্রহণের সুযোগ। সাথে প্রতিT পার্সেল থাকছে একT Coupon code।',
    videoUrl: product.pdfUrl || '',
    campaignBadgeText: 'Yamaha R15 জিতুন',
    campaignBannerTitle: 'অর্ডার করলেই আপনি পেয়ে যাবেন একT কুপন কার্ড যার মাধ্যমে আপনিও ক্যাম্পেইনে যুক্ত হয়ে যেতে পারবেন!',
    campaignCouponNote: 'কুপনT অবশ্যই যত্ন সহকারে সংগ্রহ করে রাখবেন',
    campaignTickerText: 'Lucky coupon to win Yamaha R15 on order.',
    prizes: [
      { rank: '১ম পুরস্কার', title: 'Toyota Premio' },
      { rank: '২য় পুরস্কার', title: 'Yamaha R15 V4' },
      { rank: '৩য় পুরস্কার', title: 'Suzuki GSXR' }
    ],
    variantSectionTitle: 'একই feeচার, তিনT ভিন্ন লুক',
    variantSectionSubtitle: 'বেছে নিন যেটা আপনার স্টাইলের সাথে মানায়',
    customVariants: product.variants && product.variants.length > 0
      ? product.variants.map((v, i) => ({
          id: v.id || `var-${i}`,
          name: v.name,
          image: product.samplePages?.[i] || product.image || '',
          price: v.price || product.price,
          regularPrice: v.regularPrice || product.regularPrice,
          tag: i === 0 ? 'Best seller' : 'popular'
        }))
      : [
          {
            id: 'var-1',
            name: `${product.title} — সিলভার`,
            image: product.image || '',
            price: product.price,
            regularPrice: product.regularPrice || Math.round(product.price * 1.5),
            tag: 'Best seller'
          }
        ],
    features: product.features && product.features.length > 0
      ? product.features
      : [
          '10০% প্রিমিয়াম ও অরিজিনাল কোয়ালিT',
          '10 বছরের দীর্ঘস্থায়ী ব্যাটারি লাইফ',
          '10০ মিটার ওয়াটার রেজিস্ট্যান্স সুরক্ষা',
          'ওয়ার্ল্ড টাইম ও একাধিক অ্যালার্ম সিস্টেম',
          'product হাতে পেয়ে চেক করে সম্পূর্ণ price পরিশোধের সুবিধা'
        ],
    reviews: [
      { name: 'তানভীর আহমেদ', comment: 'watchT হাতে পাওয়ার পর সত্যি মুগ্ধ হয়েছি। কোয়ালিT ও feeনিশিং অgeneral!', rating: 5 },
      { name: 'রাকিব হাসান', comment: 'সিলভার কালারটা নিয়েছি, দেখতে অনেক প্রিমিয়াম লাগে। সময়মতো ডেলিভারি পেয়েছি।', rating: 5 }
    ],
    galleryImages: product.samplePages || [],
    paymentMethodDefault: 'COD',
    onlyCashOnDelivery: true
  };
};
