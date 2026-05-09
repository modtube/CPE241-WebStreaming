import express from "express";
import { getAllPersons } from "../controllers/personController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/persons
// หรือ GET http://localhost:5000/api/persons?movie=[...]
// (movie_id)
router.get("/", getAllPersons);

export default router;
