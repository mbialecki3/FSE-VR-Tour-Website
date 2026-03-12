# FSE VR Campus Tour

An interactive 360° virtual-reality tour of the **Fulton Schools of Engineering** on the ASU Tempe campus, built with the open-source [Marzipano](https://www.marzipano.net/) panoramic viewer.

---

## Features

- 🌐 **Full-screen 360° panoramic viewer** powered by Marzipano
- 🏛️ **Five FSE campus locations** — Engineering Center, ISTB4 Atrium, Engineering Courtyard, Computing Commons, and the Goldwater Center
- ➡️ **Link hotspots** — navigation arrows placed inside each panorama to move between scenes
- ℹ️ **Info hotspots** — hover to read information about points of interest
- 🔄 **Auto-rotate** — scenes gently rotate automatically when idle
- ⛶ **Fullscreen** support
- ⌨️ **Keyboard navigation** — `←`/`↑` (previous scene) and `→`/`↓` (next scene)
- 📱 Responsive layout, works on desktop and mobile

---

## Getting Started

### 1 — Add your 360° photos

Place your equirectangular panoramic JPEG images in `images/scenes/`.  
See **[images/scenes/README.md](images/scenes/README.md)** for the exact filenames expected and image requirements.

The repo ships with solid-colour **placeholder** images so the site loads immediately.  Replace each file with a real 360° photo to see your campus.

### 2 — Open in a browser

Because browsers restrict loading local files with the `file://` protocol, serve the project via a local HTTP server:

```bash
# Python 3 (built-in)
python3 -m http.server 8080
# then open http://localhost:8080
```

Or use any static file server (VS Code Live Server extension, Node's `npx serve`, etc.).

### 3 — Customise scenes

Edit **`js/data.js`** to:
- Change scene names, descriptions, and image paths
- Add or remove campus locations
- Adjust hotspot positions (`yaw` / `pitch`) to match your photos
- Modify the initial camera angle for each scene

---

## Project Structure

```
FSE-VR-Tour-Website/
├── index.html              # Main page
├── css/
│   └── style.css           # ASU-themed styles
├── js/
│   ├── data.js             # Scene & hotspot configuration
│   └── app.js              # Marzipano viewer logic
└── images/
    └── scenes/
        ├── README.md                   # Image instructions
        ├── engineering-center.jpg      # → replace with real photo
        ├── istb4-atrium.jpg
        ├── engineering-courtyard.jpg
        ├── computing-commons.jpg
        └── goldwater-center.jpg
```

---

## Dependencies (loaded via CDN — no install needed)

| Library | Version | Purpose |
|---------|---------|---------|
| [Marzipano](https://github.com/google/marzipano) | 0.10.2 | 360° panoramic viewer |
| [screenfull.js](https://github.com/sindresorhus/screenfull.js) | 5.2.0 | Cross-browser fullscreen API |

---

## License

This project is open source. Marzipano is licensed under the Apache 2.0 License.
