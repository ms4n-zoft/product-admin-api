const { getDB } = require("../../config/db-config");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "final_product_payloads";
const DEFAULT_PAGE_SIZE = 10;

// Collection has indexes on: url, product_slug, source, generated_at,
// snapshot.product_name, snapshot.company_name, snapshot.parent_category, snapshot.website

// Fetch products with pagination
const getProducts = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  try {
    const db = getDB();
    const collection = db.collection(COLLECTION_NAME);

    const validPage = Math.max(1, parseInt(page) || 1);
    const validPageSize = Math.max(
      1,
      Math.min(100, parseInt(pageSize) || DEFAULT_PAGE_SIZE) // Cap at 100 for performance
    );

    const skip = (validPage - 1) * validPageSize;
    const totalCount = await collection.estimatedDocumentCount(); // Faster for large collections

    const products = await collection
      .find({})
      .project({
        product_slug: 1,
        snapshot: 1,
      })
      .skip(skip)
      .limit(validPageSize)
      .toArray();

    const totalPages = Math.ceil(totalCount / validPageSize);

    return {
      success: true,
      data: products,
      pagination: {
        currentPage: validPage,
        pageSize: validPageSize,
        totalItems: totalCount,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};

// Get single product by MongoDB ObjectId
const getProductById = async (productId) => {
  try {
    const db = getDB();
    const collection = db.collection(COLLECTION_NAME);

    // Validate ObjectId format
    if (!ObjectId.isValid(productId)) {
      return null;
    }

    const product = await collection.findOne(
      { _id: ObjectId.createFromHexString(productId) },
      { projection: { product_slug: 1, snapshot: 1 } }
    );

    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error.message);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
};

// Search products by slug
const getProductBySlug = async (slug) => {
  try {
    const db = getDB();
    const collection = db.collection(COLLECTION_NAME);

    const products = await collection
      .find({ product_slug: slug })
      .project({
        product_slug: 1,
        snapshot: 1,
      })
      .toArray();

    return products;
  } catch (error) {
    console.error("Error searching products by slug:", error.message);
    throw new Error(`Failed to search products: ${error.message}`);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
};
