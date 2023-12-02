import app from './app.js'




// variables de entorno
const PORT = process.env.PORT || 8000;
console.log(process.env.NODE_ENV)

app.listen(PORT, () => {
  console.log(`Escuchando Puerto ${PORT}...`);
});