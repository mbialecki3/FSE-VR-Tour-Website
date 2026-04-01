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

## Creating 3D Walkable Models (AKASO Workflow)

If you want to create a 3D walkable environment (a `.glb` file) from your AKASO 360 camera, follow these steps:

### 1. Capture (On Campus)
- **Settings:** Set the AKASO to its highest resolution 360° video mode. If possible, set a locked exposure / white balance.
- **Pacing:** Walk slowly and smoothly. Imagine you are carrying a full cup of coffee.
- **Path 1 (Perimeter):** Walk around the perimeter of the room, keeping the camera about 2 feet from the walls.
- **Path 2 (Center & Objects):** Walk horizontally/vertically through the center. Circle around any large machinery or tables so the camera sees them from all sides.
- **Elevations:** Hold the camera at chest height for most of it, but do a quick pass holding it higher (to see the tops of things) and lower.

### 2. Export & Convert (On PC)
- **Transfer:** Move the raw 360° video files from the AKASO to your PC.
- **Reframe in AKASO 360 Studio:**
  1. Open the video in AKASO 360 Studio.
  2. Use the Reframe (or "Free Capture") tool to export a standard 16:9 flat video.
  3. **Crucial Step:** As the video plays, digitally "pan" the camera around. You want the exported 16:9 video to look progressively at the walls, then the floor, then the ceiling.
  4. *Tip:* You may need to export the same video clip 3-4 times, panning different angles (e.g., Export 1: Looking forward, Export 2: Looking 90° right, Export 3: Looking 90° left).
- **Extract Frames using FFmpeg:**
  1. Install FFmpeg on your PC if you haven't already.
  2. Extract frames from your reframed 16:9 video(s) at about 1-2 frames per second.
  3. Run the following command:
     ```bash
     ffmpeg -i your_reframed_video.mp4 -vf "fps=2" -q:v 2 frames/img_%04d.jpg
     ```
  4. You want a folder containing roughly 150-300 standard JPEG images that overlap significantly.

### 3. Photogrammetry Processing (Meshroom)
- Download and install [Meshroom](https://alicevision.org/#meshroom). Ensure your NVIDIA GPU drivers are up to date (Meshroom requires CUDA).
- **Process:**
  1. Open Meshroom.
  2. Drag all the extracted `.jpg` images into the left "Images" panel.
  3. Save the Project to a specific folder (`File` > `Save As`). Meshroom will generate a lot of cache data here.
  4. Click the green **Start** button at the top.

### 4. Cleanup & Export (Blender)
- Open [Blender](https://www.blender.org/) (Free).
- Delete the default cube.
- Go to `File` > `Import` > `Wavefront (.obj)` and select your generated `texturedMesh.obj`.
- **Cleanup/Crop:**
  1. You will see noise, floating bits, and the outside of the room.
  2. Enter **Edit Mode** (`Tab`), select the unwanted geometry, and delete it (`X`). Keep only the clean interior of your room.
- **Decimate (Reduce File Size):**
  1. With the object selected, go to the **Modifiers Properties** tab (the blue wrench icon on the right).
  2. Add a **Decimate** modifier.
  3. Reduce the **Ratio** slider until the polygon "Face Count" (bottom right) is roughly 200,000 - 500,000. Keep an eye on the model to ensure it doesn't lose too much shape.
  4. Apply the modifier.
- **Export to .glb:**
  1. Go to `File` > `Export` > `glTF 2.0 (.glb/.gltf)`.
  2. On the right-hand export settings, under **Geometry**, check **Compression**. *(Note: This requires Draco compression to be enabled in Blender's add-on settings, which significantly reduces web file size).*
  3. Name the file (e.g., `3d-printlab.glb`) and export it into your website project repository under your `models/` directory.
