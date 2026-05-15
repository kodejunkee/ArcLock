<p align="center">
  <img src="https://img.shields.io/badge/ArcLock-Biometric_Auth-00D4AA?style=for-the-badge&logo=shield&logoColor=white" alt="ArcLock"/>
</p>

<h1 align="center">🔒 ArcLock</h1>

<p align="center">
  <b>Secure Facial Biometric Authentication System</b><br/>
  <sub>ECC-Encrypted Embeddings · Privacy-First Architecture · MongoDB Atlas</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_Native-Expo-000020?style=flat-square&logo=expo&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square"/>
</p>

---

## 📋 Overview

**ArcLock** is a production-structured, mobile-first biometric authentication platform that verifies user identity through **facial recognition** — without ever storing raw facial images. It uses a three-tier microservice architecture designed with cybersecurity-first principles.

The system generates 512-dimensional facial embeddings using **ArcFace**, encrypts them with **Elliptic Curve Cryptography (ECIES)**, and stores only the encrypted biometric templates in **MongoDB Atlas**. Raw images exist only in memory during processing and are securely destroyed immediately after embedding extraction.

### Key Highlights

- 🚫 **Zero raw image storage** — facial data never touches disk
- 🔐 **Per-user ECC key pairs** — each user's biometrics encrypted with their own keys
- 🛡️ **AES-256-GCM** — private keys encrypted at rest with a server master key
- 📱 **Dark-mode mobile UI** — premium cybersecurity aesthetic
- 📊 **In-app monitoring** — authentication logs and security dashboard
- ⚡ **Rate limiting & lockout** — brute-force protection built-in

---

## 🏗️ Architecture

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│   Mobile App    │──────▶│   Node.js Backend    │──────▶│  Python Face Svc    │
│   (React Native)│◀──────│   (Express + TS)     │◀──────│  (FastAPI)          │
│                 │       │                      │       │                     │
│  • Camera       │       │  • Auth / JWT        │       │  • RetinaFace       │
│  • UI / Nav     │       │  • ECC Encryption    │       │  • ArcFace (512-d)  │
│  • Secure Store │       │  • Rate Limiting     │       │  • Image Validation │
│  • Zustand      │       │  • Mongoose ODM      │       │  • Memory Cleanup   │
└─────────────────┘       └──────────┬───────────┘       └─────────────────────┘
                                     │
                          ┌──────────▼───────────┐
                          │   MongoDB Atlas      │
                          │                      │
                          │  • Encrypted templates│
                          │  • Encrypted keys    │
                          │  • Auth logs         │
                          └──────────────────────┘
```

### Data Flow

```
Registration:
  📷 Camera → base64 → [Python] → 512-d embedding → [Node] → ECIES encrypt → MongoDB
                         🗑️ image destroyed                    🔑 AES-256 key wrap

Verification:
  📷 Camera → base64 → [Python] → new embedding → [Node] → decrypt stored embedding
                         🗑️ image destroyed                 → cosine similarity
                                                            → accept/reject (≥ 0.6)
```

---

## 🔐 Security Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Embedding Encryption** | ECIES (secp256k1) | Per-user asymmetric encryption of facial templates |
| **Key Protection** | AES-256-GCM | Server-side encryption of user private keys at rest |
| **API Authentication** | JWT (RS256) | Access tokens (15m) + refresh tokens (7d) |
| **Token Storage** | expo-secure-store | Device keychain/keystore for token persistence |
| **Transport** | HTTPS / TLS | Encrypted database connections via MongoDB Atlas |
| **HTTP Hardening** | Helmet.js | Security headers (CSP, HSTS, X-Frame, etc.) |
| **Rate Limiting** | express-rate-limit | 100 req/15min (general), 10 req/15min (auth) |
| **Brute Force** | Auto-lockout | 5 failed attempts → 15 minute lockout |
| **Input Validation** | Zod schemas | All endpoints validated before processing |
| **Input Sanitization** | Custom middleware | HTML stripping, XSS prevention |

### Privacy Guarantees

```
✅ Raw facial images are NEVER stored (disk or database)
✅ Images exist ONLY in memory during processing
✅ Images are securely zeroed out after embedding extraction
✅ Each user has a unique ECC key pair
✅ Private keys are AES-encrypted before storage
✅ Only encrypted blobs exist in the database
```

---

## 📁 Project Structure

```
ArcLock/
│
├── backend/                          # Node.js Express API (TypeScript)
│   ├── src/
│   │   ├── config/                   # Database, environment, CORS
│   │   ├── controllers/              # Request handlers (auth, user, log)
│   │   ├── encryption/               # ECC (ECIES) + AES-256-GCM services
│   │   ├── middleware/               # Auth guard, rate limiter, sanitizer
│   │   ├── models/                   # Mongoose schemas (User, AuthLog, FailedAttempt)
│   │   ├── routes/                   # API route definitions
│   │   ├── services/                 # Business logic layer
│   │   ├── types/                    # TypeScript interfaces & DTOs
│   │   ├── utils/                    # Logger, response builder, constants
│   │   ├── validators/               # Zod validation schemas
│   │   └── server.ts                 # Application entry point
│   ├── .env                          # Environment variables (not committed)
│   ├── package.json
│   └── tsconfig.json
│
├── python-face-service/              # FastAPI Microservice
│   ├── app/
│   │   ├── core/config.py            # Service settings
│   │   ├── models/schemas.py         # Pydantic request/response models
│   │   ├── routes/                   # Embedding & health endpoints
│   │   ├── services/                 # Face processing & validation
│   │   └── utils/image_utils.py      # Secure image handling & destruction
│   ├── main.py                       # FastAPI entry point
│   └── requirements.txt
│
└── mobile-app/                       # React Native (Expo SDK 54)
    ├── src/
    │   ├── components/               # GlassCard, BiometricButton, FaceGuide, etc.
    │   ├── constants/                # Theme tokens, API endpoints
    │   ├── navigation/               # Auth stack, Main tabs, Root navigator
    │   ├── screens/                  # 12 screens (Splash → Dashboard)
    │   ├── services/                 # Axios API client with token refresh
    │   ├── store/                    # Zustand auth state
    │   └── types/                    # TypeScript navigation & auth types
    ├── App.tsx
    ├── app.json
    ├── eas.json
    └── tailwind.config.js            # NativeWind dark theme
```

---

## ⚙️ Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | ≥ 18.x | Backend runtime |
| **Python** | 3.10 – 3.12 | Face processing service |
| **npm** | ≥ 9.x | Package management |
| **Git** | Latest | Version control |
| **Expo CLI** | Latest | Mobile development |
| **EAS CLI** | Latest | Development builds |

> **Note:** Python 3.13+ may have compatibility issues with OpenCV/DeepFace. Python 3.11 is recommended.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kodejunkee/ArcLock.git
cd ArcLock
```

### 2. Set Up the Python Face Service

```bash
cd python-face-service

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the service
python main.py
# → Running on http://localhost:8000
```

### 3. Set Up the Node.js Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB Atlas URI, JWT secrets, and AES master key

# Start in development mode
npm run dev
# → Running on http://localhost:5000
```

### 4. Set Up the Mobile App

```bash
cd mobile-app

# Install dependencies
npm install

# Build a development client (required for camera access)
npx eas build --profile development --platform android
# or
npx eas build --profile development --platform ios

# Start the dev server
npx expo start --dev-client
```

> ⚠️ **Expo Go cannot be used** — the `expo-camera` native module requires a development build.

### 5. Connect Mobile to Backend

Edit `mobile-app/src/constants/api.ts` and set `API_BASE_URL` to your machine's local IP:

```typescript
export const API_BASE_URL = 'http://192.168.x.x:5000';
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Access token signing key | Random 64-char string |
| `JWT_REFRESH_SECRET` | Refresh token signing key | Random 64-char string |
| `JWT_EXPIRY` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime | `7d` |
| `AES_MASTER_KEY` | 32-byte hex key for private key encryption | 64-char hex string |
| `FACE_SERVICE_URL` | Python service URL | `http://localhost:8000` |
| `SIMILARITY_THRESHOLD` | Min cosine similarity for face match | `0.6` |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `POST` | `/api/auth/register` | Register with name, email, face | ❌ |
| `POST` | `/api/auth/login` | Login with email + face verification | ❌ |
| `POST` | `/api/auth/verify-face` | Verify face (alias for login) | ❌ |
| `POST` | `/api/auth/refresh-token` | Refresh expired access token | ❌ |
| `POST` | `/api/auth/logout` | Logout (client-side token removal) | ❌ |

### User

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `GET` | `/api/user/profile` | Get current user profile | ✅ |
| `PUT` | `/api/user/profile` | Update profile (name) | ✅ |
| `DELETE` | `/api/user/delete` | Delete account + biometric data | ✅ |

### Logs

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `GET` | `/api/logs/auth` | Get authentication history | ✅ |
| `GET` | `/api/logs/failures` | Get failed attempt logs | ✅ |

### Health

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/health` | Service health + dependency status |

---

## 🎨 Mobile App Screens

| Screen | Purpose |
|--------|---------|
| **Splash** | Animated launch with shield logo and ring effect |
| **Register** | Name + email form → camera enrollment |
| **Login** | Email input → face verification |
| **Camera Capture** | Live camera with face alignment guide overlay |
| **Enrollment Processing** | Animated loading during registration |
| **Enrollment Success** | Confirmation with ECC encryption status |
| **Verification Loading** | Scanning animation during face comparison |
| **Verification Success** | Confidence gauge with match percentage |
| **Verification Failure** | Shake animation with retry option |
| **Dashboard** | Security status, auth stats, recent activity |
| **Activity Log** | Filterable authentication history |
| **Profile** | User info, security details, account management |

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript (strict mode)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JSON Web Tokens (jsonwebtoken)
- **Encryption:** Native Node.js crypto (ECDH, AES-256-GCM)
- **Validation:** Zod
- **Security:** Helmet, express-rate-limit, CORS

### Face Processing
- **Runtime:** Python 3.11
- **Framework:** FastAPI + Uvicorn
- **ML Models:** DeepFace (ArcFace + RetinaFace)
- **Image Processing:** OpenCV, Pillow, NumPy
- **Validation:** Pydantic v2

### Mobile
- **Framework:** React Native (Expo SDK 54)
- **Language:** TypeScript
- **Navigation:** React Navigation 7 (Stack + Bottom Tabs)
- **State:** Zustand
- **Styling:** NativeWind (TailwindCSS for RN)
- **Camera:** expo-camera
- **Storage:** expo-secure-store
- **HTTP:** Axios with interceptors

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 🔒 security-first principles<br/>
  <sub>ArcLock — Because your face is your password.</sub>
</p>
