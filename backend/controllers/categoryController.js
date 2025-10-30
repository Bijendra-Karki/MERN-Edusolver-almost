import Category from "../models/categoryModel.js";

/**
 * =========================
 * Create Category
 * =========================
 */
export const createCategory = async (req, res) => {
  try {
    const { name, slug, icon, color } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = new Category({ name, slug, icon, color });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * =========================
 * Get All Categories
 * =========================
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * =========================
 * Get Category by Slug
 * =========================
 */
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * =========================
 * Update Category
 * =========================
 */
export const updateCategory = async (req, res) => {
  try {
    const { name, icon, color, courseCount } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon, color, courseCount },
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * =========================
 * Delete Category
 * =========================
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ msg: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
