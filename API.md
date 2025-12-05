# Product Admin API

Simple API for managing and fetching product data with pagination support.

## Base URL

```
http://localhost:3000
```

---

## Authentication

All `/products` endpoints require authentication. Use the login endpoint to get a JWT token.

### `POST /auth/login`

Login with email and password.

**Request Body:**

```json
{
  "email": "yourname@zoftwarehub.com",
  "password": "your-password"
}
```

**Requirements:**

- Email must be a `@zoftwarehub.com` domain
- Password is the shared admin password

**Response (Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h",
    "expiresAt": "2025-12-06T10:30:00.000Z",
    "user": {
      "email": "yourname@zoftwarehub.com"
    }
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

---

### `GET /auth/verify` 🔒

Verify if your token is still valid.

**Headers:**

```
Authorization: Bearer <your-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "email": "yourname@zoftwarehub.com",
      "loginAt": "2025-12-05T10:30:00.000Z"
    },
    "isValid": true
  }
}
```

---

### `GET /auth/me` 🔒

Get current authenticated user info.

**Headers:**

```
Authorization: Bearer <your-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "email": "yourname@zoftwarehub.com",
    "loginAt": "2025-12-05T10:30:00.000Z"
  }
}
```

---

### Using Authentication

Include the token in the `Authorization` header for all protected routes:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Errors:**

| Code            | Description                    |
| --------------- | ------------------------------ |
| `NO_TOKEN`      | No token provided in request   |
| `TOKEN_EXPIRED` | Token has expired, login again |
| `INVALID_TOKEN` | Token is malformed or invalid  |

---

## Endpoints

### Health Check

#### `GET /`

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

---

#### `GET /health`

Alternative health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

---

### Products 🔒

> **Note:** All product endpoints require authentication. Include the `Authorization: Bearer <token>` header.

#### `GET /products/minimal` ⭐ **Recommended for UI Cards**

Fetch paginated products with minimal data optimized for listing pages and UI cards.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number (starts from 1) |
| pageSize | number | 10 | Items per page (max: 100) |
| sortBy | string | "latest" | Sort order: "latest" (newest first) or "oldest" (oldest first) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "690149f0f6a907bf3d010815",
      "product_slug": "100-ai-prompts",
      "product_name": "100+ AI Prompts",
      "company_name": "Trello",
      "short_description": "A Trello board template collecting over 100 AI prompts and prompt-writing resources...",
      "website": "https://trello.com/b/4BPkSY1w/100-ai-prompts-resources-prompt-lovers",
      "logo_url": "https://upload.wikimedia.org/wikipedia/commons/6/60/Trello_logo.svg",
      "parent_category": "Project Management / Collaboration",
      "industry": ["Productivity", "Project Management", "Team Collaboration"],
      "completion_percentage": 85,
      "generated_at": "2025-11-27T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "completionStats": {
    "high": 95,
    "medium": 35,
    "low": 20
  }
}
```

**Use Case:** Perfect for product listing pages, search results, and UI cards where you need basic product information for display.

**Example:**

```
GET /products/minimal?page=2&pageSize=15&sortBy=oldest
```

**Features:**

- Includes completion statistics for data quality insights
- Supports sorting by date (latest/oldest)
- Flattened minimal data structure for easy consumption
- Includes `completion_percentage` and `generated_at` fields

---

#### `GET /products`

Fetch paginated products with full data (includes complete snapshot object).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number (starts from 1) |
| pageSize | number | 10 | Items per page (max: 100) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "product_slug": "string",
      "snapshot": {
        "product_name": "string",
        "company_name": "string",
        "description": "string",
        "features": [],
        "pricing": {},
        "reviews": {}
        // ... extensive product data
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Use Case:** When you need complete product data for detailed analysis or bulk processing. Contains full snapshot object with all available product information.

**Example:**

```
GET /products?page=2&pageSize=15
```

---

#### `GET /products/:id`

Get a single product by MongoDB ObjectId.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId |

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "product_slug": "string",
    "snapshot": {}
  }
}
```

**Example:**

```
GET /products/690149f0f6a907bf3d010815
```

---

#### `GET /products/slug/:slug` ⭐ **Recommended for Product Detail Pages**

Get a single product by slug with full data.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| slug | string | Product slug (e.g., "100-ai-prompts") |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "690149f0f6a907bf3d010815",
      "product_slug": "100-ai-prompts",
      "snapshot": {
        "product_name": "100+ AI Prompts",
        "company_name": "Trello",
        "description": "A Trello board template collecting over 100 AI prompts...",
        "website": "https://trello.com/b/4BPkSY1w/100-ai-prompts-resources-prompt-lovers",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/6/60/Trello_logo.svg",
        "features": [
          {
            "name": "Board & Cards",
            "description": "Kanban-style boards with lists and cards to organize prompts..."
          }
        ],
        "pricing": {
          "overview": "Trello uses a freemium pricing model...",
          "pricing_plans": []
        },
        "reviews": {
          "strengths": ["Easy to use, simple Kanban interface"],
          "weaknesses": ["Advanced enterprise controls require paid plans"],
          "overall_rating": null
        },
        "company_info": {},
        "integrations": []
        // ... complete product data
      }
    }
  ]
}
```

**Use Case:** Perfect for individual product detail pages where you need complete product information including features, pricing, reviews, company info, etc.

**Example:**

```
GET /products/slug/100-ai-prompts
```

---

## Frontend Integration Guide

### 🔐 Authentication Flow

```javascript
// 1. Login to get token
const loginResponse = await fetch("/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "yourname@zoftwarehub.com",
    password: "your-password",
  }),
});
const {
  data: { token },
} = await loginResponse.json();

// 2. Store token (localStorage, sessionStorage, or state management)
localStorage.setItem("authToken", token);

// 3. Use token for all product requests
const getProducts = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("/products/minimal?page=1&pageSize=20", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
```

### 🔄 Token Refresh Strategy

```javascript
// Check token validity on app load
const verifyToken = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  const response = await fetch("/auth/verify", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    localStorage.removeItem("authToken");
    return false;
  }
  return true;
};

// Handle 401 errors globally
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/login"; // Redirect to login
  }

  return response;
};
```

### 🎯 Quick Reference for Frontend Teams

| Use Case                  | Endpoint                   | Auth | Purpose                                |
| ------------------------- | -------------------------- | ---- | -------------------------------------- |
| **Login**                 | `POST /auth/login`         | ❌   | Get JWT token                          |
| **Verify Token**          | `GET /auth/verify`         | ✅   | Check if token is valid                |
| **Current User**          | `GET /auth/me`             | ✅   | Get logged-in user info                |
| **Product Listing/Cards** | `GET /products/minimal`    | ✅   | Fast-loading cards with essential info |
| **Product Detail Page**   | `GET /products/slug/:slug` | ✅   | Complete product information           |
| **Data Processing/Admin** | `GET /products`            | ✅   | Full dataset for analysis              |
| **Direct ID Lookup**      | `GET /products/:id`        | ✅   | Get by MongoDB ObjectId                |

### 💡 Best Practices

1. **Store token securely** - Use `httpOnly` cookies in production or secure storage
2. **Handle token expiration** - Token expires in 24h, redirect to login on 401
3. **Use `/products/minimal` for listings** - Much faster, smaller payload (~500 bytes vs ~50KB per product)
4. **Use `/products/slug/:slug` for detail pages** - Complete data when user clicks on a product
5. **Implement pagination** - Use `page` and `pageSize` parameters for large datasets
6. **Handle loading states** - Show skeleton cards while data loads

### 🔗 Complete Frontend Flow

```javascript
// auth.js - Authentication utilities
export const login = async (email, password) => {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();

  if (data.success) {
    localStorage.setItem("authToken", data.data.token);
    localStorage.setItem("tokenExpiresAt", data.data.expiresAt);
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiresAt");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  const expiresAt = localStorage.getItem("tokenExpiresAt");

  if (!token || !expiresAt) return false;
  return new Date(expiresAt) > new Date();
};

// api.js - API calls
export const fetchProducts = async (page = 1, pageSize = 20) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `/products/minimal?page=${page}&pageSize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.json();
};

export const fetchProductBySlug = async (slug) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`/products/slug/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
```

---

## Error Handling

All errors return appropriate HTTP status codes with error details:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Database

- **Database:** scraped-raw-data
- **Collection:** final_product_payloads
- **Total Products:** 147
- **Main Fields:** product_slug, snapshot (contains all product data)

### Data Structure Notes

- **minimal endpoint**: Returns flattened, essential fields for UI display
- **full endpoints**: Return complete `snapshot` object with all scraped data
- **product_slug**: Used as the primary identifier for frontend routing
- **\_id**: MongoDB ObjectId, used for direct database queries

---

## Environment Variables

```
MONGO_URI=mongodb+srv://...
DB_NAME=scraped-raw-data
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=24h
ADMIN_PASSWORD=your-admin-password
```
