import TransactionsRepositories from "../repositories/transactions-repositories.js"
import response from '../../../utils/response.js'
import WalletsRepositories from "../../wallets/repositories/wallets-repositories.js"
import BudgetRepositories from "../../budgeting/repositories/budget-repositories.js"

const createTransaction = (req, res, next) => {
    const { id: user_id } = req.user
    const { newTransaction } = req.body
    const { type, descript, amount, category, wallet, date } = newTransaction

    const walletSucces = WalletsRepositories.updateWalletByTransaction(user_id, wallet, amount)
    if (!walletSucces) {
        return response(res, 400, 'Gagal memperbarui wallet')
    }

    if (type === 'Pengeluaran') {
        const budgetSuccess = BudgetRepositories.updateByTransaction(user_id, category, amount)
        if (!budgetSuccess) {
            return response(res, 400, 'Gagal meperbarui budget')
        }
    }

    const transactionId = TransactionsRepositories.createTransaction(user_id, type, descript, amount, category, wallet, date)
    if (!transactionId) {
        return response(res, 400, 'Gagal membuat transaksi')
    }

    return response(res, 201, 'Berhasil menambahkan transaksi', { id: transactionId })
}

const getAllTransactions = (req, res, next) => {
    const { id: user_id } = req.user
    const transactions = TransactionsRepositories.getAllTransaction(user_id)

    return response(res, 200, 'Berhasil ', { transactions })
}

const getTransactionById = (req, res, next) => {
    const { transaction_id } = req.params
    const foundedTransaction = TransactionsRepositories.getTransactionById(transaction_id)
    if (!foundedTransaction) {
        return response(res, 404, 'Transaksi tidak ditemukan')
    }

    return response(res, 200, 'Berhasil menampilkan transaksi', foundedTransaction)
}

const updateTransactions = (req, res, next) => {
    const { transaction_id } = req.params
    const { oldTransaction, newTransaction } = req.body

    const updateWalletSuccess = WalletsRepositories.updateByEditTransaction(oldTransaction, newTransaction)
    if (!updateWalletSuccess) {
        return response(res, 400, 'Gagal update wallet')
    }

    const updateBudgetSucces = BudgetRepositories.updateByEditTransaction(oldTransaction, newTransaction)
    if (!updateBudgetSucces) {
        return response(res, 400, 'Gagal update budget')
    }

    const updateTransactionSuccess = TransactionsRepositories.updateTransaction(transaction_id, oldTransaction.user_id, newTransaction)
    if (!updateTransactionSuccess) {
        return response(res, 400, 'Gagal memperbarui transaksi')
    }

    return response(res, 200, 'Berhasil memperbarui transaksi')
}

const deleteTransaction = (req, res, next) => {
    const { id: user_id } = req.user
    const { transaction_id } = req.params
    const foundedTransaction = TransactionsRepositories.getTransactionById(transaction_id)
    if (!foundedTransaction) {
        return response(res, 404, 'Transaksi tidak ditemukan')
    }

    const { type, amount, category, wallet } = foundedTransaction

    const updateWalletSuccess = WalletsRepositories.updateWalletByTransaction(user_id, wallet, -(amount))
    if (!updateWalletSuccess) {
        return response(res, 400, 'Gagal memperbarui wallet')
    }

    if (type === 'Pengeluaran') {
        const updateBudgetSuccess = BudgetRepositories.updateByTransaction(user_id, category, -(amount))
        if (!updateBudgetSuccess) {
            return response(res, 400, 'Gagal meperbarui budget')
        }
    }

    TransactionsRepositories.deleteTransaction(transaction_id)

    return response(res, 200, 'Berhasil menghapus transaction')
}

const getIncomeAndExpense = (req, res, next) => {
    const { id: user_id } = req.user
    const { bulan, tahun } = req.params

    const transactions = TransactionsRepositories.getIncomeAndExpense(user_id, bulan, tahun)
    return response(res, 200, 'Berhasil menampilkan data', transactions)
}


export {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransactions,
    deleteTransaction,
    getIncomeAndExpense,
}