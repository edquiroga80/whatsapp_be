import app from './app.js'
import dotenv from "dotenv";

// dotenv
dotenv.config();

// variables de entorno
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Escuchando Puerto ${PORT}...`);
});