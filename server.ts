import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

// --- Models ---
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: String,
}, { timestamps: true });

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  points: { type: Number, default: 0 },
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  userId: String,
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: "cash" },
  status: { type: String, default: "completed" },
  memberId: String,
}, { timestamps: true });

const SettingSchema = new mongoose.Schema({
  storeName: { type: String, default: "KasirPro" },
  address: String,
  phone: String,
  taxRate: { type: Number, default: 11 },
  currency: { type: String, default: "IDR" },
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

if (!MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI is not defined. The app will run with in-memory mock data.");
} else {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    // Seed sample data if empty
    const count = await Product.countDocuments();
    if (count === 0) {
      const sampleProducts = [
        { name: "Beras 5kg Premium", price: 65000, stock: 50, category: "Sembako" },
        { name: "Minyak Goreng 2L", price: 34000, stock: 30, category: "Sembako" },
        { name: "Gula Pasir 1kg", price: 15000, stock: 100, category: "Sembako" },
        { name: "Susu UHT 1L", price: 18000, stock: 24, category: "Minuman" },
        { name: "Telur 1kg", price: 28000, stock: 40, category: "Sembako" },
        { name: "Kopi Instan Box", price: 12500, stock: 60, category: "Minuman" },
        { name: "Indomie Goreng (DUS)", price: 115000, stock: 15, category: "Sembako" },
        { name: "Air Mineral 600ml (DUS)", price: 48000, stock: 20, category: "Minuman" },
        { name: "Sabon Cuci Piring 800ml", price: 14500, stock: 45, category: "Kebutuhan Rumah" },
        { name: "Deterjen Cair 700ml", price: 19000, stock: 35, category: "Kebutuhan Rumah" },
        { name: "Sikat Gigi Soft", price: 8500, stock: 120, category: "Kebutuhan Rumah" },
        { name: "Penyedap Rasa 250g", price: 9000, stock: 80, category: "Sembako" },
        { name: "Teh Celup Box", price: 6500, stock: 75, category: "Minuman" },
        { name: "Snack Kentang 68g", price: 10500, stock: 40, category: "Snack" },
        { name: "Biskuit Cokelat", price: 8000, stock: 50, category: "Snack" },
        { name: "Permen Mint Bag", price: 7000, stock: 90, category: "Snack" },
        { name: "Tissue Wajah 250s", price: 12000, stock: 60, category: "Kebutuhan Rumah" },
        { name: "Pembersih Lantai 750ml", price: 11000, stock: 25, category: "Kebutuhan Rumah" },
        { name: "Roti Tawar Gandum", price: 16500, stock: 12, category: "Sembako" },
        { name: "Margarin 200g", price: 7500, stock: 55, category: "Sembako" },
      ];
      await Product.insertMany(sampleProducts as any);
      console.log("Sample products seeded");
    }

    // Seed settings if empty
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
      await Setting.create({ storeName: "KasirPro Utama", address: "Jl. Sudirman No. 123", phone: "08123456789", taxRate: 11 });
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: MONGODB_URI ? "mongodb" : "mock", dbState: mongoose.connection.readyState });
});

// Products
app.get("/api/products", async (req, res) => {
  try {
    if (MONGODB_URI && mongoose.connection.readyState === 1) {
      const products = await Product.find().sort({ name: 1 });
      res.json(products);
    } else {
      res.json([
        { _id: "1", name: "Beras 5kg Premium", price: 65000, stock: 50, category: "Sembako" },
        { _id: "2", name: "Minyak Goreng 2L", price: 34000, stock: 30, category: "Sembako" },
        { _id: "3", name: "Gula Pasir 1kg", price: 15000, stock: 100, category: "Sembako" },
        { _id: "4", name: "Susu UHT 1L", price: 18000, stock: 24, category: "Minuman" },
        { _id: "5", name: "Telur 1kg", price: 28000, stock: 40, category: "Sembako" },
        { _id: "6", name: "Kopi Instan Box", price: 12500, stock: 60, category: "Minuman" },
        { _id: "7", name: "Indomie Goreng (DUS)", price: 115000, stock: 15, category: "Sembako" },
        { _id: "8", name: "Air Mineral 600ml (DUS)", price: 48000, stock: 20, category: "Minuman" },
        { _id: "9", name: "Sabun Cuci Piring", price: 14500, stock: 45, category: "Kebutuhan Rumah" },
        { _id: "10", name: "Deterjen Cair 700ml", price: 19000, stock: 35, category: "Kebutuhan Rumah" },
        { _id: "11", name: "Sikat Gigi Soft", price: 8500, stock: 120, category: "Kebutuhan Rumah" },
        { _id: "12", name: "Penyedap Rasa 250g", price: 9000, stock: 80, category: "Sembako" },
        { _id: "13", name: "Teh Celup Box", price: 6500, stock: 75, category: "Minuman" },
        { _id: "14", name: "Snack Kentang 68g", price: 10500, stock: 40, category: "Snack" },
        { _id: "15", name: "Biskuit Cokelat", price: 8000, stock: 50, category: "Snack" },
        { _id: "16", name: "Permen Mint Bag", price: 7000, stock: 90, category: "Snack" },
        { _id: "17", name: "Tissue Wajah 250s", price: 12000, stock: 60, category: "Kebutuhan Rumah" },
        { _id: "18", name: "Pembersih Lantai", price: 11000, stock: 25, category: "Kebutuhan Rumah" },
        { _id: "19", name: "Roti Tawar Gandum", price: 16500, stock: 12, category: "Sembako" },
        { _id: "20", name: "Margarin 200g", price: 7500, stock: 55, category: "Sembako" },
      ]);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    if (MONGODB_URI) {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } else {
      res.status(201).json({ ...req.body, _id: Date.now().toString() });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    if (MONGODB_URI) {
      const product = await (Product as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(product);
    } else {
      res.json({ ...req.body, id: req.params.id });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    if (MONGODB_URI) {
      await (Product as any).findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted" });
    } else {
      res.json({ message: "Mock product deleted" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Members
app.get("/api/members", async (req, res) => {
  try {
    if (MONGODB_URI) {
      const members = await Member.find().sort({ name: 1 });
      res.json(members);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

app.post("/api/members", async (req, res) => {
  try {
    if (MONGODB_URI) {
      const member = new Member(req.body);
      await member.save();
      res.status(201).json(member);
    } else {
      res.status(201).json({ ...req.body, _id: Date.now().toString() });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to create member" });
  }
});

app.put("/api/members/:id", async (req, res) => {
  try {
    if (MONGODB_URI) {
      const member = await (Member as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(member);
    } else {
      res.json({ ...req.body, id: req.params.id });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update member" });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  try {
    if (MONGODB_URI) {
      await (Member as any).findByIdAndDelete(req.params.id);
      res.json({ message: "Member deleted" });
    } else {
      res.json({ message: "Mock member deleted" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete member" });
  }
});

// Transactions
app.post("/api/transactions", async (req, res) => {
  try {
    const { items, total, paymentMethod, memberId } = req.body;
    if (MONGODB_URI) {
      const transaction = new Transaction({ items, total, paymentMethod, memberId });
      await transaction.save();
      
      // Update stock
      for (const item of items) {
        await (Product as any).findByIdAndUpdate(
          item.id || item.productId, 
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }

      // Add points to member if exists
      if (memberId) {
        await (Member as any).findByIdAndUpdate(memberId, { $inc: { points: Math.floor(total / 1000) } });
      }
      
      res.status(201).json(transaction);
    } else {
      res.status(201).json({ id: Date.now().toString(), status: "success (mock)" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to process transaction" });
  }
});

// Reports
app.get("/api/reports/dashboard", async (req, res) => {
  try {
    if (MONGODB_URI) {
      const transactions = await Transaction.find().sort({ createdAt: -1 });
      const totalOmzet = transactions.reduce((sum, t) => sum + t.total, 0);
      const totalTransactions = transactions.length;
      const recentTransactions = transactions.slice(0, 10);
      
      res.json({
        totalOmzet,
        totalTransactions,
        recentTransactions
      });
    } else {
      res.json({ totalOmzet: 0, totalTransactions: 0, recentTransactions: [] });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Settings
app.get("/api/settings", async (req, res) => {
  try {
    if (MONGODB_URI) {
      const setting = await (Setting as any).findOne({});
      res.json(setting);
    } else {
      res.json({ storeName: "KasirPro (Mock)", taxRate: 11 });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    if (MONGODB_URI) {
      const setting = await (Setting as any).findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.json(setting);
    } else {
      res.json(req.body);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
