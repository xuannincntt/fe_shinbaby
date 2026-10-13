# Shinbaby frontend

Frontend Angular 21 của Shinbaby, dùng standalone components, reactive forms và Angular SSR.

## Chạy local

Yêu cầu Node.js 24 và backend chạy tại `http://localhost:8081`.

```powershell
npm ci
npm start
```

Mở http://localhost:4200. Development server proxy `/api` sang backend qua `proxy.conf.json`.

## Kiểm tra và build

```powershell
npm run format:check
npm test -- --watch=false
npm run build
```

Kết quả build SSR nằm tại `dist/shinbaby-web`. Chạy bản SSR bằng:

```powershell
$env:API_INTERNAL_URL = 'http://localhost:8081'
$env:PUBLIC_ORIGIN = 'http://localhost:4000'
npm run serve:ssr:shinbaby-web
```

## CI/CD trên GitHub

Workflow `.github/workflows/frontend-ci-cd.yml` chạy khi có pull request hoặc push vào `main`:

1. Cài dependency bằng `npm ci`.
2. Kiểm tra Prettier và chạy unit test.
3. Build production Angular SSR và lưu bundle trong GitHub Actions Artifacts trong 14 ngày.
4. Với push vào `main`, build Docker image và publish lên GitHub Container Registry.
5. Build bản demo tĩnh và deploy lên https://xuannincntt.github.io/fe_shinbaby/.

Docker image được gắn hai tag:

- `ghcr.io/xuannincntt/fe_shinbaby:latest`
- `ghcr.io/xuannincntt/fe_shinbaby:sha-<commit>`

Workflow dùng `GITHUB_TOKEN` do GitHub cấp, không cần tạo Personal Access Token. Có thể chạy thủ công từ tab **Actions → Frontend CI/CD → Run workflow**.

Bản GitHub Pages dùng dữ liệu mẫu vì dịch vụ hosting tĩnh không chạy được Spring Boot và Oracle. Bản local, Docker và production SSR vẫn sử dụng backend thật. Cấu hình Pages nằm trong build configuration `github-pages`, với base path `/fe_shinbaby/`.

Việc triển khai image lên máy chủ chưa được tự động hóa vì cần địa chỉ máy chủ và phương thức triển khai cụ thể. Các biến SSR khi chạy container gồm `API_INTERNAL_URL`, `PUBLIC_ORIGIN` và `SSR_ALLOWED_HOSTS`.
