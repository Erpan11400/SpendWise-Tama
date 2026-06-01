import db from '../../../database/sqlite.js';

/* 
 * token
 */

class AuthenticationsRepositories {
    addRefreshToken(token) {
        db.prepare('INSERT OR IGNORE INTO refresh_tokens (token) VALUES (?)').run(token)
    }

    verifyRefreshToken(token) {
        const row = db.prepare('SELECT token FROM refresh_tokens WHERE token = ?').get(token)
        return Boolean(row)
    }

    deleteRefreshToken(token) {
        db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token)
    }
}

export default new AuthenticationsRepositories()