import express from "express";
import {
  createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,
} from "../controllers/faqController.js";
const router = express.Router();
router.post("/create-faq", createFaq);
router.get("/", getAllFaqs);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);
export default router;
