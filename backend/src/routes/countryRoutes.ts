import express from "express";
import {
  addCountry,
  deleteCountry,
  getAllCountries,
  updateCountry,
} from "../controllers/countryController.js";

const router = express.Router();

router.get("/", getAllCountries);

router.post("/", addCountry);

router.put("/:country_code", updateCountry);

router.delete("/:country_code", deleteCountry);

export default router;
