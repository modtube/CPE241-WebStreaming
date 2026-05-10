import express from "express";
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUsers,
} from "../controllers/userController.js";

const router = express.Router();

// GET http://localhost:5000/api/users?[...]
router.get("/", getAllUsers);

// PUT http://localhost:5000/api/users/[...]/status
/* Body:
{ "status": "suspended" }
*/
router.put("/:id/status", updateUserStatus);

// PUT http://localhost:5000/api/users/[...]/role
/* Body:
{ "role": "admin" }
*/
router.put("/:id/role", updateUserRole);

// DELETE http://localhost:5000/api/users
/* Body:
{ "userIds": ["U00001", "U00002"] }
*/
router.delete("/", deleteUsers);

export default router;
