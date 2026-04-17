import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Database from 'better-sqlite3'
import dotenv from 'dotenv'

import { DEFAULT_IMPORT_TEMPLATES } from './accountUtils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

export const databasePath = path.resolve(__dirname, '../data/kami-manager.db')

fs.mkdirSync(path.dirname(databasePath), { recursive: true })

export const db = new Database(databasePath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export async function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS account_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      email_password TEXT NOT NULL,
      domain TEXT NOT NULL,
      vendor TEXT NOT NULL DEFAULT 'other',
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      raw_input TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      invalidated_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_account_status_updated
      ON account_credentials(status, updated_at DESC);

    CREATE INDEX IF NOT EXISTS idx_account_vendor
      ON account_credentials(vendor);

    CREATE INDEX IF NOT EXISTS idx_account_domain
      ON account_credentials(domain);

    CREATE TABLE IF NOT EXISTS import_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      separator TEXT NOT NULL,
      email_index INTEGER NOT NULL DEFAULT 0,
      password_index INTEGER NOT NULL DEFAULT 1,
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `)

  const insertTemplate = db.prepare(`
    INSERT OR IGNORE INTO import_templates (
      name,
      separator,
      email_index,
      password_index,
      is_default,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `)

  const now = new Date().toISOString()

  for (const template of DEFAULT_IMPORT_TEMPLATES) {
    insertTemplate.run(
      template.name,
      template.separator,
      template.emailIndex,
      template.passwordIndex,
      template.isDefault,
      now,
    )
  }
}

export async function getDatabaseStatus() {
  try {
    db.prepare('SELECT 1').get()
    return `SQLite: ${path.basename(databasePath)}`
  } catch (error) {
    return `SQLite error: ${error.message}`
  }
}
