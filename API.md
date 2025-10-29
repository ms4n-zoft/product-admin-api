# Product Admin API

Simple API for managing and fetching product data with pagination support.

## Base URL

```
http://localhost:3000
```

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

### Products

#### `GET /products`

Fetch paginated products.

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
      "snapshot": {}
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

#### `GET /products/slug/:slug`

Search products by slug.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| slug | string | Product slug |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "product_slug": "string",
      "snapshot": {}
    }
  ]
}
```

**Example:**

```
GET /products/slug/247chatapp
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
- **Fields Returned:** product_slug, snapshot

---

## Environment Variables

```
MONGO_URI=mongodb+srv://...
DB_NAME=scraped-raw-data
PORT=3000
NODE_ENV=development
```
