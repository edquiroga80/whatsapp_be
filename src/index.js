import app from "./app.js";
import logger from "./configs/logger.config.js";
import mongoose from "mongoose";

// variables de entorno
const { DATABASE_URL } = process.env;

const PORT = process.env.PORT || 8000;
console.log(process.env.NODE_ENV);

// exit on mongodb error
mongoose.connection.on("error", (err) => {
  logger.error(`Error de coneccion: ${err}`);
  process.exit(1);
});

// mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// mongodb connection
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Conectado a la base de datos MongoDB");
  });

let server;

server = app.listen(PORT, () => {
  logger.info(`Con Logger Escuchando Puerto ${PORT}...`);
  // throw new Error("error in server");
  console.log("process id", process.pid);
});

// handle server errors
const exitHandler = () => {
  if (server) {
    logger.info("Server Cerrado");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);

process.on("unhandledRejection", unexpectedErrorHandler);

// SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server Closed");
    process.exit(1);
  }
});
