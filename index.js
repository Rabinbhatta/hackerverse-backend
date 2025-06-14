import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
// import authRoutes from "./route/auth.js";

const app = express();
const https = createServer(app);

dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    // Your React app domain
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth", authRoutes);

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    https.listen(process.env.PORT, () =>
      console.log(`Server is listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error.message));
