import express from "express";


// create express app
const app = express();

app.get('/',(req,res)=>{
    res.send('Hola desde el server')
})

export default app;