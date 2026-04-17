import { db } from './db.js'
import { parseImportText } from './accountUtils.js'

function nowIso() {
  return new Date().toISOString()
}

function buildFilterClause(options = {}) {
  const search = String(options.search || '').trim().toLowerCase()
  const vendor = String(options.vendor || 'all').trim() || 'all'
  const filters = []
  const params = []

  if (search) {
    const likeSearch = `%${search}%`
    filters.push(
      '(lower(email) LIKE ? OR lower(email_password) LIKE ? OR lower(domain) LIKE ?)',
    )
    params.push(likeSearch, likeSearch, likeSearch)
  }

  if (vendor !== 'all') {
    filters.push('vendor = ?')
    params.push(vendor)
  }

  return {
    clause: filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '',
    params,
  }
}

function mapTemplateRow(row) {
  return {
    id: row.id,
    name: row.name,
    separator: row.separator,
    emailIndex: row.email_index,
    passwordIndex: row.password_index,
    isDefault: Boolean(row.is_default),
  }
}

function getImportTemplateById(templateId) {
  if (templateId !== undefined && templateId !== null && templateId !== '') {
    const template = db
      .prepare(
        `
          SELECT id, name, separator, email_index, password_index, is_default
          FROM import_templates
          WHERE id = ?
        `,
      )
      .get(Number(templateId))

    if (template) {
      return mapTemplateRow(template)
    }
  }

  const fallback = db
    .prepare(
      `
        SELECT id, name, separator, email_index, password_index, is_default
        FROM import_templates
        ORDER BY is_default DESC, id ASC
        LIMIT 1
      `,
    )
    .get()

  if (!fallback) {
    throw new Error('没有可用的导入模板。')
  }

  return mapTemplateRow(fallback)
}

export async function listImportTemplates() {
  const rows = db
    .prepare(
      `
        SELECT id, name, separator, email_index, password_index, is_default
        FROM import_templates
        ORDER BY is_default DESC, id ASC
      `,
    )
    .all()

  return rows.map(mapTemplateRow)
}

export async function createImportTemplate(payload = {}) {
  const name = String(payload.name || '').trim()
  const separator = String(payload.separator || '').trim()
  const emailIndex = Math.max(Number(payload.emailIndex ?? 0), 0)
  const passwordIndex = Math.max(Number(payload.passwordIndex ?? 1), 0)

  if (!name) {
    throw new Error('模板名称不能为空。')
  }

  if (!separator) {
    throw new Error('分隔符不能为空。')
  }

  const result = db
    .prepare(
      `
        INSERT INTO import_templates (
          name,
          separator,
          email_index,
          password_index,
          is_default,
          created_at
        ) VALUES (?, ?, ?, ?, 0, ?)
        RETURNING id, name, separator, email_index, password_index, is_default
      `,
    )
    .get(name, separator, emailIndex, passwordIndex, nowIso())

  return mapTemplateRow(result)
}

export async function listAccounts(options = {}) {
  const requestedPage = Math.max(Number(options.page) || 1, 1)
  const pageSize = Math.min(Math.max(Number(options.pageSize) || 12, 1), 50)
  const { clause, params } = buildFilterClause(options)

  const summary = db
    .prepare(
      `
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
          SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive
        FROM account_credentials
        ${clause}
      `,
    )
    .get(...params)

  const normalizedSummary = {
    total: Number(summary.total || 0),
    active: Number(summary.active || 0),
    inactive: Number(summary.inactive || 0),
  }

  const totalPages = Math.max(Math.ceil(normalizedSummary.total / pageSize), 1)
  const page = Math.min(requestedPage, totalPages)
  const offset = (page - 1) * pageSize

  const rows = db
    .prepare(
      `
        SELECT
          id,
          email,
          email_password,
          domain,
          vendor,
          status,
          created_at,
          updated_at,
          invalidated_at
        FROM account_credentials
        ${clause}
        ORDER BY
          CASE WHEN status = 'active' THEN 0 ELSE 1 END,
          updated_at DESC,
          created_at DESC
        LIMIT ?
        OFFSET ?
      `,
    )
    .all(...params, pageSize, offset)

  return {
    accounts: rows.map((row) => ({
      id: row.id,
      email: row.email,
      emailPassword: row.email_password,
      domain: row.domain,
      vendor: row.vendor,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      invalidatedAt: row.invalidated_at,
    })),
    summary: normalizedSummary,
    pagination: {
      page,
      pageSize,
      total: normalizedSummary.total,
      totalPages,
    },
  }
}

export async function importAccounts(text, templateId) {
  const template = getImportTemplateById(templateId)
  const { rows, invalidLines } = parseImportText(text, template)

  if (rows.length === 0) {
    throw new Error(`没有识别到可导入的数据，请检查所选模板 ${template.name} 的分隔格式。`)
  }

  const result = {
    created: 0,
    updated: 0,
    skipped: 0,
    invalidLines,
  }

  const selectByEmail = db.prepare(`
    SELECT id, email_password, status
    FROM account_credentials
    WHERE email = ?
  `)

  const insertRow = db.prepare(`
    INSERT INTO account_credentials (
      email,
      email_password,
      domain,
      vendor,
      status,
      raw_input,
      created_at,
      updated_at,
      invalidated_at
    ) VALUES (?, ?, ?, ?, 'active', ?, ?, ?, NULL)
  `)

  const updateRow = db.prepare(`
    UPDATE account_credentials
    SET
      email_password = ?,
      domain = ?,
      vendor = ?,
      status = 'active',
      raw_input = ?,
      updated_at = ?,
      invalidated_at = NULL
    WHERE email = ?
  `)

  const transaction = db.transaction((records) => {
    for (const row of records) {
      const existing = selectByEmail.get(row.email)

      if (!existing) {
        const timestamp = nowIso()
        insertRow.run(
          row.email,
          row.emailPassword,
          row.domain,
          row.vendor,
          row.rawInput,
          timestamp,
          timestamp,
        )
        result.created += 1
        continue
      }

      if (
        existing.email_password === row.emailPassword &&
        existing.status === 'active'
      ) {
        result.skipped += 1
        continue
      }

      updateRow.run(
        row.emailPassword,
        row.domain,
        row.vendor,
        row.rawInput,
        nowIso(),
        row.email,
      )
      result.updated += 1
    }
  })

  transaction(rows)
  return {
    ...result,
    template,
  }
}

export async function updateAccountStatus(id, status) {
  const nextStatus = status === 'inactive' ? 'inactive' : 'active'
  const timestamp = nowIso()

  const result = db
    .prepare(
      `
        UPDATE account_credentials
        SET
          status = ?,
          updated_at = ?,
          invalidated_at = ?
        WHERE id = ?
        RETURNING id, email, status, updated_at
      `,
    )
    .get(
      nextStatus,
      timestamp,
      nextStatus === 'inactive' ? timestamp : null,
      id,
    )

  if (!result) {
    throw new Error('目标账号不存在。')
  }

  return {
    id: result.id,
    email: result.email,
    status: result.status,
    updatedAt: result.updated_at,
  }
}
