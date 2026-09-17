# Danh sách API đề xuất

Hai endpoint đánh dấu **đã triển khai**. Các endpoint còn lại là bản thiết kế theo yêu cầu Phần A, chưa có controller hoặc cơ sở dữ liệu.

| Phương thức | Đường dẫn | Mục đích |
| --- | --- | --- |
| POST | `/courses` | Tạo khóa học |
| GET | `/courses` | Liệt kê khóa học |
| GET | `/courses/:id` | Xem chi tiết khóa học |
| POST | `/classes` | Tạo lớp thuộc khóa học |
| GET | `/classes` | Liệt kê lớp, lọc theo khóa học |
| GET | `/classes/:id/sessions` | Xem lịch từng buổi của lớp |
| POST | `/enrollments` | Đăng ký lớp |
| PATCH | `/enrollments/:id/status` | Cập nhật trạng thái đăng ký |
| GET | `/students/:id/enrollments` | Xem các lớp học viên đã đăng ký |
| POST | `/invoices` | Tạo hóa đơn cho lượt đăng ký |
| POST | `/invoices/:id/payments` | Ghi nhận thanh toán |
| POST | `/service-requests` | Gửi yêu cầu dịch vụ |
| GET | `/service-requests` | Liệt kê yêu cầu dịch vụ |
| PATCH | `/service-requests/:id/status` | Cập nhật trạng thái yêu cầu |
| POST | `/schedule/generate` | **Đã triển khai:** tạo lịch học và ngày kết thúc |
| POST | `/invoice/calc` | **Đã triển khai:** tính học phí, giảm giá và hoàn tiền |

Các API quản trị cần xác thực và phân quyền khi triển khai thực tế. Danh sách này chỉ mô tả phạm vi dữ liệu, đúng yêu cầu “list, không cần implement tất cả” của đề.
