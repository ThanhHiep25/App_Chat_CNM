# 💬 Ứng dụng Chat Đa Nền Tảng với Firebase Realtime Database

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Ứng dụng này là một giải pháp chat đa nền tảng, bao gồm ứng dụng di động (React Native) và ứng dụng web (ReactJS), được xây dựng dựa trên sức mạnh của Firebase Realtime Database cho việc quản lý dữ liệu thời gian thực. Ứng dụng cung cấp các tính năng cơ bản của một ứng dụng chat hiện đại, cho phép người dùng kết nối và trò chuyện một cách dễ dàng trên nhiều thiết bị.

## 🚀 Tính năng Nổi bật

* **Đăng ký và Đăng nhập:** Hệ thống xác thực người dùng an toàn với Firebase Authentication.
* **Tạo và Quản lý Phòng Chat:** Người dùng có thể tạo các phòng chat công khai hoặc riêng tư.
* **Nhắn tin Thời gian Thực:** Gửi và nhận tin nhắn văn bản ngay lập tức nhờ Firebase Realtime Database.
* **Hiển thị Trạng thái Hoạt động:** Xem trạng thái trực tuyến của người dùng khác.
* **Gửi Hình ảnh:** Chia sẻ hình ảnh dễ dàng trong cuộc trò chuyện.
* **Thông báo Tin nhắn Mới:** Nhận thông báo khi có tin nhắn mới (tùy thuộc vào cấu hình nền tảng).
* **Lịch sử Tin nhắn:** Xem lại các tin nhắn đã gửi và nhận trong phòng chat.
* **Giao diện Người dùng Thân thiện:** Thiết kế giao diện trực quan và dễ sử dụng trên cả web và ứng dụng di động.
* **Đa Nền Tảng:** Trải nghiệm chat liền mạch trên trình duyệt web và thiết bị di động (iOS và Android).

## 🛠️ Công nghệ Sử dụng

### Ứng dụng Web (ReactJS)

* **ReactJS:** Thư viện JavaScript phổ biến để xây dựng giao diện người dùng tương tác.
* **Firebase:** Nền tảng phát triển ứng dụng di động và web của Google, bao gồm:
    * **Firebase Authentication:** Quản lý xác thực người dùng (email/password, Google, Facebook,...).
    * **Firebase Realtime Database:** Cơ sở dữ liệu NoSQL thời gian thực để lưu trữ và đồng bộ dữ liệu.
    * **Firebase Storage:** Lưu trữ tệp, bao gồm hình ảnh.
* **Các thư viện UI (tùy chọn):**
    * **Material-UI (MUI):** Bộ component UI tuân theo Material Design.
    * **Ant Design:** Một bộ component UI phong phú cho các ứng dụng web doanh nghiệp.
    * **Chakra UI:** Một bộ component UI đơn giản và dễ tùy chỉnh.
    * **Styled-components hoặc Emotion:** CSS-in-JS để quản lý kiểu dáng.
* **React Router:** Điều hướng giữa các trang trong ứng dụng web.
* **Redux hoặc Context API (tùy chọn):** Quản lý trạng thái ứng dụng.
* **Axios hoặc Fetch API:** Thực hiện các yêu cầu HTTP (nếu cần).
* **Date-fns hoặc Moment.js (tùy chọn):** Xử lý định dạng ngày và giờ.

### Ứng dụng Di động (React Native)

* **React Native:** Framework để xây dựng ứng dụng di động đa nền tảng bằng JavaScript và React.
* **Firebase:** Tương tự như ứng dụng web, sử dụng:
    * **Firebase Authentication:** Xác thực người dùng.
    * **Firebase Realtime Database:** Dữ liệu thời gian thực.
    * **Firebase Storage:** Lưu trữ hình ảnh.
* **Các thư viện UI (tùy chọn):**
    * **React Native Elements:** Bộ component UI được xây dựng trên nền tảng React Native.
    * **NativeBase:** Một framework UI phong phú cho React Native.
    * **Gluestack UI:** Một framework UI có khả năng tùy biến cao.
* **React Navigation:** Điều hướng giữa các màn hình trong ứng dụng di động.
* **Redux hoặc Context API (tùy chọn):** Quản lý trạng thái ứng dụng.
* **Async Storage:** Lưu trữ dữ liệu cục bộ (ví dụ: token đăng nhập).
* **react-native-image-picker:** Chọn ảnh từ thư viện hoặc chụp ảnh từ camera.
* **react-native-push-notification (tùy chọn):** Triển khai thông báo đẩy.
* **react-native-gesture-handler và react-native-reanimated (tùy chọn):** Xử lý cử chỉ và tạo hiệu ứng động.

## ⚙️ Cài đặt và Chạy

### Yêu cầu

* **Node.js và npm (hoặc yarn):** Cài đặt trên máy phát triển của bạn.
* **Firebase Project:** Đã tạo một dự án Firebase với Authentication và Realtime Database được kích hoạt.
* **Firebase CLI (tùy chọn):** Để triển khai ứng dụng web (nếu cần).
* **Expo CLI hoặc môi trường phát triển React Native:** Để chạy ứng dụng di động.

### Các bước cài đặt

#### Ứng dụng Web (ReactJS)

1.  **Clone repository:**
    ```bash
    git clone <địa_chỉ_repository_web>
    cd <tên_thư_mục_web>
    ```
2.  **Cài đặt các dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```
3.  **Cấu hình Firebase:**
    * Tạo một file `.env.local` (hoặc tương tự tùy theo thiết lập của bạn) và thêm cấu hình Firebase của bạn:
        ```
        REACT_APP_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
        REACT_APP_FIREBASE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
        REACT_APP_FIREBASE_DATABASE_URL=<YOUR_FIREBASE_DATABASE_URL>
        REACT_APP_FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
        REACT_APP_FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
        REACT_APP_FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
        ```
    * Hoặc, bạn có thể cấu hình trực tiếp trong file cấu hình Firebase của ứng dụng.
4.  **Chạy ứng dụng:**
    ```bash
    npm start
    # hoặc
    yarn start
    ```
    Ứng dụng web sẽ thường chạy tại `http://localhost:3000`.

#### Ứng dụng Di động (React Native)

1.  **Clone repository:**
    ```bash
    git clone <địa_chỉ_repository_app>
    cd <tên_thư_mục_app>
    ```
2.  **Cài đặt các dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```
3.  **Cấu hình Firebase:**
    * Tạo một file cấu hình Firebase (ví dụ: `src/firebaseConfig.js` hoặc `.env`) và thêm cấu hình Firebase của bạn tương tự như trên.
4.  **Chạy ứng dụng:**
    * **Sử dụng Expo CLI:**
        ```bash
        npx expo start
        ```
        Quét mã QR bằng ứng dụng Expo Go trên thiết bị di động của bạn (iOS hoặc Android) hoặc chạy trên trình giả lập/thiết bị ảo.
    * **Sử dụng môi trường phát triển React Native thông thường:**
        * **iOS:**
            ```bash
            npx react-native run-ios
            ```
        * **Android:**
            ```bash
            npx react-native run-android
            ```
        Đảm bảo bạn đã cài đặt Xcode (cho iOS) và Android Studio (cho Android) và cấu hình môi trường phát triển phù hợp.

## 🛡️ Giấy phép

Ứng dụng này được cấp phép theo giấy phép [MIT](https://opensource.org/licenses/MIT).

## 🙏 Đóng góp

Mọi đóng góp đều được hoan nghênh! Nếu bạn có ý tưởng cải thiện, báo cáo lỗi hoặc muốn thêm tính năng mới, vui lòng tạo một pull request.

## 📞 Liên hệ

[hiepnguyen.250402@gmail.com]
[https://github.com/ThanhHiep25]

---
