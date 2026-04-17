import path from 'node:path'
import { fileURLToPath } from 'node:url'

import cors from 'cors'
import express from 'express'

import { getDatabaseStatus, initializeDatabase } from './db.js'
import {
  createImportTemplate,
  importAccounts,
  listImportTemplates,
  listAccounts,
  updateAccountStatus,
} from './accountService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = Number(process.env.PORT || 3001)
const host = process.env.HOST || '0.0.0.0'

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', async (_request, response) => {
  response.json({
    ok: true,
    database: await getDatabaseStatus(),
  })
})

app.get('/api/accounts', async (_request, response) => {
  try {
    const data = await listAccounts({
      page: _request.query.page,
      pageSize: _request.query.pageSize,
      search: _request.query.search,
      vendor: _request.query.vendor,
    })
    response.json({
      ...data,
      database: await getDatabaseStatus(),
    })
  } catch (error) {
    response.status(500).json({
      error: error.message,
    })
  }
})

app.get('/api/import-templates', async (_request, response) => {
  try {
    response.json({
      templates: await listImportTemplates(),
    })
  } catch (error) {
    response.status(500).json({
      error: error.message,
    })
  }
})

app.post('/api/import-templates', async (request, response) => {
  try {
    const template = await createImportTemplate(request.body)
    response.status(201).json(template)
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})

app.post('/api/accounts/import', async (request, response) => {
  try {
    const result = await importAccounts(
      request.body.text || '',
      request.body.templateId,
    )
    response.status(201).json(result)
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})

app.patch('/api/accounts/:id/status', async (request, response) => {
  try {
    const account = await updateAccountStatus(
      Number(request.params.id),
      request.body.status,
    )
    response.json(account)
  } catch (error) {
    response.status(400).json({
      error: error.message,
    })
  }
})

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist')

  app.use(express.static(distPath))
  app.get('/{*any}', (_request, response) => {
    response.sendFile(path.join(distPath, 'index.html'))
  })
}

initializeDatabase()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`Kami manager server listening on http://${host}:${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  })
