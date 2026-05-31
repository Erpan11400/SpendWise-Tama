import { Router } from 'express';
import authenticateToken from '../../../middlewares/authentication.js'
import {
    login,
    logout,
    refreshToken
} from '../controller/auth-controller.js';

const router = Router()

router.post('/', login)
router.put('/', refreshToken)
router.delete('/', authenticateToken, logout);

export default router