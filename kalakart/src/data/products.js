// Local product data for KalaKart.
// Images use stable placeholder URLs.
// Replace with your own product photography when ready.

const img = (text, w = 600, h = 750) =>
  `https://placehold.co/${w}x${h}?text=${encodeURIComponent(text)}`;

// ==========================================
// CATEGORIES
// ==========================================

export const categories = [
  {
    id: "sarees",
    name: "Sarees",
    description: "Silk and cotton weaves for every occasion",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
  },

  {
    id: "textiles",
    name: "Handwoven Textiles",
    description: "Dupattas, shawls and printed fabric",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85",
  },

 {
  id: "pottery",
  name: "Pottery",
  description: "Terracotta and blue pottery, shaped by hand",
  image:
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=85",
},
  {
    id: "jewellery",
    name: "Jewellery",
    description: "Silver, brass and stone-set adornments",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85",
  },

  {
    id: "woodcraft",
    name: "Woodcraft",
    description: "Carved figures and lacquered toys",
    image:
      "https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&w=800&q=85",
  },

  {
    id: "paintings",
    name: "Paintings",
    description: "Folk art passed down through generations",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=85",
  },

  {
    id: "homedecor",
    name: "Home Decor",
    description: "Brass, metal and wall pieces for the home",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=85",
  },

  {
    id: "bags",
    name: "Handcrafted Bags",
    description: "Embroidered and block-printed carryalls",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=85",
  },
];

// ==========================================
// STATES
// ==========================================

export const states = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Gujarat",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];