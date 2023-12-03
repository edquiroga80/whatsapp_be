import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";

// Configuración de dotenv
dotenv.config();

// Crear la aplicación express
const app = express();

// Morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Parsear el cuerpo de la solicitud en formato JSON
app.use(express.json());

// Parsear el cuerpo de la solicitud codificado en URL
app.use(express.urlencoded({ extended: true }));

// sanitize
app.use(mongoSanitize());

// coockie parser
app.use(cookieParser());

// Helmet
app.use(helmet());

// compression
app.use(compression());

// file upload
app.use(
  fileUpload({
    useTempFile: true,
  })
);

// cors
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// api v1 routes
app.use("/api/v1", routes);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});

// error handling
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export default app;
