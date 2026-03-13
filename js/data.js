/* =============================================================
   data.js  –  FSE VR Campus Tour scene definitions
   
   To use your own 360° panoramic photos:
     1. Export / convert them to equirectangular JPEG format.
     2. Name each file to match the `imagePath` field below.
     3. Place the files in the  images/scenes/  directory.
     4. Reload index.html in your browser.
   
   Each scene's  imagePath  is relative to index.html.
   Recommended image resolution: 4096 × 2048 pixels (or 8192 × 4096
   for higher fidelity), 90–95 % JPEG quality.
   ============================================================= */

var APP_DATA = {

  /* ----- Global settings ------------------------------------- */
  settings: {
    mouseViewMode:    'drag',   // 'drag' | 'qtvr'
    autorotateEnabled: true,
    autorotateDelay:   3000,    // ms before autorotate kicks in
    autorotateSpeed:   0.1,     // yaw speed in radians per second (~5.73°/sec)
    fullscreenButton:  true
  },

  /* ----- Scene list ------------------------------------------ */
  scenes: [
    {
      id:          'maker-space-entrance',
      name:        'Maker Space',
      subtitle:    'Entrance',
      description: 'The main entrance of the Maker Space.',
      imagePath:   'images/scenes/makerspace/placeholder.jpg',
      emoji:       '🛠️',

      initialViewParameters: {
        yaw:   0.0,
        pitch: 0.0,
        fov:   1.4
      },

      linkHotspots: [
        {
          yaw:      0.5,
          pitch:    0.0,
          rotation: 0,
          target:   'maker-space-3d-printers',
          label:    'Go to 3D Printers'
        },
        {
          yaw:     -0.5,
          pitch:    0.0,
          rotation: 0,
          target:   'maker-space-office',
          label:    'Go to Office'
        }
      ],

      infoHotspots: []
    },

    /* ------------------------------------------------------- */
    {
      id:          'maker-space-3d-printers',
      name:        'Maker Space',
      subtitle:    '3D Printers',
      description: 'The 3D printing and rapid prototyping area.',
      imagePath:   'images/scenes/makerspace/placeholder.jpg',
      emoji:       '🛠️',

      initialViewParameters: {
        yaw:   0.0,
        pitch: 0.0,
        fov:   1.4
      },

      linkHotspots: [
        {
          yaw:      3.14,
          pitch:    0.0,
          rotation: 0,
          target:   'maker-space-entrance',
          label:    'Go to Entrance'
        },
        {
          yaw:      1.0,
          pitch:    0.0,
          rotation: 0,
          target:   'maker-space-laser-cutters',
          label:    'Go to Laser Cutters'
        }
      ],

      infoHotspots: []
    },

    /* ------------------------------------------------------- */
    {
      id:          'maker-space-laser-cutters',
      name:        'Maker Space',
      subtitle:    'Laser Cutters',
      description: 'Laser cutting and engraving stations.',
      imagePath:   'images/scenes/makerspace/placeholder.jpg',
      emoji:       '🛠️',

      initialViewParameters: {
        yaw:   0.0,
        pitch: 0.0,
        fov:   1.4
      },

      linkHotspots: [
        {
          yaw:      3.14,
          pitch:    0.0,
          rotation: 0,
          target:   'maker-space-3d-printers',
          label:    'Go to 3D Printers'
        }
      ],

      infoHotspots: []
    },

    /* ------------------------------------------------------- */
    {
      id:          'maker-space-office',
      name:        'Maker Space',
      subtitle:    'Office',
      description: 'The admin and support office for the Maker Space.',
      imagePath:   'images/scenes/makerspace/placeholder.jpg',
      emoji:       '🛠️',

      initialViewParameters: {
        yaw:   0.0,
        pitch: 0.0,
        fov:   1.4
      },

      linkHotspots: [
        {
          yaw:      3.14,
          pitch:    0.0,
          rotation: 0,
          target:   'maker-space-entrance',
          label:    'Go to Entrance'
        }
      ],

      infoHotspots: []
    },

    /* ------------------------------------------------------- */
    {
      id:          '3d-printlab-ecg',
      name:        'Engineering Center 3D Printing and Lasercutting Lab',
      subtitle:    'Print Area',
      description: 'A 3D printing lab located in the Engineering Center, featuring various printers and prototyping tools',
      imagePath:   'images/scenes/3d-printlab-ecg/middle-of-3dprintlab.jpg',
      emoji:       '🛠️',

      initialViewParameters: {
        yaw:   0.0,
        pitch: 0.0,
        fov:   1.4
      },

      linkHotspots: [
        {
          yaw:      0.8405,
          pitch:    0.3276,
          rotation: 0,
          target:   '3d-printlab-ecg-computers',
          label:    'Go to Computers'
        }
      ],

      infoHotspots: []
    },

    /* ------------------------------------------------------- */
    {
      id:          '3d-printlab-ecg-computers',
      name:        'Engineering Center 3D Printing and Lasercutting Lab',
      subtitle:    'Computers in the print area',
      description: 'Computers for designing and uploading models inside the 3d print lab',
      imagePath:   'images/scenes/3d-printlab-ecg/computers-3dprintlab.jpg',
      emoji:       '🛠️',

      initialViewParameters: {
        yaw:   0.0,
        pitch: 0.0,
        fov:   1.4
      },

      linkHotspots: [
        {
          yaw:      -1.2133,
          pitch:    0.2559,
          rotation: 0,
          target:   '3d-printlab-ecg',
          label:    'Go to Entrance'
        }
      ],

      infoHotspots: []
    }


  ] /* end scenes */

}; /* end APP_DATA */
