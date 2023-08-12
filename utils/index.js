import mongoose from "mongoose";

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

// creamos un random que importamos luego en el modelo deuser
const uniqueId = () => {
  return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export { 
  validateObjectId, 
  handleNotFoundError, 
  uniqueId 
};
