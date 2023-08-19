import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    // esto es todo el objeto con los servicios la fecha la hora y el total a pagar
    // mas el cruce de la informacion del usuaruio que reaslizsa la cita
    // y haremos el mismo cruce como con servicios
    services: [
        {
            // es como hacer un join ledigo que apunte a Servicios y el tipo que le pasare 
            // para hacer esa union es el id de mongoose
            // y ademas es un arreglo
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services'
        }

    ,]
    ,
    date: {
        type: Date
    },
    time: {
        type: String
    },
    totalAmount: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }


})

const Appointment = mongoose.model('Appointment', appointmentSchema)

export default Appointment;