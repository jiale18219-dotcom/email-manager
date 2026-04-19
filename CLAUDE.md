# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal email account manager for bulk importing, filtering, and managing email credentials. Supports multiple email providers (Outlook, Proton, Gmail, QQ, Netease, Apple, Yahoo) with SQLite storage and LAN access.

## Commands

```bash
npm run dev          # Start dev mode (frontend :3002, backend :3001)
npm run build        # Build frontend to dist/
npm run start        # Production server on :3001 (serves static frontend)
npm run lint         # Run ESLint
```

## Architecture

**Frontend** (React + Vite on port 3002 in dev):
- `src/App.jsx` - Single-file React app with all UI components, state management, and API calls
- Vite dev server proxies `/api` to backend

**Backend** (Express on port 3001):
- `server/index.js` - Express routes, serves static files in production
- `server/db.js` - SQLite initialization via better-sqlite3, schema definitions, WAL mode
- `server/accountService.js` - Business logic for CRUD operations, pagination, import templates
- `server/accountUtils.js` - Email parsing, vendor detection by domain, default import templates

**Database**:
- SQLite file at `data/kami-manager.db` (gitignored)
- Tables: `account_credentials`, `import_templates`
- Uses WAL journal mode and foreign keys

## Key Patterns

- Vendor detection: Domain-to-vendor mapping in `accountUtils.js` (e.g., `outlook.com` → `outlook`)
- Import templates: Configurable separator and column positions for parsing pasted text
- Pagination: Server-side with configurable page size (default 12, max 50)
- Sorting: Pinned records first, then active status, then by update time
