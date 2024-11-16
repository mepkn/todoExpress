import express from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodo,
  toggleTodo,
  updateTodo,
} from "../controllers/todoController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(protect, getAllTodos);
router.route("/").post(protect, createTodo);
router.route("/:id").get(protect, getTodo);
router.route("/:id").put(protect, updateTodo);
router.route("/toggle/:id").put(protect, toggleTodo);
router.route("/:id").delete(protect, deleteTodo);

export default router;
