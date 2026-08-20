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
      "https://loremflickr.com/600/750/banarasi,silk,saree?lock=1",
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
      "https://loremflickr.com/600/750/kalamkari,fabric,textile?lock=2",
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
      "https://loremflickr.com/600/750/kanchipuram,silk,saree?lock=3",
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
      "https://loremflickr.com/600/750/madhubani,folk,painting?lock=4",
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
      "https://loremflickr.com/600/750/blue,pottery,vase?lock=5",
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
      "https://loremflickr.com/600/750/embroidered,bag,handmade?lock=6",
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
      "https://loremflickr.com/600/750/bamboo,basket,weave?lock=7",
    stock: 22,
  },
  {
    productId: 8,
    name: "Terracotta Painted Pot",
    description:
      "Wheel-thrown terracotta from Gujarat, finished with a white kanadu clay wash and hand motifs.",
    price: 799,
    originalPrice: 1100,
    category: "pottery",
    state: "Gujarat",
    rating: 4.4,
    image:
      "https://loremflickr.com/600/750/terracotta,pot,handmade?lock=8",
    stock: 19,
  },
  {
    productId: 9,
    name: "Carved Wooden Elephant",
    description:
      "A single block of rosewood, hand-chiselled and finished with a natural lac polish.",
    price: 1450,
    originalPrice: 1950,
    category: "woodcraft",
    state: "Karnataka",
    rating: 4.6,
    image:
      "https://loremflickr.com/600/750/wooden,elephant,carving?lock=9",
    stock: 13,
  },
  {
    productId: 10,
    name: "Dokra Metal Craft Figurine",
    description:
      "Lost-wax cast bronze in the ancient dokra tradition, its surface left deliberately unfinished.",
    price: 1350,
    originalPrice: 1750,
    category: "homedecor",
    state: "Odisha",
    rating: 4.5,
    image:
      "https://loremflickr.com/600/750/bronze,metal,figurine,craft?lock=10",
    stock: 10,
  },
  {
    productId: 11,
    name: "Pattachitra Scroll Painting",
    description:
      "Natural-pigment narrative art on cloth-backed paper, framed with a traditional floral border.",
    price: 1699,
    originalPrice: 2200,
    category: "paintings",
    state: "Odisha",
    rating: 4.7,
    image:
      "https://loremflickr.com/600/750/pattachitra,scroll,painting?lock=11",
    stock: 7,
  },
  {
    productId: 12,
    name: "Handwoven Cotton Saree",
    description:
      "A light Paithani-inspired cotton weave with a woven pallu, easy to drape and breathe in.",
    price: 1599,
    originalPrice: 2100,
    category: "sarees",
    state: "Maharashtra",
    rating: 4.5,
    image:
      "https://loremflickr.com/600/750/cotton,handloom,saree?lock=12",
    stock: 15,
  },
  {
    productId: 13,
    name: "Ajrakh Block Print Textile",
    description:
      "Fourteen-step natural dye block printing from Kutch, in signature indigo and madder red.",
    price: 1199,
    originalPrice: 1600,
    category: "textiles",
    state: "Gujarat",
    rating: 4.6,
    image:
      "https://loremflickr.com/600/750/block,print,textile,indigo?lock=13",
    stock: 16,
  },
  {
    productId: 14,
    name: "Handmade Silver Jhumkas",
    description:
      "Oxidised silver bell earrings, hand-stamped with a repeating temple motif.",
    price: 899,
    originalPrice: 1200,
    category: "jewellery",
    state: "Rajasthan",
    rating: 4.6,
    image:
      "https://loremflickr.com/600/750/silver,earrings,jhumka?lock=14",
    stock: 20,
  },
  {
    productId: 15,
    name: "Brass Diya Set of Five",
    description:
      "Sand-cast brass lamps from Moradabad, hand-etched with paisley detailing.",
    price: 749,
    originalPrice: 1000,
    category: "homedecor",
    state: "Uttar Pradesh",
    rating: 4.5,
    image:
      "https://loremflickr.com/600/750/brass,diya,lamp?lock=15",
    stock: 24,
  },
  {
    productId: 16,
    name: "Warli-Style Wall Decor Panel",
    description:
      "A hand-painted wooden wall panel featuring the geometric figures of Warli folk art.",
    price: 1099,
    originalPrice: 1450,
    category: "homedecor",
    state: "Maharashtra",
    rating: 4.4,
    image:
      "https://loremflickr.com/600/750/wall,art,decor,handmade?lock=16",
    stock: 12,
  },
  {
    productId: 17,
    name: "Channapatna Wooden Toy Set",
    description:
      "Lacquered ivory-wood toys turned on a traditional lathe, coloured with vegetable dye.",
    price: 899,
    originalPrice: 1200,
    category: "woodcraft",
    state: "Karnataka",
    rating: 4.7,
    image:
      "https://loremflickr.com/600/750/wooden,toy,lacquer,craft?lock=17",
    stock: 18,
  },
  {
    productId: 18,
    name: "Kashmiri Embroidery Shawl",
    description:
      "Fine pashmina wool with hand-worked sozni embroidery along the border and corners.",
    price: 3299,
    originalPrice: 4200,
    category: "textiles",
    state: "Jammu & Kashmir",
    rating: 4.9,
    image:
      "https://loremflickr.com/600/750/kashmiri,shawl,embroidery?lock=18",
    stock: 5,
  },
  {
    productId: 19,
    name: "Kerala Kasavu Handloom Saree",
    description:
      "Off-white cotton with a gold-zari border, woven on a pit-loom in Balaramapuram.",
    price: 1999,
    originalPrice: 2600,
    category: "sarees",
    state: "Kerala",
    rating: 4.6,
    image:
      "https://loremflickr.com/600/750/kasavu,saree,handloom?lock=19",
    stock: 11,
  },
  {
    productId: 20,
    name: "Warli Folk Painting",
    description:
      "Rice-paste figures on a mud-toned canvas, illustrating a harvest dance in the traditional style.",
    price: 999,
    originalPrice: 1350,
    category: "paintings",
    state: "Maharashtra",
    rating: 4.5,
    image:
      "https://loremflickr.com/600/750/warli,tribal,painting?lock=20",
    stock: 14,
  },
  {
    productId: 21,
    name: "Kondapalli Wooden Toy",
    description:
      "Softwood figures from Andhra Pradesh, hand-carved in sections and painted in bright enamel.",
    price: 649,
    originalPrice: 900,
    category: "woodcraft",
    state: "Andhra Pradesh",
    rating: 4.3,
    image:
      "https://loremflickr.com/600/750/painted,wooden,toy?lock=21",
    stock: 21,
  },
  {
    productId: 22,
    name: "Pochampally Ikat Dupatta",
    description:
      "Resist-dyed yarn woven into geometric ikat patterns before a single thread crosses the loom.",
    price: 1450,
    originalPrice: 1900,
    category: "textiles",
    state: "Telangana",
    rating: 4.6,
    image:
      "https://loremflickr.com/600/750/ikat,dupatta,weave?lock=22",
    stock: 13,
  },
  {
    productId: 23,
    name: "Kantha Embroidered Bag",
    description:
      "Layered cotton hand-stitched with the running kantha stitch, upcycled from old sarees.",
    price: 1099,
    originalPrice: 1450,
    category: "bags",
    state: "West Bengal",
    rating: 4.4,
    image:
      "https://loremflickr.com/600/750/kantha,embroidery,bag?lock=23",
    stock: 15,
  },
  {
    productId: 24,
    name: "Mysore Silk Saree",
    description:
      "Pure mulberry silk with a gold-zari border, known for its soft drape and subtle sheen.",
    price: 3899,
    originalPrice: 4900,
    category: "sarees",
    state: "Karnataka",
    rating: 4.8,
    image:
      "https://loremflickr.com/600/750/mysore,silk,saree?lock=24",
    stock: 9,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany({});

    console.log("Old products removed");

    await Product.insertMany(products);

    console.log(`${products.length} products added successfully`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();