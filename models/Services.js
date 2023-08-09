import mongoose from "mongoose"
// se llama services porq ue eso dara la empresa servicios de belleza 
const servicesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Nombre Servicio'
    },
    price: {
        type: String,
        required: true,
        trim: true,
    }
})

// nombre del modelo y el esquema del modelo
const Services = mongoose.model('Services', servicesSchema)
export default Services;