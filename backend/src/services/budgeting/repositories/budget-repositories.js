import { nanoid } from 'nanoid';
import db from '../../../database/sqlite.js';

/* 
 * id
 * user_id
 * name
 * used
 * allocation
 */

class BudgetRepositories {
    addBudget(user_id, name, allocation) {
        const id = `bud-${nanoid(16)}`
        const created_at = new Date().toISOString()

        db.prepare(
            'INSERT INTO budgets (id, user_id, name, used, allocation, created_at) VALUES (?, ?, ?, 0, ?, ?)'
        ).run(id, user_id, name, allocation, created_at)

        return id
    }

    getAllBudgeting(user_id, namaBulan, stringTahun) {
        const mapBulan = {
            'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04', 'Mei': '05', 'Juni': '06',
            'Juli': '07', 'Agustus': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
        };

        const targetBulan = mapBulan[namaBulan];
        const targetTahun = String(Number(stringTahun));

        if (!targetBulan || Number.isNaN(Number(targetTahun))) {
            return [];
        }

        return db
            .prepare(
                'SELECT * FROM budgets WHERE user_id = ? AND strftime("%Y", created_at) = ? AND strftime("%m", created_at) = ?'
            )
            .all(user_id, targetTahun, targetBulan)
    }

    getAllBudget() {
        return db.prepare('SELECT * FROM budgets ORDER BY created_at DESC').all()
    }

    getBudgetById(id) {
        return db.prepare('SELECT * FROM budgets WHERE id = ?').get(id)
    }

    editBudget(budget_id, name, allocation) {
        db.prepare('UPDATE budgets SET name = ?, allocation = ? WHERE id = ?').run(name, allocation, budget_id)
    }

    updateByTransaction(user_id, name, amount) {
        const result = db
            .prepare('UPDATE budgets SET used = used - ? WHERE user_id = ? AND name = ?')
            .run(amount, user_id, name)

        return result.changes > 0
    }

    updateByEditTransaction(oldTransaction, newTransaction) {
        const updateUsed = (user_id, name, delta) => {
            const result = db
                .prepare('UPDATE budgets SET used = used + ? WHERE user_id = ? AND name = ?')
                .run(delta, user_id, name)
            return result.changes > 0
        }

        if (oldTransaction.type === 'Pemasukan' && newTransaction.type === 'Pemasukan') {
            return true
        }

        if (oldTransaction.type === 'Pemasukan' && newTransaction.type === 'Pengeluaran') {
            return updateUsed(oldTransaction.user_id, newTransaction.category, -newTransaction.amount)
        }

        if (oldTransaction.type === 'Pengeluaran' && newTransaction.type === 'Pemasukan') {
            return updateUsed(oldTransaction.user_id, oldTransaction.category, oldTransaction.amount)
        }

        if (oldTransaction.category === newTransaction.category) {
            return updateUsed(oldTransaction.user_id, newTransaction.category, oldTransaction.amount - newTransaction.amount)
        }

        return (
            updateUsed(oldTransaction.user_id, oldTransaction.category, oldTransaction.amount) &&
            updateUsed(newTransaction.user_id, newTransaction.category, -oldTransaction.amount)
        )
    }

    searchBudgeting(name) {
        const row = db.prepare('SELECT 1 FROM budgets WHERE name = ? LIMIT 1').get(name)
        return Boolean(row)
    }

    deleteBudget(id) {
        db.prepare('DELETE FROM budgets WHERE id = ?').run(id)
    }
}

export default new BudgetRepositories()