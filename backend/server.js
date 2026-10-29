
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Tạo cấu trúc dữ liệu sinh viên
const Student = mongoose.model(
  "Student",
  new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true }
  })
);

app.get("/", (req, res) => {
  res.send("Cloud Lab API is running!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Cloud Lab!" });
});

// Xem danh sách sinh viên
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm sinh viên
app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
