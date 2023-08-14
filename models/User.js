
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import { uniqueId } from "../utils/index.js";

// archivos creados por nosotros siempre van con js
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  token: {
    type: String,
    // id unico para el usuario random creado en utils
    // lo enviaremos por email
    // autenticamos en la base de datos y confirmamos la cuenta
    default: () => uniqueId()
  },
  // cuando un usuario se genere en la base de datos
  // el default comienza como false
  // pero si confirma la cuenta y envia el token sera true
  verified: {
    type: Boolean,
    default: false,
  },

  admin: {
    type: Boolean,
    default: false,
  },
})

// antes de que se guarde hachear el pass para eso srive el pre 
// etonces antes de save ejecuita este codigo
userSchema.pre('save', async function (next){
  // si un password ya esta hacheado no lo volvera a hachear
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
// el nombre del archivo en base de datos que contendra usuarios se llamara aqui User 
// pero mongo convierte todo a minusculas y le pone una s y queda users

// comprobacion de password hacheado con password plano para login

 userSchema.methods.checkPassword = async function(inputPassword){
    
    // ira a la instancia del usuario haciendo login a buscar la columna password eso es this.password
  return await bcrypt.compare(inputPassword, this.password)
 }

const User = mongoose.model('User', userSchema)

export default User
