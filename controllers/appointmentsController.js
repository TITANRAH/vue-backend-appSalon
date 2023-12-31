import Appointment from "../models/Appointment.js";
import {parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns'
import { validateObjectId, handleNotFoundError, formateDate } from "../utils/index.js";
import { sendEmailAppointment, sendEmailUpdateAppointment, sendEmailDeleteAppointment } from "../emails/appointmentsEmailService.js";


const createAppointment = async (req, res) => {
    
    const appointment = req.body
    appointment.user = req.user._id.toString()
    console.log(appointment);

    // return por si quuiero ver el console log en la consola aca en back
    // lo quito y guardara en bd
    // return 
    try {

        const newAppointment = new Appointment(appointment)
       const result = await newAppointment.save()
        await sendEmailAppointment({
            date: formateDate(result.date) ,
            time: result.time
        })

        res.json({
            msg: 'Tu reservación se realizó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const getAppointmentsByDate = async (req, res) =>{

    // para recuperar datos de url se usa req.params 
    // en este caso usaremnos req.query por que tamien esta en la url 
    // pero despues del signo de interrogacion
    // console.log(req.query)

    // tomo el dato date del query
    const {date} = req.query
    // digo que newDate es igual al parseo de date al formato indicado
    const newDate = parse(date, 'dd/MM/yyyy', new Date())
    // paso a iso la fecha parseada 
    // y valido newDate que sea una fecha valida antes que continue
    if(!isValid(newDate)){
        const error = new Error('Fecha no válida')
        return res.status(400).json({
            msg: error.message
        })
    }
    const isoDate = formatISO(newDate)
    console.log('isoDate', isoDate)
    // como la fecha convertida a iso tiene parametros asi
    // 2023-08-29T00:00:00-04:00 y esta misma fecha en mongo db 
    // esta guardada asi 2023-08-29T04:00:00.000+00:00 no son iguales
    // jamas me las traera por lo que se hace lo que esta a continuaciion
    
    // consulto la base de datos e importo arriba startOfDay y endOfDay 
    // y le paso a startOfDay iso Date pero convertida a new Date
    const appointments = await Appointment.find({date: {
        $gte: startOfDay(new Date(isoDate)),
        $lte: endOfDay(new Date(isoDate))
        // al poner selecte y time y no -time esto solo me trae time
    }}).select('time')

    res.json(appointments)

}   

// al igual que con las fechas uysaremos esto para obtener la cita por id 
// para la edicion
const getAppointmentsById = async (req, res) => {
    const {id} = req.params

    // validar por Object id
    if(validateObjectId(id, res)) return

    // validar que exista la cita
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment){
        return handleNotFoundError('La cita no existe', res)
    }

    // el usuario autentcado y el del req son distintos 
    // por si abro la url en otro naveggador hayq ue prevenir que eso pase
    console.log(appointment.user)
    console.log(req.user._id)
    
    if(appointment.user.toString() !== req.user._id.toString()){
        const error = new Error('No tienes los permisos')
        return res.status(403).json({msg: error.message})
    }
    // retornar la cita
    res.json(appointment)
}


const updateAppointment = async (req, res) => {
    const {id} = req.params

    // validar por Object id
    if(validateObjectId(id, res)) return

    // validar que exista la cita
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment){
        return handleNotFoundError('La cita no existe', res)
    }

    // el usuario autentcado y el del req son distintos 
    // por si abro la url en otro naveggador hayq ue prevenir que eso pase
    console.log(appointment.user)
    console.log(req.user._id)
    
    if(appointment.user.toString() !== req.user._id.toString()){
        const error = new Error('No tienes los permisos')
        return res.status(403).json({msg: error.message})
    }

    const {date, time, totalAmount, services} = req.body
    appointment.date = date
    appointment.time = time
    appointment.totalAmount = totalAmount
    appointment.services = services

    try {
        const result = await appointment.save()
        await sendEmailUpdateAppointment({
            date: formateDate(result.date) ,
            time: result.time
        })
        res.json({
            msg: 'Cita actualizada correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteAppointment = async (req, res) => {
    console.log('delete')

    const {id} = req.params

    // validar por Object id
    if(validateObjectId(id, res)) return

    // validar que exista la cita
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment){
        return handleNotFoundError('La cita no existe', res)
    }

    // el usuario autentcado y el del req son distintos 
    // por si abro la url en otro naveggador hayq ue prevenir que eso pase
    console.log(appointment.user)
    console.log(req.user._id)
    
    if(appointment.user.toString() !== req.user._id.toString()){
        const error = new Error('No tienes los permisos')
        return res.status(403).json({msg: error.message})
    }

    try {

        console.log('delete')
        const result = await appointment.deleteOne()
        await sendEmailDeleteAppointment({
            date: formateDate(result.date) ,
            time: result.time
        })
        res.json({msg:'Cita cancelada exitósamente'})


        
    } catch (error) {
        console.log(error)
    }
}

export {
    createAppointment,
    getAppointmentsByDate,
    getAppointmentsById,
    updateAppointment,
    deleteAppointment
}