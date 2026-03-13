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
      id:          '3d-printlab-ecg',
      name:        'Engineering Center 3D Printing and Lasercutting Lab',
      subtitle:    'Entrance',
      description: 'A 3D printing lab located in the Engineering Center, featuring various printers and prototyping tools',
      imagePath:   'images/scenes/3d-printlab-ecg/middle-of-3dprintlab.jpg',
      emoji:       '🚪',

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

      infoHotspots: [
        {
          yaw:      2.9838,
          pitch:    0.4157,
          title:    'Front Desk',
          text:     'The front desk is where visitors can check in, ask questions, and get assistance from the staff. It also serves as a hub for accessing resources and information about the lab.\n More information can be accessed by going to their <a href="https://students.engineering.asu.edu/3d-print-lab/https://students.engineering.asu.edu/3d-print-lab/" target="_blank">website</a> or they can be contacted through the email <span class="highlight">fse3dprintlab@gmail.com</span> or the phone number <span class="highlight">(480) 727-7330</span>.'
        }
      ]
    },

    /* ------------------------------------------------------- */
    {
      id:          '3d-printlab-ecg-computers',
      name:        'Engineering Center 3D Printing and Lasercutting Lab',
      subtitle:    'Computers',
      description: 'Computers for designing and uploading models inside the 3d print lab',
      imagePath:   'images/scenes/3d-printlab-ecg/computers-3dprintlab.jpg',
      emoji:       '🖥️',

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

      infoHotspots: [
        {
          yaw:      0.1182,
          pitch:    0.3051,
          title:    'Design Computers',
          text:     'These computers are used for designing and uploading 3D models to the printers. They have software like <span class="highlight">Fusion 360</span> and <span class="highlight">Cura</span> installed for 3D modeling and slicing.'
        },
        {
          yaw:      1.8735,
          pitch:    0.1665,
          title:    'Leo and Alex',
          text:     'Bums'
        }
      ]
    },

    /* ------------------------------------------------------- */
    {
      id:          'maker-space-entrance',
      name:        'Maker Space',
      subtitle:    'Entrance',
      description: 'The main entrance of the Maker Space.',
      imagePath:   'images/scenes/makerspace/placeholder.jpg',
      emoji:       '🚪',

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
          target:   'placeholder',
          label:    'placeholder'
        },
        {
          yaw:     -0.5,
          pitch:    0.0,
          rotation: 0,
          target:   'placeholder',
          label:    'placeholder'
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
      emoji:       '🖨️',

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
          target:   'placeholder',
          label:    'placeholder'
        },
        {
          yaw:      1.0,
          pitch:    0.0,
          rotation: 0,
          target:   'placeholder',
          label:    'placeholder'
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
      emoji:       '✂️',

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
          target:   'placeholder',
          label:    'placeholder'
        }
      ],

      infoHotspots: []
    },

    /* ------------------------------------------------------- */


  ] /* end scenes */

}; /* end APP_DATA */
