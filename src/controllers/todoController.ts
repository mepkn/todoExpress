import { Request, Response } from "express";
import mongoose from "mongoose";
import Todo from "../models/todoModel";
import { UserDocument } from "../models/userModel";

interface AuthRequest extends Request {
  user?: UserDocument & { _id: mongoose.Types.ObjectId };
}

const getAllTodos = async (req: AuthRequest, res: Response) => {
  try {
    const todos = await Todo.find({ user: req.user?._id });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createTodo = async (req: AuthRequest, res: Response) => {
  const { text } = req.body;
  try {
    const newTodo = new Todo({ text, user: req.user?._id });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid data" });
  }
};

const getTodo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }
  try {
    const todo = await Todo.findOne({ _id: id, user: req.user?._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTodo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }
  const update = { text };
  try {
    const todo = await Todo.findByIdAndUpdate(
      { _id: id, user: req.user?._id },
      update,
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleTodo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }
  try {
    const todo = await Todo.findOne({ _id: id, user: req.user?._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTodo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid todo ID" });
  }
  try {
    const todo = await Todo.findByIdAndDelete({ _id: id, user: req.user?._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { createTodo, deleteTodo, getAllTodos, getTodo, toggleTodo, updateTodo };
