import Appointment from "../models/Appointment.js";

const getUserAppointments = async (req, res) => {
    console.log('desde get user appointments', req.params);
    const {user} = req.params
    // en el objeto de appointments tenemos el id de usuario
    // en el campo user de los appointments 
    // asi que le pasamos el id que viene de params para buscar al usuario
    // buscamos en la columna user de appointment el valor de user que recibimos de los params
 

    // esto es para que la informnacion de citas la pueda ver solo el usuario autenticado 
    // user es de la consulta y req.user._id es el usuario autenticado
    if(user !== req.user._id.toString()){
        const error = new Error('Acceso Denegado')
        return res.status(400).json({msg: error.message})
    }
    try {

        const query = req.user.admin ? {date: {$gte: new Date()}} : {
            //    como son iguales puedo poner solo user
                 user,
                 date:{
                    // esto solo retorna las citas a futuro no las anteriores a la fecha actual
                    $gte: new Date()
                 }
                //  este populate lo que hace es traerse la informacion de los servicios 
                //  completa como en el modelo de appointments le estamos pasando el id de servicio 
                //  asi puedo traer la info completa de cada servicio
                // ordeno la colimna que quiera y desc o asc
            } 
        const appointments = await Appointment.find(query).populate('services').populate({path: 'user', select:'name email'}).sort({date: 'asc'})

        res.json(appointments)
        
    } catch (error) {
        console.log(error)
    }
}   

export {
    getUserAppointments
}