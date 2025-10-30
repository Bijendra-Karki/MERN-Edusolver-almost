import express from "express";
import {
  createExamSet,
  getExamSets,
  getExamSetById,
  updateExamSet,
  deleteExamSet,
} from "../controllers/examSetController.js";
import { requireAdmin, requireSignin, requireUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/createExamSet", requireSignin, requireAdmin, createExamSet);
router.get("/examSetList", requireSignin, requireUser, getExamSets);
router.get("/examSetDetail/:id", requireSignin, requireUser, getExamSetById);
router.put("/examSetUpdate/:id", requireSignin, requireAdmin, updateExamSet);
router.delete("/examSetDelete/:id", requireSignin, requireAdmin, deleteExamSet);

export default router;
