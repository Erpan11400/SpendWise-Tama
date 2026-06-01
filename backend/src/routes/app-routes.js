import { Router } from "express";
import users from '../services/users/routes/users-route.js';
import budgeting from '../services/budgeting/routes/budget-route.js'
import authentications from '../services/authentications/routes/auth-route.js';
import wallets from '../services/wallets/routes/wallets-route.js'
import transactions from '../services/transactions/routes/transactions-route.js'
import aiRoutes from '../services/ai/routes/ai-route.js';

const router = Router()

router.use('/users', users)
router.use('/budgeting', budgeting)
router.use('/wallets', wallets)
router.use('/transactions', transactions)
router.use('/authentication', authentications)
router.use('/ai', aiRoutes)

export default router