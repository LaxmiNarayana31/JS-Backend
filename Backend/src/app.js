import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/user", userRouter);

export { app };

  
  
  
  
// routes declaration
// you can't directly write app.get() -> in that all you write all routes and controllers in a single file
// in this case all routes are write in a separate folder, so it is mandotory to use middlewares -> for that use app.use

// what are write in this it act as prefix
// standard practise to write this v1 -> version 1
