import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Todo } from "../models/todos.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validateSubTodoData } from "../utils/validate.js";

const addTodo = asyncHandler(async (req, res) => {
  const todoDetails = req.body;
  const todoListId = req.params.todoListId;

  validateSubTodoData(todoDetails);

  const todoList = await Todo.findById(todoListId);
  if (!todoList) {
    throw new ApiError(404, "Unable to find todo list. Invalid Id");
  }

  if (todoList.createdBy.toString() != req.user._id.toString()) {
    throw new ApiError(403, "Not permitted to add todo");
  }
  todoList.subTodo.push(todoDetails);

  const updatedTodoList = await todoList.save({ validateBeforeSave: false });
  if (!updatedTodoList) {
    throw new ApiError(500, "Something went wrong while adding todo.");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { todoList: updatedTodoList },
        "Todo added successfully"
      )
    );
});
const editTodo = asyncHandler(async (req, res) => {
  const { todoName, status, dueDate, note } = req.body;
  const { todoId, todoListId } = req.params;

  validateSubTodoData(req.body);

  const todoList = await Todo.findById(todoListId);
  if (!todoList) {
    throw new ApiError(404, "Todo list not found");
  }

  if (todoList.createdBy.toString() != req.user._id.toString()) {
    throw new ApiError(403, "Not permitted to update todo");
  }

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: todoListId, "subTodo._id": todoId },
    {
      $set: {
        "subTodo.$.todoName": todoName,
        "subTodo.$.status": status,
        "subTodo.$.dueDate": dueDate,
        "subTodo.$.note": note,
      },
    },
    { new: true }
  );

  if (!updatedTodo) {
    throw new ApiError(404, "Todo not found.");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "Todo updated successfully"));
});
const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId, todoListId } = req.params;

  const todoList = await Todo.findById(todoListId);
  if (todoList.createdBy.toString() != req.user._id.toString()) {
    throw new ApiError(403, "Not permitted to delete todo");
  }

  const updatedTodoAfterDeletion = await Todo.findOneAndUpdate(
    { _id: todoListId, "subTodo._id": todoId },
    { $pull: { subTodo: { _id: todoId } } },
    { new: true }
  );

  if (!updatedTodoAfterDeletion) {
    throw new ApiError(404, "Todo not found to delete.");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTodoAfterDeletion,
        "Todo deleted successfully"
      )
    );
});

const getTodo = asyncHandler(async (req, res) => {
  const { todoListId, todoId } = req.params;
  const todoList = await Todo.findById(todoListId);

  if (!todoList) {
    throw new ApiError(404, "TodoList not found.");
  }

  if (todoList.createdBy.toString() != req.user._id.toString()) {
    throw new ApiError(403, "Not permitted to delete todo");
  }

  const todo = await Todo.findOne(
    { _id: todoListId, "subTodo._id": todoId },
    { "subTodo.$": 1 }
  );
  if (!todo) {
    throw new ApiError(404, "Todo not found.");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, { todo: todo.subTodo[0] }, "Todo sent successfully")
    );
});

export { addTodo, editTodo, deleteTodo, getTodo };
