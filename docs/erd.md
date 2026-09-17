# ERD đề xuất

```mermaid
erDiagram
    USER {
        uuid id PK
        string email UK
        string full_name
        enum role "STUDENT | STAFF | MANAGER | TEACHER"
    }
    COURSE {
        uuid id PK
        string code UK
        string name
        string description
        enum course_type "MONTHLY | FULL_COURSE"
        decimal base_price
        string textbook
    }
    CLASS {
        uuid id PK
        uuid course_id FK
        uuid teacher_id FK
        uuid support_staff_id FK
        string code UK
        date start_date
        date end_date
        string meet_url
        int capacity
    }
    SCHEDULE_SESSION {
        uuid id PK
        uuid class_id FK
        date session_date
        enum status "PLANNED | COMPLETED | CANCELED"
    }
    ENROLLMENT {
        uuid id PK
        uuid student_id FK
        uuid class_id FK
        enum status "REGISTERED | CONSULTED | PAID | COMPLETED"
        datetime registered_at
    }
    INVOICE {
        uuid id PK
        uuid enrollment_id FK
        int billing_month
        decimal subtotal
        decimal discount
        decimal refund
        decimal total
        date due_date
        enum status "UNPAID | PAID | OVERDUE"
    }
    PAYMENT {
        uuid id PK
        uuid invoice_id FK
        decimal amount
        datetime paid_at
        string transaction_reference
    }
    SERVICE_REQUEST {
        uuid id PK
        uuid customer_user_id FK
        uuid assigned_staff_id FK
        string contact_name
        string contact_email
        string service_name
        enum status "NEW | CONTACTED | IN_PROGRESS | COMPLETED | CANCELED"
        int rating
        datetime requested_at
    }

    COURSE ||--o{ CLASS : contains
    USER ||--o{ CLASS : teaches
    USER ||--o{ CLASS : supports
    CLASS ||--o{ SCHEDULE_SESSION : schedules
    USER ||--o{ ENROLLMENT : joins
    CLASS ||--o{ ENROLLMENT : has
    ENROLLMENT ||--o{ INVOICE : billed_by
    INVOICE ||--o{ PAYMENT : paid_by
    USER |o--o{ SERVICE_REQUEST : requests
    USER |o--o{ SERVICE_REQUEST : handles
```

## Lý do thiết kế

1. `Course` chứa thông tin khóa chung; `Class` là lớp cụ thể có lịch, giáo viên và sĩ số riêng.
2. `ScheduleSession` lưu từng buổi để theo dõi lịch và buổi bị hủy, thay vì chỉ lưu ngày kết thúc.
3. `Enrollment` nối `User` học viên với `Class`, đồng thời giữ trạng thái đăng ký; cần ràng buộc duy nhất `(student_id, class_id)`.
4. `Invoice` gắn với lượt đăng ký để một khóa đóng theo tháng có thể có nhiều kỳ thu; `billing_month` để trống cho gói trọn khóa.
5. `Payment` tách khỏi `Invoice` vì một hóa đơn có thể được thanh toán qua nhiều giao dịch.
6. Truy cập link học có thể tính từ `Enrollment` và hóa đơn quá hạn; không cần lưu một cờ dễ lệch dữ liệu.
7. `ServiceRequest` cho phép khách chưa có tài khoản bằng `contact_name` và `contact_email`; `customer_user_id` được để trống trong trường hợp đó.
8. Các khóa ngoại từ lớp và yêu cầu dịch vụ đến nhân sự phải kiểm tra role tương ứng ở tầng nghiệp vụ.

ERD là thiết kế dữ liệu cho Phần A. Bài code chỉ triển khai hai nghiệp vụ và hai endpoint được yêu cầu ở Phần B/C; chưa có cơ sở dữ liệu.
