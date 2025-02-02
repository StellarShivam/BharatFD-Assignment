---
# Bharat FD Assignment - FAQ Web App Backend with Multi-language Support

## 📌 Overview

This project is a **FAQ Management API** that supports **multi-language translations** using `googletrans`. It allows users to **create, read, update, and delete FAQs**, while providing real-time translations in different languages. The system uses **Redis caching** for optimized performance.
---

## 💡 Tech Stack

| Technology       | Description                                    |
| ---------------- | ---------------------------------------------- |
| **Node.js**      | JavaScript runtime for server-side logic       |
| **Express.js**   | Web framework for handling API requests        |
| **MongoDB**      | NoSQL database for storing FAQs                |
| **Mongoose**     | ODM for MongoDB interaction                    |
| **Redis**        | In-memory caching for performance optimization |
| **googletrans**  | Library for translating FAQs dynamically       |
| **Mocha & Chai** | Testing framework for API validation           |

---

## Features

**Multi-language Support** using `googletrans`  
 **CRUD operations** for FAQ management  
 **Redis caching** for better performance  
 **Unit Testing** with Mocha,Chai & SuperTest  
 **Mongoose ODM** for MongoDB interaction

---

## Folder Structure

| Directory/File                  | Description                             |
| ------------------------------- | --------------------------------------- |
| `config/Db.Connect.js`          | MongoDB connection setup                |
| `config/RedisConfig.js`         | Redis client setup for caching          |
| `controllers/FAQ.Controller.js` | Logic for handling FAQ requests         |
| `models/FAQModel.js`            | Mongoose schema for FAQs                |
| `routes/FAQ.routes.js`          | Express routes for FAQ API              |
| `testing/Chai.js`               | Unit tests using Mocha & Chai           |
| `Trans_Util/TransLate_Text.js`  | Translation utility using `googletrans` |
| `.env`                          | Environment variables                   |
| `server.js`                     | Main entry point of the application     |

---

## Installation & Setup

### Prerequisites

- **Node.js** (>= 18.x)
- **MongoDB** (Running locally or on a cloud service like MongoDB Atlas)
- **Redis** (For caching)
- **Postman** (Optional, for testing API endpoints)

### Setup Steps

**Clone the repository**

```sh
git clone https://github.com/StellarShivam/BharatFD-Assignment.git
cd BharatFD-Assignment
```

**Install dependencies**

```sh
npm install
```

**Set up environment variables** (`.env` file)

```
MONGO_URI=mongodb_connection_string
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=5000
```

**Run the application**

```sh
npm run dev
```

The server will start at `http://localhost:8080`

---

## API Endpoints

### 1 **Create a FAQ**

```http
POST /api/faqs/create-faq
```

**Request Body:**

```json
{
  "question": "Why are APIs important?",
  "answer": "APIs enable seamless communication and integration between different software.",
  "targetLanguage": "hi"
}
```

**Response:**

```json
{
  "message": "Faq Created Successfully",
  "faq": {
    "_id": "82c4f6a2h71e29b2f",
    "question": "Why are APIs important?",
    "answer": "APIs enable seamless communication and integration between different software."
  }
}
```

---

### 2️ **Fetch FAQs (With Translations)**

```http
GET /api/faqs?targetLanguage=hi
```

**Response:**

```json
{
  "translatedFaqs": [
    {
      "_id": "82c4f6a2h71e29b2f",
      "question": "एपीआई क्यों महत्वपूर्ण हैं?",
      "answer": "एपीआई विभिन्न सॉफ्टवेयर के बीच सहज संचार और एकीकरण को सक्षम बनाते हैं।"
    }
  ]
}
```

---

### 3️ **Update a FAQ**

```http
PUT /api/faqs/:id
```

**Request Body:**

```json
{
  "question": "What are API endpoints?",
  "answer": "API endpoints are specific routes where API requests are sent and responses are received.",
  "targetLanguage": "hi"
}
```

**Response:**

```json
{
  "message": "Successfully Updated Faq",
  "UpdatedFAQ": {
    "question": "What is an API in detail?",
    "answer": "An API is a set of protocols and tools for building software applications."
  }
}
```

---

### 4️ **Delete a FAQ**

```http
DELETE /api/faqs/:id
```

**Response:**

```json
{
  "message": "Faq Deleted"
}
```

---

## Running Tests

To run unit tests:

```sh
npm test
```

---
