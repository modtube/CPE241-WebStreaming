import express from "express";
import {
  addCountry,
  getAllCountries,
} from "../controllers/countryController.js";

const router = express.Router();

router.get("/", getAllCountries);

router.post("/", addCountry);

export default router;
