# Task: 2-Level Encryption Student CRUD Application

This project implements a full-stack Student Management System using React, Node.js, Express, and MongoDB with **2-Level Data Encryption**.

## 🔐 Encryption Architecture

1. **Layer 1 (Client-Side Encryption)**:
   - Frontend encrypts sensitive form values (`fullName`, `phoneNumber`, `dateOfBirth`, `address`, `courseEnrolled`, `password`) using `crypto-js` (AES) before firing HTTP API requests.
2. **Layer 2 (Server-Side Encryption)**:
   - Backend receives the Layer 1 encrypted payload and applies an additional layer of AES-256-CBC encryption using Node's native `crypto` library before storing it in MongoDB.
3. **Decryption Flow**:
   - On retrieval (`GET /api/students`), backend decrypts Layer 2 encryption and sends Layer 1 encrypted payloads to React.
   - React decrypts Layer 1 encryption to show plain text on UI.

---

## 🚀 How to Run

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on `mongodb://127.0.0.1:27017`

### Backend Setup
```bash
cd server
npm install
npm start
# Runs on http://localhost:5000