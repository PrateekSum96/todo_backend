import { Router } from "express";
import {
  addTodoList,
  updateTodoListName,
  updateTodoListImage,
  deleteTodoList,
} from "../controllers/todo.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/todo-list", verifyJwt, addTodoList);
router.put("/todo-lists/:todoListId/name", verifyJwt, updateTodoListName);
router.put("/todo-lists/:todoListId/image", verifyJwt, updateTodoListImage);
router.delete("/todo-lists/:todoListId", verifyJwt, deleteTodoList);

export default router;
