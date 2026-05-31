import { Router } from "express";
import authenticateToken from '../../../middlewares/authentication.js'
import {
    createTransaction,
    deleteTransaction,
    getAllTransactions,
    getIncomeAndExpense,
    getTransactionById,
    updateTransactions
} from "../controllers/transactions-controller.js";

const router = Router()

router.use(authenticateToken)

router.post('/', createTransaction)
router.get('/', getAllTransactions)
router.put('/:transaction_id', updateTransactions)
router.get('/:transaction_id', getTransactionById)
router.get('/:bulan/:tahun', getIncomeAndExpense)
router.delete('/:transaction_id', deleteTransaction)

export default router