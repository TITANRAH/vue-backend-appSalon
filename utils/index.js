import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import {format} from 'date-fns'
import es from 'date-fns/locale/es/index.js'

function validateObjectId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("El id no es valido");
    // al póner return hasta aca se ejecuta este codigo si es que los cambpos son vacios
    return res.status(400).json({
      msg: error.message,
    });
  }
}

function handleNotFoundError(message, res) {
  const error = new Error(message);
  // al póner return hasta aca se ejecuta este codigo si es que los cambpos son vacios
  return res.status(404).json({
    msg: error.message,
  });
}

// creamos un random que importamos luego en el modelo deuser conb esto creamos el TOKEN DE VERIFICACION 
const uniqueId = () => {
  return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

const generateJWT = (id) => {
  // guardare el id
  const token = jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })

  return token;
}

function formateDate(date){
  return format(date, 'PPPP', {locale:es})
}

export { 
  validateObjectId, 
  handleNotFoundError, 
  uniqueId,
  generateJWT,
  formateDate
};
