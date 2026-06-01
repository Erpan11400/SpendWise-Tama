import initSqlJs from 'sql.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../db.sqlite');

const SQL = await initSqlJs();

const loadDatabase = async () => {
    try {
        const data = await fs.readFile(dbPath);
        return new SQL.Database(new Uint8Array(data));
    } catch {
        return new SQL.Database();
    }
};

const db = await loadDatabase();

db.run('PRAGMA foreign_keys = ON;');

const saveDatabase = async () => {
    const data = db.export();
    await fs.writeFile(dbPath, Buffer.from(data));
};

const bindParams = (stmt, params) => {
    if (params.length === 1 && typeof params[0] === 'object' && !Array.isArray(params[0])) {
        stmt.bind(params[0]);
    } else {
        stmt.bind(params);
    }
};

const prepare = (sql) => {
    return {
        run: (...params) => {
            const statement = db.prepare(sql);
            bindParams(statement, params);
            statement.step();
            const changes = db.getRowsModified();
            statement.free();
            awaitSave();
            return { changes };
        },
        get: (...params) => {
            const statement = db.prepare(sql);
            bindParams(statement, params);
            const row = statement.step() ? statement.getAsObject() : undefined;
            statement.free();
            return row;
        },
        all: (...params) => {
            const statement = db.prepare(sql);
            bindParams(statement, params);
            const rows = [];
            while (statement.step()) {
                rows.push(statement.getAsObject());
            }
            statement.free();
            return rows;
        }
    };
};

const awaitSave = (() => {
    let saving = Promise.resolve();
    return () => {
        saving = saving.then(() => saveDatabase()).catch(() => saveDatabase());
        return saving;
    };
})();

const dbWrapper = {
    prepare,
    exec: (sql) => db.exec(sql),
    transaction: (fn) => {
        const result = fn();
        awaitSave();
        return result;
    }
};

const initSqliteSchema = () => {
    db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wallets (
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  used REAL NOT NULL DEFAULT 0,
  allocation REAL NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  descript TEXT,
  amount REAL NOT NULL,
  category TEXT,
  wallet TEXT,
  date TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  token TEXT PRIMARY KEY
);
    `);
};

initSqliteSchema();

export default dbWrapper;
