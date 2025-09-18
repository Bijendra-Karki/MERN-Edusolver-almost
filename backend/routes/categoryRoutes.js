import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { requireUser, requireAdmin } from "../controllers/authController.js";

const router = express.Router();

// Admin Routes
router.post("/createCategory", requireUser, requireAdmin, createCategory);
router.put("/updateCategory/:id", requireUser, requireAdmin, updateCategory);
router.delete("/deleteCategory/:id", requireUser, requireAdmin, deleteCategory);

// Public Routes
router.get("/categoryList", requireUser, getCategories);
router.get("/category/:slug",  requireUser,getCategoryBySlug);

export default router;
