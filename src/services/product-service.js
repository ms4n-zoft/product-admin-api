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
        completion_percentage: 1,
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
      { projection: { product_slug: 1, snapshot: 1, completion_percentage: 1 } }
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
        completion_percentage: 1,
      })
      .toArray();

    return products;
  } catch (error) {
    console.error("Error searching products by slug:", error.message);
    throw new Error(`Failed to search products: ${error.message}`);
  }
};

// Fetch products with minimal data for list/card view
const getProductsMinimal = async (
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sortBy = "latest"
) => {
  try {
    const db = getDB();
    const collection = db.collection(COLLECTION_NAME);

    const validPage = Math.max(1, parseInt(page) || 1);
    const validPageSize = Math.max(
      1,
      Math.min(100, parseInt(pageSize) || DEFAULT_PAGE_SIZE)
    );

    // Determine sort order: 'latest' = newest first (-1), 'oldest' = oldest first (1)
    const sortOrder = sortBy === "oldest" ? 1 : -1;

    const skip = (validPage - 1) * validPageSize;
    const totalCount = await collection.estimatedDocumentCount();

    const products = await collection
      .find({})
      .project({
        product_slug: 1,
        completion_percentage: 1,
        generated_at: 1,
        "snapshot.product_name": 1,
        "snapshot.company_name": 1,
        "snapshot.short_description": 1,
        "snapshot.website": 1,
        "snapshot.logo_url": 1,
        "snapshot.parent_category": 1,
        "snapshot.industry": 1,
      })
      .sort({ generated_at: sortOrder })
      .skip(skip)
      .limit(validPageSize)
      .toArray();

    // Transform the data to flatten it for easier frontend consumption
    const transformedProducts = products.map((product) => ({
      _id: product._id,
      product_slug: product.product_slug,
      completion_percentage: product.completion_percentage || 0,
      generated_at: product.generated_at || null,
      product_name: product.snapshot?.product_name || "Unknown Product",
      company_name: product.snapshot?.company_name || "Unknown Company",
      short_description:
        product.snapshot?.short_description || "No description available",
      website: product.snapshot?.website || null,
      logo_url: product.snapshot?.logo_url || null,
      parent_category: product.snapshot?.parent_category || "Uncategorized",
      industry: product.snapshot?.industry || [],
    }));

    const totalPages = Math.ceil(totalCount / validPageSize);

    return {
      success: true,
      data: transformedProducts,
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
    console.error("Error fetching minimal products:", error.message);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsMinimal,
};
