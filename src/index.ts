import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db";
import errorHandler from "./middleware/errorMiddleware";
import logger from "./middleware/loggerMiddleware";
import notFound from "./middleware/notFoundMiddleware";
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";

// Config
dotenv.config();
const port = process.env.PORT || 3000;
connectDB();
const app = express();

// Middleware
// handle json and urlencoded data in incoming request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// handle cors access
app.use(cors());
// log all requests to the console
app.use(logger);

// Routing
app.get("/", (req, res) => res.send("API running"));
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use(notFound);
app.use(errorHandler);

// Listen
app.listen(port, () => console.log(`Server started on port ${port}`));
