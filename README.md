# FSE VR Campus Tour

A 360 virtual tour for the Fulton Schools of Engineering at ASU. Built using [Marzipano](https://www.marzipano.net/) for the panoramic viewing engine.

This project allows users to pan around various 360 photos of the FSE campus, click on info hotspots to learn more about specific rooms or tools, and navigate seamlessly between different locations.

## Setup

You will need a local web server to run this. Opening the `index.html` file directly in your browser (`file://`) will block the 3D images from loading due to standard browser CORS restrictions.

If you have Python installed, you can spin up a quick server:

```bash
python -m http.server 8080
```

Then navigate to `http://localhost:8080` in your browser. You can also use the Live Server extension in VS Code.

## Modifying Content

### Adding Images
Drop your equirectangular 360 `.jpg` photos into the `images/scenes/` directory. 

*Note: Be mindful of mobile device WebGL limits. Keeping panoramic image dimensions scaled to `4096x2048` is heavily recommended to prevent crashes and failed renders on iOS and Android phones.*

### Scenes and Hotspots
All scene configurations are handled directly in `js/data.js`. Use this file to:
- Define new scene data
- Link scenes together using navigation hotspots (`target`)
- Add informational text hotspots for specific points of interest
- Set the default camera starting angle (`yaw` and `pitch`)

**Pro Tip:** To figure out the exact `yaw` and `pitch` values for placing your hotspots, just click anywhere in the 360 viewer while testing the site in your browser. The exact coordinate data will be automatically printed to your browser's inspect console.

## Core Structure
- `index.html` - Main DOM and UI overlay.
- `css/style.css` - UI styling, edge-indicator animations, and ASU branding.
- `js/app.js` - Main rendering loop, sidebar logic, off-screen indicator math, and Marzipano core setup.
- `js/data.js` - The central data configuration map for all scenes.
