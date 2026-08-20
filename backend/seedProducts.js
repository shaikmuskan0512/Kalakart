import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";

const products = [
  {
    productId: 1,
    name: "Handwoven Banarasi Silk Saree",
    description:
      "A rich zari-brocade weave from the ghats of Varanasi, finished with a traditional meenakari border.",
    price: 2499,
    originalPrice: 3200,
    category: "sarees",
    state: "Uttar Pradesh",
    rating: 4.8,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Traditional%20handwoven%20Sindhi%20Lungi%20shawl.jpg",
    stock: 8,
  },

  {
    productId: 2,
    name: "Kalamkari Hand-Painted Dupatta",
    description:
      "Vegetable-dyed motifs hand-painted with a bamboo pen, depicting temple stories in earthy tones.",
    price: 1899,
    originalPrice: 2500,
    category: "textiles",
    state: "Andhra Pradesh",
    rating: 4.6,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ajrak%20Craft%20artisan.jpeg",
    stock: 14,
  },

  {
    productId: 3,
    name: "Kanchipuram Silk Saree",
    description:
      "Temple-town silk woven with a contrasting zari border, prized for its weight and sheen.",
    price: 4599,
    originalPrice: 5800,
    category: "sarees",
    state: "Tamil Nadu",
    rating: 4.9,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Traditional%20handwoven%20Sindhi%20Lungi%20shawl1.jpg",
    stock: 6,
  },

  {
    productId: 4,
    name: "Madhubani Folk Painting",
    description:
      "A Mithila-style painting on handmade paper, filled with double-line borders and natural pigment.",
    price: 1299,
    originalPrice: 1800,
    category: "paintings",
    state: "Bihar",
    rating: 4.7,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dhokra%20art%20with%20clay.jpg",
    stock: 11,
  },

  {
    productId: 5,
    name: "Blue Pottery Vase",
    description:
      "Jaipur's signature quartz-clay pottery, glazed in cobalt and hand-painted with floral trails.",
    price: 1150,
    originalPrice: 1600,
    category: "pottery",
    state: "Rajasthan",
    rating: 4.5,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Designer%20Jars.JPG",
    stock: 17,
  },

  {
    productId: 6,
    name: "Rajasthani Handcrafted Bag",
    description:
      "Camel-leather trim over hand-embroidered cotton, with mirror work along the flap.",
    price: 1799,
    originalPrice: 2400,
    category: "bags",
    state: "Rajasthan",
    rating: 4.4,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Handicraft%20shop,%20on%20Janpath,%20New%20Delhi.jpg",
    stock: 9,
  },

  {
    productId: 7,
    name: "Bamboo Woven Basket",
    description:
      "Split-bamboo basketry from the Bengal delta, tight-woven for daily use and gifting.",
    price: 649,
    originalPrice: 900,
    category: "homedecor",
    state: "West Bengal",
    rating: 4.3,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hand%20made%20basket%2001.jpg",
    stock: 22,
  },

  {
    productId: 8,
    name: "Terracotta Painted Pot",
    description:
      "Wheel-thrown terracotta from Gujarat, finished with a white clay wash and hand motifs.",
    price: 799,
    originalPrice: 1100,
    category: "pottery",
    state: "Gujarat",
    rating: 4.4,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hatima%20Putul%20,%20a%20traditional%20Indian%20terracotta%20art%20DSC%204721%201.jpg",
    stock: 19,
  },

  {
    productId: 9,
    name: "Carved Wooden Elephant",
    description:
      "A hand-carved wooden sculpture finished with a natural polish.",
    price: 1450,
    originalPrice: 1950,
    category: "woodcraft",
    state: "Karnataka",
    rating: 4.6,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/A%20wood%20carving%20work%201.JPG",
    stock: 13,
  },

  {
    productId: 10,
    name: "Dokra Metal Craft Figurine",
    description:
      "Lost-wax cast metal craft inspired by the ancient Dokra tradition.",
    price: 1350,
    originalPrice: 1750,
    category: "homedecor",
    state: "Odisha",
    rating: 4.5,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Terracotta%20Eco%20Friendly%20Tribal%20Dhokra%20art.jpg",
    stock: 10,
  },

  {
    productId: 11,
    name: "Pattachitra Scroll Painting",
    description:
      "Natural-pigment narrative art inspired by the traditional painting heritage of Odisha.",
    price: 1699,
    originalPrice: 2200,
    category: "paintings",
    state: "Odisha",
    rating: 4.7,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/ARTESANIA.jpg",
    stock: 7,
  },

  {
    productId: 12,
    name: "Handwoven Cotton Saree",
    description:
      "A lightweight traditional handwoven textile with a comfortable drape.",
    price: 1599,
    originalPrice: 2100,
    category: "sarees",
    state: "Maharashtra",
    rating: 4.5,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Traditional%20handwoven%20Sindhi%20Lungi%20shawl.jpg",
    stock: 15,
  },

  {
    productId: 13,
    name: "Ajrakh Block Print Textile",
    description:
      "Natural-dye textile inspired by the traditional Ajrakh printing craft of Kutch.",
    price: 1199,
    originalPrice: 1600,
    category: "textiles",
    state: "Gujarat",
    rating: 4.6,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ajrak%20Craft.jpeg",
    stock: 16,
  },

  {
    productId: 14,
    name: "Handmade Silver Jhumkas",
    description:
      "Traditional handcrafted earrings with detailed Indian-inspired patterns.",
    price: 899,
    originalPrice: 1200,
    category: "jewellery",
    state: "Rajasthan",
    rating: 4.6,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Earring%20handmade.jpg",
    stock: 20,
  },

  {
    productId: 15,
    name: "Brass Diya Set of Five",
    description:
      "Traditional Indian brass lamps with handcrafted decorative detailing.",
    price: 749,
    originalPrice: 1000,
    category: "homedecor",
    state: "Uttar Pradesh",
    rating: 4.5,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bell%20metal%20handicraft.jpg",
    stock: 24,
  },

  {
    productId: 16,
    name: "Warli-Style Wall Decor Panel",
    description:
      "A hand-painted decorative panel inspired by traditional Warli folk art.",
    price: 1099,
    originalPrice: 1450,
    category: "homedecor",
    state: "Maharashtra",
    rating: 4.4,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Decorations%20work.jpg",
    stock: 12,
  },

  {
    productId: 17,
    name: "Channapatna Wooden Toy Set",
    description:
      "Traditional Indian wooden toys inspired by the famous Channapatna craft.",
    price: 899,
    originalPrice: 1200,
    category: "woodcraft",
    state: "Karnataka",
    rating: 4.7,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Handicrafts%20idols.JPG",
    stock: 18,
  },

  {
    productId: 18,
    name: "Kashmiri Embroidery Shawl",
    description:
      "A richly decorated textile inspired by traditional Kashmiri embroidery.",
    price: 3299,
    originalPrice: 4200,
    category: "textiles",
    state: "Jammu & Kashmir",
    rating: 4.9,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Srinagar%20Handicrafts%20605.jpg",
    stock: 5,
  },

  {
    productId: 19,
    name: "Kerala Kasavu Handloom Saree",
    description:
      "Traditional handwoven textile inspired by Kerala's elegant Kasavu tradition.",
    price: 1999,
    originalPrice: 2600,
    category: "sarees",
    state: "Kerala",
    rating: 4.6,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Traditional%20Spinning%20Tool%20Used%20in%20Weaving.jpg",
    stock: 11,
  },

  {
    productId: 20,
    name: "Warli Folk Painting",
    description:
      "Folk-art inspired wall painting featuring traditional geometric figures.",
    price: 999,
    originalPrice: 1350,
    category: "paintings",
    state: "Maharashtra",
    rating: 4.5,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Handicrafting%20in%20India%20(2020).jpg",
    stock: 14,
  },

  {
    productId: 21,
    name: "Kondapalli Wooden Toy",
    description:
      "Traditional wooden toy inspired by the famous craft tradition of Andhra Pradesh.",
    price: 649,
    originalPrice: 900,
    category: "woodcraft",
    state: "Andhra Pradesh",
    rating: 4.3,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bamboo%20crafted%20dancing%20lady%20from%20Samaguri%20Satra.jpg",
    stock: 21,
  },

  {
    productId: 22,
    name: "Pochampally Ikat Dupatta",
    description:
      "Traditional resist-dyed textile inspired by the famous Pochampally Ikat craft.",
    price: 1450,
    originalPrice: 1900,
    category: "textiles",
    state: "Telangana",
    rating: 4.6,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/EYE%20HAND%20EMBROIDERY.jpg",
    stock: 13,
  },

  {
    productId: 23,
    name: "Kantha Embroidered Bag",
    description:
      "Hand-stitched textile craft inspired by the traditional Kantha embroidery of Bengal.",
    price: 1099,
    originalPrice: 1450,
    category: "bags",
    state: "West Bengal",
    rating: 4.4,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HAND%20EMBROIDERY.jpg",
    stock: 15,
  },

  {
    productId: 24,
    name: "Mysore Silk Saree",
    description:
      "Elegant silk textile inspired by Karnataka's traditional weaving heritage.",
    price: 3899,
    originalPrice: 4900,
    category: "sarees",
    state: "Karnataka",
    rating: 4.8,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Srinagar%20Handicrafts%20606.jpg",
    stock: 9,
  },
];

async function seedProducts() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove old products
    await Product.deleteMany({});

    console.log("Old products removed");

    // Insert new products
    await Product.insertMany(products);

    console.log(
      `${products.length} products added successfully`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error seeding products:", error);

    try {
      await mongoose.connection.close();
    } catch {}

    process.exit(1);
  }
}

seedProducts();