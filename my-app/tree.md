Hướng Dẫn Sử Dụng Công Cụ CLI struct
Công cụ struct CLI giúp bạn quản lý cấu trúc thư mục dự án một cách hiệu quả. Nó có hai chức năng chính: tạo bản đồ cấu trúc từ thư mục hiện có và xây dựng thư mục/file dựa trên một bản đồ cấu trúc.

Chức năng 1: Tạo cấu trúc cây từ một thư mục 🌳
Chức năng này cho phép bạn tạo một bản đồ cấu trúc thư mục của dự án hiện tại và xuất ra một file. Điều này rất hữu ích khi bạn muốn ghi lại hoặc chia sẻ kiến trúc của một dự án.

Ví dụ: Bạn muốn tạo một file my-project-structure.tree từ thư mục hiện tại, nhưng muốn bỏ qua thư mục dist.

1. Cài đặt
Nếu bạn chưa cài đặt struct CLI, hãy mở terminal và chạy lệnh sau:

npm i -g @structure-codes/cli

2. Cú pháp lệnh
Sử dụng lệnh struct với các tùy chọn phù hợp.

-o <tên_file_đầu_ra>: Chỉ định tên file .tree sẽ được tạo.

-i <tên_thư_mục_bỏ_qua>: Bỏ qua (không bao gồm) một hoặc nhiều thư mục cụ thể.

Lệnh mẫu:

struct -o my-project-structure.tree -i node-modules -i .next -i dist

3. Kết quả
Sau khi chạy lệnh, một file có tên my-project-structure.tree sẽ được tạo trong thư mục hiện hành của bạn. File này sẽ chứa cấu trúc cây của dự án, ngoại trừ thư mục dist đã được chỉ định bỏ qua.

Chức năng 2: Xây dựng cấu trúc từ một file cây 🏗️
Chức năng này thực hiện điều ngược lại: nó sẽ tạo ra các thư mục và file dựa trên một file .tree có sẵn. Điều này rất tiện lợi khi bạn muốn tái tạo một cấu trúc dự án đã định nghĩa trước.

Ví dụ: Bạn có một file frontend.tree và muốn tạo cấu trúc này trong một thư mục mới tên là new-website.

1. Cú pháp lệnh
Sử dụng lệnh struct build với các tùy chọn.

<tên_file_đầu_vào.tree>: Tên file .tree chứa định nghĩa cấu trúc.

-d <tên_thư_mục_đầu_ra>: Chỉ định thư mục nơi cấu trúc sẽ được tạo.

Lệnh mẫu:

struct build frontend.tree -d new-website

2. Kết quả
Một thư mục có tên new-website sẽ được tạo ra, và bên trong đó sẽ có tất cả các thư mục và file theo cấu trúc đã định nghĩa trong file frontend.tree của bạn.