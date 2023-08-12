import express from 'express'
import {register, verifyAccount} from '../controllers/authController.js'

const router = express.Router()

// rutas y autenticacion

router.post('/register', register)
router.get('/verify/:token', verifyAccount)

// http://localhost:4000/api/auth/verify/1h7l71emfs7bpjm6ltco

export default router