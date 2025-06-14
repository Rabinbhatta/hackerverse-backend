import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import authRoutes from "./routes/auth.js";

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
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use("/api/auth", authRoutes);

cloudinary.config({
  cloud_name: String(process.env.cloudinary_cloud_name),
  api_key: Number(process.env.cloudinary_api_key),
  api_secret: String(process.env.cloudinary_api_secret),
});

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGODB)
  .then(() =>
    https.listen(process.env.PORT, "0.0.0.0", () =>
      console.log(`Server is listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error.message));
