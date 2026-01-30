# 🤖 NexoBot - Descargador de YouTube para Telegram

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)

**NexoBot** es un bot de Telegram rápido y eficiente escrito en **TypeScript** que permite descargar videos y música de YouTube con selección de calidad.

### 🔴 **Demo en Vivo**

¡Puedes probar el bot funcionando ahora mismo! Está activo **24/7**.
👉 **Usuario:** [@Cxz7bot](https://t.me/Cxz7bot)

---

## ⚡ Características

- 🎥 **Descarga de Video (MP4):**
  - **Calidad Alta:** 1080p (o la mejor disponible).
  - **Calidad Media:** 720p (Estándar HD).
  - **Calidad Baja:** 480p (Ahorro de datos).
- 🎵 **Descarga de Música (MP3):**
  - Conversión automática de audio a MP3.
  - Formato ligero y compatible.
- 🧹 **Auto-Limpieza:** Los archivos descargados se eliminan automáticamente del servidor después de enviarse al usuario para ahorrar espacio.
- 🚀 **Asíncrono:** Capaz de procesar múltiples descargas simultáneamente sin bloquearse.

---

## 🛠️ Stack Tecnológico

Este proyecto utiliza las tecnologías más modernas del ecosistema Node.js:

- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [grammY](https://grammy.dev/) (Framework moderno para Bots de Telegram)
- **Motor de Descarga:** [youtube-dl-exec](https://github.com/microlinkhq/youtube-dl-exec) (Wrapper de yt-dlp)
- **Procesamiento:** [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) & `ffmpeg-static`

---

## 🚀 Instalación y Despliegue Local

Si deseas clonar este repositorio y correr tu propia versión del bot:

### 1. Prerrequisitos

- **Node.js** (v18 o superior)
- **Python 3** (Necesario para el motor de descarga)
- **Git**

### 2. Instalación

```bash
# Clonar el repositorio
git clone [https://github.com/Cristhian1810/nexobot-telegram.git](https://github.com/Cristhian1810/nexobot-telegram.git)

# Entrar a la carpeta
cd nexobot-telegram

# Instalar dependencias
npm install
```

### 3. Configuración (.env)

Crea un archivo llamado .env en la raíz del proyecto y agrega tu token de Telegram:

```bash
BOT_TOKEN=TU_TOKEN_DE_TELEGRAM_AQUI
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

## 📦 Despliegue en Producción

Pasos para desplegar en un servidor

### 1. Compilar el código (TypeScript -> JavaScript):

```bash
npm run biuld
```

### 2. Iniciar el bot con Node:

```bash
npm start
```
