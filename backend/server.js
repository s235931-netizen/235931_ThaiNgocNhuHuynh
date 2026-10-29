
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

app.use(cors());
app.use(express.json());

// Food model
const foodSchema = new mongoose.Schema(
  {
    foodId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    ingredients: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true, collection: "foods" }
);

const Food = mongoose.model("Food", foodSchema);

// Home
app.get("/", (req, res) => {
  res.send("Food Management API is running!");
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Food API is running",
  });
});

// Get all foods and search
app.get("/api/foods", async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const keyword = search.trim();
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { cuisine: { $regex: keyword, $options: "i" } },
      ];
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one food
app.get("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json(food);
  } catch (err) {
    res.status(400).json({ error: "Invalid food ID" });
  }
});

// Create food
app.post("/api/foods", async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "foodId already exists" });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
});

// Update food
app.put("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json(food);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "foodId already exists" });
    }

    res.status(400).json({ error: err.message });
  }
});

// Delete food
app.delete("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid food ID" });
  }
});

// Connect MongoDB, then start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
