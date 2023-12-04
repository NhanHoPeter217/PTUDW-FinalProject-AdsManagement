<style>
  div p {
    text-align: justify;
    text-justify: inter-word;
  }
  
  mark {
    background: none !important;
    font-family: monospace;
    color: #c0341d;
    font-weight: bold;
  }
  
  .markdown-body code {
    color: #c0341d !important;
    background-color: #fbe5e1 !important;
    font-weight: bold;
  }
  
  pre>code.hljs {
    color: inherit !important;
    background-color: inherit !important;
    font-weight: inherit !important;
  }
</style>

# PTUDW - Final Project - Ads Management

:::info
**Yêu cầu**: xây dựng bộ ứng dụng web **Quản lý bảng quảng cáo** cho thành phố X gồm các phân hệ & chức năng sau
:::

## 1. Phân hệ người dân

:::warning

- Một ứng dụng **web tĩnh**, sử dụng công nghệ `ajax` để lấy dữ liệu và công nghệ `javascript` hoặc `jQuery` để cài đặt các xử lý cần thiết
- Không được phép sử dụng các công nghệ SPA như `reactjs`, `angular`, ...
  :::

### Trang chủ

- Hiển thị trên bản đồ các điểm được phép đặt bảng quảng cáo ở thành phố cùng các thông tin đi kèm được Sở Văn Hoá - Thể Thao cung cấp
  - Địa chỉ
  - Khu vực (Phường, Quận)
  - Loại vị trí (Đất công/Công viên/Hành lang an toàn giao thông, Đất tư nhân/Nhà ở riêng lẻ, Trung tâm thương mại, Chợ, Cây xăng, Nhà chờ xe buýt)
  - Hình thức quảng cáo (Cổ động chính trị, Quảng cáo thương mại, Xã hội hoá)
  - Hình ảnh điểm đặt bảng quảng cáo
  - Thông tin về việc điểm đặt đã được quy hoạch hay chưa?

![Bản đồ các điểm đặt bảng quảng cáo](https://res.cloudinary.com/nndkhoa9/image/upload/v1696436036/ptudw/o1vxg9be4bqwuavi6utw.png)

- Khi người dân chọn 1 điểm đặt quảng cáo trên bản đồ, trang chủ đồng thời hiển thị thông tin **các bảng quảng cáo** đang được đặt tại một điểm, gồm các thông tin:
  - Loại bảng quảng cáo (Trụ bảng hiflex, Trụ màn hình điện tử LED, Trụ hộp đèn, Bảng hiflex ốp tường, Màn hình điện tử ốp tường, Trụ treo băng rôn dọc, Trụ treo băng rôn ngang, Trụ/Cụm pano, Cổng chào, Trung tâm thương mại)
  - Kích thước (Vd: 2.5m x 10m)

![](https://res.cloudinary.com/nndkhoa9/image/upload/v1696436695/ptudw/xxwgyxmgk4lkytmr4tyn.png)

- Người dân có thể xem thêm thông tin chi tiết của một bảng quảng cáo

  - Hình ảnh bảng quảng cáo
  - Ngày hết hạn của hợp đồng quảng cáo

- Khi người dân chọn 1 điểm bất kỳ trên bản đồ, trang chủ thể hiện thông tin địa chỉ sơ bộ của điểm được chọn (reverse geocoding)

![](https://res.cloudinary.com/nndkhoa9/image/upload/v1696436874/ptudw/mywv1irxofzzi9mogioq.png)

- Người dân có thể gửi báo cáo về Sở VH-TT về các vấn đề họ phát hiện liên quan đến **một bảng quảng cáo**, hoặc **một địa điểm** trên bản đồ. Thông tin báo cáo gửi về gồm các thông tin:
  - Hình thức báo cáo (Tố giác sai phạm, Đăng ký nội dung, Đóng góp ý kiến, Giải đáp thắc mắc)
  - Họ tên người gửi báo cáo
  - Email
  - Điện thoại liên lạc
  - Nội dung báo cáo
    - Hỗ trợ `WYSIWYG`
      - tinymce (http://tiny.cloud)
      - ckeditor (https://ckeditor.com)
      - quilljs (https://quilljs.com)
      - summernote (https://summernote.org)
  - Hình ảnh minh hoạ, tối đa 02 hình
- Ứng dụng cần có cơ chế phân biệt người-máy (captcha) để hạn chế tình trạng kẻ xấu dùng phần mềm tự động (BOT) gửi báo cáo rác về Sở VH-TT
- Người dân (**không có tài khoản**) được phép xem lại các báo cáo mà mình đã gửi về Sở VH-TT ngay trên bản đồ cùng các trạng thái xử lý của Sở VH-TT cho báo cáo đó, nhằm tránh tình trạng họ gửi lại báo cáo cho 1 điểm/bảng đã từng được chính họ báo cáo trước đây
- Ứng dụng cho phép người dân ẩn/hiện các báo cáo, các điểm đặt quảng cáo đã quy hoạch / chưa quy hoạch trên bản đồ

### Xử lý trên bản đồ

- Zoom (phóng to, thu nhỏ)
- Pan (kéo)
- Các điểm có trạng thái khác nhau nên có màu sắc hoặc icon khác nhau (vd: điểm đã quy hoạch có màu sắc khác điểm chưa quy hoạch, báo cáo đã xử lý có icon khác báo cáo chưa xử lý, ...)
- Lấy vị trí hiện tại của người dân
- Nâng cao: gom nhóm các điểm trên bản đồ khi chúng ở quá gần nhau
- Nâng cao: cho phép bản đồ di chuyển nhanh đến một địa chỉ nào đó (geocoding)

## 2. Phân hệ cán bộ Phường

:::warning
Một ứng dụng **web động**, **server-side render**, sử dụng công nghệ `expressjs`
:::

### Trang chủ (Bản đồ)

- Xem thông tin các điểm đặt quảng cáo cùng các bảng quảng cáo có trong Phường mình
- Xem các báo cáo được người dân gửi về Phường mình

### Danh sách điểm đặt quảng cáo & bảng quảng cáo

- Xem dưới dạng danh sách (table)
  - Thông tin tương tự phân hệ người dân
- Gửi yêu cầu chỉnh sửa thông tin điểm đặt quảng cáo, bảng quảng cáo về Sở VH-TT. Một yêu cầu nên có các thông tin sau:
  - Thông tin mới của điểm đặt quảng cáo, bảng quảng cáo
  - Thời điểm xin chỉnh sửa
  - Lý do chỉnh sửa

### Xử lý các báo cáo do người dân gửi về

- Xem các báo cáo dưới dạng danh sách (table), các thông tin có thể thể hiện trên danh sách gồm: thời điểm gửi, thông tin người gửi, điểm/bảng hoặc địa chỉ liên quan, loại hình báo cáo
- Xem chi tiết báo cáo (cán bộ xem thêm được hình ảnh minh hoạ và nội dung báo cáo)
- Cán bộ thay đổi tình trạng xử lý của từng báo cáo (Đang xử lý, Đã xử lý xong) & cập nhật thông tin cách thức xử lý cho từng báo cáo
- Người dân gửi báo cáo sẽ nhận được email thông báo về tình trạng và cách thức xử lý cho từng báo cáo một cách tự động

### Cấp phép quảng cáo cho công ty

- Cán bộ Phường tạo yêu cầu cấp phép quảng cáo, gồm các thông tin
  - Bảng quảng cáo & điểm đặt tương ứng
  - Nội dung quảng cáo sẽ đặt kèm hình ảnh minh hoạ
  - Thông tin công ty đặt quảng cáo
  - Thông tin liên lạc của công ty (email, điện thoại, địa chỉ, ...)
  - Ngày bắt đầu hợp đồng
  - Ngày kết thúc hợp đồng
- Cán bộ Phường có thể xem lại danh sách các cấp phép theo dạng danh sách riêng biệt, hoặc xem trực tiếp ở màn hình xem thông tin bảng quảng cáo
- Đối với các yêu cầu cấp phép chưa được duyệt bởi Sở VH-TT, cán bộ Phường có thể huỷ bỏ các yêu cầu này.

## 3. Phân hệ cán bộ Quận

- Tương tự phân hệ cán bộ Phường, khác biệt là cán bộ Quận được phép thao tác trên các điểm đặt quảng cáo, các bảng quảng cáo, các báo cáo của cả Quận (gồm nhiều Phường)
- Cán bộ Quận có thể lựa chọn các Phường mình quan tâm để xử lý
  - Ví dụ: cán bộ Quận Bình Thạnh có thể lựa chọn Phường 17, 19, 21 để xem và xử lý thông tin, thay vì xem toàn bộ thông tin của 26 phường trong quận

## 4. Phân hệ cán bộ Sở VH-TT

- Quản lý danh sách Quận, Phường
- Quản lý danh sách các loại hình quảng cáo, các loại hình thức báo cáo, ...
- Quản lý các điểm đặt quảng cáo
- Quản lý các bảng quảng cáo
- Xét duyệt các yêu cầu chỉnh sửa điểm quảng cáo, bảng quảng cáo được gửi từ Phường, Quận
- Xem danh sách & xét duyệt các yêu cầu cấp phép quảng cáo theo từng Phường, Quận
- Xem thống kê các báo cáo & cách thức xử lý của từng Phường, Quận
- Tạo tài khoản cho các cán bộ Phường, Quận
- Phân công khu vực quản lý (Phường, Quận) cho các tài khoản

> _Lưu ý_: `Quản lý` bao gồm các thao tác `Xem danh sách`, `Xem chi tiết`, `Thêm`, `Xoá`, `Cập nhật` và các thao tác chuyên biệt khác

> _Lưu ý_: Phải dùng **bản đồ** cho việc nhập liệu kinh độ, vĩ độ các điểm đặt quảng cáo, các bảng quảng cáo, ...

## 5. Các tính năng chung cho các phân hệ cán bộ

### Đăng nhập

- Tự cài đặt
- Hoặc sử dụng `passportjs` (http://www.passportjs.org)
- _Khuyến khích_ cài đặt thêm chức năng đăng nhập qua Google, Facebook, Twitter, Github, ...

### Cập nhật thông tin cá nhân

- Họ tên
- Ngày tháng năm sinh
- Email
- Điện thoại liên lạc

### Đổi mật khẩu

- Mật khẩu được mã hoá bằng thuật toán `bcrypt`

### Quên mật khẩu

- Yêu cầu xác nhận bằng email OTP

:::warning
**Email OTP** phải có định dạng nghiêm túc (xem ví dụ bên dưới)
:::

![](https://i.imgur.com/SVQZtPl.png)

## Các Yêu cầu khác

### Yêu cầu kỹ thuật

- Web App **MVC**
- Technical Stack
  - framework: `expressjs`
  - view engine: `handlebars/ejs`
  - db: `mysql/postgres/mongodb`
  - client side scripting language: `vanilla js`, `jQuery`
  - Map
    - Vietbando (https://api.vietbando.com)
    - Mapbox (https://www.mapbox.com)
    - Google Map (https://developers.google.com/maps)
    - Nokia HERE Map (https://developer.here.com/)
    - OpenStreet Map (https://www.openstreetmap.org)

### Yêu cầu dữ liệu

- Cần có ít nhất 50 điểm đặt quảng cáo nằm rải rác ở 2 quận, mỗi điểm đặt & bảng quảng cáo có thông tin & hình ảnh đầy đủ.
- Chỉ hoàn thành **ĐÚNG** các chức năng được yêu cầu
  - Có thể bổ sung các hiệu ứng để tăng tính tiện dụng của từng chức năng cụ thể

### Yêu cầu quản lý mã nguồn

- Sinh viên cần upload mã nguồn lên ==github== từ lúc bắt đầu thực hiện đồ án.
- Nhóm nào lịch sử commit/push gần như không có ➠ 0đ.
