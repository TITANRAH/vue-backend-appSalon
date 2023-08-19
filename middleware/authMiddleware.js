import jwt from 'jsonwebtoken'
import User from '../models/User.js';


// el token siempre se manda en el header y los datos en el body
const authMiddleware = async (req, res, next) => {
    // console.log('desde middleware');
    
    //     esto en el area privada de las rutas primero se ejectuta 
    //     el middleware y luego se ejecuta la siguiente funcion que esta declarada 
    //     ahi al lado en el archivo de rutas por lo tanto ejecutara user
    //     // area privada requiere jwt
    // router.get('/user', authMiddleware, user)
    
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
       

       try {
            // console.log('si hay token');
            const token = req.headers.authorization.split(' ')[1]
            
            // console.log('token ->', token);
            // para verificar el token usamos la mismallave creada para crearlo
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // console.log('token decodificado ->', decoded) 
            // con .select puedo decirle que no me traiga esas columnas
            // al decir que el req.user seraigual al usuario encontrado 
            // tendre al user para ser utilizado en mas endpoints y consultas de express
            // por ejemplo en la funcion user que esta ligada a este middleware
           req.user = await User.findById(decoded.id).select(
                "-password -verified -token -__v"
            )
            // console.log('usuario encontrado por el id en token ->' , req.user)

            next()
    //    podemos poner catch solo se puede generar el error sin problema 
    //    si lo dejo chocara con el error de abajo
        } catch {
        const error = new Error('Token no válido')
        res.status(403).json({msg: error.message})
       
       }
} else {
    const error = new Error('Token no válido o inexistente')
    res.status(403).json({msg: error.message})
    console.log('no hay token');
    
}

}

export default authMiddleware