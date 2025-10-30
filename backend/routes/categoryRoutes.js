import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { requireUser, requireAdmin, requireSignin } from "../controllers/authController.js";

const router = express.Router();

// Admin Routes
router.post("/createCategory", requireSignin, requireAdmin, createCategory);
router.put("/updateCategory/:id", requireSignin, requireAdmin, updateCategory);
router.delete("/deleteCategory/:id", requireSignin, requireAdmin, deleteCategory);

// Public Routes
router.get("/categoryList", requireSignin, requireUser, getCategories);
router.get("/category/:slug", requireSignin, requireUser, getCategoryBySlug);

export default router;
