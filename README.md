# 🎰 Aviator Crash Point Parser

This project intercepts WebSocket messages from the Aviator game server and extracts real-time crash point data by decoding binary packets. Useful for analysis, visualization, bot integration, or building a prediction interface.

---

## 🚀 Features

- 🔌 Connects to Aviator game server via WebSocket
- 🧠 Parses binary buffer messages to extract `crash points`
- 📈 Supports tracking of multiple crash points per round
- ✅ Filters and displays valid crash points only (1x to 1000x)
- 🧩 Clean and modular code ready for extension
- 💬 Optional: Connects to front-end or Telegram bot for broadcasting

---

## 📦 Requirements

- Node.js v18+
- `ws` for WebSocket support

```bash
npm install ws
