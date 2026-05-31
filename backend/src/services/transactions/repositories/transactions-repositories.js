import { nanoid } from 'nanoid'

/* 
 * id
 * user_id
 * type
 * descript
 * amount
 * category
 * wallet
 * created_at */

class TransactionsRepositories {
    constructor() {
        this.transactions = []
    }

    createTransaction(user_id, type, descript, amount, category, wallet, date) {
        const id = `trs-${nanoid(16)}`

        const newTransaction = { id, user_id, type, descript, amount, category, wallet, date }

        this.transactions.push(newTransaction)

        return id
    }

    getTransactionById(id) {
        return this.transactions.find(trans => trans.id === id)
    }

    getAllTransaction(user_id) {
        const usedData = this.transactions.filter(trans => trans.user_id === user_id)

        return usedData.reverse()
    }

    updateTransaction(id, user_id, newTransaction) {
        const index = this.transactions.findIndex(trans => trans.id === id)
        if (index === -1) {
            return false
        }

        this.transactions[index] = { id, user_id, ...newTransaction }
        return true
    }

    deleteTransaction(id) {
        const newTransactionList = this.transactions.filter(trans => trans.id !== id)

        this.transactions = newTransactionList
    }

    getIncomeAndExpense(user_id, bulan, tahun) {
        const mapBulan = {
            'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04', 'Mei': '05', 'Juni': '06',
            'Juli': '07', 'Agustus': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
        };
        const targetBulan = mapBulan[bulan]

        if (targetBulan === undefined) {
            return [];
        }

        const periode = `${tahun}-${targetBulan}`

        const income = this.transactions.filter(trans => {
            return trans.user_id === user_id && trans.date.startsWith(periode) && trans.type === 'Pemasukan'
        })

        const expense = this.transactions.filter(trans => {
            return trans.user_id === user_id && trans.date.startsWith(periode) && trans.type === 'Pengeluaran'
        })

        return {income, expense}
    }
}

export default new TransactionsRepositories()