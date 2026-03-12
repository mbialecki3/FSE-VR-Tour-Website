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
    autorotateSpeed:   0.1,     // yaw speed in radians per second (~5.7°/sec)
    fullscreenButton:  true
  },

  /* ----- Scene list ------------------------------------------ */
  scenes: [
    {
      id:          'engineering-center',
      name:        'Engineering Center',
      subtitle:    'ECG / ECF Buildings',
      description: 'The main entrance and lobby of the Fulton Schools of Engineering Center on the ASU Tempe campus.',
      imagePath:   'images/scenes/engineering-center.jpg',
      emoji:       '🏛️',

      /* Where the camera points when the scene first loads */
      initialViewParameters: {
        yaw:   0.0,
        pitch: 0.05,
        fov:   1.4   /* radians ≈ 80° */
      },

      /* Navigation arrows that take the viewer to another scene */
      linkHotspots: [
        {
          yaw:      1.57,   /* ~90° right */
          pitch:    0.0,
          rotation: 0,
          target:   'istb4-atrium',
          label:    'ISTB4 Atrium'
        },
        {
          yaw:     -1.57,   /* ~90° left */
          pitch:    0.0,
          rotation: 0,
          target:   'engineering-courtyard',
          label:    'Engineering Courtyard'
        }
      ],

      /* Information markers at points of interest */
      infoHotspots: [
        {
          yaw:   0.3,
          pitch: -0.2,
          title: 'Main Entrance',
          text:  'The Engineering Center serves as the primary hub for the Fulton Schools of Engineering, housing faculty offices, classrooms, and collaborative workspaces.'
        }
      ]
    },

    /* ------------------------------------------------------- */
    {
      id:          'istb4-atrium',
      name:        'ISTB4 Atrium',
      subtitle:    'Interdisciplinary Science & Technology Building 4',
      description: 'The soaring atrium of ISTB4, home to cutting-edge research labs and collaborative student spaces.',
      imagePath:   'images/scenes/istb4-atrium.jpg',
      emoji:       '🔬',

      initialViewParameters: {
        yaw:   0.5,
        pitch: 0.1,
        fov:   1.4
      },

      linkHotspots: [
        {
          yaw:      3.14,
          pitch:    0.0,
          rotation: 0,
          target:   'engineering-center',
          label:    'Engineering Center'
        },
        {
          yaw:      0.8,
          pitch:    0.0,
          rotation: 0,
          target:   'computing-commons',
          label:    'Computing Commons'
        }
      ],

      infoHotspots: [
        {
          yaw:   -0.5,
          pitch:  0.2,
          title: 'Research Atrium',
          text:  'ISTB4 houses state-of-the-art research facilities across multiple disciplines, including bioengineering, chemical engineering, and materials science.'
        },
        {
          yaw:   1.2,
          pitch: -0.3,
          title: 'Collaboration Spaces',
          text:  'Open-plan areas throughout the building encourage interdisciplinary collaboration between students and faculty.'
        }
      ]
    },

    /* ------------------------------------------------------- */
    {
      id:          'engineering-courtyard',
      name:        'Engineering Courtyard',
      subtitle:    'Outdoor Common Area',
      description: 'The open-air courtyard connecting the main engineering buildings — a popular spot for students to study and relax.',
      imagePath:   'images/scenes/engineering-courtyard.jpg',
      emoji:       '🌳',

      initialViewParameters: {
        yaw:   0.0,
        pitch: 0.0,
        fov:   1.5   /* slightly wider FOV for outdoor scene */
      },

      linkHotspots: [
        {
          yaw:      1.57,
          pitch:    0.0,
          rotation: 0,
          target:   'engineering-center',
          label:    'Engineering Center'
        },
        {
          yaw:     -1.0,
          pitch:    0.0,
          rotation: 0,
          target:   'goldwater-center',
          label:    'Goldwater Center'
        }
      ],

      infoHotspots: [
        {
          yaw:   0.0,
          pitch: -0.4,
          title: 'Engineering Courtyard',
          text:  'This central outdoor space connects the Engineering Center, ISTB4, and surrounding buildings. Students gather here between classes for study sessions and group projects.'
        }
      ]
    },

    /* ------------------------------------------------------- */
    {
      id:          'computing-commons',
      name:        'Computing Commons',
      subtitle:    'Student Computing & Study Area',
      description: 'A state-of-the-art computing facility featuring hundreds of workstations, collaborative labs, and 24/7 study spaces.',
      imagePath:   'images/scenes/computing-commons.jpg',
      emoji:       '💻',

      initialViewParameters: {
        yaw:   1.0,
        pitch: 0.05,
        fov:   1.3
      },

      linkHotspots: [
        {
          yaw:      2.5,
          pitch:    0.0,
          rotation: 0,
          target:   'istb4-atrium',
          label:    'ISTB4 Atrium'
        },
        {
          yaw:     -0.5,
          pitch:    0.0,
          rotation: 0,
          target:   'goldwater-center',
          label:    'Goldwater Center'
        }
      ],

      infoHotspots: [
        {
          yaw:  -0.8,
          pitch: -0.1,
          title: 'Workstation Lab',
          text:  'Over 500 high-performance workstations are available for students across the university, supporting engineering simulations, programming, and design work.'
        },
        {
          yaw:   0.4,
          pitch:  0.3,
          title: 'Collaborative Pods',
          text:  'Private and semi-private study pods are bookable by students for group projects and presentations.'
        }
      ]
    },

    /* ------------------------------------------------------- */
    {
      id:          'goldwater-center',
      name:        'Goldwater Center',
      subtitle:    'Barry M. Goldwater Center for Science & Engineering',
      description: 'Houses the School of Electrical, Computer and Energy Engineering alongside advanced research laboratories.',
      imagePath:   'images/scenes/goldwater-center.jpg',
      emoji:       '⚡',

      initialViewParameters: {
        yaw:  -0.5,
        pitch:  0.05,
        fov:   1.4
      },

      linkHotspots: [
        {
          yaw:      1.0,
          pitch:    0.0,
          rotation: 0,
          target:   'computing-commons',
          label:    'Computing Commons'
        },
        {
          yaw:      2.8,
          pitch:    0.0,
          rotation: 0,
          target:   'engineering-courtyard',
          label:    'Engineering Courtyard'
        }
      ],

      infoHotspots: [
        {
          yaw:   0.0,
          pitch: -0.2,
          title: 'ECEE School',
          text:  'The School of Electrical, Computer and Energy Engineering is one of the largest in the nation, conducting research in areas including power systems, semiconductors, and wireless communications.'
        },
        {
          yaw:  -1.2,
          pitch:  0.2,
          title: 'Research Laboratories',
          text:  'State-of-the-art labs support cutting-edge research in power electronics, RF systems, photovoltaics, and quantum computing.'
        }
      ]
    }
  ] /* end scenes */

}; /* end APP_DATA */
