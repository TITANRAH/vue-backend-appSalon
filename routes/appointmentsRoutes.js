import express from "express";
import {createAppointment, getAppointmentsByDate} from '../controllers/appointmentsController.js'
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/')
      .post(authMiddleware, createAppointment )
      .get(authMiddleware, getAppointmentsByDate )

export default router;