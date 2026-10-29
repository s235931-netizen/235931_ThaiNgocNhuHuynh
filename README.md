# Food Management System

## 1. Giới thiệu

Food Management System là ứng dụng quản lý món ăn, hỗ trợ hiển thị danh sách, tìm kiếm, thêm, cập nhật và xóa món ăn. Dữ liệu được lưu trữ trên MongoDB Atlas.

## 2. Công nghệ sử dụng

- Frontend: React, Vite, Axios
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Container: Docker
- Source code: GitHub
- Deployment: Render
- Container Registry: Docker Hub

## 3. Cấu trúc dự án

- `frontend/`: mã nguồn giao diện React.
- `backend/`: mã nguồn REST API.
- `.gitignore`: loại trừ các tệp không đưa lên Git.
- `README.md`: tài liệu dự án.

## 4. Chạy ứng dụng tại máy tính

### Backend

Mở terminal tại thư mục `backend`:

```bash
npm install
```

Tạo file `.env` ở thư mục gốc dự án, cấu hình `MONGODB_URI` và `PORT=5000`, sau đó chạy:

```bash
npm start
```

Lệnh chạy giả định `backend/package.json` có script `start`.

### Frontend

Mở terminal khác tại thư mục `frontend`:

```bash
npm install
```

Tạo file `.env` trong `frontend` với biến:

```env
VITE_API_URL=http://localhost:5000
```

Khởi động giao diện:

```bash
npm run dev
```

## 5. Các API chính

- `GET /health`: kiểm tra trạng thái backend.
- `GET /api/foods`: lấy danh sách món ăn.
- `GET /api/foods/:id`: lấy chi tiết món ăn.
- `POST /api/foods`: thêm món ăn.
- `PUT /api/foods/:id`: cập nhật món ăn.
- `DELETE /api/foods/:id`: xóa món ăn.

## 6. Triển khai trực tuyến

- GitHub: https://github.com/s235931-netizen/235931_ThaiNgocNhuHuynh
- Render Backend: https://food-backend-235931.onrender.com
- Render Frontend: DAN_URL_FRONTEND_RENDER
- Backend Health Check: https://food-backend-235931.onrender.com/health
- API món ăn: https://food-backend-235931.onrender.com/api/foods

## 7. Docker Hub

- Backend image: https://hub.docker.com/r/nhuhuynh06/food-backend
- Frontend image: https://hub.docker.com/r/nhuhuynh06/food-frontend

## 8. Database

- Database: `235931_ThaiNgocNhuHuynh` (đối chiếu tên thực tế trên MongoDB Atlas).
- Collection: `foods`.

Không đưa chuỗi kết nối MongoDB, mật khẩu hoặc thông tin xác thực vào repository công khai.

## 9. Bảo mật

Các thông tin nhạy cảm được cấu hình qua biến môi trường. File `.env` không được đưa lên GitHub.
