import express from "express"
import {
  createActivity,
  getActivities,
  getActivityById,
  toggleLike,
  addComment,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js"
import { requireSignin } from "../controllers/authController.js"

const router = express.Router()

// Activity Routes
router.post("/", requireSignin, createActivity)
router.get("/", getActivities)
router.get("/:id", getActivityById)
router.put("/:id/like", requireSignin, toggleLike)
router.post("/:id/comment", requireSignin, addComment)
router.put("/:id", requireSignin, updateActivity)
router.delete("/:id", requireSignin, deleteActivity)

export default router
