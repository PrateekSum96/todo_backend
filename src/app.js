import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.route.js";

// routes declaration
app.use("/api/v1/users", userRouter);

export { app };