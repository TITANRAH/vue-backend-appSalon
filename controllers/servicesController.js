
import Services from "../models/Services.js";
import { validateObjectId, handleNotFoundError } from "../utils/index.js";

// CRETE SERVICES
const createService = async (req, res) => {
  console.log("entro a la funcion create");
  // console.log(req.body)
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    // al póner return hasta aca se ejecuta este codigo si es que los cambpos son vacios
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    // llamo al modelo y hago match con el body que se ingresa desde el cliente
    // automaticamente mongo db le asigna un id
    const service = new Services(req.body);
    // console.log(service)
    // guardamos asi en la base de datos de mongo
    const result = await service.save();
    // retornamos lo que se guardo
    // res.json(result)
    // o bien una respuesta
    res.json({
      msg: "El servicio se creo correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

// GET SERVICES
const getServices = async (req, res) => {
  try {

    console.log('entro al getservices')
    const services = await Services.find()
    res.json(services)
  } catch (error) {

    console.log(error)
  }
};


// GET SERVICE FOR ID
const getServiceById = async (req, res) => {
  // obtengo el parametro llamado id
  // console.log(req.params.id)

  // validar un object id (nomencaltura de ids de mnonog) no si esxiste , si es valido
  // extraigo de req.params el id
  const { id } = req.params;

  // como la funcion validateObjectId tiene un return en caso de error debo poner el if y retornar
  // o el codigo dara error
  if (validateObjectId(id, res)) return;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("El id no es valido");
    // al póner return hasta aca se ejecuta este codigo si es que los cambpos son vacios
    return res.status(400).json({
      msg: error.message,
    });
  }
  // validar que exista el servicio con ese id
  const service = await Services.findById(id);
  // console.log(service)
  if (!service) {
    // si no existe el servicio retorna lo que realiza la funcion
    return handleNotFoundError("El servicio no existe", res);
  }
  // mostrar el servicio
  res.json(service);
};


// UPDATE SERVICES
const updateService = async (req, res) => {
  // extraigo de req.params el id
  const { id } = req.params;

  if (validateObjectId(id, res)) return;

  // validar que exista el servicio con ese id
  const service = await Services.findById(id);
  // console.log(service)
  if (!service) {
    // si no existe el servicio retorna lo que realiza la funcion
    return handleNotFoundError("El servicio no existe", res);
  }
  // escribimos en el objeto los valores nuevos o mantenemos el antiguo segun el caso
  service.name = req.body.name || service.name;
  service.price = req.body.price || service.price;

  //  console.log(service) servicio antiguo
  //  console.log(id) id a editar
  //  console.log(req.body) datos de servicio a actuializar

  try {
    await service.save();
    res.json({
      msg: "El servicio se actualizó correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

// DELETE SERVICE

const deleteService = async (req, res) => {
  const { id } = req.params;
  if (validateObjectId(id, res)) return;
  const service = await Services.findById(id);
  if (!service) {
    // si no existe el servicio retorna lo que realiza la funcion
    return handleNotFoundError("El servicio no existe", res);
  }
  try {
    await service.deleteOne();
    res.json({
      msg: "El servicio ha sido eliminado",
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
};
