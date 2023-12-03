import app from './app.js'
import logger from './configs/logger.config.js';



// variables de entorno
const PORT = process.env.PORT || 8000;
console.log(process.env.NODE_ENV)

app.listen(PORT, () => {
  logger.info(`Con Logger Escuchando Puerto ${PORT}...`);
});