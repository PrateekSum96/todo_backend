import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);

export { app };
