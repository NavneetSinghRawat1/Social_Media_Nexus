# 🚀 Nexus

> 🌐 **A Full-Stack Community-Driven Social Platform Inspired by Reddit**

Built using the **PERN Stack** (**PostgreSQL, Express.js, React.js, Node.js**), Nexus empowers users to create and join communities, share content, engage through comments and reactions, participate in community discussions, and discover personalized content through an intelligent recommendation system.

---

## ✨ Overview

Nexus was developed to explore the architecture and implementation of a modern social media platform while addressing real-world challenges such as:

* 🔐 Secure Authentication & Authorization
* 📢 Community-Based Content Sharing
* 🤝 User Engagement & Interaction
* 🗄️ Relational Database Design
* ⚡ Scalable Content Delivery
* 🎯 Personalized Recommendations

By combining community interaction with intelligent content discovery, Nexus delivers an engaging and user-centric social experience.

---

## 🌟 Key Features

### 🔐 Authentication & Security

* ✅ JWT-based Authentication
* ✅ Password Hashing with bcrypt
* ✅ Protected API Routes


### 👥 Community System

* ✅ Create & Manage Communities
* ✅ Join or Leave Communities
* ✅ Community-Centric Content Organization

### 📝 Content Sharing

* ✅ Create Posts with Text & Images
* ✅ Media Uploads via ImageKit


### ❤️ User Engagement

* ✅ Like & React to Posts
* ✅ Comment on Discussions
* ✅ Interactive Social Experience

### 🎯 Personalized Feed

* ✅ Tag-Based Recommendation Engine
* ✅ Interest-Driven Content Discovery
* ✅ Engagement-Aware Feed Ranking

### ⚡ Performance Optimization

* ✅ Cursor-Based Pagination
* ✅ Infinite Scrolling Feed
* ✅ Efficient Large-Scale Data Retrieval

### 👤 User Profiles

* ✅ Profile Management
* ✅ Created posts Visibility

---

## 🛠️ Technology Stack

### 🎨 Frontend

* ⚛️ React.js
* ⚡ Vite
* 🎨 Tailwind CSS
* 🖼️ Lucide React

### 🔧 Backend

* 🟢 Node.js
* 🚂 Express.js

### 🗄️ Database

* 🐘 PostgreSQL

### 🔐 Authentication

* 🔑 JWT (JSON Web Tokens)
* 🔒 bcrypt

### ☁️ Media Storage

* 🖼️ ImageKit

---

## 🏗️ System Architecture

```text
        ⚛️ React.js Frontend
                 │
                 ▼
        🚂 Express.js REST API
                 │
                 ▼
        🐘 PostgreSQL Database

        Additional Services:
        🔐 JWT Authentication
        ☁️ ImageKit Media Storage
```

---

## 🗄️ High-Level Database Design

The database follows a **Normalized Relational Design (3NF)** to reduce redundancy and maintain data consistency.

### 📌 Core Entities

* 👤 Users
* 👥 Communities
* 📝 Posts
* 🏷️ Tags

### 🔗 Relationship Tables

* 🏷️ Post Tags
* 🎯 User Interests
* 📊 User Engagement Tracking

### ✅ Benefits

* Efficient Community Management
* Personalized Recommendation Generation
* User Interaction Tracking
* Scalable Content Organization

---

## 🎯 Recommendation Engine

One of Nexus's standout features is its **Tag-Based Recommendation System**, designed to improve content discovery and user engagement.

### ⚙️ How It Works

1. 👤 Users interact with content.
2. 📊 Interests are inferred from engagement patterns.
3. 🏷️ Posts are categorized using tags.
4. 🎯 Relevant content is prioritized in the feed.
5. 🚀 Personalized recommendations are generated dynamically.

### 🌟 Advantages

* Better Content Discovery
* Increased User Engagement
* Transparent & Explainable Recommendations
* Personalized User Experience

---

## ⚡ Cursor-Based Pagination

To efficiently handle large volumes of content, Nexus uses **Cursor-Based Pagination** instead of traditional offset-based pagination.

### ✅ Benefits

* 🚀 Faster Queries on Large Datasets
* 🔄 Consistent Results During Data Updates
* 📜 Smooth Infinite Scrolling Experience
* 📈 Improved Scalability

---

## 🚀 Installation

### 📋 Prerequisites

Make sure you have the following installed:

* 🟢 Node.js
* 🐘 PostgreSQL
* 📦 npm

---

### 📥 Clone the Repository

```bash
git clone https://github.com/NavneetSinghRawat1/Social_Media_Nexus.git
```

---

### 📦 Install Dependencies

#### 🎨 Frontend

```bash
cd FrontEnd
npm install
```

#### 🔧 Backend

```bash
cd BackEnd
npm install
```

---

### ⚙️ Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=your_database_url

JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

---

### ▶️ Run the Backend

```bash
npx nodemon .\server.js
```

### ▶️ Run the Frontend

```bash
npm run dev
```

---

## 📚 Learning Outcomes

Through the development of Nexus, the following concepts were explored and implemented:

* 🌐 Full-Stack Application Development
* 🔌 REST API Design
* 🗄️ Database Modeling & Normalization
* 🔐 Authentication & Authorization
* 🎯 Recommendation Systems
* ⚡ Cursor-Based Pagination
* ⚛️ State Management in React
* ☁️ Cloud Storage Integration
* 🏗️ Production-Oriented Architecture

---

## 🏆 Project Highlights

✨ Built entirely as a **Solo Project**

✨ Designed using a **Scalable PERN Architecture**

✨ Implements a **Custom Recommendation Engine**

✨ Uses **Cursor-Based Pagination** for efficient feed loading

✨ Supports **Community-Driven Interactions** similar to modern social platforms

✨ Integrates **ImageKit** for optimized media management

---

## 🎯 Future Potential

Nexus lays the foundation for a scalable social platform and can be extended with:

* 🔔 Real-Time Notifications
* 🤖 AI-Powered Recommendations
* 🌍 Community Moderation Tools
* 📱 Mobile Application Support

---

## 👨‍💻 Author

### **Navneet Singh Rawat**

🎓 Bachelor of Computer Applications (BCA)
