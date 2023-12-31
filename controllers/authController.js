import User from "../models/User.js";
import { sendEmailVerification, sendEmailPasswordReset } from "../emails/authEmailService.js"
import { generateJWT, uniqueId } from "../utils/index.js";


const register = async (req, res) => {

    // VALIDAR CAMPOS

    // al ahcer console log y al condfigurar la ruta de register e ir 
    // a postman puedo ver el console log aca
    // console.log('desde register')
    // console.log(req.body);
    if (Object.values(req.body).includes('')) {

        const error = new Error('Todos los campos son obligatorios')
        // siempre se recomienda enviar el error asi
        return res.status(400).json({ msg: error.message })
    }

    // EVITAR REGISTROS DUPLICADOS

    const { email, password, name } = req.body
    // busca en la columna de email de la bd y siexiste es por que esta duplicado
    const userExist = await User.findOne({ email })
    console.log(userExist)
    if (userExist) {
        const error = new Error('Usuario ya registrado')
        // siempre se recomienda enviar el error asi
        return res.status(400).json({ msg: error.message })
    }

    // VALIDAR EXTENSION DEL PASS
    console.log(password.trim().length)
    const MIN_PASSWORD_LENGTH = 8
    if (password.trim().length < MIN_PASSWORD_LENGTH) {
        const error = new Error(`El password debe contener ${MIN_PASSWORD_LENGTH} caracteres`)
        // siempre se recomienda enviar el error asi
        return res.status(400).json({ msg: error.message })
    }


    try {
        // creamos una isntancia de user para decir que el usuario es lo que traiga el body
        const user = new User(req.body)
        // guardamos en base de datos y asignamos esos datos guardados a una variable result
        const result = await user.save()
        // extraemos los datos que se ingresan en la base de datos
        const { name, email, token } = result
        console.log(result)
        sendEmailVerification({
            name,
            email,
            token
        })

        res.json({
            msg: 'El usuario se creo correctamente, revisa tu email'
        })
    } catch (error) {
        console.log(error);
    }
}


const verifyAccount = async (req, res) => {
    // console.log('desde verify account')
    //    console.log(req.params.token)  
    const { token } = req.params

    // user ahora es lo que encontro con findOne
    const user = await User.findOne({ token })
    console.log('user encontrado con este token -> ', user)

    if (!user) {
        const error = new Error('Hubo un error, token no válido')

        // el 401 indica que el prblema fueron las credenciales
        return res.status(401).json({ msg: error.message })
    }

    // si el token es valido confiurmar cuenta

    try {
        // usamos la isntancia de usario y cambiamos el campo verified
        user.verified = true
        // eliminamos el token por que estara visible en la url del usuario
        user.token = ''
        await user.save();
        res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {

    }
}


const login = async (req, res) => {

    // extraemoos del body email y password
    const { email, password } = req.body
    //revisar que el usuariuo exiota
    const user = await User.findOne({
        email
    })

    if (!user) {
        const error = new Error('El usuario no existe')

        // el 401 indica que el prblema fueron las credenciales
        return res.status(401).json({ msg: error.message })
    }
    //revisar si confirmo la cuenta verified es un camppo
    if (!user.verified) {
        const error = new Error('Tu cuenta aún no ha sido verificada')

        // el 401 indica que el prblema fueron las credenciales
        return res.status(401).json({ msg: error.message })
    }

    // comporbar password
    // accedo al metodo creado en el modelo user checkpassword es un metodocreado en user model
    if (await user.checkPassword(password)) {
        // generador de tokens desde utils
        const token = generateJWT(user._id)
        console.log('token', token)
        res.json({
            token
        })
    } else {
        const error = new Error('El password es incorrecto')
        // el 401 indica que el prblema fueron las credenciales
        return res.status(401).json({ msg: error.message })
    }

}

const forgotPassword = async (req, res) => {
    console.log('forgot')

    const { email } = req.body
    // comprobar si existe el usuario conn ese correo

    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error('El usuario no existe')

        return res.status(404).json({ msg: error.message })
    }

    try {

        console.log('entro al try de forgot')
        // token de validacion no jwt
        user.token = uniqueId()
        const result = await user.save()

        await sendEmailPasswordReset({
            name: result.name,
            email: result.email,
            token: result.token
        })
        return res.json({ msg: 'Hemos enviado un email con las instrucciones' })
    } catch (error) {
        console.log(error)
    }
}

const verifyPasswordResetToken = async (req, res) => {
    console.log('entro a verify')
    const { token } = req.params

    const isValidToken = await User.findOne({ token })

    if (!isValidToken) {
        const error = new Error('Hubo un error, Token no válido')
        return res.status(400).json({ msg: error.message })
    }

    res.json({ msg: 'Token Válido' })

    console.log(token)
}

const updatePassword = async (req, res) => {
    
    console.log('entro a verify')
    const { token } = req.params
    
    const user = await User.findOne({ token })
    
    if (!user) {
        const error = new Error('Hubo un error, Token no válido')
        return res.status(400).json({ msg: error.message })
    }
    
    const { password } = req.body

    try {
        user.token = ''
        user.password = password
        await user.save()
        res.json({
            msg: 'Password modificado correctamente'
        })
    } catch (error) {
        console.log(error)
    }

}

const user = async (req, res) => {

    // console.log('desde user usuario encontrado que paso por el authMiddleware ->', req.user)

    const { user } = req;
    res.json(user)
}
const admin = async (req, res) => {

    
    const { user } = req;

    if(!user.admin){
        const error = new Error('Acción no válida')
        return res.status(403).json({msg: error.message})
    }
    res.json(user)
}


export {
    register,
    verifyAccount,
    login,
    forgotPassword,
    user,
    verifyPasswordResetToken,
    updatePassword,
    admin
}