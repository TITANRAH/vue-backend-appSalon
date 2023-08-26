import express from 'express'
import {register, verifyAccount, login, admin,user, forgotPassword, verifyPasswordResetToken, updatePassword} from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()

// rutas y autenticacion

router.post('/register', register)
router.get('/verify/:token', verifyAccount)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.route('/forgot-password/:token')
      .get(verifyPasswordResetToken)
      .post(updatePassword)

// http://localhost:4000/api/auth/verify/1h7l71emfs7bpjm6ltco


// area privada requiere jwt
router.get('/user', authMiddleware, user)
router.get('/admin', authMiddleware, admin)
export default router