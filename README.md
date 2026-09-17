# GenX Backend Developer Test 2026

Bài làm gồm ERD, danh sách API, bộ tạo lịch học, bộ tính hóa đơn và hai REST endpoint. [ERD](docs/erd.md), [ảnh ERD PNG](docs/erd.png) và [API list](docs/api-list.md) nằm trong `/docs`.

## Tech stack

- Node.js 20+, TypeScript, Express
- Zod để kiểm tra request
- Vitest và Supertest để kiểm tra logic và HTTP
- Không dùng database: đề chỉ yêu cầu thiết kế ERD, hai phép tính và hai endpoint chạy được

## Chạy local

```bash
npm install
npm run dev
```

Server mặc định ở `http://localhost:3000`. Có thể đặt biến môi trường `PORT` để đổi cổng.

`GET /health` trả `{ "status": "ok" }` để dịch vụ triển khai kiểm tra trạng thái.

```bash
npm test
npm run typecheck
npm run build
npm start
```

`npm start` chạy code đã build trong `dist`; hãy chạy `npm run build` trước.

### Thử API bằng Postman

Chạy `npm run dev`, rồi trong Postman chọn **Import → Files** và chọn [`docs/GenX Backend Test.postman_collection.json`](docs/GenX%20Backend%20Test.postman_collection.json). Collection có sẵn hai request POST, URL `http://localhost:3000` và phép kiểm tra response. Bấm **Send** cho từng request; tab **Test Results** cho biết phép kiểm tra đạt hay lỗi. Không cần dùng CMD để gọi API.

## Triển khai Render

File [`render.yaml`](render.yaml) khai báo Web Service gói Free, build bằng `npm ci && npm run build`, chạy bằng `npm start` và kiểm tra `/health`. Ứng dụng đọc cổng từ biến môi trường `PORT` do Render cung cấp. Sau khi deploy, đổi biến `baseUrl` trong Postman collection thành URL `https://<tên-dịch-vụ>.onrender.com` để thử hai API qua mạng.

## Cấu trúc

```text
docs/               ERD và danh sách API thiết kế
src/routes/         Định tuyến HTTP
src/controllers/    Nhận request và gửi response
src/services/       Quy tắc tính lịch và hóa đơn
src/validators/     Schema Zod cho input
src/utils/          Hàm xử lý ngày UTC
src/middleware/     Định dạng lỗi HTTP
tests/              Unit test và HTTP integration test
```

## API đã triển khai

### Tạo lịch học

```bash
curl -X POST http://localhost:3000/schedule/generate \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2026-01-01","totalClasses":16,"classWeekdays":[1,3],"holidays":["2026-04-30","2026-05-01"],"holidayRanges":[["2026-01-26","2026-02-05"]]}'
```

Kết quả có `endDate` và `fullSchedule` gồm đúng 16 ngày; với dữ liệu trên, `endDate` là `2026-03-10`.

### Tính hóa đơn

```bash
curl -X POST http://localhost:3000/invoice/calc \
  -H "Content-Type: application/json" \
  -d '{"courseType":"MONTHLY","basePrice":1500000,"months":2,"promoCode":"SAVE10","canceledClasses":1,"refundPerClass":40000}'
```

Response:

```json
{
  "subtotal": 3000000,
  "discount": 300000,
  "refund": 40000,
  "total": 2660000
}
```

### Lỗi input

Input không hợp lệ nhận HTTP 400:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [{ "field": "months", "reason": "must be between 1 and 3 for MONTHLY" }]
  }
}
```

Lỗi server ngoài dự kiến nhận HTTP 500 với thông báo chung, không lộ stack trace qua response.

## Quy tắc và giả định

- Dùng **UTC** thống nhất cho tính toán ngày. Input/output chỉ dùng `YYYY-MM-DD`; ngày không tồn tại như `2026-02-30` bị từ chối.
- `startDate` được tính **inclusive**. `classWeekdays`: `0=Mon` đến `6=Sun`; thứ trùng được loại bỏ và sắp tăng trước khi tạo lịch.
- `holidayRanges` nghỉ **inclusive cả ngày bắt đầu và ngày kết thúc**. Ngày vừa có trong `holidays` vừa thuộc một range vẫn chỉ là ngày nghỉ.
- `totalClasses` là số nguyên dương; `classWeekdays` không được rỗng; range có ngày bắt đầu sau ngày kết thúc bị từ chối.
- `MONTHLY` cần `months` là số nguyên 1–3. `FULL_COURSE` không cần `months`; nếu được truyền, giá trị này không tham gia tính toán.
- `promoCode` nhận `SAVE10`, `FLAT50K` hoặc `null`; mã khác bị từ chối. Giảm 10% được làm tròn xuống; giảm giá không vượt `subtotal`.
- `canceledClasses` là số nguyên không âm; các giá trị tiền là số hữu hạn không âm. `refund` được trả theo công thức, còn `total` được chặn tối thiểu 0.
- Endpoint nhận đủ các trường của mẫu request trong đề (riêng `months` có thể bỏ qua cho `FULL_COURSE`); trường lạ bị từ chối.
