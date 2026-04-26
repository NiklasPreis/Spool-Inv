# 🧵 SpoolInv

**3D-Druck Filament Inventarverwaltung** — A self-hosted web application for managing your 3D printing filament collection.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-D97757?logo=anthropic&logoColor=white)

---

## ✨ Features

- **Full CRUD** — Add, edit, and delete filament spools
- **Smart Filtering** — Filter by material, manufacturer, or storage location in real time
- **Full-Text Search** — Instantly search across all spool properties
- **Statistics Dashboard** — Overview of your collection by material, brand, and location
- **13 Material Types** — PLA, PLA+, ABS, ASA, PETG, TPU, FLEX, Nylon, PC, HIPS, PVA, CF-PLA, and more
- **Temperature Presets** — Auto-filled nozzle & bed temperature ranges per material
- **Persistent Storage** — Data is stored in a simple JSON file, easily backed up
- **Dark UI** — Clean, responsive dark-themed interface
- **Docker-Ready** — One command to deploy, data survives container restarts

---

## 📸 Screenshots

> *Coming soon — feel free to open a PR with screenshots!*

---

## 🚀 Quick Start

### Docker (Recommended)

```bash
docker compose up -d
```

That's it. Open [http://localhost:3000](http://localhost:3000) in your browser.

Data is persisted in a named Docker volume (`spoolinv-data`) and survives container restarts and updates.

---

### Local Development

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Start in development mode (hot-reload for both frontend and backend)
npm run dev
```

- React frontend: [http://localhost:5173](http://localhost:5173)
- Express API: [http://localhost:3000](http://localhost:3000)

---

### Production Build (without Docker)

```bash
npm run build
npm start
```

Server listens on port `3000` by default.

---

## ⚙️ Configuration

All configuration is done via environment variables:

| Variable   | Default  | Description                          |
|------------|----------|--------------------------------------|
| `PORT`     | `3000`   | Port the Express server listens on   |
| `DATA_DIR` | `./data` | Directory where `spoolinv.json` lives |
| `NODE_ENV` | —        | Set to `production` for optimized build |

### Custom Port Example

```yaml
# docker-compose.yml
services:
  spoolinv:
    build: .
    ports:
      - "8080:3000"        # Expose on host port 8080
    environment:
      - PORT=3000
    volumes:
      - spoolinv-data:/data
    restart: unless-stopped

volumes:
  spoolinv-data:
```

---

## 🗄️ Data Storage

SpoolInv uses a single JSON file (`spoolinv.json`) — no database setup required.

**Docker volume location (inside container):** `/data/spoolinv.json`

To back up your data:
```bash
docker run --rm -v spoolinv-data:/data -v $(pwd):/backup alpine \
  cp /data/spoolinv.json /backup/spoolinv-backup.json
```

---

## 🧱 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, TypeScript, Vite        |
| Backend   | Node.js 20, Express 4, TypeScript |
| Storage   | JSON file (no external DB)        |
| Container | Docker, multi-stage build         |

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

| Method   | Endpoint            | Description             |
|----------|---------------------|-------------------------|
| `GET`    | `/api/spools`       | List all spools         |
| `GET`    | `/api/spools/stats` | Get collection stats    |
| `POST`   | `/api/spools`       | Create a new spool      |
| `PUT`    | `/api/spools/:id`   | Update an existing spool|
| `DELETE` | `/api/spools/:id`   | Delete a spool          |

### Spool Object

```json
{
  "id": 1,
  "manufacturer": "Prusament",
  "material": "PLA",
  "color_name": "Galaxy Black",
  "color_hex": "#1a1a2e",
  "weight_g": 1000,
  "quantity": 2,
  "nozzle_temp_min": 190,
  "nozzle_temp_max": 220,
  "bed_temp_min": 20,
  "bed_temp_max": 60,
  "location": "Regal A",
  "notes": "",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

---

## 📁 Project Structure

```
SpoolInv/
├── src/
│   ├── server/              # Express backend
│   │   ├── index.ts         # API routes
│   │   └── database.ts      # JSON file persistence
│   └── renderer/            # React frontend
│       └── src/
│           ├── App.tsx       # Main view (grid, sidebar, filters)
│           ├── App.css       # All styles
│           ├── api.ts        # Fetch client
│           ├── components/
│           │   ├── SpoolCard.tsx    # Individual spool card
│           │   └── SpoolModal.tsx   # Add / edit form
│           └── types/
│               └── filament.ts      # Interfaces & material constants
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

[MIT](LICENSE) — Copyright © 2026 Niklas Preis

---

## 🤖 Built with Claude Code

This project was built with the help of [Claude Code](https://claude.ai/code), Anthropic's AI-powered coding assistant.
