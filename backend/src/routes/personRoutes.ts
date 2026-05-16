import express from "express";
import {
  getAllPersons,
  getPersonById,
} from "../controllers/personController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/persons
// หรือ GET http://localhost:5000/api/persons?movie=[...]
// (movie_id)
router.get("/", getAllPersons);

router.get("/:id", getPersonById);

export default router;
