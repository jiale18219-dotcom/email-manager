export const DEFAULT_IMPORT_TEMPLATES = [
  {
    name: 'Dash 4',
    separator: '----',
    emailIndex: 0,
    passwordIndex: 1,
    isDefault: 1,
  },
  {
    name: 'Pipe',
    separator: '|',
    emailIndex: 0,
    passwordIndex: 1,
    isDefault: 1,
  },
  {
    name: 'Comma',
    separator: ',',
    emailIndex: 0,
    passwordIndex: 1,
    isDefault: 1,
  },
  {
    name: 'Colon',
    separator: ':',
    emailIndex: 0,
    passwordIndex: 1,
    isDefault: 1,
  },
  {
    name: 'Tab',
    separator: '\\t',
    emailIndex: 0,
    passwordIndex: 1,
    isDefault: 1,
  },
]

const vendorByDomain = new Map([
  ['outlook.com', 'outlook'],
  ['hotmail.com', 'outlook'],
  ['live.com', 'outlook'],
  ['msn.com', 'outlook'],
  ['proton.me', 'proton'],
  ['protonmail.com', 'proton'],
  ['163.com', 'netease'],
  ['126.com', 'netease'],
  ['yeah.net', 'netease'],
  ['netease.com', 'netease'],
  ['qq.com', 'qq'],
  ['gmail.com', 'gmail'],
  ['googlemail.com', 'gmail'],
  ['icloud.com', 'apple'],
  ['me.com', 'apple'],
  ['mac.com', 'apple'],
  ['yahoo.com', 'yahoo'],
  ['yahoo.co.jp', 'yahoo'],
  ['ymail.com', 'yahoo'],
])

export function normalizeLine(rawLine) {
  return rawLine.replace(/^[：:\s]+/, '').trim()
}

export function normalizeSeparator(separator) {
  return String(separator || '').replaceAll('\\t', '\t')
}

export function getDomain(email) {
  return email.includes('@') ? email.split('@').pop().toLowerCase() : ''
}

export function detectVendor(email) {
  return vendorByDomain.get(getDomain(email)) || 'other'
}

export function parseImportText(text, template) {
  const separator = normalizeSeparator(template?.separator || '----')
  const emailIndex = Number(template?.emailIndex ?? 0)
  const passwordIndex = Number(template?.passwordIndex ?? 1)
  const rows = []
  const invalidLines = []

  for (const rawLine of text.split(/\r?\n/)) {
    const line = normalizeLine(rawLine)

    if (!line) {
      continue
    }

    const parts = line.split(separator)

    if (
      parts.length < 2 ||
      parts[emailIndex] === undefined ||
      parts[passwordIndex] === undefined
    ) {
      invalidLines.push(line)
      continue
    }

    const email = parts[emailIndex].trim().toLowerCase()
    const emailPassword = parts[passwordIndex].trim()

    if (!email || !emailPassword) {
      invalidLines.push(line)
      continue
    }

    rows.push({
      email,
      emailPassword,
      rawInput: line,
      domain: getDomain(email),
      vendor: detectVendor(email),
    })
  }

  return { rows, invalidLines }
}
