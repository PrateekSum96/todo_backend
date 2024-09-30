import { z } from "zod";

import { Todo } from "../models/todos.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addTodoList = asyncHandler(async (req, res) => {
  const todoListName = req.body.todoListName;

  const validTodoName = z.string().trim().min(1);
  const isTodoNameValid = validTodoName.safeParse(todoListName);
  if (!isTodoNameValid.success) {
    throw new ApiError(400, "Todo list name is not valid.");
  }

  const userId = req.user._id;

  const existedTodoName = await Todo.countDocuments({
    todoListName,
    createdBy: userId,
  });

  if (existedTodoName) {
    throw new ApiError(409, "Todo list name already present.");
  }
  const addedTodoListName = await Todo.create({
    todoListName,
    createdBy: userId,
  });

  const allTodoListByUser = await Todo.find({ createdBy: userId });

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { allTodoListByUser, addedTodoList: addedTodoListName },
        "Todo list successfully created."
      )
    );
});

const updateTodoListName = asyncHandler(async (req, res) => {
  const updatedListName = req.body.updatedListName;
  const todoListId = req.params.todoListId;

  const validTodoListName = z.string().trim().min(1);
  const isTodoListNameValid = validTodoListName.safeParse(updatedListName);
  if (!isTodoListNameValid.success) {
    throw new ApiError(400, "Todo list name is invalid.");
  }

  const existedTodoList = await Todo.findById(todoListId);
  if (!existedTodoList) {
    throw new ApiError(404, "Todo List not found.");
  }

  if (req.user._id.toString() !== existedTodoList.createdBy.toString()) {
    throw new ApiError(403, "Not permitted to update details.");
  }
  existedTodoList.todoListName = updatedListName;
  const updatedTodoList = await existedTodoList.save({
    validateBeforeSave: false,
  });

  if (!updatedTodoList) {
    throw new ApiError(
      500,
      "Something went wrong while updating the todo list name"
    );
  }

  const allTodoListByUser = await Todo.find({ createdBy: req.user._id });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedTodoList, allTodoListByUser },
        "Todo list name updated successfully"
      )
    );
});

const updateTodoListImage = asyncHandler(async (req, res) => {
  const { backgroundImageLink } = req.body;
  const { todoListId } = req.params;

  const existedTodoList = await Todo.findById(todoListId);
  if (!existedTodoList) {
    throw new ApiError(404, "Todo list not found");
  }
  if (existedTodoList.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not permitted to update background color.");
  }
  existedTodoList.backgroundImage = backgroundImageLink;
  const updatedTodoList = await existedTodoList.save({
    validateBeforeSave: false,
  });
  if (!updatedTodoList) {
    throw new ApiError(
      500,
      "Something went wrong while updating the todo list background color"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { todoList: updatedTodoList },
        "Todo list background color updated successfully"
      )
    );
});

const deleteTodoList = asyncHandler(async (req, res) => {
  const { todoListId } = req.params;
  const todoList = await Todo.findById(todoListId);
  if (!todoList) {
    throw new ApiError(404, "Todo list not found");
  }
  if (todoList?.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete.");
  }

  const deletedTodoList = await Todo.findByIdAndDelete(todoListId);
  if (!deletedTodoList) {
    throw new ApiError(500, "Something went wrong while deleting.");
  }
  const allTodoListByUser = await Todo.find({ createdBy: req.user._id });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { allTodoListByUser },
        "Todo list successfully deleted."
      )
    );
});

const getAllTodoLists = asyncHandler(async (req, res) => {
  const user = req.user;
  const allTodoList = await Todo.find({ createdBy: user._id });
  res
    .status(200)
    .json(new ApiResponse(200, allTodoList, "All todo list sent successfully"));
});

const getATodoList = asyncHandler(async (req, res) => {
  const { todoListId } = req.params;
  const todoList = await Todo.findById(todoListId);

  if (!todoList) {
    throw new ApiError(404, "Todo list not found.");
  }
  if (req.user._id.toString() !== todoList.createdBy.toString()) {
    throw new ApiError(403, "You do not have access");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { todoList }, "Todo list sent successfully"));
});

export {
  addTodoList,
  updateTodoListName,
  updateTodoListImage,
  deleteTodoList,
  getAllTodoLists,
  getATodoList,
};
