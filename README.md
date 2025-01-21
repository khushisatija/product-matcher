# Product Matcher

A web application that utilizes Google Vision API to identify and match products from uploaded images or URLs with a preloaded product catalog. 
This application is designed to match products in the following categories of **women's clothing**:
- **Tops**: Includes t-shirts, crop tops, and other upper wear.
- **Dresses**: Covers a variety of styles like bodycon, A-line, maxi, and more.
- **Sweatshirts and Hoodies**: Includes casual and cozy outerwear options.
The system uses **Google Vision API** to detect labels from uploaded images and matches them with preloaded product metadata stored in `products.json`.

https://github.com/user-attachments/assets/f6ee8142-3e2e-4728-9e32-e6fb56d3acbd



The system uses **Google Vision API** to detect labels from uploaded images and matches them with preloaded product metadata stored in `products.json`.

---

## 🚀 Live Demo
Access the live application here: [Live URL](https://product-matcher-frontend.vercel.app/)

---

## 📂 Project Structure
- **Backend**: A FastAPI application that processes uploaded images, uses Google Vision API for label detection, and matches products based on similarity.
- **Frontend**: A React application that allows users to upload images or enter image URLs, view matching products, and filter results by category or price.

---

## ⚙️ Features
- Upload an image or provide an image URL for matching.
- Google Vision API for label detection and matching.
- Results displayed in a grid format with product details.
- Filters for category and price range.
- Deployed using Vercel for both Frontend and backend.

---
## 🛠️ Technologies Used
- Frontend: React
- Backend: FastAPI
- API: Google Vision API
- Deployment: Vercel

