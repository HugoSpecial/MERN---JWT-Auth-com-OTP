import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/mongobd.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRouter from "./src/routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// mim 1:27:42 https://www.youtube.com/watch?v=7BTsepZ9xp8&t=37s
