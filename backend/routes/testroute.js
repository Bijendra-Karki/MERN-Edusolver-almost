import express from "express";
import { testfunction } from "../controllers/testController.js";

const router = express.Router();

router.get("/demo", testfunction);

export default router;