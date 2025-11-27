const {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsMinimal,
} = require("../services/product-service");

// Get paginated products
const getProductsController = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const result = await getProducts(page, pageSize);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getProductsController:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
};

// Get single product by ID
const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error in getProductByIdController:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
};

// Get products by slug
const getProductBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;
    const products = await getProductBySlug(slug);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error in getProductBySlugController:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to search products by slug",
    });
  }
};

// Get paginated products with minimal data for listing/cards
const getProductsMinimalController = async (req, res) => {
  try {
    const { page, pageSize, sortBy } = req.query;
    const result = await getProductsMinimal(page, pageSize, sortBy);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getProductsMinimalController:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
};

module.exports = {
  getProductsController,
  getProductByIdController,
  getProductBySlugController,
  getProductsMinimalController,
};
