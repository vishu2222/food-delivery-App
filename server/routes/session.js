import express from 'express'
import { userLogin, authorizeUser, logout } from '../controllers/session.js'
import { auth } from '../middleware/auth.js'

export const router = express.Router()

router.post('/', userLogin)
router.get('/', auth, authorizeUser)
router.delete('/', auth, logout)
