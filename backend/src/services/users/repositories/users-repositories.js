import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import db from '../../../database/sqlite.js';

class Users {
    async createUser(fullName, userName, email, password) {
        const id = `user-${nanoid(16)}`
        const hashedPass = await bcrypt.hash(password, 10)
        const created_at = new Date().toISOString()

        const stmt = db.prepare(
            'INSERT INTO users (id, full_name, user_name, email, password, created_at) VALUES (?, ?, ?, ?, ?, ?)'
        )
        stmt.run(id, fullName, userName, email, hashedPass, created_at)

        return id
    }

    getAllUsers() {
        return db.prepare(
            'SELECT id, full_name AS fullName, user_name AS userName, email, created_at FROM users ORDER BY created_at DESC'
        ).all()
    }

    deleteUser(id) {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?')
        const result = stmt.run(id)
        return result.changes > 0
    }

    async verifyUsersCredential(email, password) {
        const user = db.prepare('SELECT id, password FROM users WHERE email = ?').get(email)
        if (!user) {
            return null
        }

        const passwordIsTrue = await bcrypt.compare(password, user.password)
        if (!passwordIsTrue) {
            return null
        }

        return user.id
    }

    getUserById(id) {
        return db
            .prepare('SELECT id, full_name AS fullName, user_name AS userName, email, created_at FROM users WHERE id = ?')
            .get(id)
    }
}

export default new Users()