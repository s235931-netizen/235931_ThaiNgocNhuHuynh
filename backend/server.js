
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) =>
    console.error("MongoDB connection error:", err.message)
  );

// Cấu trúc dữ liệu món ăn
const Food = mongoose.model(
  "Food",
  new mongoose.Schema(
    {
      foodId: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      category: String,
      cuisine: String,
      ingredients: [String],
      price: Number,
      quantity: Number,
      description: String,
      imageUrl: String
    },
    { timestamps: true, collection: "foods" }
  )
);

// Kiểm tra Backend
app.get("/", (req, res) => {
  res.send("Food Management API is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Food API is running"
  });
});

// Lấy danh sách món ăn, hỗ trợ tìm kiếm
app.get("/api/foods", async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { cuisine: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const foods = await Food.find(filter);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy một món ăn
app.get("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }
    res.json(food);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Thêm món ăn
app.post("/api/foods", async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cập nhật món ăn
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
    res.status(400).json({ error: err.message });
  }
});

// Xóa món ăn
app.delete("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
