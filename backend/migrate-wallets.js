import db from './src/database/sqlite.js';

const defaultWallets = ['BCA', 'Cash', 'OVO', 'Dana', 'Mandiri'];

const users = db.prepare('SELECT id FROM users').all();
console.log(`Found ${users.length} users.`);

let totalInserted = 0;
for (const { id } of users) {
    const existingWallets = db
        .prepare('SELECT name FROM wallets WHERE user_id = ?')
        .all(id)
        .map((row) => row.name);

    const missingWallets = defaultWallets.filter((name) => !existingWallets.includes(name));
    if (missingWallets.length > 0) {
        console.log(`User ${id} missing wallets: ${missingWallets.join(', ')}`);
        for (const name of missingWallets) {
            const result = db
                .prepare('INSERT OR IGNORE INTO wallets (user_id, name, amount) VALUES (?, ?, 0)')
                .run(id, name);
            if (result.changes > 0) {
                totalInserted += 1;
            }
        }
    }
}

console.log(`Migration complete. Inserted ${totalInserted} wallets.`);
