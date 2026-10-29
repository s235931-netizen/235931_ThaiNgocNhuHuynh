
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyFood = {
  foodId: "",
  name: "",
  category: "",
  cuisine: "",
  ingredients: "",
  price: "",
  quantity: "",
  description: "",
  imageUrl: "",
};

function App() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(emptyFood);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadFoods = async (keyword = search) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/api/foods`, {
        params: { search: keyword },
      });
      setFoods(response.data);
    } catch {
      setError("Không tải được dữ liệu. Hãy kiểm tra backend đang chạy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods("");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyFood);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...form,
      ingredients: form.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/foods/${editingId}`, payload);
        setMessage("Cập nhật món ăn thành công!");
      } else {
        await axios.post(`${API_URL}/api/foods`, payload);
        setMessage("Thêm món ăn thành công!");
      }

      resetForm();
      await loadFoods();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Không lưu được món ăn. Hãy kiểm tra thông tin nhập."
      );
    }
  };

  const handleEdit = (food) => {
    setForm({
      foodId: food.foodId || "",
      name: food.name || "",
      category: food.category || "",
      cuisine: food.cuisine || "",
      ingredients: (food.ingredients || []).join(", "),
      price: food.price ?? "",
      quantity: food.quantity ?? "",
      description: food.description || "",
      imageUrl: food.imageUrl || "",
    });
    setEditingId(food._id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (food) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${food.name}"?`)) return;

    setMessage("");
    setError("");

    try {
      await axios.delete(`${API_URL}/api/foods/${food._id}`);
      setMessage("Xóa món ăn thành công!");
      if (editingId === food._id) resetForm();
      await loadFoods();
    } catch (err) {
      setError(err.response?.data?.error || "Không xóa được món ăn.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadFoods(search);
  };

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">FOOD MANAGEMENT SYSTEM</p>
          <h1>Quản lý món ăn</h1>
          <p className="subtitle">
            Quản lý thực đơn, giá bán và số lượng trong một giao diện.
          </p>
        </div>
        <div className="total">
          <span>Tổng số món</span>
          <strong>{foods.length}</strong>
        </div>
      </header>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <section className="panel">
        <h2>{editingId ? "Cập nhật món ăn" : "Thêm món ăn mới"}</h2>

        <form onSubmit={handleSubmit} className="food-form">
          <label>
            Mã món ăn *
            <input name="foodId" value={form.foodId} onChange={handleChange}
              placeholder="VD: MON004" required />
          </label>
          <label>
            Tên món ăn *
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Tên món ăn" required />
          </label>
          <label>
            Danh mục *
            <input name="category" value={form.category} onChange={handleChange}
              placeholder="VD: Món chính" required />
          </label>
          <label>
            Ẩm thực *
            <input name="cuisine" value={form.cuisine} onChange={handleChange}
              placeholder="VD: Việt Nam" required />
          </label>
          <label>
            Giá bán (VNĐ) *
            <input type="number" name="price" min="0" value={form.price}
              onChange={handleChange} required />
          </label>
          <label>
            Số lượng *
            <input type="number" name="quantity" min="0" value={form.quantity}
              onChange={handleChange} required />
          </label>
          <label className="wide">
            Nguyên liệu (phân cách bằng dấu phẩy)
            <input name="ingredients" value={form.ingredients} onChange={handleChange}
              placeholder="VD: Thịt bò, hành, rau" />
          </label>
          <label className="wide">
            Mô tả
            <textarea name="description" value={form.description}
              onChange={handleChange} placeholder="Mô tả món ăn" rows="2" />
          </label>
          <label className="wide">
            Đường dẫn hình ảnh
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
              placeholder="https://..." />
          </label>

          <div className="form-actions wide">
            <button className="primary" type="submit">
              {editingId ? "Lưu thay đổi" : "Thêm món ăn"}
            </button>
            {editingId && (
              <button className="secondary" type="button" onClick={resetForm}>
                Hủy sửa
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="list-heading">
          <div>
            <h2>Danh sách món ăn</h2>
            <p className="muted">Tìm theo tên, danh mục hoặc loại ẩm thực.</p>
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập từ khóa..." />
            <button className="primary" type="submit">Tìm kiếm</button>
            <button className="secondary" type="button" onClick={() => {
              setSearch("");
              loadFoods("");
            }}>Làm mới</button>
          </form>
        </div>

        {loading ? (
          <p className="empty">Đang tải dữ liệu...</p>
        ) : foods.length === 0 ? (
          <p className="empty">Chưa có món ăn phù hợp.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã món</th>
                  <th>Tên món</th>
                  <th>Danh mục</th>
                  <th>Ẩm thực</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    <td>{food.foodId}</td>
                    <td>
                      <strong>{food.name}</strong>
                      {food.description && <small>{food.description}</small>}
                    </td>
                    <td>{food.category}</td>
                    <td>{food.cuisine}</td>
                    <td className="price">
                      {Number(food.price).toLocaleString("vi-VN")} đ
                    </td>
                    <td>{food.quantity}</td>
                    <td>
                      <div className="row-actions">
                        <button className="edit" onClick={() => handleEdit(food)}>
                          Sửa
                        </button>
                        <button className="delete" onClick={() => handleDelete(food)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>Food Management System · React · Express · MongoDB</footer>
    </main>
  );
}

export default App;
