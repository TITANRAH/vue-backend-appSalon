// const express = require('express')
import express from 'express';
import {db} from './config/db.js'
import colors from 'colors'
import dotenv from 'dotenv'
import servicesRoutes from './routes/ServicesRoutes.js'
import autRoutes from './routes/authRoutes.js'
import cors from "cors"


// variables de entorno

dotenv.config()

// configurar app

const app = express()

//leer datos via body
app.use(express.json())

//conectar a db

db()

// configurar cors

console.log('argumento 2 desde el index.js',process.argv[2])
// quitar undefined antes de hacer el deployment
const whitelist = [process.env.FRONTEND_URL]
// al poner undefined puedo ver en el cliente y en postman el llamado 
// a las apis
if(process.argv[2] === '--postman'){
    whitelist.push(undefined)
}

const corsOptions = {
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            // Permite la conexión
            callback(null, true);
        } else {
            // No permitir la conexión
            callback(new Error('Not allowed by CORS'));
        }
    }
}

app.use(cors(corsOptions))

// definir ruta

app.use('/api/services', servicesRoutes)
app.use('/api/auth', autRoutes)

// definir puerto


const PORT = process.env.PORT || 5000
console.log('port' ,process.env.PORT )

// arrancar la app

app.listen(PORT, ()=> {
    console.log( colors.blue('servidorejecutando en puerto:', PORT));
})


