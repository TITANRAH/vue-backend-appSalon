// const express = require('express')
import express from 'express';
import {db} from './config/db.js'
import colors from 'colors'
import dotenv from 'dotenv'
import servicesRoutes from './routes/ServicesRoutes.js'

// variables de entorno

dotenv.config()

// configurar app

const app = express()

//leer datos via body
app.use(express.json())

//conectar a db

db()

// definir ruta

app.use('/api/services', servicesRoutes)

// definir puerto


const PORT = process.env.PORT || 5000
console.log('port' ,process.env.PORT )

// arrancar la app

app.listen(PORT, ()=> {
    console.log( colors.blue('servidorejecutando en puerto:', PORT));
})


