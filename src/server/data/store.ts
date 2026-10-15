import fs from 'fs';
import path from 'path';
import { Product, BookOrder, EcomSettings } from '../../types';

const PRODUCTS_STORAGE_FILE = path.join(process.cwd(), 'prisma', 'products.json');

// Authentic FANTINE Skincare Catalog with verified server uploads
export const INITIAL_REAL_PRODUCTS: Product[] = [
  {
    id: 'prod-vb5-repair-serum',
    title: 'VB5 Repair Serum',
    author: 'FANTINE Korea',
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
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
    description: `Intensive Provitamin B5 (D-Panthenol) and Centella Asiatica calming serum. Rapidly relieves skin redness, soothes allergic reactions, repairs weakened moisture barrier, and locks deep hydration into sensitized facial skin.

পণ্যের বিবরণ:
উচ্চ বিশুদ্ধতার প্রো-ভিটামিন বি৫ (ডি-প্যান্থেনল) ও সেন্টেলা সমৃদ্ধ ইনটেনসিভ রিপেয়ারিং সিরাম। এটি সংবেদনশীল ও ক্ষতিগ্রস্ত ত্বকের জ্বালাপোড়া ও লালচে ভাব তাৎক্ষণিকভাবে দূর করে, ত্বকের প্রাকৃতিক সুরক্ষা স্তর (Skin Barrier) মজবুত করে এবং দীর্ঘস্থায়ী আর্দ্রতা নিশ্চিত করে।`,
    benefitsHighlights: `Pure Provitamin B5 (D-Panthenol),
Rapid barrier repair & soothing,
Reduces irritation & redness,
Deep cellular moisture lock.

⭐ Overall
• 🎯 Barrier Restoration: 9.5/10
• 🛡️ Redness & Soothing: 9.8/10
• 💧 Deep Hydration: 9.0/10
• 🧴 Barrier Defense: 9.2/10
• ✨ Gentle Tolerance: 10/10

প্রধান সুবিধাসমূহ:
বিশুদ্ধ প্রো-ভিটামিন বি৫ (D-Panthenol),
ত্বকের ড্যামেজড ব্যারিয়ার দ্রুত মেরামত,
রেডনেস ও প্রদাহ উপশম,
গভীর আর্দ্রতা ধারণ ক্ষমতা।

⭐ সামগ্রিক মূল্যায়ন
🎯 ত্বক মেরামত / ব্যারিয়ার সুরক্ষা: ৯.৫/১০
🛡️ লালচে ভাব ও জ্বালাপোড়া দূর: ৯.৮/১০
💧 গভীর আর্দ্রতা (Hydration): ৯.০/১০
🧴 পুষ্টি ও ত্বকের ঢাল: ৯.২/১০
✨ সংবেদনশীল ত্বকে শতভাগ নিরাপদ: ১০/১০`,
    howToUse: `After cleansing and toning in the morning and evening, dispense 2-3 drops onto fingertips and gently pat over face and neck until fully absorbed. Follow with moisturizer.

ব্যবহারবিধি:
সকাল ও সন্ধ্যায় ত্বক পরিষ্কার ও টোনার ব্যবহারের পর, ২-৩ ফোঁটা সিরাম আঙুলে নিয়ে পুরো মুখ ও গলায় আলতোভাবে চেপে চেপে লাগিয়ে দিন। এরপর ময়েশ্চারাইজার ব্যবহার করুন।`,
    howToUseIt: `After cleansing and toning in the morning and evening, dispense 2-3 drops onto fingertips and gently pat over face and neck until fully absorbed. Follow with moisturizer.

ব্যবহারবিধি:
সকাল ও সন্ধ্যায় ত্বক পরিষ্কার ও টোনার ব্যবহারের পর, ২-৩ ফোঁটা সিরাম আঙুলে নিয়ে পুরো মুখ ও গলায় আলতোভাবে চেপে চেপে লাগিয়ে দিন। এরপর ময়েশ্চারাইজার ব্যবহার করুন।`,
    ingredients: `WATER, PANTHENOL (PROVITAMIN B5), GLYCERIN, BUTYLENE GLYCOL, MADECASSOSIDE, CENTELLA ASIATICA EXTRACT, SODIUM HYALURONATE, CERAMIDE NP, ALLANTOIN, BETA-GLUCAN, 1,2-HEXANEDIOL, ETHYLHEXYLGLYCERIN, CARBOMER, ARGININE.

উপাদানসমূহ: পানি, প্যান্থেনল (প্রো-ভিটামিন বি৫), গ্লিসারিন, বিউটিলিন গ্লাইকল, ম্যাডেক্যাসোসাইড, সেন্টেলা এশিয়াটিকা নির্যাস, সোডিয়াম হায়ালুরোনেট, সিরামাইড এনপি, অ্যালানটয়েন, বিটা-গ্লুকান, ১,২-হেক্সেনডিওল।`,
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
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
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
    description: `High-potency Vitamin B3 (Niacinamide) and Alpha-Arbutin spot-correcting essence. Actively targets stubborn post-acne dark marks, sun spots, and hyperpigmentation while balancing excess sebum and shrinking enlarged pores.

পণ্যের বিবরণ:
উচ্চ কার্যক্ষমতাসম্পন্ন ভিটামিন বি৩ (নিয়াসিনামাইড) এবং আলফা-আরবুটিন সমৃদ্ধ স্পট-লাইটেনিং এসেন্স। এটি ত্বকের জেদি কালো দাগ, মেছতা ও ব্রণের দাগ দূর করে ত্বকের স্বাভাবিক উজ্জ্বলতা ফিরিয়ে আনে এবং অতিরিক্ত তৈলাক্ততা দূর করে লোমকূপ সঙ্কুচিত করে।`,
    benefitsHighlights: `Targeted dark spot correction,
High-purity Niacinamide (Vitamin B3),
Pore tightening & oil control,
Evens skin tone & texture.

⭐ Overall
• 🎯 Spot Lightening / Melasma: 9.4/10
• 🛡️ Post-Acne Mark Fading: 9.5/10
• 💧 Hydration & Balance: 8.5/10
• 🧴 Sebum Regulation: 9.0/10
• ✨ Pore Refining: 9.2/10

প্রধান সুবিধাসমূহ:
কালো দাগ ও পিগমেন্টেশন হালকা করা,
উচ্চ বিশুদ্ধতার নিয়াসিনামাইড (ভিটামিন বি৩),
লোমকূপ সঙ্কোচন ও তেল নিয়ন্ত্রণ,
ত্বকের অসম রঙ দূর করে সমরূপ উজ্জ্বলতা।

⭐ সামগ্রিক মূল্যায়ন
🎯 দাগ হালকা ও মেছতা নিয়ন্ত্রণ: ৯.৪/১০
🛡️ ব্রণের দাগ দূরীকরণ: ৯.৫/১০
💧 আর্দ্রতা ও ত্বকের ভারসাম্য: ৮.৫/১০
🧴 সিবাম নিয়ন্ত্রণ: ৯.০/১০
✨ পোর মিনিমাইজিং: ৯.২/১০`,
    howToUse: `Apply 2-3 drops to cleansed skin morning and night, paying extra attention to hyperpigmented spots and uneven areas. Always follow with SPF during daytime.

ব্যবহারবিধি:
প্রতিদিন সকাল ও রাতে ত্বক পরিষ্কারের পর ২-৩ ফোঁটা এসেন্স সম্পূর্ণ মুখে বিশেষ করে দাগযুক্ত স্থানে আলতোভাবে ব্যবহার করুন। দিনের বেলা সানস্ক্রিন ব্যবহার করুন।`,
    howToUseIt: `Apply 2-3 drops to cleansed skin morning and night, paying extra attention to hyperpigmented spots and uneven areas. Always follow with SPF during daytime.

ব্যবহারবিধি:
প্রতিদিন সকাল ও রাতে ত্বক পরিষ্কারের পর ২-৩ ফোঁটা এসেন্স সম্পূর্ণ মুখে বিশেষ করে দাগযুক্ত স্থানে আলতোভাবে ব্যবহার করুন। দিনের বেলা সানস্ক্রিন ব্যবহার করুন।`,
    ingredients: `WATER, NIACINAMIDE (VITAMIN B3), BUTYLENE GLYCOL, GLYCERIN, ALPHA-ARBUTIN, TRANEXAMIC ACID, GLYCYRRHIZA GLABRA (LICORICE) ROOT EXTRACT, SODIUM HYALURONATE, ALLANTOIN, 1,2-HEXANEDIOL, HYDROXYETHYLCELLULOSE, ETHYLHEXYLGLYCERIN.

উপাদানসমূহ: পানি, নিয়াসিনামাইড (ভিটামিন বি৩), বিউটিলিন গ্লাইকল, গ্লিসারিন, আলফা-আরবুটিন, ট্রানেক্সামিক অ্যাসিড, যষ্টিমধু নির্যাস, সোডিয়াম হায়ালুরোনেট, অ্যালানটয়েন, ১,২-হেক্সেনডিওল।`,
    badge: 'Trending',
    isFeatured: true
  },
  {
    id: 'prod-super-antioxidant-serum',
    title: 'Super Antioxidant Serum',
    author: 'FANTINE Korea',
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
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
    description: `Ultimate multi-antioxidant defense serum. Combines Ferulic Acid, Astaxanthin, and Resveratrol to neutralize environmental free radicals, prevent premature cellular aging, eliminate dullness, and boost youthful radiance.

পণ্যের বিবরণ:
শক্তিশালী মাল্টি-অ্যান্টিঅক্সিডেন্ট ডিফেন্স সিরাম। এতে রয়েছে ফেরুলিক অ্যাসিড, অ্যাস্টাজ্যান্থিন ও রেসভেরাট্রল যা ক্ষতিকর পরিবেশ দূষণ ও ফ্রি-র‍্যাডিক্যাল থেকে ত্বককে রক্ষা করে, বয়সের ছাপ প্রতিরোধ করে এবং ত্বককে করে প্রাণবন্ত ও ঝলমলে।`,
    benefitsHighlights: `Multi-antioxidant synergy,
Neutralizes free radical damage,
Anti-photoaging defense,
Restores radiant vitality.

⭐ Overall
• 🎯 Antioxidant Protection: 9.8/10
• 🛡️ Anti-Pollution Defense: 9.5/10
• 💧 Hydration: 8.0/10
• 🧴 Cellular Firming: 8.8/10
• ✨ Radiant Glow: 9.2/10

প্রধান সুবিধাসমূহ:
শক্তিশালী মাল্টি-অ্যান্টিঅক্সিডেন্ট ফর্মুলা,
পরিবেশ দূষণ ও ফ্রি-র‍্যাডিক্যাল প্রতিরোধ,
ত্বকের অকাল বার্ধক্য রোধ,
উজ্জ্বল ও সতেজ ত্বকের দীপ্তি।

⭐ সামগ্রিক মূল্যায়ন
🎯 অ্যান্টিঅক্সিডেন্ট সুরক্ষা: ৯.৮/১০
🛡️ পরিবেশ দূষণ থেকে ঢাল: ৯.৫/১০
💧 আর্দ্রতা প্রদান: ৮.০/১০
🧴 ত্বকের টানটান ভাব: ৮.৮/১০
✨ উজ্জ্বল ও গ্লাস স্কিন গ্লো: ৯.২/১০`,
    howToUse: `Gently smooth 3 drops onto clean face and neck in the morning before sun exposure, and at evening to recharge depleted skin.

ব্যবহারবিধি:
প্রতিদিন সকালে রোদে যাওয়ার পূর্বে এবং রাতে ত্বক পরিষ্কার করে ৩ ফোঁটা সিরাম মুখ ও গলায় মেখে নিন।`,
    howToUseIt: `Gently smooth 3 drops onto clean face and neck in the morning before sun exposure, and at evening to recharge depleted skin.

ব্যবহারবিধি:
প্রতিদিন সকালে রোদে যাওয়ার পূর্বে এবং রাতে ত্বক পরিষ্কার করে ৩ ফোঁটা সিরাম মুখ ও গলায় মেখে নিন।`,
    ingredients: `WATER, PROPANEDIOL, GLYCERIN, FERULIC ACID, ASTAXANTHIN, RESVERATROL, CAMELLIA SINENSIS (GREEN TEA) LEAF EXTRACT, TOCOPHERYL ACETATE (VITAMIN E), SODIUM HYALURONATE, 1,2-HEXANEDIOL, POLYSORBATE 20, ETHYLHEXYLGLYCERIN.

উপাদানসমূহ: পানি, প্রোপেনডিওল, গ্লিসারিন, ফেরুলিক অ্যাসিড, অ্যাস্টাজ্যান্থিন, রেসভেরাট্রল, গ্রিন টি নির্যাস, ভিটামিন ই (টোকোফেরিল অ্যাসিটেট), সোডিয়াম হায়ালুরোনেট, ১,২-হেক্সেনডিওল।`,
    badge: 'Antioxidant',
    isFeatured: true
  },
  {
    id: 'prod-ve-nourishing-serum',
    title: 'VE Nourishing Serum',
    author: 'FANTINE Korea',
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
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
    description: `Lipid-rich Vitamin E (Tocopherol) and Botanical Squalane nourishing serum. Deeply comforts parched, peeling, or weather-damaged skin, replenishing natural intercellular lipids for 48-hour moisture barrier defense.

পণ্যের বিবরণ:
ভিটামিন ই (টোকোফেরল) ও বোটানিক্যাল স্কোয়ালেন সমৃদ্ধ গভীর পুষ্টিকর সিরাম। শুষ্ক, রুক্ষ ও ফেটে যাওয়া ত্বকে প্রয়োজনীয় লিপিড ফিরিয়ে দিয়ে ৪৮ ঘণ্টা পর্যন্ত তীব্র আর্দ্রতা বজায় রাখে এবং ত্বককে মাখনের মতো নরম ও কোমল করে।`,
    benefitsHighlights: `Pure Tocopherol (Vitamin E),
48-hour deep lipid hydration,
Relieves dry peeling & tight skin,
Restores natural softness.

⭐ Overall
• 🎯 Deep Moisture Lock: 9.7/10
• 🛡️ Flakiness Relief: 9.6/10
• 💧 Hydration Barrier: 9.5/10
• 🧴 Lipid Nourishment: 9.8/10
• ✨ Velvety Softness: 9.4/10

প্রধান সুবিধাসমূহ:
খাঁটি টোকোফেরল (ভিটামিন ই),
৪৮ ঘণ্টা গভীর লিপিড আর্দ্রতা,
ত্বকের খসখসে ভাব ও রুক্ষতা দূরীকরণ,
মখমলে মসৃণতা ফিরিয়ে আনা।

⭐ সামগ্রিক মূল্যায়ন
🎯 গভীর আর্দ্রতা লক: ৯.৭/১০
🛡️ শুষ্কতা ও খোসা ওঠা রোধ: ৯.৬/১০
💧 হাইড্রেশন ব্যারিয়ার: ৯.৫/১০
🧴 লিপিড পুষ্টি প্রদান: ৯.৮/১০
✨ মাখনের মতো কোমলতা: ৯.৪/১০`,
    howToUse: `Dispense 2-3 drops into palm, warm gently between hands, and press lightly onto cleansed skin morning and evening.

ব্যবহারবিধি:
সকাল ও রাতে ২-৩ ফোঁটা সিরাম হাতের তালুতে নিয়ে আলতোভাবে ঘষে উষ্ণ করে পুরো মুখে হালকা চাপে বসিয়ে দিন।`,
    howToUseIt: `Dispense 2-3 drops into palm, warm gently between hands, and press lightly onto cleansed skin morning and evening.

ব্যবহারবিধি:
সকাল ও রাতে ২-৩ ফোঁটা সিরাম হাতের তালুতে নিয়ে আলতোভাবে ঘষে উষ্ণ করে পুরো মুখে হালকা চাপে বসিয়ে দিন।`,
    ingredients: `WATER, GLYCERIN, TOCOPHERYL ACETATE (VITAMIN E), SQUALANE, SIMMONDSIA CHINENSIS (JOJOBA) SEED OIL, MACADAMIA TERNIFOLIA SEED OIL, SODIUM HYALURONATE, 1,2-HEXANEDIOL, CERAMIDE NP, HYDROXYACETOPHENONE.

উপাদানসমূহ: পানি, গ্লিসারিন, ভিটামিন ই (টোকোফেরিল অ্যাসিটেট), স্কোয়ালেন, জোজোবা অয়েল, ম্যাকাকাডামিয়া সিড অয়েল, সোডিয়াম হায়ালুরোনেট, সিরামাইড এনপি, ১,২-হেক্সেনডিওল।`,
    badge: 'Moisture Care',
    isFeatured: true
  },
  {
    id: 'prod-rapid-acne-treatment-essence',
    title: 'Rapid Acne Treatment Essence',
    author: 'FANTINE Korea',
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
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
    description: `Clinical rapid-action acne clarifying essence. Formulated with Salicylic Acid (BHA), Tea Tree, and Heartleaf to dissolve pore-clogging sebum, neutralize acne bacteria, relieve inflamed pimples, and prevent recurrent breakouts.

পণ্যের বিবরণ:
ক্লিনিক্যাল র‍্যাপিড একনে ট্রিটমেন্ট এসেন্স। স্যালিসাইলিক অ্যাসিড (BHA), টি-ট্রি ও হার্টলিফ এক্সট্র্যাক্টের সমন্বয়ে তৈরি, যা লোমকূপে জমে থাকা তেল ও জীবাণু পরিষ্কার করে সক্রিয় ব্রণ দ্রুত শুকিয়ে ফেলে এবং নতুন ব্রণ ওঠা রোধ করে।`,
    benefitsHighlights: `Fast-acting acne & pimple relief,
Unclogs congested pores & blackheads,
Regulates excess sebum production,
Calms inflamed breakouts without drying.

⭐ Overall
• 🎯 Active Acne Clearance: 9.6/10
• 🛡️ Pimple Redness Relief: 9.5/10
• 💧 Moisture Balance: 8.0/10
• 🧴 Sebum & Oil Control: 9.4/10
• ✨ Pore Unclogging: 9.5/10

প্রধান সুবিধাসমূহ:
সক্রিয় ব্রণ ও ফুসকুড়ি দ্রুত দূরীকরণ,
ব্ল্যাকহেডস ও পোরস পরিষ্কারকরণ,
অতিরিক্ত তেল ও সিবাম নিয়ন্ত্রণ,
ত্বক শুকিয়ে না ফেলে আরামদায়ক প্রশান্তি।

⭐ সামগ্রিক মূল্যায়ন
🎯 ব্রণ নির্মূল ক্ষমতা: ৯.৬/১০
🛡️ ব্রণের লালচে ভাব উপশম: ৯.৫/১০
💧 আর্দ্রতার ভারসাম্য: ৮.০/১০
🧴 সিবাম ও তেল নিয়ন্ত্রণ: ৯.৪/১০
✨ পোরস গভীর থেকে পরিচ্ছন্নতা: ৯.৫/১০`,
    howToUse: `Apply 2-3 drops to affected acne areas or all over face after cleansing at evening. Start every other night and gradually build up to daily use.

ব্যবহারবিধি:
প্রতিদিন রাতে ত্বক পরিষ্কারের পর ব্রণের স্থানে বা পুরো মুখে ২-৩ ফোঁটা এসেন্স আলতোভাবে লাগিয়ে দিন।`,
    howToUseIt: `Apply 2-3 drops to affected acne areas or all over face after cleansing at evening. Start every other night and gradually build up to daily use.

ব্যবহারবিধি:
প্রতিদিন রাতে ত্বক পরিষ্কারের পর ব্রণের স্থানে বা পুরো মুখে ২-৩ ফোঁটা এসেন্স আলতোভাবে লাগিয়ে দিন।`,
    ingredients: `WATER, BUTYLENE GLYCOL, SALICYLIC ACID (BHA), MELALEUCA ALTERNIFOLIA (TEA TREE) EXTRACT, HOUTTUYNIA CORDATA EXTRACT, ZINC PCA, CENTELLA ASIATICA EXTRACT, 1,2-HEXANEDIOL, ARGININE, ALLANTOIN, XANTHAN GUM.

উপাদানসমূহ: পানি, বিউটিলিন গ্লাইকল, স্যালিসাইলিক অ্যাসিড (BHA), টি-ট্রি নির্যাস, হার্টলিফ নির্যাস, জিংক পিসিএ, সেন্টেলা এশিয়াটিকা নির্যাস, ১,২-হেক্সেনডিওল, আরজিনিন।`,
    badge: 'Acne Care',
    isFeatured: true
  },
  {
    id: 'prod-aha-exfoliating-essence',
    title: 'AHA Exfoliating Essence',
    author: 'FANTINE Korea',
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
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
    description: `Gentle alpha-hydroxy fruit acid resurfacing elixir. Dissolves hardened keratinized dead cells, sweeps away dull crust, improves rough skin texture, and enhances the absorption of subsequent serums.

পণ্যের বিবরণ:
মৃদু এএইচএ (AHA) ফ্রুট অ্যাসিড সমৃদ্ধ এক্সফোলিয়েটিং এসেন্স। এটি ত্বকের উপরিভাগের মৃত কোষ দূর করে খসখসে ভাব কাটিয়ে ত্বককে করে কাঁচের মতো মসৃণ, ফ্রেশ ও উজ্জ্বল।`,
    benefitsHighlights: `Dissolves dull, dead skin cells,
Evens bumpy and rough texture,
Deep pore cleansing & smoothing,
Promotes glowing cellular renewal.

⭐ Overall
• 🎯 Dead Skin Exfoliation: 9.6/10
• 🛡️ Smooth Skin Texture: 9.5/10
• 💧 Hydration: 8.0/10
• 🧴 Glow & Radiance: 9.2/10
• ✨ Pore Cleansing: 9.3/10

প্রধান সুবিধাসমূহ:
মৃত কোষ দূর করে ত্বক পুনরুজ্জীবিত করা,
খসখসে ত্বক মসৃণ করা,
পোরস ভেতর থেকে গভীর পরিষ্কার,
উজ্জ্বল স্কিন টোন ও দীপ্তি।

⭐ সামগ্রিক মূল্যায়ন
🎯 ডেড সেল দূরীকরণ: ৯.৬/১০
🛡️ মসৃণ ও সমতল ত্বক: ৯.৫/১০
💧 আর্দ্রতা রক্ষা: ৮.০/১০
🧴 প্রাকৃতিক গ্লো: ৯.২/১০
✨ পোর ডিপ ক্লিনিং: ৯.৩/১০`,
    howToUse: `Use 2-3 nights per week on cleansed skin with a cotton pad. Avoid eye contour area. Do not rinse off. Follow with barrier serum or cream.

ব্যবহারবিধি:
সপ্তাহে ২-৩ রাত ত্বক পরিষ্কারের পর কটন প্যাডে নিয়ে মুখে আলতোভাবে ব্যবহার করুন। ধুয়ে ফেলার প্রয়োজন নেই। এরপর সিরাম বা ক্রিম ব্যবহার করুন।`,
    howToUseIt: `Use 2-3 nights per week on cleansed skin with a cotton pad. Avoid eye contour area. Do not rinse off. Follow with barrier serum or cream.

ব্যবহারবিধি:
সপ্তাহে ২-৩ রাত ত্বক পরিষ্কারের পর কটন প্যাডে নিয়ে মুখে আলতোভাবে ব্যবহার করুন। ধুয়ে ফেলার প্রয়োজন নেই। এরপর সিরাম বা ক্রিম ব্যবহার করুন।`,
    ingredients: `WATER, GLYCOLIC ACID (AHA), LACTIC ACID, PROPANEDIOL, POTASSIUM HYDROXIDE, PYRUS MALUS (APPLE) FRUIT EXTRACT, PANTHENOL, SODIUM HYALURONATE, 1,2-HEXANEDIOL, ETHYLHEXYLGLYCERIN.

উপাদানসমূহ: পানি, গ্লাইকোলিক অ্যাসিড (AHA), ল্যাকটিক অ্যাসিড, প্রোপেনডিওল, পটাশিয়াম হাইড্রোক্সাইড, আপেল নির্যাস, প্যানথেনল, সোডিয়াম হায়ালুরোনেট, ১,২-হেক্সেনডিওল।`,
    badge: 'Exfoliation',
    isFeatured: true
  },
  {
    id: 'prod-retinol-anti-aging-serum',
    title: 'Retinol Anti-Aging Serum',
    author: 'FANTINE Korea',
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
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
    description: `Micro-encapsulated pure Retinol and Bakuchiol nocturnal rejuvenating serum. Stimulates natural collagen synthesis, minimizes stubborn forehead lines, crow's feet, and smile lines while firming lax skin for a youthful contour.

পণ্যের বিবরণ:
মাইক্রো-এনক্যাপসুলেটেড রেটিনল ও বাকুচিওল সমৃদ্ধ অ্যান্টি-এজিং নাইট সিরাম। এটি ত্বকে নতুন কোলাজেন তৈরি করে বলিরেখা, ফাইন লাইনস এবং ঝুলে পড়া ত্বক টানটান করে বয়সের ছাপ দূর করে তারুণ্য ফিরিয়ে আনে।`,
    benefitsHighlights: `Encapsulated slow-release Retinol,
Diminishes fine lines & wrinkles,
Accelerates cellular turnover,
Improves dermal bounce & firmness.

⭐ Overall
• 🎯 Fine Line Reduction: 9.5/10
• 🛡️ Collagen Boosting: 9.6/10
• 💧 Hydration: 8.2/10
• 🧴 Firming & Tightening: 9.4/10
• ✨ Smooth Skin Renewal: 9.3/10

প্রধান সুবিধাসমূহ:
ধীর-শোষণকারী এনক্যাপসুলেটেড রেটিনল,
বলিরেখা ও বয়সের ছাপ দূরীকরণ,
ত্বকের কোলাজেন পুনর্গঠন,
ত্বক টানটান ও ইলাস্টিক করা।

⭐ সামগ্রিক মূল্যায়ন
🎯 বলিরেখা হ্রাস: ৯.৫/১০
🛡️ কোলাজেন বৃদ্ধি: ৯.৬/১০
💧 আর্দ্রতা বজায় রাখা: ৮.২/১০
🧴 টানটান ভাব ও দৃঢ়তা: ৯.৪/১০
✨ কোষ পুনর্জন্ম: ৯.৩/১০`,
    howToUse: `Apply 2-3 drops at night only onto cleansed skin. Begin using 2 nights per week, gradually increasing frequency. Always apply SPF sunscreen the following morning.

ব্যবহারবিধি:
শুধুমাত্র রাতে ত্বক পরিষ্কারের পর ২-৩ ফোঁটা ব্যবহার করুন। প্রথম সপ্তাহে ২ রাত দিয়ে শুরু করে ধীরে ধীরে ব্যবহার বাড়ান। পরদিন সকালে অবশ্যই সানস্ক্রিন ব্যবহার করুন।`,
    howToUseIt: `Apply 2-3 drops at night only onto cleansed skin. Begin using 2 nights per week, gradually increasing frequency. Always apply SPF sunscreen the following morning.

ব্যবহারবিধি:
শুধুমাত্র রাতে ত্বক পরিষ্কারের পর ২-৩ ফোঁটা ব্যবহার করুন। প্রথম সপ্তাহে ২ রাত দিয়ে শুরু করে ধীরে ধীরে ব্যবহার বাড়ান। পরদিন সকালে অবশ্যই সানস্ক্রিন ব্যবহার করুন।`,
    ingredients: `WATER, GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, RETINOL (MICRO-ENCAPSULATED), BAKUCHIOL, ADENOSINE, PALMITOYL TRIPEPTIDE-5, SODIUM HYALURONATE, TOCOPHEROL, 1,2-HEXANEDIOL, POLYSORBATE 20, ETHYLHEXYLGLYCERIN.

উপাদানসমূহ: পানি, গ্লিসারিন, রেটিনল (মাইক্রো-এনক্যাপসুলেটেড), বাকুচিওল, অ্যাডিনোসিন, পেপটাইড, সোডিয়াম হায়ালুরোনেট, ভিটামিন ই (টোকোফেরল), ১,২-হেক্সেনডিওল।`,
    badge: 'Anti-Aging',
    isFeatured: true
  },
  {
    id: 'prod-collagen-elastic-essence',
    title: 'Collagen Elastic Essence',
    author: 'FANTINE Korea',
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
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
    description: `Hydrolyzed marine and botanical collagen peptide lifting essence. Replenishes depleting dermal bounce, plumps dry expression lines, and imparts the coveted radiant Korean glass-skin finish.

পণ্যের বিবরণ:
হাইড্রোলাইজড মেরিন ও ভেষজ কোলাজেন পেপটাইড সমৃদ্ধ ইলাস্টিসিটি এসেন্স। এটি ত্বকের গভীরে হারিয়ে যাওয়া স্থিতিস্থাপকতা ফিরিয়ে দিয়ে ত্বককে ভরাট, টানটান ও আকর্ষণীয় কোরিয়ান গ্লাস-স্কিন আভা প্রদান করে।`,
    benefitsHighlights: `High-density Hydrolyzed Collagen,
Restores skin bounce & elasticity,
Deeply plumps fine dehydration lines,
Imparts dewy glass-skin glow.

⭐ Overall
• 🎯 Elasticity & Bounce: 9.7/10
• 🛡️ Plumping Effect: 9.5/10
• 💧 Glass-Skin Hydration: 9.4/10
• 🧴 Barrier Support: 9.0/10
• ✨ Smooth Radiance: 9.5/10

প্রধান সুবিধাসমূহ:
উচ্চ ঘনত্বের হাইড্রোলাইজড কোলাজেন,
ত্বকের স্থিতিস্থাপকতা ও বাউন্স বৃদ্ধি,
ফাইন লাইনস ভরাট করে মসৃণ করা,
কাঁচের মতো চকচকে গ্লাস-স্কিন ফিনিশ।

⭐ সামগ্রিক মূল্যায়ন
🎯 ইলাস্টিসিটি ও বাউন্স: ৯.৭/১০
🛡️ প্লাস্পিং ও ত্বক ভরাট: ৯.৫/১০
💧 গ্লাস-স্কিন হাইড্রেশন: ৯.৪/১০
🧴 ত্বকের সুরক্ষা: ৯.০/১০
✨ প্রাকৃতিক দীপ্তি ও গ্লো: ৯.৫/১০`,
    howToUse: `Apply 3 pumps generously onto cleansed face and neck morning and night before heavier face creams. Press into skin until fully absorbed.

ব্যবহারবিধি:
সকাল ও রাতে ত্বক পরিষ্কারের পর ৩ পাম্প পরিমাণ এসেন্স মুখ ও গলায় মেখে হাতের তালু দিয়ে আলতোভাবে চেপে মিলিয়ে দিন।`,
    howToUseIt: `Apply 3 pumps generously onto cleansed face and neck morning and night before heavier face creams. Press into skin until fully absorbed.

ব্যবহারবিধি:
সকাল ও রাতে ত্বক পরিষ্কারের পর ৩ পাম্প পরিমাণ এসেন্স মুখ ও গলায় মেখে হাতের তালু দিয়ে আলতোভাবে চেপে মিলিয়ে দিন।`,
    ingredients: `HYDROLYZED COLLAGEN EXTRACT, WATER, BUTYLENE GLYCOL, GLYCERIN, TREMELLA FUCIFORMIS (MUSHROOM) EXTRACT, POLYGLUTAMIC ACID, COPPER TRIPEPTIDE-1, SODIUM HYALURONATE, BETAINE, PANTHENOL, 1,2-HEXANEDIOL, ETHYLHEXYLGLYCERIN.

উপাদানসমূহ: হাইড্রোলাইজড কোলাজেন নির্যাস, পানি, বিউটিলিন গ্লাইকল, গ্লিসারিন, ট্রেমেল্লা মাশরুম নির্যাস, পলিগ্লুটামিক অ্যাসিড, কপার ট্রাইপেপটাইড-১, সোডিয়াম হায়ালুরোনেট, প্যানথেনল, ১,২-হেক্সেনডিওল।`,
    badge: 'Elasticity',
    isFeatured: true
  },
  {
    id: 'prod-botox-anti-wrinkle-essence',
    title: 'Botox Anti-Wrinkle Essence',
    author: 'FANTINE Korea',
    authorName: 'FANTINE Korea',
    brand: 'FANTINE',
    brandId: 'brand-fantine',
    regularPrice: 3200,
    price: 2200,
    discountPercentage: 31,
    stockQuantity: 100,
    category: 'Serums',
    series: 'Ultra Repair Series',
    coverImage: '/uploads/file-1791822783298-380226454.jpg',
    images: [
      '/uploads/file-1791822783298-380226454.jpg'
    ],
    additionalImages: [
      '/uploads/file-1791822783298-380226454.jpg'
    ],
    description: `Dual-signal peptide anti-wrinkle lifting essence. Stimulates natural collagen synthesis, relaxes fine facial expression lines, and visibly restores skin firmness and youthful elasticity.

পণ্যের বিবরণ:
ডুয়াল-সিগন্যাল পেপটাইড সমৃদ্ধ বোটক্স অ্যান্টি-রিঙ্কেল এসেন্স। এটি ত্বকের গভীরে কোলাজেন উৎপাদন বৃদ্ধি করে, বলিরেখা ও ফাইন লাইনস দূর করে ত্বককে টানটান, মসৃণ ও উজ্জ্বল করে তোলে।`,
    benefitsHighlights: `Dual-Signal Peptide Complex,
Botox-like expression line smoothing,
Enhanced dermal firmness,
Deep skin plumping & lifting.

⭐ Overall
• 🎯 Anti-Wrinkle / Firming: 9.5/10
• 🛡️ Lifting & Elasticity: 9.0/10
• 💧 Hydration: 8.0/10
• 🧴 Barrier & Nourishment: 8.5/10
• ✨ Smooth Texture: 9.0/10

প্রধান সুবিধাসমূহ:
ডুয়াল-সিগন্যাল পেপটাইড,
বলিরেখা হ্রাস ও মসৃণতা,
ত্বকের টানটান ভাব ও ইলাস্টিসিটি বৃদ্ধি,
গভীর আর্দ্রতা ও তারুণ্যোজ্জ্বল আভা।`,
    howToUse: `After cleansing and toning, dispense 2-3 pumps onto fingertips and gently massage into face and neck with upward lifting motions until fully absorbed.

ব্যবহারবিধি:
সকাল ও সন্ধ্যায় ত্বক পরিষ্কার ও টোনার ব্যবহারের পর, ২-৩ পাম্প এসেন্স আঙুলে নিয়ে নিচ থেকে উপরের দিকে আলতোভাবে ম্যাসাজ করে ত্বকে মিলিয়ে দিন।`,
    howToUseIt: `After cleansing and toning, dispense 2-3 pumps onto fingertips and gently massage into face and neck with upward lifting motions until fully absorbed.

ব্যবহারবিধি:
সকাল ও সন্ধ্যায় ত্বক পরিষ্কার ও টোনার ব্যবহারের পর, ২-৩ পাম্প এসেন্স আঙুলে নিয়ে নিচ থেকে উপরের দিকে আলতোভাবে ম্যাসাজ করে ত্বকে মিলিয়ে দিন।`,
    ingredients: `WATER, GLYCERIN, ACETYL HEXAPEPTIDE-8, PALMITOYL PENTAPEPTIDE-4, COPPER TRIPEPTIDE-1, NIACINAMIDE, ADENOSINE, SODIUM HYALURONATE, BUTYLENE GLYCOL, 1,2-HEXANEDIOL, BETAINE, PANTHENOL, ALLANTOIN, CARBOMER, ARGININE, ETHYLHEXYLGLYCERIN.

উপাদানসমূহ: পানি, গ্লিসারিন, অ্যাসিটাইল হেক্সাপেপটাইড-৮, পালমিটয়েল পেন্টাপেপটাইড-৪, কপার ট্রাইপেপটাইড-১, নিয়াসিনামাইড, অ্যাডিনোসিন, সোডিয়াম হায়ালুরোনেট, বিউটিলিন গ্লাইকল, ১,২-হেক্সেনডিওল, বেটেইন, প্যানথেনল, অ্যালানটয়েন।`,
    badge: 'Anti-Wrinkle',
    isFeatured: true
  }
];

// Load persisted products from disk or initialize with real catalog
function loadProductsFromDisk(): Product[] {
  let list: Product[] = [];
  try {
    if (fs.existsSync(PRODUCTS_STORAGE_FILE)) {
      const raw = fs.readFileSync(PRODUCTS_STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (err) {
    console.warn('[store] Could not load products from disk:', err);
  }

  if (list.length === 0) {
    list = [...INITIAL_REAL_PRODUCTS];
  } else {
    // Ensure all authentic default catalog products exist in the active catalog
    for (const initProd of INITIAL_REAL_PRODUCTS) {
      if (!list.some(p => p.id === initProd.id)) {
        list.push(initProd);
      }
    }
  }

  return list.map(p => {
    const initialMatch = INITIAL_REAL_PRODUCTS.find(init => init.id === p.id);
    const img = p.image || p.coverImage || (p.images && p.images[0]) || initialMatch?.image || '/uploads/file-1791830876714-429462367.jpg';
    const stockNum = typeof p.stock === 'number' ? p.stock : (typeof p.stockQuantity === 'number' ? p.stockQuantity : 100);
    return {
      ...p,
      description: (p.description && p.description.length > 200) ? p.description : (initialMatch?.description || p.description || ''),
      benefitsHighlights: (p.benefitsHighlights && p.benefitsHighlights.length > 150) ? p.benefitsHighlights : (initialMatch?.benefitsHighlights || p.benefitsHighlights || ''),
      howToUse: (p.howToUse && p.howToUse.length > 120) ? p.howToUse : (initialMatch?.howToUse || p.howToUse || (p as any).howToUseIt || ''),
      howToUseIt: (p.howToUse && p.howToUse.length > 120) ? p.howToUse : (initialMatch?.howToUseIt || p.howToUse || (p as any).howToUseIt || ''),
      ingredients: (p.ingredients && p.ingredients.length > 50) ? p.ingredients : (initialMatch?.ingredients || p.ingredients || ''),
      brand: p.brand || initialMatch?.brand || p.authorName || p.author || 'FANTINE Korea',
      brandId: p.brandId || initialMatch?.brandId || 'brand-fantine',
      image: img,
      coverImage: p.coverImage || img,
      stock: stockNum,
      stockQuantity: stockNum,
      isAvailable: p.isAvailable !== false,
      authorName: p.authorName || p.author || 'FANTINE Korea'
    };
  });
}

export function saveProductsToDisk(products: Product[]): void {
  try {
    const dir = path.dirname(PRODUCTS_STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRODUCTS_STORAGE_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('[store] Failed saving products to disk:', err);
  }
}

export let storeProducts: Product[] = loadProductsFromDisk();

// Persist normalized products to disk
saveProductsToDisk(storeProducts);

export const setStoreProducts = (newProducts: Product[]) => {
  storeProducts = newProducts;
  saveProductsToDisk(storeProducts);
  return storeProducts;
};

export let storeOrders: BookOrder[] = [];

const SETTINGS_STORAGE_FILE = path.join(process.cwd(), 'prisma', 'settings.json');

const DEFAULT_INITIAL_SETTINGS: EcomSettings = {
  storeName: 'FAИTIИE Korea (Brandini Co., Ltd.)',
  companyName: 'Brandini Co., Ltd.',
  storeLogo: '/logo_transparent.webp',
  storeTagline: 'Luxury Hanbang Skincare & Clinical Botanical Whitening Solutions',
  topAnnouncementText: 'WELCOME TO BRANDINI CO.,LTD',
  contactEmail: 'FANTINE@BRANDINI.CO.KR',
  contactPhone: '+82 (02) 884-9021',
  storeAddress: '9F, Gangnamjeil Bldg, 109, Teheran-ro, Gangnam-gu, Seoul, Republic of Korea',
  footerDescription: 'Brandini Co., Ltd. • Seoul, Republic of Korea. Clinical Hanbang Skincare & Botanical Whitening Solutions.',
  gtmId: '',
  deliveryChargeInsideDhaka: 0,
  deliveryChargeOutsideDhaka: 0,
  bkashNumber: '',
  nagadNumber: '',
  categories: [
    'Serums',
    'Ultra Repair Series',
    'Whitening and Brightening Series',
    'Rapid Acne Treatment Series',
    'Deep Hydration Series',
    'Toners',
    'Creams',
    'Cleansers',
    'Sets'
  ]
};

export function loadSettingsFromDisk(): EcomSettings {
  try {
    if (fs.existsSync(SETTINGS_STORAGE_FILE)) {
      const raw = fs.readFileSync(SETTINGS_STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_INITIAL_SETTINGS, ...parsed };
      }
    }
  } catch (err) {
    console.error('[store] Error reading settings from disk:', err);
  }
  return { ...DEFAULT_INITIAL_SETTINGS };
}

export function saveSettingsToDisk(settings: EcomSettings): void {
  try {
    const dir = path.dirname(SETTINGS_STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_STORAGE_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('[store] Failed saving settings to disk:', err);
  }
}

export let storeSettings: EcomSettings = loadSettingsFromDisk();
saveSettingsToDisk(storeSettings);

export const updateStoreSettings = (newSettings: Partial<EcomSettings>) => {
  storeSettings = { ...storeSettings, ...newSettings };
  saveSettingsToDisk(storeSettings);
  return storeSettings;
};

export const clearAllStoreData = () => {
  storeProducts = [...INITIAL_REAL_PRODUCTS];
  saveProductsToDisk(storeProducts);
  storeOrders = [];
  return { success: true };
};
