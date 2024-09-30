import { Router } from "express";
import {
  addTodoList,
  updateTodoListName,
  updateTodoListImage,
  deleteTodoList,
  getAllTodoLists,
  getATodoList,
} from "../controllers/todo.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addTodo,
  deleteTodo,
  editTodo,
  getTodo,
} from "../controllers/subTodo.controller.js";

const router = Router();

//todo list route
router.post("/todo-list", verifyJwt, addTodoList);
router.put("/todo-lists/:todoListId/name", verifyJwt, updateTodoListName);
router.put("/todo-lists/:todoListId/image", verifyJwt, updateTodoListImage);
router.delete("/todo-lists/:todoListId", verifyJwt, deleteTodoList);
router.get("/todo-lists", verifyJwt, getAllTodoLists);
router.get("/todo-lists/:todoListId", verifyJwt, getATodoList);

//todo route

router.post("/:todoListId/sub-todo", verifyJwt, addTodo);
router.put("/:todoListId/sub-todo/:todoId", verifyJwt, editTodo);
router.delete("/:todoListId/sub-todo/:todoId", verifyJwt, deleteTodo);
router.get("/:todoListId/sub-todo/:todoId", verifyJwt, getTodo);
export default router;
