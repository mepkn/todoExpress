import mongoose, { Document } from "mongoose";

interface TodoDocument extends Document {
  text: string;
  completed: boolean;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new mongoose.Schema<TodoDocument>(
  {
    text: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model<TodoDocument>("Todo", TodoSchema);

export default Todo;
export type { TodoDocument };
