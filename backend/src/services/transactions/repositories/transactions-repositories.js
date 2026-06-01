import { nanoid } from 'nanoid'
import db from '../../../database/sqlite.js'

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
    createTransaction(user_id, type, descript, amount, category, wallet, date) {
        const id = `trs-${nanoid(16)}`

        db.prepare(
            'INSERT INTO transactions (id, user_id, type, descript, amount, category, wallet, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(id, user_id, type, descript, amount, category, wallet, date)

        return id
    }

    getTransactionById(id) {
        return db.prepare('SELECT * FROM transactions WHERE id = ?').get(id)
    }

    getAllTransaction(user_id) {
        return db
            .prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC')
            .all(user_id)
    }

    updateTransaction(id, user_id, newTransaction) {
        const stmt = db.prepare(
            'UPDATE transactions SET type = ?, descript = ?, amount = ?, category = ?, wallet = ?, date = ? WHERE id = ? AND user_id = ?'
        )
        const result = stmt.run(
            newTransaction.type,
            newTransaction.descript,
            newTransaction.amount,
            newTransaction.category,
            newTransaction.wallet,
            newTransaction.date,
            id,
            user_id
        )
        return result.changes > 0
    }

    deleteTransaction(id) {
        db.prepare('DELETE FROM transactions WHERE id = ?').run(id)
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

        const income = db
            .prepare('SELECT * FROM transactions WHERE user_id = ? AND strftime("%Y-%m", date) = ? AND type = ? ORDER BY date DESC')
            .all(user_id, periode, 'Pemasukan')

        const expense = db
            .prepare('SELECT * FROM transactions WHERE user_id = ? AND strftime("%Y-%m", date) = ? AND type = ? ORDER BY date DESC')
            .all(user_id, periode, 'Pengeluaran')

        return { income, expense }
    }
}

export default new TransactionsRepositories()