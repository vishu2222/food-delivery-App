import express from 'express'
import { userLogin } from '../controllers/session.js'

export const router = express.Router()

router.post('/new', userLogin)
