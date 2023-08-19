import express from 'express'
import {register, verifyAccount, login, user} from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()

// rutas y autenticacion

router.post('/register', register)
router.get('/verify/:token', verifyAccount)
router.post('/login', login)

// http://localhost:4000/api/auth/verify/1h7l71emfs7bpjm6ltco


// area privada requiere jwt
router.get('/user', authMiddleware, user)
export default router