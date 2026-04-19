import { useEffect, useState } from 'react'
import './App.css'

const pageSize = 12

const vendorOptions = [
  { value: 'all', label: 'All vendors' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'proton', label: 'Proton' },
  { value: 'netease', label: 'Netease' },
  { value: 'qq', label: 'QQ' },
  { value: 'gmail', label: 'Gmail' },
  { value: 'apple', label: 'Apple' },
  { value: 'yahoo', label: 'Yahoo' },
  { value: 'other', label: 'Other' },
]

const emptyPagination = {
  page: 1,
  pageSize,
  total: 0,
  totalPages: 1,
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7.5 3.75A1.75 1.75 0 0 1 9.25 2h5A1.75 1.75 0 0 1 16 3.75v7.5A1.75 1.75 0 0 1 14.25 13h-5A1.75 1.75 0 0 1 7.5 11.25z" />
      <path d="M4.25 6A1.75 1.75 0 0 0 2.5 7.75v8.5A1.75 1.75 0 0 0 4.25 18h6.5A1.75 1.75 0 0 0 12.5 16.25v-.5H9.25A4.5 4.5 0 0 1 4.75 11.25V6z" />
    </svg>
  )
}

function DisableIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2.5a7.5 7.5 0 1 0 7.5 7.5A7.51 7.51 0 0 0 10 2.5m0 1.5a5.94 5.94 0 0 1 4.09 1.62L5.62 14.09A6 6 0 0 1 10 4m0 12a5.94 5.94 0 0 1-4.09-1.62l8.47-8.47A6 6 0 0 1 10 16" />
    </svg>
  )
}

function RestoreIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3a7 7 0 1 1-6.76 8.82.75.75 0 0 1 1.45-.37A5.5 5.5 0 1 0 5.8 6.06H8A.75.75 0 0 1 8 7.56H3.75A.75.75 0 0 1 3 6.81V2.56a.75.75 0 0 1 1.5 0v2.08A6.96 6.96 0 0 1 10 3" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M8.5 3a5.5 5.5 0 1 1 0 11A5.5 5.5 0 0 1 8.5 3m0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
      <path d="M12.03 13.09a.75.75 0 0 1 1.06 0l2.66 2.65a.75.75 0 1 1-1.06 1.06l-2.66-2.65a.75.75 0 0 1 0-1.06" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5.28 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.66-3.72a.75.75 0 1 1 1.08 1.04L11.06 10l3.68 3.74a.75.75 0 0 1-1.08 1.04L10 11.06l-3.66 3.72a.75.75 0 0 1-1.08-1.04L8.94 10 5.28 6.26a.75.75 0 0 1 0-1.04" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2.5 16.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H3.25a.75.75 0 0 1-.75-.75z" />
      <path d="M14.5 3.44l2.06 2.06-9.5 9.5-2.06-2.06 9.5-9.5zm1.06-1.06a1.5 1.5 0 0 0-2.12 0l-9.5 9.5a1.5 1.5 0 0 0 0 2.12l2.06 2.06a1.5 1.5 0 0 0 2.12 0l9.5-9.5a1.5 1.5 0 0 0 0-2.12l-2.06-2.06z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M8.5 3a1.5 1.5 0 0 0-1.5 1.5v.5h6v-.5A1.5 1.5 0 0 0 11.5 3h-3zM6 4.5v.5H3.75a.75.75 0 0 0 0 1.5h.321l.938 10.355A1.5 1.5 0 0 0 6.5 17.5h7a1.5 1.5 0 0 0 1.491-1.145L15.929 6.5h.321a.75.75 0 0 0 0-1.5H14v-.5A3 3 0 0 0 11.5 2h-3A3 3 0 0 0 6 4.5zm5.25 3.75a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75zm-2.5 0a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2z" />
      <path d="M10 6a4 4 0 0 0-4 4v4.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V10a4 4 0 0 0-4-4z" />
      <path d="M6 16.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z" />
    </svg>
  )
}

function formatTime(value) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
}

async function parseJson(response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.')
  }

  return payload
}

async function fetchAccountsSnapshot({ page, search, vendor }) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    vendor,
  })

  return parseJson(await fetch(`/api/accounts?${params.toString()}`))
}

async function fetchImportTemplates() {
  const data = await parseJson(await fetch('/api/import-templates'))
  return data.templates
}

function App() {
  const [accounts, setAccounts] = useState([])
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0 })
  const [pagination, setPagination] = useState(emptyPagination)
  const [dbStatus, setDbStatus] = useState('Connecting')
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [vendor, setVendor] = useState('all')
  const [page, setPage] = useState(1)
  const [importText, setImportText] = useState('')
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [templates, setTemplates] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [templateForm, setTemplateForm] = useState({
    name: '',
    separator: '----',
    emailPosition: '1',
    passwordPosition: '2',
  })
  const [flash, setFlash] = useState('')
  const [editingAccount, setEditingAccount] = useState(null)
  const [editForm, setEditForm] = useState({ remark: '' })
  const [deletingId, setDeletingId] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ email: '', password: '' })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim())
    }, 250)

    return () => window.clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false

    async function loadTemplates() {
      try {
        const nextTemplates = await fetchImportTemplates()

        if (cancelled) {
          return
        }

        setTemplates(nextTemplates)
        setSelectedTemplateId((current) =>
          current || String(nextTemplates[0]?.id || ''),
        )
      } catch (error) {
        if (!cancelled) {
          setFlash(error.message)
        }
      }
    }

    loadTemplates()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        const data = await fetchAccountsSnapshot({ page, search, vendor })

        if (cancelled) {
          return
        }

        setAccounts(data.accounts)
        setSummary(data.summary)
        setPagination(data.pagination)
        setDbStatus(data.database)
        if (data.pagination.page !== page) {
          setPage(data.pagination.page)
        }
      } catch (error) {
        if (!cancelled) {
          setFlash(error.message)
          setDbStatus('Offline')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [page, search, vendor])

  async function refresh(pageOverride = page) {
    setLoading(true)

    try {
      const data = await fetchAccountsSnapshot({
        page: pageOverride,
        search,
        vendor,
      })

      setAccounts(data.accounts)
      setSummary(data.summary)
      setPagination(data.pagination)
      setDbStatus(data.database)
      if (data.pagination.page !== pageOverride) {
        setPage(data.pagination.page)
      }
    } catch (error) {
      setFlash(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleImport(event) {
    event.preventDefault()

    if (!importText.trim()) {
      setFlash('Paste records before importing.')
      return
    }

    if (!selectedTemplateId) {
      setFlash('Select a template first.')
      return
    }

    setImporting(true)

    try {
      const data = await parseJson(
        await fetch('/api/accounts/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: importText,
            templateId: selectedTemplateId,
          }),
        }),
      )

      setFlash(
        `Imported ${data.created}, updated ${data.updated}, skipped ${data.skipped}.`,
      )
      setImportText('')
      setIsImportOpen(false)
      setPage(1)
      await refresh(1)
    } catch (error) {
      setFlash(error.message)
    } finally {
      setImporting(false)
    }
  }

  async function handleToggleStatus(account) {
    setTogglingId(account.id)

    try {
      const nextStatus = account.status === 'active' ? 'inactive' : 'active'

      await parseJson(
        await fetch(`/api/accounts/${account.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: nextStatus }),
        }),
      )

      setFlash(nextStatus === 'inactive' ? 'Marked as inactive.' : 'Restored.')
      await refresh()
    } catch (error) {
      setFlash(error.message)
    } finally {
      setTogglingId(null)
    }
  }

  async function handleTogglePin(account) {
    const wasPinned = account.pinned

    // 单行冻结：解冻所有，只冻结当前行（如果之前未冻结）
    setAccounts((current) => {
      const updated = current.map((a) => ({
        ...a,
        pinned: !wasPinned && a.id === account.id,
      }))
      // 冻结的行在最前，其他按 ID 排序
      return [...updated].sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned ? 1 : -1
        return a.id - b.id
      })
    })

    try {
      if (wasPinned) {
        await parseJson(
          await fetch(`/api/accounts/${account.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pinned: false }),
          }),
        )
        setFlash('Unpinned.')
      } else {
        // 先解冻其他已冻结的行
        const currentlyPinned = accounts.find((a) => a.pinned && a.id !== account.id)
        if (currentlyPinned) {
          await parseJson(
            await fetch(`/api/accounts/${currentlyPinned.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pinned: false }),
            }),
          )
        }
        await parseJson(
          await fetch(`/api/accounts/${account.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pinned: true }),
          }),
        )
        setFlash('Pinned to top.')
      }
    } catch (error) {
      refresh()
      setFlash(error.message)
    }
  }

  async function handleCopy(value, label) {
    try {
      await navigator.clipboard.writeText(value)
      setFlash(`${label} copied.`)
    } catch (error) {
      setFlash(`Copy failed: ${error.message}`)
    }
  }

  async function handleEdit(account) {
    setEditingAccount(account)
    setEditForm({ remark: account.remark || '' })
  }

  async function handleSaveEdit(event) {
    event.preventDefault()
    
    try {
      await parseJson(
        await fetch(`/api/accounts/${editingAccount.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editForm),
        }),
      )

      setFlash('Updated.')
      setEditingAccount(null)
      await refresh()
    } catch (error) {
      setFlash(error.message)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('确定要删除这条记录吗？')) {
      return
    }

    setDeletingId(id)

    try {
      await parseJson(
        await fetch(`/api/accounts/${id}`, {
          method: 'DELETE',
        }),
      )

      setFlash('Deleted.')
      await refresh()
    } catch (error) {
      setFlash(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleAdd(event) {
    event.preventDefault()

    if (!addForm.email.trim() || !addForm.password.trim()) {
      setFlash('邮箱和密码不能为空。')
      return
    }

    setAdding(true)

    try {
      await parseJson(
        await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: addForm.email,
            password: addForm.password,
          }),
        }),
      )

      setFlash('Added.')
      setAddForm({ email: '', password: '' })
      setIsAddOpen(false)
      setPage(1)
      await refresh(1)
    } catch (error) {
      setFlash(error.message)
    } finally {
      setAdding(false)
    }
  }

  async function handleCreateTemplate(event) {
    event.preventDefault()

    setSavingTemplate(true)

    try {
      const template = await parseJson(
        await fetch('/api/import-templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: templateForm.name,
            separator: templateForm.separator,
            emailIndex: Math.max(Number(templateForm.emailPosition || '1') - 1, 0),
            passwordIndex: Math.max(Number(templateForm.passwordPosition || '2') - 1, 0),
          }),
        }),
      )

      const nextTemplates = await fetchImportTemplates()
      setTemplates(nextTemplates)
      setSelectedTemplateId(String(template.id))
      setTemplateForm({
        name: '',
        separator: '----',
        emailPosition: '1',
        passwordPosition: '2',
      })
      setShowTemplateEditor(false)
      setFlash(`Template ${template.name} saved.`)
    } catch (error) {
      setFlash(error.message)
    } finally {
      setSavingTemplate(false)
    }
  }

  const pageItems = buildPageItems(pagination.page, pagination.totalPages)
  const selectedTemplate = templates.find(
    (template) => String(template.id) === String(selectedTemplateId),
  )
  const templateSampleSeparator = selectedTemplate
    ? selectedTemplate.separator.replaceAll('\\t', '\t')
    : '----'

  return (
    <div className="app-shell">
      <main className="layout">
        <header className="topbar">
          <div className="topbar-copy">
            <h1>Records</h1>
            <div className="subline">
              <span>{summary.total} total</span>
              <span>{summary.active} active</span>
              <span>{summary.inactive} inactive</span>
              <span className="db-pill">{dbStatus}</span>
            </div>
          </div>

          <div className="topbar-buttons">
            <button className="secondary-button" type="button" onClick={() => setIsAddOpen(true)}>
              Add
            </button>
            <button className="primary-button" type="button" onClick={() => setIsImportOpen(true)}>
              Import
            </button>
          </div>
        </header>

        <section className="toolbar">
          <label className="search-field">
            <span className="field-icon">
              <SearchIcon />
            </span>
            <input
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value)
                setPage(1)
              }}
              placeholder="Search email, password, domain"
            />
          </label>

          <select
            value={vendor}
            onChange={(event) => {
              setVendor(event.target.value)
              setPage(1)
            }}
          >
            {vendorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        <section className="table-card">
          <div className="table-head">
            <span>{pagination.total} matched</span>
            <span>{flash || 'Click row to pin/unpin.'}</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Remark</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="empty-row">
                      Loading records...
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-row">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  accounts.map((account) => (
                    <tr
                      key={account.id}
                      className={`${account.status === 'inactive' ? 'is-muted' : ''} ${account.pinned ? 'is-pinned' : ''}`}
                      onClick={() => handleTogglePin(account)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="id-cell">{account.id}</td>
                      <td>
                        <div className="compact-cell">
                          <span className="value-text">{account.email}</span>
                          <button
                            className="icon-button"
                            type="button"
                            title="Copy email"
                            onClick={(e) => { e.stopPropagation(); handleCopy(account.email, 'Email'); }}
                          >
                            <CopyIcon />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="compact-cell">
                          <span className="value-text mono">{account.emailPassword}</span>
                          <button
                            className="icon-button"
                            type="button"
                            title="Copy password"
                            onClick={(e) => { e.stopPropagation(); handleCopy(account.emailPassword, 'Password'); }}
                          >
                            <CopyIcon />
                          </button>
                        </div>
                      </td>
                      <td className="remark-cell">{account.remark || '-'}</td>
                      <td>
                        <span className={`vendor-badge vendor-${account.vendor}`}>
                          {account.vendor}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            account.status === 'active' ? 'status-active' : 'status-inactive'
                          }`}
                        >
                          {account.status}
                        </span>
                      </td>
                      <td className="time-cell">{formatTime(account.updatedAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="icon-button"
                            type="button"
                            title="Edit"
                            onClick={(e) => { e.stopPropagation(); handleEdit(account); }}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="icon-button"
                            type="button"
                            title={account.status === 'active' ? 'Mark inactive' : 'Restore'}
                            disabled={togglingId === account.id}
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(account); }}
                          >
                            {account.status === 'active' ? <DisableIcon /> : <RestoreIcon />}
                          </button>
                          <button
                            className="icon-button danger"
                            type="button"
                            title="Delete"
                            disabled={deletingId === account.id}
                            onClick={(e) => { e.stopPropagation(); handleDelete(account.id); }}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="pagination">
            <button
              className="page-button"
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              Prev
            </button>

            <div className="page-list">
              {pageItems.map((item) => (
                <button
                  key={item}
                  className={item === pagination.page ? 'page-button active' : 'page-button'}
                  type="button"
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              className="page-button"
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                setPage((current) => Math.min(current + 1, pagination.totalPages))
              }
            >
              Next
            </button>
          </footer>
        </section>
      </main>

      {isImportOpen ? (
        <div className="modal-backdrop" onClick={() => setIsImportOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Import records</h2>
                <p>Pick a template, then import with that format.</p>
              </div>
              <button
                className="icon-button"
                type="button"
                title="Close"
                onClick={() => setIsImportOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleImport}>
              <div className="template-row">
                <label className="modal-field">
                  <span>Template</span>
                  <select
                    value={selectedTemplateId}
                    onChange={(event) => setSelectedTemplateId(event.target.value)}
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setShowTemplateEditor((current) => !current)}
                >
                  {showTemplateEditor ? 'Hide template' : 'New template'}
                </button>
              </div>

              {selectedTemplate ? (
                <div className="template-note">
                  Split by <code>{selectedTemplate.separator}</code>, email column{' '}
                  {selectedTemplate.emailIndex + 1}, password column{' '}
                  {selectedTemplate.passwordIndex + 1}
                </div>
              ) : null}

              {showTemplateEditor ? (
                <div className="template-editor">
                  <div className="template-grid">
                    <label className="modal-field">
                      <span>Name</span>
                      <input
                        value={templateForm.name}
                        onChange={(event) =>
                          setTemplateForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Custom template"
                      />
                    </label>

                    <label className="modal-field">
                      <span>Separator</span>
                      <input
                        value={templateForm.separator}
                        onChange={(event) =>
                          setTemplateForm((current) => ({
                            ...current,
                            separator: event.target.value,
                          }))
                        }
                        placeholder="---- or | or \t"
                      />
                    </label>

                    <label className="modal-field">
                      <span>Email pos</span>
                      <input
                        type="number"
                        min="1"
                        value={templateForm.emailPosition}
                        onChange={(event) =>
                          setTemplateForm((current) => ({
                            ...current,
                            emailPosition: event.target.value,
                          }))
                        }
                      />
                    </label>

                    <label className="modal-field">
                      <span>Password pos</span>
                      <input
                        type="number"
                        min="1"
                        value={templateForm.passwordPosition}
                        onChange={(event) =>
                          setTemplateForm((current) => ({
                            ...current,
                            passwordPosition: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className="template-actions">
                    <button
                      className="secondary-button"
                      type="button"
                      disabled={savingTemplate}
                      onClick={handleCreateTemplate}
                    >
                      {savingTemplate ? 'Saving...' : 'Save template'}
                    </button>
                  </div>
                </div>
              ) : null}

              <textarea
                value={importText}
                onChange={(event) => setImportText(event.target.value)}
                placeholder={`demo@example.com${templateSampleSeparator}password123`}
              />

              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => setImportText('')}>
                  Clear
                </button>
                <button className="primary-button" type="submit" disabled={importing}>
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editingAccount ? (
        <div className="modal-backdrop" onClick={() => setEditingAccount(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Edit Record #{editingAccount.id}</h2>
                <p>{editingAccount.email}</p>
              </div>
              <button
                className="icon-button"
                type="button"
                title="Close"
                onClick={() => setEditingAccount(null)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <label className="modal-field">
                <span>Remark</span>
                <input
                  value={editForm.remark}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      remark: event.target.value,
                    }))
                  }
                  placeholder="Add a note..."
                />
              </label>

              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => setEditingAccount(null)}>
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isAddOpen ? (
        <div className="modal-backdrop" onClick={() => setIsAddOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Add Record</h2>
                <p>Create a new email record.</p>
              </div>
              <button
                className="icon-button"
                type="button"
                title="Close"
                onClick={() => setIsAddOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleAdd}>
              <label className="modal-field">
                <span>Email</span>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(event) =>
                    setAddForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="example@domain.com"
                  required
                />
              </label>

              <label className="modal-field" style={{ marginTop: '12px' }}>
                <span>Password</span>
                <input
                  type="text"
                  value={addForm.password}
                  onChange={(event) =>
                    setAddForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Password"
                  required
                />
              </label>

              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button className="primary-button" type="submit" disabled={adding}>
                  {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
