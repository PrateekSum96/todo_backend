import mongoose from "mongoose";

const todoItemSchema = new mongoose.Schema({
  todo: {
    type: String,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const todoSchema = new mongoose.Schema(
  {
    todoTitle: {
      type: String,
      required: true,
      unique: true,
    },
    todoItems: [todoItemSchema],

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
