import { ReactNode } from "react";
import { apiService } from '@/services/apiService';

// Translation function type
type TranslationFunction = (key: string) => string;

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
};

export type FeaturedProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  discount?: number;
  images?: string[];
  specifications?: Record<string, string>;
  benefits?: string[];
};

// Helper function to get translated categories
export const getTranslatedCategories = (t: TranslationFunction): ProductCategory[] => [
  {
    id: "lab-grown-plants",
    name: t("lab-grown-plants"),
    description: t("lab-grown-plants-desc"),
    icon: "Sprout",
    image: "https://plus.unsplash.com/premium_photo-1679436184527-74af0573db60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxhYiUyMGdyb3duJTIwcGxhbnRzJTIwcGxhbnRpbmclMjBpbiUyMGZlaWxkc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "seeds",
    name: t("seeds"),
    description: t("seeds-desc"),
    icon: "Leaf",
    image: "https://media.istockphoto.com/id/1190855168/photo/young-woman-sowing-seeds-in-soil.webp?a=1&b=1&s=612x612&w=0&k=20&c=t_wtHjJmkLfuFa6NPdkbxUD6Rf-lfbYpniHGAORITO0="
  },
  {
    id: "fertilizers",
    name: t("fertilizers"),
    description: t("fertilizers-desc"),
    icon: "FlaskConical",
    image: "https://media.istockphoto.com/id/522391502/photo/farmer-spreading-fertilizer-in-the-field-wheat.webp?a=1&b=1&s=612x612&w=0&k=20&c=uAfPuR4JPwdlx-KADzSAVbEYeuPR8SkHXsCiXuyizAo="
  },
  {
    id: "pesticides",
    name: t("pesticides"),
    description: "Effective pest control solutions for healthier crops",
    icon: "Flower",
    image: "https://www.niehs.nih.gov/sites/default/files/health/assets/images/pesticides_og.jpg"
  },
  {
    id: "farming-tools",
    name: t("farming-tools"),
    description: t("farming-tools-desc"),
    icon: "Shovel",
    image: "https://media.istockphoto.com/id/1271469823/photo/gardening-tools-on-a-green-background-top-view-farming.jpg?s=612x612&w=0&k=20&c=UBrbD-SqT3O-jOnSd-wRiU0SdCgKC23ji8HyBb6GVME="
  },
  {
    id: "irrigation",
    name: t("irrigation"),
    description: t("irrigation-desc"),
    icon: "Leaf",
    image: "https://media.istockphoto.com/id/1146633438/photo/irrigation-system-watering-agricultural-field-with-young-plants-and-sprinkler-system.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ig2HJvkkAJ8ijC0N06wwKKdFTQRORFcDZoBcpahyw84="
  }
];

// Keep the original categories for fallback
export const categories: ProductCategory[] = [
  {
    id: "lab-grown-plants",
    name: "Lab Grown Plants",
    description: "High-yield, disease-resistant plants grown using advanced lab techniques",
    icon: "Sprout",
    image: "https://plus.unsplash.com/premium_photo-1679436184527-74af0573db60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxhYiUyMGdyb3duJTIwcGxhbnRzJTIwcGxhbnRpbmclMjBpbiUyMGZlaWxkc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "seeds",
    name: "Seeds",
    description: "Premium quality seeds with high germination rates for various crops",
    icon: "Leaf",
    image: "https://media.istockphoto.com/id/1190855168/photo/young-woman-sowing-seeds-in-soil.webp?a=1&b=1&s=612x612&w=0&k=20&c=t_wtHjJmkLfuFa6NPdkbxUD6Rf-lfbYpniHGAORITO0="
  },
  {
    id: "fertilizers",
    name: "Fertilizers",
    description: "Organic and chemical fertilizers for enhanced crop growth",
    icon: "FlaskConical",
    image: "https://media.istockphoto.com/id/522391502/photo/farmer-spreading-fertilizer-in-the-field-wheat.webp?a=1&b=1&s=612x612&w=0&k=20&c=uAfPuR4JPwdlx-KADzSAVbEYeuPR8SkHXsCiXuyizAo="
  },
  {
    id: "pesticides",
    name: "Pesticides",
    description: "Effective pest control solutions for healthier crops",
    icon: "Flower",
    image: "https://www.niehs.nih.gov/sites/default/files/health/assets/images/pesticides_og.jpg"
  },
  {
    id: "farming-tools",
    name: "Farming Tools",
    description: "Essential hand tools and equipment for efficient farming operations",
    icon: "Shovel",
    image: "https://media.istockphoto.com/id/1271469823/photo/gardening-tools-on-a-green-background-top-view-farming.jpg?s=612x612&w=0&k=20&c=UBrbD-SqT3O-jOnSd-wRiU0SdCgKC23ji8HyBb6GVME="
  },
  {
    id: "irrigation",
    name: "Irrigation",
    description: "Advanced irrigation systems for optimal water usage",
    icon: "Leaf",
    image: "https://media.istockphoto.com/id/1146633438/photo/irrigation-system-watering-agricultural-field-with-young-plants-and-sprinkler-system.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ig2HJvkkAJ8ijC0N06wwKKdFTQRORFcDZoBcpahyw84="
  }
];

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "featured-1",
    categoryId: "lab-grown-plants",
    name: "High-Yield Rice Seedling",
    description: "Lab-grown rice seedlings with 30% higher yield potential",
    price: 199,
    image: "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
    rating: 4.7,
    discount: 15
  },
  {
    id: "featured-2",
    categoryId: "seeds",
    name: "Organic Tomato Seeds",
    description: "High-quality organic tomato seeds for your garden",
    price: 99,
    image: "https://plus.unsplash.com/premium_photo-1723568420145-4b3f90ef6c02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T3JnYW5pYyUyMFRvbWF0byUyMFNlZWRzfGVufDB8fDB8fHww",
    rating: 4.6,
    discount: 10
  },
  {
    id: "featured-3",
    categoryId: "fertilizers",
    name: "Premium Organic Compost",
    description: "Nutrient-rich organic compost for all your farming needs",
    price: 149,
    image: "https://images-cdn.ubuy.co.in/634f6bf504748a51bf456dde-r-m-organics-premium-organic-compost.jpg",
    rating: 4.9
  },
  {
    id: "featured-4",
    categoryId: "farming-tools",
    name: "Premium Garden Tool Set",
    description: "Complete set of essential farming tools for everyday use",
    price: 129,
    image: "https://organicbazar.net/cdn/shop/products/Hand-Trowel-for-Digging-and-Gardening-_E2_80_93-Small-Size-3.png?v=1692321767&width=533",
    rating: 4.8,
    discount: 20
  }
];

// Export product data
export const productsByCategory: Record<string, Product[]> = {
  "lab-grown-plants": [
    {
      id: "lg-plant-1",
      name: "High-Yield Rice Seedling",
      description: "Lab-grown rice seedlings with 30% higher yield potential. These genetically optimized seedlings are designed to maximize output while maintaining resistance to common diseases that affect rice crops.",
      price: 199,
      image: "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
      rating: 4.7,
      stock: 120,
      discount: 15,
      images: [
        "https://media.istockphoto.com/id/2199060174/photo/lush-green-rice-fields-in-taiwan-during-the-growing-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=E5jYkLX3rLbd4JjNQHAwZSENqQKdE0-FYgBCWN6rcec=",
        "https://media.istockphoto.com/id/1282569924/photo/rice-field-at-sunset.webp?a=1&b=1&s=612x612&w=0&k=20&c=JjsJe_lYF-3qC_Z9MFy0FbYaWGJxhHRpH1F8-4F2GGU=",
        "https://media.istockphoto.com/id/1056248814/photo/farmer-planting-rice-seedlings-in-rice-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=oDzDICxikxUgnO6moFpcTaXHwOVR2iBSzqj3hH6-MiE="
      ],
      specifications: {
        "Growth Rate": "30% faster than traditional varieties",
        "Disease Resistance": "High resistance to blast and bacterial blight",
        "Water Requirements": "20% less than traditional varieties",
        "Expected Yield": "8-10 tons per hectare"
      },
      benefits: [
        "Higher yield potential compared to traditional varieties",
        "Reduced need for pesticides due to enhanced disease resistance",
        "Greater tolerance to environmental stress factors",
        "More efficient water usage"
      ]
    },
    {
      id: "lg-plant-2",
      name: "Disease-Resistant Wheat",
      description: "Wheat seedlings engineered to resist common fungal diseases",
      price: 249,
      image: "https://media.istockphoto.com/id/983287672/photo/close-up-on-ripe-wheat-ears-on-reaping-time-in-middle-june.webp?a=1&b=1&s=612x612&w=0&k=20&c=ie2OOz5kDNy75bXzurOf1nu9WlXhHmfD8MQCe2jJ-wk=",
      rating: 4.5,
      stock: 85,
      discount: 10
    },
    {
      id: "lg-plant-3",
      name: "Drought-Tolerant Corn",
      description: "Corn plants designed to thrive in low-water conditions",
      price: 279,
      image: "https://media.istockphoto.com/id/1218144150/photo/plants.webp?a=1&b=1&s=612x612&w=0&k=20&c=e1jdZY90le1ls-4DDdF8jnJ1hiF7p14QIJnE0f6i7xA=",
      rating: 4.8,
      stock: 63
    },
    {
      id: "lg-plant-4",
      name: "Fast-Growing Vegetable Set",
      description: "Collection of tomato, cucumber, and bell pepper lab-grown seedlings",
      price: 349,
      image: "https://plus.unsplash.com/premium_photo-1677756430981-31e8977f572f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmFzdCUyMEdyb3dpbmclMjBWZWdldGFibGUlMjBTZXQlMjBsYWIlMjBncm93bnxlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.6,
      stock: 42
    },
    {
      id: "lg-plant-5",
      name: "Cold-Resistant Spinach",
      description: "Spinach seedlings that thrive in colder climates",
      price: 199,
      image: "https://media.istockphoto.com/id/1419939833/photo/arugula-seedlings-sprouted-from-the-seeds-in-the-garden.webp?a=1&b=1&s=612x612&w=0&k=20&c=bcSKbNQv382GhyNqF2KuqC6d8Wb6TIRgMtDuwhAtoyk=",
      rating: 4.7,
      stock: 100
    },
    {
      id: "lg-plant-6",
      name: "Salt-Tolerant Rice",
      description: "Rice seedlings engineered to grow in saline soils",
      price: 229,
      image: "https://media.istockphoto.com/id/1036579474/photo/rice-and-sake-cup.webp?a=1&b=1&s=612x612&w=0&k=20&c=qnugmk7hFyjeAMZGw7IMeH5WUdBrBQPQP_BkEA_xg8U=",
      rating: 4.6,
      stock: 75
    },
    {
      id: "lg-plant-7",
      name: "High-Protein Soybean",
      description: "Soybean plants with enhanced protein content for better nutrition",
      price: 259,
      image: "https://media.istockphoto.com/id/1324336237/photo/soy-milk-and-soy-on-the-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=iaUvgAdkoa0cDbMCAz5m3MW0u2-1jW3YBjSnJQkYznk=",
      rating: 4.8,
      stock: 90
    },
    {
      id: "lg-plant-8",
      name: "Pest-Resistant Eggplant",
      description: "Eggplant seedlings designed to resist common pests",
      price: 189,
      image: "https://allianceforscience.org/wp-content/uploads/2018/02/22172931728_1223b8c407_k.jpg",
      rating: 4.5,
      stock: 110
    },
    {
      id: "lg-plant-9",
      name: "High-Yield Cassava Seedling",
      description: "Lab-grown cassava with 45% higher starch content",
      price: 219,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcUYXa8RnC9POaqYokfJV7TyHIrc23f4QCZQ&s",
      rating: 4.9,
      stock: 65
    },
    {
      id: "lg-plant-10",
      name: "Climate-Adaptive Potato",
      description: "Potato seedlings engineered to adapt to climate fluctuations",
      price: 169,
      image: "https://cipotato.org/wp-content/uploads/2023/08/file.jpg",
      rating: 4.6,
      stock: 88
    }
  ],
  "seeds": [
    {
      id: "seed-1",
      name: "Organic Tomato Seeds",
      description: "High-quality organic tomato seeds for your garden",
      price: 99,
      image: "https://plus.unsplash.com/premium_photo-1723568420145-4b3f90ef6c02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T3JnYW5pYyUyMFRvbWF0byUyMFNlZWRzfGVufDB8fDB8fHww",
      rating: 4.6,
      stock: 200,
      discount: 5
    },
    {
      id: "seed-2",
      name: "Hybrid Corn Seeds",
      description: "Hybrid corn seeds for higher yield and disease resistance",
      price: 149,
      image: "https://media.istockphoto.com/id/1385753483/photo/corn-seeds-on-a-white-background-and-in-hand.webp?a=1&b=1&s=612x612&w=0&k=20&c=STB-c6g5BYmw9wv41Tg1UaT9Gz5ERrgD7JNJA0iCQ0o=",
      rating: 4.7,
      stock: 150
    },
    {
      id: "seed-3",
      name: "Organic Bottleguard Seeds",
      description: "High-quality organic gourd seeds for healthy farming",
      price: 99,
      image: "https://5.imimg.com/data5/SELLER/Default/2022/5/WC/TH/HF/44902003/new-product-500x500.jpeg",
      rating: 4.5,
      stock: 200
    },
    {
      id: "seed-4",
      name: "Wheat Seeds - Premium Quality",
      description: "Clean, certified wheat seeds for optimal production",
      price: 129,
      image: "https://m.media-amazon.com/images/I/711KJzRJIvL._UF350,350_QL80_.jpg",
      rating: 4.8,
      stock: 180
    },
    {
      id: "seed-5",
      name: "Premium Carrot Seeds",
      description: "High-germination carrot seeds for abundant harvests",
      price: 79,
      image: "https://m.media-amazon.com/images/I/718BUMMdHDL._UF1000,1000_QL80_.jpg",
      rating: 4.7,
      stock: 220
    },
    {
      id: "seed-6",
      name: "Organic Lettuce Seed Mix",
      description: "A blend of premium organic lettuce varieties",
      price: 89,
      image: "https://i5.walmartimages.com/seo/Organic-Lettuce-Garden-Seeds-Buttercrunch-2-5-Gram-Packet-Non-GMO-Heirloom-Vegetable-Gardening-Microgreens-Seeds-AKA-Butterhead_20e32865-35e6-409a-b0b2-0f1fc0026bbf_1.72abb7e9eff95160e835dbe92779f9e3.jpeg",
      rating: 4.6,
      stock: 150
    },
    {
      id: "seed-7",
      name: "Organic Cucumber Seeds",
      description: "Fresh organic cucumber seeds with high germination rate",
      price: 85,
      image: "https://m.media-amazon.com/images/I/71uE89hMMsL.jpg",
      rating: 4.8,
      stock: 175
    },
    {
      id: "seed-8",
      name: "Premium Rice Seeds",
      description: "High-yield rice seed varieties for optimal production",
      price: 110,
      image: "https://www.jiomart.com/images/product/original/rv2xqclley/shree-jee-birds-food-premium-rice-paddy-seeds-900-grams-product-images-orv2xqclley-p602828705-0-202306291228.jpg?im=Resize=(1000,1000)",
      rating: 4.9,
      stock: 200,
      discount: 8
    },
    {
      id: "seed-9",
      name: "Organic Pumpkin Seeds",
      description: "Large, disease-resistant pumpkin seeds for commercial farming",
      price: 95,
      image: "https://images-cdn.ubuy.co.in/64a4aa87ef36fe2570518315-good-sense-roasted-salted-organic.jpg",
      rating: 4.6,
      stock: 130
    }
  ],
  "fertilizers": [
    {
      id: "fert-1",
      name: "Premium Organic Compost",
      description: "Nutrient-rich organic compost for all your farming needs",
      price: 149,
      image: "https://images-cdn.ubuy.co.in/634f6bf504748a51bf456dde-r-m-organics-premium-organic-compost.jpg",
      rating: 4.9,
      stock: 300
    },
    {
      id: "fert-2",
      name: "NPK Fertilizer Blend",
      description: "Balanced nitrogen, phosphorus, and potassium for optimal growth",
      price: 199,
      image: "https://image.chukouplus.com/themes/simplebootx/Upload/W_715/upload/5f9bc5af5b6a1.jpg?x-oss-process=image/format,webp,image/resize,m_pad,h_400,w_400,color_FFFFFF&1",
      rating: 4.7,
      stock: 250,
      discount: 10
    },
    {
      id: "fert-3",
      name: "Organic Bone Meal",
      description: "Slow-release fertilizer perfect for root development",
      price: 129,
      image: "https://m.media-amazon.com/images/I/611f-p12F8L.jpg",
      rating: 4.6,
      stock: 175
    },
    {
      id: "fert-4",
      name: "Liquid Seaweed Fertilizer",
      description: "Nutrient-rich seaweed extract for boosting plant health",
      price: 109,
      image: "https://organicbazar.net/cdn/shop/products/Liquid-Seaweed-Concentrate-Fertilizer-for-Plants.jpg?v=1694169201",
      rating: 4.8,
      stock: 200
    },
    {
      id: "fert-5",
      name: "Micronutrient Mix",
      description: "Essential micronutrients to prevent deficiencies in crops",
      price: 159,
      image: "https://5.imimg.com/data5/SELLER/Default/2023/7/330299645/RF/QO/MG/7443034/mix-micronutrients-gujarat-grade-4.jpg",
      rating: 4.7,
      stock: 120
    },
    {
      id: "fert-6",
      name: "Vermicompost Premium",
      description: "Worm-processed organic matter rich in beneficial microbes",
      price: 179,
      image: "https://5.imimg.com/data5/SELLER/Default/2021/5/BY/MN/YQ/121958000/premium-vermicompost.jpg",
      rating: 4.9,
      stock: 150,
      discount: 12
    },
    {
      id: "fert-7",
      name: "Calcium Nitrate Fertilizer",
      description: "Fast-acting calcium and nitrogen source for vegetable crops",
      price: 139,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQigBA77b9lmr6_ORKpd0KhwAw3FVnidOwXkw&s",
      rating: 4.6,
      stock: 180
    }
  ],
  "pesticides": [
    {
      id: "pest-1",
      name: "Organic Pest Control Spray",
      description: "Natural formula to control common plant pests",
      price: 89,
      image: "https://m.media-amazon.com/images/I/71IwdmvlTNL.jpg",
      rating: 4.5,
      stock: 150
    },
    {
      id: "pest-2",
      name: "Neem Oil Concentrate",
      description: "Organic solution for pest and fungal control",
      price: 69,
      image: "https://m.media-amazon.com/images/I/61apvuoK0WL._UF350,350_QL80_.jpg",
      rating: 4.7,
      stock: 200,
      discount: 15
    },
    {
      id: "pest-3",
      name: "Insect Barrier Mesh",
      description: "Physical protection against flying pests",
      price: 129,
      image: "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/a0434ed81ad9511c812c226182e4bfee.jpg?imageView2/2/w/500/q/60/format/webp",
      rating: 4.6,
      stock: 80
    },
    {
      id: "pest-4",
      name: "Beneficial Insects Kit",
      description: "Live ladybugs and predatory mites for natural pest control",
      price: 99,
      image: "https://media.istockphoto.com/id/179870973/photo/a-ladybug-ladybird-on-a-green-leaf.jpg?s=612x612&w=0&k=20&c=v5_Fc_5PgA3zbCrBMFQectZQ5HizBnjFuF1Dggk1Yjk=",
      rating: 4.8,
      stock: 50
    },
    {
      id: "pest-5",
      name: "Fungal Disease Treatment",
      description: "Eco-friendly spray for controlling powdery mildew and rusts",
      price: 79,
      image: "https://media.istockphoto.com/id/1356242240/photo/homemade-natural-spray-bottle-and-garden-herbs-on-wooden-table-outdoors-copy-space.jpg?s=612x612&w=0&k=20&c=FvASKTCDLCsQzrGPZzJ1y6N3DYE28a7mLbz_kXmzcGw=",
      rating: 4.5,
      stock: 120,
      discount: 8
    },
    {
      id: "pest-6",
      name: "Soil Pest Control Granules",
      description: "Long-lasting granular formula for controlling soil-dwelling pests",
      price: 119,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI8rpOaPkLeWg83wiCB59_i8U0t1J81hoB1w&s",
      rating: 4.6,
      stock: 90
    }
  ],
  "farming-tools": [
    {
      id: "tool-1",
      name: "Premium Garden Tool Set",
      description: "Complete set of essential farming tools for everyday use",
      price: 129,
      image: "https://organicbazar.net/cdn/shop/products/Hand-Trowel-for-Digging-and-Gardening-_E2_80_93-Small-Size-3.png?v=1692321767&width=533",
      rating: 4.8,
      stock: 75,
      discount: 20
    },
    {
      id: "tool-2",
      name: "Ergonomic Hand Trowel",
      description: "Comfortable grip hand trowel for planting and soil work",
      price: 29,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYAQ56gVbaYYVrsi_gdU-56hEhEnLN6_QYBw&s",
      rating: 4.7,
      stock: 150
    },
    {
      id: "tool-3",
      name: "Professional Pruning Shears",
      description: "Sharp, durable pruning shears for precise plant maintenance",
      price: 45,
      image: "https://images-cdn.ubuy.co.in/65cd88eb4be4734db70ac1c6-electric-pruning-shears-cordless.jpg",
      rating: 4.9,
      stock: 100
    },
    {
      id: "tool-4",
      name: "Heavy-Duty Garden Hoe",
      description: "Sturdy hoe for weeding and soil preparation",
      price: 39,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQup8FPrNWGITvvjcYU8dUAVAiSjbPSRPFkbA&s",
      rating: 4.6,
      stock: 90
    },
    {
      id: "tool-5",
      name: "Soil Moisture Meter",
      description: "Accurate tool for measuring soil moisture, pH, and light levels",
      price: 25,
      image: "https://static.wixstatic.com/media/b00896_1b390949b8674c5b95e1b9da706b7f49~mv2.jpg/v1/fill/w_484,h_644,al_c,lg_1,q_80/b00896_1b390949b8674c5b95e1b9da706b7f49~mv2.jpg",
      rating: 4.5,
      stock: 120
    },
    {
      id: "tool-6",
      name: "Seedling Transplanter",
      description: "Specialized tool for safely transplanting seedlings",
      price: 19,
      image: "https://m.media-amazon.com/images/I/71nfr-k6O8L._UF1000,1000_QL80_.jpg",
      rating: 4.4,
      stock: 80
    },
    {
      id: "tool-7",
      name: "Harvest Basket Set",
      description: "Durable woven baskets for harvesting and carrying produce",
      price: 59,
      image: "https://media.istockphoto.com/id/598171350/photo/basket-with-vegetables.jpg?s=612x612&w=0&k=20&c=OmQORcZaFvDb_SKj2QOhNuM00gVYnUFMfFQJ3UnHfZg=",
      rating: 4.7,
      stock: 60,
      discount: 15
    },
    {
      id: "tool-8",
      name: "Garden Kneeling Pad",
      description: "Thick foam pad to protect knees during planting and weeding",
      price: 22,
      image: "https://m.media-amazon.com/images/I/915egWdrbdL.jpg",
      rating: 4.8,
      stock: 100
    }
  ],
  "irrigation": [
    {
      id: "irrig-1",
      name: "Smart Drip Irrigation Kit",
      description: "Water-saving drip irrigation system with smart controls",
      price: 299,
      image: "https://plantlane.com/cdn/shop/articles/smart-garden-using-computer-cont_1100x.jpg?v=1693835652",
      rating: 4.8,
      stock: 50,
      discount: 20
    },
    {
      id: "irrig-2",
      name: "Sprinkler System - Pro",
      description: "Professional-grade sprinkler system for even coverage",
      price: 349,
      image: "https://5.imimg.com/data5/SELLER/Default/2021/2/EL/WS/FC/7227892/hunter-irrigation-pro-sprayer-fixed-arc-nozzles.jpg",
      rating: 4.7,
      stock: 35
    },
    {
      id: "irrig-3",
      name: "Smart Moisture Sensors",
      description: "IoT-enabled sensors to optimize watering schedules",
      price: 179,
      image: "https://cdn1.npcdn.net/images/1621756470557096d6db60e4049c0b991e9a9af6d7.jpg?md5id=6b67560b23af2fb369555be4155d8c48&new_width=1000&new_height=1000&w=1744343065",
      rating: 4.9,
      stock: 75
    },
    {
      id: "irrig-4",
      name: "Solar-Powered Water Pump",
      description: "Eco-friendly water pump for irrigation systems",
      price: 249,
      image: "https://5.imimg.com/data5/ET/CI/LO/SELLER-3310025/solar-powered-water-pump-500x500.jpg",
      rating: 4.6,
      stock: 40
    },
    {
      id: "irrig-5",
      name: "Rainwater Collection System",
      description: "Complete system for collecting and reusing rainwater",
      price: 379,
      image: "https://media.istockphoto.com/id/1256524259/photo/rain-barrel-and-garden-watering-can.jpg?s=612x612&w=0&k=20&c=MhzlD5rcoQRKBn8GJOsQ403uHQcIr3i4Myyls0EHvDQ=",
      rating: 4.8,
      stock: 25,
      discount: 10
    }
  ]
};

// API-based data fetching functions

// Function to get categories from API with fallback to static data
export const getMarketCategories = async (): Promise<ProductCategory[]> => {
  try {
    const response = await apiService.getProductCategories();
    if (response.success) {
      return response.data.categories.map(category => ({
        id: category._id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        image: category.image
      }));
    }
  } catch (error) {
    console.warn('Failed to fetch categories from API, using fallback:', error);
  }

  return categories; // Fallback to static data
};

// Function to get featured products from API with fallback
export const getFeaturedProducts = async (): Promise<FeaturedProduct[]> => {
  try {
    const response = await apiService.getFeaturedProducts(10);
    if (response.success) {
      return response.data.products.map(product => ({
        id: product._id,
        categoryId: product.categoryId._id || product.categoryId,
        name: product.name,
        description: product.description,
        price: product.discountedPrice || product.price,
        image: product.images?.[0] || product.image,
        rating: product.rating,
        discount: product.discount
      }));
    }
  } catch (error) {
    console.warn('Failed to fetch featured products from API, using fallback:', error);
  }

  return featuredProducts; // Fallback to static data
};

// Function to get products by category from API with fallback
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const response = await apiService.getProductsByCategory(categoryId, 1, 50);
    if (response.success) {
      return response.data.products.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.discountedPrice || product.price,
        image: product.images?.[0] || product.image,
        rating: product.rating,
        stock: product.stock,
        discount: product.discount,
        images: product.images,
        specifications: product.specifications ? Object.fromEntries(product.specifications) : undefined,
        benefits: product.benefits
      }));
    }
  } catch (error) {
    console.warn(`Failed to fetch products for category ${categoryId} from API, using fallback:`, error);
  }

  return productsByCategory[categoryId] || []; // Fallback to static data
};

// Function to get all products with filtering
export const getProducts = async (options: {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
} = {}): Promise<{ products: Product[]; pagination: any }> => {
  try {
    const response = await apiService.getProducts(options);
    if (response.success) {
      const products = response.data.products.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.discountedPrice || product.price,
        image: product.images?.[0] || product.image,
        rating: product.rating,
        stock: product.stock,
        discount: product.discount,
        images: product.images,
        specifications: product.specifications ? Object.fromEntries(product.specifications) : undefined,
        benefits: product.benefits
      }));

      return {
        products,
        pagination: response.data.pagination
      };
    }
  } catch (error) {
    console.warn('Failed to fetch products from API, using fallback:', error);
  }

  // Fallback to static data
  let allProducts: Product[] = [];
  Object.values(productsByCategory).forEach(categoryProducts => {
    allProducts = allProducts.concat(categoryProducts);
  });

  // Apply basic filtering for fallback
  if (options.categoryId) {
    allProducts = productsByCategory[options.categoryId] || [];
  }

  if (options.search) {
    const searchTerm = options.search.toLowerCase();
    allProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  if (options.minPrice !== undefined) {
    allProducts = allProducts.filter(product => product.price >= options.minPrice!);
  }

  if (options.maxPrice !== undefined) {
    allProducts = allProducts.filter(product => product.price <= options.maxPrice!);
  }

  const page = options.page || 1;
  const limit = options.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    products: allProducts.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: allProducts.length,
      totalPages: Math.ceil(allProducts.length / limit),
      hasNext: endIndex < allProducts.length,
      hasPrev: page > 1
    }
  };
};
