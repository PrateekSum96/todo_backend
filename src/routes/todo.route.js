import { Router } from "express";
import {
  addTodoList,
  updateTodoListName,
  updateTodoListImage,
  deleteTodoList,
} from "../controllers/todo.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addTodo,
  deleteTodo,
  editTodo,
} from "../controllers/subTodo.controller.js";

const router = Router();

//todo list route
router.post("/todo-list", verifyJwt, addTodoList);
router.put("/todo-lists/:todoListId/name", verifyJwt, updateTodoListName);
router.put("/todo-lists/:todoListId/image", verifyJwt, updateTodoListImage);
router.delete("/todo-lists/:todoListId", verifyJwt, deleteTodoList);

//todo route

router.post("/:todoListId/sub-todo", verifyJwt, addTodo);
router.put("/:todoListId/sub-todo/:todoId", verifyJwt, editTodo);
router.delete("/:todoListId/sub-todo/:todoId", verifyJwt, deleteTodo);
export default router;
