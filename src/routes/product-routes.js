const express = require("express");
const {
  getProductsController,
  getProductByIdController,
  getProductBySlugController,
} = require("../controllers/product-controller");

const router = express.Router();

// GET /products - Get paginated products
router.get("/", getProductsController);

// GET /products/slug/:slug - Get products by slug (must come before /:id)
router.get("/slug/:slug", getProductBySlugController);

// GET /products/:id - Get single product by MongoDB ObjectId
router.get("/:id", getProductByIdController);

module.exports = router;
