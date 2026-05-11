import express from 'express';
// Import the specific fetcher for individual data
import { getAllCrew, getPersonById, createPerson, updatePerson, deletePerson } from '../controllers/crewController.js'; 

const router = express.Router();

// Route for fetching the full list
router.get('/', getAllCrew);

// Route for creating a new crew member
router.post('/', createPerson);

// NEW: Route for fetching a single person by ID (e.g., /api/crew/P00025)
// This matches the ID format in your schema: VARCHAR(10)
router.get('/:id', getPersonById);

// Route for updating a crew member by ID
router.put('/:id', updatePerson);

router.delete('/:id', deletePerson);

export default router;