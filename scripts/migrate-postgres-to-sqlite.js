import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import pg from 'pg'

import { initializeDatabase, db, databasePath } from '../server/db.js'
import { detectVendor, getDomain } from '../server/accountUtils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../litellm-local/.env') })

function buildConnectionConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
    }
  }

  return {
    host: process.env.PGHOST || '127.0.0.1',
    port: Number(process.env.PGPORT || 5432),
    database: process.env.POSTGRES_DB || 'litellm',
    user: process.env.POSTGRES_USER || 'litellm',
    password: process.env.POSTGRES_PASSWORD || '',
  }
}

async function main() {
  const { Pool } = pg
  const pool = new Pool(buildConnectionConfig())

  try {
    await initializeDatabase()

    const { rows } = await pool.query(`
      SELECT
        id,
        email,
        email_password,
        status,
        raw_input,
        created_at,
        updated_at,
        invalidated_at
      FROM account_credentials
      ORDER BY id ASC
    `)

    const upsert = db.prepare(`
      INSERT INTO account_credentials (
        id,
        email,
        email_password,
        domain,
        vendor,
        status,
        raw_input,
        created_at,
        updated_at,
        invalidated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        email_password = excluded.email_password,
        domain = excluded.domain,
        vendor = excluded.vendor,
        status = excluded.status,
        raw_input = excluded.raw_input,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
        invalidated_at = excluded.invalidated_at
    `)

    const transaction = db.transaction((records) => {
      for (const row of records) {
        upsert.run(
          row.id,
          row.email,
          row.email_password,
          getDomain(row.email),
          detectVendor(row.email),
          row.status,
          row.raw_input,
          new Date(row.created_at).toISOString(),
          new Date(row.updated_at).toISOString(),
          row.invalidated_at ? new Date(row.invalidated_at).toISOString() : null,
        )
      }
    })

    transaction(rows)

    const count = db
      .prepare('SELECT COUNT(*) AS total FROM account_credentials')
      .get().total

    console.log(
      `Migrated ${rows.length} rows into SQLite at ${databasePath}. Current SQLite total: ${count}.`,
    )
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
