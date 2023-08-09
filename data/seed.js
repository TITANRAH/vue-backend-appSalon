
import dotenv from 'dotenv'
import { db } from '../config/db.js'
import colors from 'colors'
// siempre los datos interacturan con los modelos
import Services from '../models/Services.js'
import { services } from './beautyServices.js'

// llamo a las variables de entorno
dotenv.config()

// llamo a la conexiuon a la base de datos de mongo db
await db()

async function seedDB() {
    try {

        // insertMany significa que espera un arreglo en vez de hacer foreach esto es propio de mongo
        await Services.insertMany(services)
        console.log(colors.green.bold('Se agregaron los datos correctamednte'))
        // asi sin numero singnifca en 0 y dice finaliza y todo estuvo bien
        process.exit()
        
    } catch (error) {
        console.log(error)
        // finaliza el proceso y hubo algun error
        process.exit(1)
    }
}

async function clearDB(){
    try {

        // eliminar todo 
        await Services.deleteMany()
        console.log(colors.red.bold('Se eliminaron los datos'))
        // asi sin numero singnifca en 0 y dice finaliza y todo estuvo bien
        process.exit()
        
    } catch (error) {
        console.log(error)
        // finaliza el proceso y hubo algun error
        process.exit(1)
    }
}

// console.log(process.argv[2])

if(process.argv[2] === '--import'){

    seedDB()
} else {
    clearDB()
}