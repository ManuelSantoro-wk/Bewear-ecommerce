# 🛒 BEWEAR Bootcamp

> A full-stack e-commerce application built during the BEWEAR Bootcamp — leveraging **Next.js**, **Drizzle ORM**, **shadcn/ui**, **Tailwind CSS**, and **React Query**. This project delivers a modern, responsive shopping experience, complete with product browsing, category filtering, cart management, checkout flow, and order tracking.

🌐 **Live Demo:** [bewear-bootcamp-amber.vercel.app](https://bewear-bootcamp-amber.vercel.app/)

---

## ✨ Features

- **Home Page (Mobile-first + Desktop Ready):**
  - Hero banner with responsive design
  - Featured sections: *Best Sellers* & *New Products* with horizontal scrolling
  - Brand showcase and category highlights

- **Catalog & Search:**
  - Category-based navigation
  - Dynamic search with live results

- **Product Page:**
  - Variant selection
  - Add-to-cart & Buy-now actions

- **Cart & Checkout:**
  - Responsive cart summary
  - Address/Identification step (select or add new)
  - Purchase confirmation page
  - Visual step indicator for checkout flow

- **Authentication:**
  - Sign in / Sign up with form validation
  - Google social login
  - Fully responsive design

- **User Orders:**
  - "My Orders" dashboard with order history
  - Expandable accordion for detailed view
  - Status badges for quick updates

---

## 🛠 Tech Stack

| Layer         | Technologies                              |
|---------------|-------------------------------------------|
| Frontend      | Next.js (App Router), React               |
| UI/CSS        | Tailwind CSS, shadcn/ui                   |
| State         | React Query, Custom Hooks                 |
| Backend/DB    | Drizzle ORM (PostgreSQL or compatible DB) |
| Auth          | Custom `authClient` with Google Sign-in   |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── cart/               # Checkout-related pages
│   ├── authentication/     # Login & signup
│   ├── busca/              # Search results
│   └── category/           # Category listings
├── components/
│   ├── common/              # Shared UI components
│   ├── ui/                  # UI primitives
│   └── cart/                # Cart components
├── db/                      # Drizzle schema & queries
└── helpers/                 # Utility functions
    ├── money.ts
    └── address.ts
public/                      # Assets, banners, svgs
```

---

## 🎨 UI & UX Highlights

- Mobile-first layout with responsive grid  
- Step indicator for checkout progress  
- Order status badges for instant recognition  
- Smooth accordion animations for order details  

---

## 👤 Autor Mid-level Java Full Stack Developer
**Guilherme Baltazar Vericimo de Sales**

<a href="https://www.linkedin.com/in/guilherme-baltazar-0028361a1" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a> 
<a href="https://instagram.com/yguilhermeb" target="_blank"><img src="https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white" target="_blank"></a>

