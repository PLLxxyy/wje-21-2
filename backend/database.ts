import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(__dirname, 'storage.db')
export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
