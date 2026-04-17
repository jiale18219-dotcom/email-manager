# email-manager

Personal Email Manager

个人邮箱管理工具。用于批量导入邮箱账号、分类筛选、状态管理、模板化导入和局域网访问。

Personal email management tool for importing account records in bulk, filtering by provider, managing status, using reusable import templates, and accessing the app over a local network.

## Features / 功能

- Compact record-first management UI
- 紧凑型记录优先界面
- Bulk import with reusable templates
- 支持导入模板预设与自定义模板
- Separate email/password columns with one-click copy
- 邮箱和密码分栏显示，并可一键复制
- Active/inactive status switching
- 支持存活/作废状态切换
- Provider filtering for Outlook, Proton, Netease, Gmail, QQ, Apple, Yahoo, and more
- 支持 Outlook、Proton、网易、Gmail、QQ、Apple、Yahoo 等厂商分类筛选
- SQLite single-file local storage
- SQLite 单文件本地存储
- Local-network access on the same LAN
- 支持局域网访问

## Tech Stack / 技术栈

- React + Vite
- Express
- SQLite via `better-sqlite3`

## Local Run / 本地运行

Install dependencies:

```bash
npm install
```

Start in development mode:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## One-Click Launcher / 一键启动

You can use the launcher scripts:

- `Open Kami Manager.command`
- `Stop Kami Manager.command`

也可以直接使用一键脚本：

- `Open Kami Manager.command`
- `Stop Kami Manager.command`

## Data Storage / 数据存储

- SQLite database path: `data/kami-manager.db`
- SQLite 数据文件位置：`data/kami-manager.db`

The SQLite database is intentionally excluded from Git tracking.

SQLite 数据文件默认不会提交到 Git 仓库。

## Import Templates / 导入模板

Built-in presets include:

- `----`
- `|`
- `,`
- `:`
- `\t`

You can also create custom templates in the import dialog by defining:

- Template name / 模板名称
- Separator / 分隔符
- Email column position / 邮箱列位置
- Password column position / 密码列位置

## LAN Access / 局域网访问

After starting the production server, open:

- `http://127.0.0.1:3001/` on the local machine
- `http://<your-lan-ip>:3001/` on devices in the same LAN

生产服务启动后可通过以下地址访问：

- 本机：`http://127.0.0.1:3001/`
- 局域网设备：`http://<你的局域网IP>:3001/`
