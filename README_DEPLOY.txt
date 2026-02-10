# GamesWebsite Deployment Guide

This project has been organized for deployment. Follow these steps to host it.

## Directory Structure
Ensure your hosting directory looks like this:

```
/public_html
  /TheGBackend
    /api
      config.php
      ...
    /Login
      config.php
      ...
    db_config.php  <-- EDIT THIS
  /TheGFrontend
    /MGames
       (Upload the CONTENTS of the 'dist' folder here)
       index.html
       Games.html
       ...
```

## Database Configuration
1.  Open `/TheGBackend/db_config.php`.
2.  Update the `$server_name`, `$db_user`, `$db_pass`, and `$database_name` with your hosting provider's details.

## Frontend
The frontend performs relative links to the backend (e.g., `../../TheGBackend/...`).
*   Ensure that `TheGBackend` and `TheGFrontend` are in the same parent directory on the server.
*   The Main entry point is `/TheGFrontend/MGames/index.html`.

## Admin & User Pages
*   Log in via the "Login" button on the home page.
*   Admins are redirected to `/TheGBackend/Login/admin_page.php`.
*   Users are redirected to `/TheGBackend/Login/user_page.php`.

--------------------------------------------------------------------------------

## 4. دورة العمل (Team Workflow & Deployment Cycle)

### 1. التطوير المحلي (Local Development)
*   **مكان التعديل**: قم بتعديل الملفات داخل مجلد `src` أو `public` فقط.
*   **التجربة**: لفتح الموقع محلياً أثناء التطوير، استخدم:
    ```bash
    npm run dev
    ```
*   سيفتح لك رابط محلي (localhost) لتجربة التعديلات بشكل فوري.

### 2. رفع التعديلات للفريق (GitHub Collaboration)
*   عند الانتهاء من إضافة ميزة أو تعديل، ارفع الكود لـ GitHub ليسحبه بقية الفريق:
    ```bash
    git add .
    git commit -m "وصف مختصر للتعديلات"
    git push origin main
    ```
*   لسحب تعديلات الآخرين: `git pull origin main`

### 3. تحضير النسخة للرفع (Building for Production) - **هام جداً**
*   عندما تكون جاهزاً لرفع التعديلات للاستضافة، يجب "بناء" المشروع لإنتاج ملفات جاهزة ومضغوطة.
*   نفذ الأوامر التالية في مجلد `TheGFrontend/MGames`:
    ```bash
    npm run build
    node fix-build.js
    ```
*   هذا سيقوم بإنشاء/تحديث مجلد **`dist`**. هذا المجلد هو النسخة النهائية الجاهزة للرفع.

### 4. الرفع للاستضافة (Deployment)
*   ادخل إلى مجلد `TheGFrontend/MGames/dist`.
*   قم بضغط محتويات هذا المجلد أو رفعها كما هي إلى الاستضافة في: `public_html/TheGFrontend/MGames`.
*   **ملاحظة:** لا ترفع مجلد `src` أو `node_modules` إلى الاستضافة، فقط محتويات `dist`.
