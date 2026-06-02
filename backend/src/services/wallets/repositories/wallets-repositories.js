import db from '../../../database/sqlite.js';

/* 
 * user_id
 * name
 * amount */

class WalletsRepositories {
    getAllWallets(user_id) {
        let wallets = db
            .prepare('SELECT user_id, name, amount FROM wallets WHERE user_id = ?')
            .all(user_id)

        if (wallets.length === 0) {
            this.addWallets(user_id)
            wallets = db
                .prepare('SELECT user_id, name, amount FROM wallets WHERE user_id = ?')
                .all(user_id)
        }

        return wallets
    }

    addWallets(user_id) {
        const stmt = db.prepare('INSERT OR IGNORE INTO wallets (user_id, name, amount) VALUES (?, ?, 0)')
        const wallets = ['BCA', 'Cash', 'OVO', 'Dana', 'Mandiri']

        wallets.forEach((name) => {
            stmt.run(user_id, name)
        })
    }

    updateWalletByTransaction(user_id, name, amount) {
        const stmt = db.prepare('UPDATE wallets SET amount = amount + ? WHERE user_id = ? AND name = ?')
        const result = stmt.run(amount, user_id, name)
        return result.changes > 0
    }

    updateByEditTransaction(oldTransaction, newTransaction) {
        const update = (user_id, name, delta) => {
            const stmt = db.prepare('UPDATE wallets SET amount = amount + ? WHERE user_id = ? AND name = ?')
            const result = stmt.run(delta, user_id, name)
            return result.changes > 0
        }

        if (oldTransaction.type === 'Pemasukan' && newTransaction.type === 'Pemasukan') {
            if (oldTransaction.wallet === newTransaction.wallet) {
                return update(oldTransaction.user_id, newTransaction.wallet, -oldTransaction.amount) &&
                    update(newTransaction.user_id, newTransaction.wallet, newTransaction.amount)
            }
            return update(oldTransaction.user_id, oldTransaction.wallet, -oldTransaction.amount) &&
                update(newTransaction.user_id, newTransaction.wallet, newTransaction.amount)
        }

        if (oldTransaction.type === 'Pemasukan' && newTransaction.type === 'Pengeluaran') {
            if (oldTransaction.wallet === newTransaction.wallet) {
                return update(oldTransaction.user_id, oldTransaction.wallet, -oldTransaction.amount) &&
                    update(newTransaction.user_id, newTransaction.wallet, newTransaction.amount)
            }
            return update(oldTransaction.user_id, oldTransaction.wallet, -oldTransaction.amount) &&
                update(newTransaction.user_id, newTransaction.wallet, newTransaction.amount)
        }

        if (oldTransaction.type === 'Pengeluaran' && newTransaction.type === 'Pemasukan') {
            if (oldTransaction.wallet === newTransaction.wallet) {
                return update(oldTransaction.user_id, oldTransaction.wallet, -oldTransaction.amount) &&
                    update(newTransaction.user_id, newTransaction.wallet, newTransaction.amount)
            }
            return update(oldTransaction.user_id, oldTransaction.wallet, -oldTransaction.amount) &&
                update(newTransaction.user_id, newTransaction.wallet, newTransaction.amount)
        }

        if (oldTransaction.wallet === newTransaction.wallet) {
            return update(oldTransaction.user_id, oldTransaction.wallet, -oldTransaction.amount) &&
                update(newTransaction.user_id, newTransaction.wallet, newTransaction.amount)
        }

        return update(oldTransaction.user_id, oldTransaction.wallet, -oldTransaction.amount) &&
            update(newTransaction.user_id, newTransaction.wallet, newTransaction.amount)
    }
}

export default new WalletsRepositories()