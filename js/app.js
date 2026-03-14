/* =============================================================
   app.js  –  FSE VR Campus Tour  –  Main application
   Requires: Marzipano, screenfull, APP_DATA (data.js)
   ============================================================= */

(function () {
  'use strict';

  /* ---- DOM references --------------------------------------- */
  var panoEl          = document.getElementById('pano');
  var sceneListEl     = document.getElementById('scene-list');
  var sceneNameEl     = document.getElementById('scene-name');
  var sceneDescEl     = document.getElementById('scene-description');
  var loadingEl       = document.getElementById('loading-overlay');
  var noImageEl       = document.getElementById('no-image-notice');
  var missingPathEl   = document.getElementById('missing-image-path');
  var autorotateBtn   = document.getElementById('autorotate-toggle');
  var fullscreenBtn   = document.getElementById('fullscreen-toggle');
  var sidebarBtn      = document.getElementById('sidebar-toggle');
  var sidebarEl       = document.getElementById('sidebar');
  var fsEnterIcon     = document.getElementById('fs-enter');
  var fsExitIcon      = document.getElementById('fs-exit');

  /* ---- Viewer initialisation -------------------------------- */
  var viewerOptions = {
    controls: {
      mouseViewMode: APP_DATA.settings.mouseViewMode
    }
  };

  var viewer = new Marzipano.Viewer(panoEl, viewerOptions);

  /* ---- Autorotate ------------------------------------------ */
  var autorotate = Marzipano.autorotate({
    yawSpeed:         APP_DATA.settings.autorotateSpeed,
    targetPitch:      0,
    targetFov:        Math.PI / 2
  });

  var isAutorotating = false;

  function startAutorotate() {
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(APP_DATA.settings.autorotateDelay, autorotate);
    isAutorotating = true;
    autorotateBtn.classList.add('active');
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
    isAutorotating = false;
    autorotateBtn.classList.remove('active');
  }

  if (APP_DATA.settings.autorotateEnabled) {
    startAutorotate();
  }

  /* Click anywhere in the panorama to log the yaw & pitch to the console */
  panoEl.addEventListener('click', function (e) {
    if (!currentSceneId || !scenes[currentSceneId]) return;
    
    // Remove the strict canvas check
    var view = scenes[currentSceneId].view;
    
    // Convert current mouse pixel coordinates to yaw and pitch
    var rect = panoEl.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    var params = view.screenToCoordinates({ x: x, y: y });
    
    if (params) {
      console.log(`%c[Clicked] Yaw: ${params.yaw.toFixed(4)}, Pitch: ${params.pitch.toFixed(4)}`, 'color: yellow; font-size: 14px; font-weight: bold;');
    } else {
      console.warn("Could not calculate click coordinates.");
    }
  });

  autorotateBtn.addEventListener('click', function () {
    if (isAutorotating) {
      stopAutorotate();
    } else {
      startAutorotate();
    }
  });

  /* Stop autorotate when the user interacts with the pano */
  panoEl.addEventListener('mousedown', stopAutorotate);
  panoEl.addEventListener('touchstart', stopAutorotate);

  /* ---- Fullscreen ------------------------------------------ */
  if (typeof screenfull !== 'undefined' && screenfull.isEnabled) {
    fullscreenBtn.addEventListener('click', function () {
      screenfull.toggle(document.documentElement);
    });

    screenfull.on('change', function () {
      var isFull = screenfull.isFullscreen;
      fsEnterIcon.style.display = isFull ? 'none'  : '';
      fsExitIcon.style.display  = isFull ? ''      : 'none';
    });
  } else {
    /* Hide button if fullscreen API unavailable */
    fullscreenBtn.style.display = 'none';
  }

  /* ---- Sidebar toggle -------------------------------------- */
  // Auto-hide the sidebar on mobile devices (screens smaller than 768px wide)
  if (window.innerWidth <= 768) {
    sidebarEl.classList.add('hidden');
  }

  sidebarBtn.addEventListener('click', function () {
    sidebarEl.classList.toggle('hidden');
  });

  /* ---- Build scenes ---------------------------------------- */
  var scenes = {};           /* id → { data, marzipanoScene } */
  var currentSceneId = null;

  /* Shared geometry and view limiter */
  var geometry = new Marzipano.EquirectGeometry([{ width: 4096 }]);
  var viewLimiter = Marzipano.RectilinearView.limit.traditional(
    2048,
    120 * Math.PI / 180,   /* max horizontal FOV */
    90  * Math.PI / 180    /* max vertical FOV   */
  );

  APP_DATA.scenes.forEach(function (sceneData) {
    var source = Marzipano.ImageUrlSource.fromString(sceneData.imagePath);

    var initialParams = sceneData.initialViewParameters;
    var view = new Marzipano.RectilinearView(
      {
        yaw:   initialParams.yaw,
        pitch: initialParams.pitch,
        fov:   initialParams.fov
      },
      viewLimiter
    );

    var marzipanoScene = viewer.createScene({
      source:       source,
      geometry:     geometry,
      view:         view,
      pinFirstLevel: true
    });

    scenes[sceneData.id] = {
      data:            sceneData,
      marzipanoScene:  marzipanoScene,
      view:            view
    };
  });

  /* ---- Create hotspots for each scene ---------------------- */
  APP_DATA.scenes.forEach(function (sceneData) {
    var sceneObj = scenes[sceneData.id];

    /* -- Link hotspots (navigation arrows) -- */
    (sceneData.linkHotspots || []).forEach(function (hotspot) {
      var element = createLinkHotspotElement(hotspot);
      sceneObj.marzipanoScene.hotspotContainer().createHotspot(
        element,
        { yaw: hotspot.yaw, pitch: hotspot.pitch }
      );
    });

    /* -- Info hotspots -- */
    (sceneData.infoHotspots || []).forEach(function (hotspot) {
      var element = createInfoHotspotElement(hotspot);
      sceneObj.marzipanoScene.hotspotContainer().createHotspot(
        element,
        { yaw: hotspot.yaw, pitch: hotspot.pitch }
      );
    });
  });

  /* ---- Create link-hotspot DOM element --------------------- */
  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('link-hotspot-wrapper');

    /* Tooltip */
    var tooltip = document.createElement('span');
    tooltip.classList.add('link-hotspot-tooltip');
    tooltip.textContent = hotspot.label || hotspot.target;

    /* Arrow circle */
    var circle = document.createElement('div');
    circle.classList.add('link-hotspot');

    /* SVG arrow icon */
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    var path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M12 2L8 10h3v10h2V10h3z'); /* up arrow */
    if (hotspot.rotation) {
      svg.style.transform = 'rotate(' + hotspot.rotation + 'rad)';
    }
    svg.appendChild(path);
    circle.appendChild(svg);

    wrapper.appendChild(tooltip);
    wrapper.appendChild(circle);

    /* Navigate on click */
    wrapper.addEventListener('click', function (e) {
      e.stopPropagation();
      switchScene(hotspot.target);
    });

    return wrapper;
  }

  /* ---- Create info-hotspot DOM element --------------------- */
  function createInfoHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('info-hotspot-wrapper');

    /* "i" badge */
    var badge = document.createElement('div');
    badge.classList.add('info-hotspot');
    badge.textContent = 'i';

    /* Info panel */
    var panel = document.createElement('div');
    panel.classList.add('info-hotspot-panel');

    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = hotspot.title; // Changed to innerHTML so parsing works

    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text; // Changed from textContent to innerHTML

    panel.appendChild(title);
    panel.appendChild(text);
    wrapper.appendChild(badge);
    wrapper.appendChild(panel);

    /* Prevent text selection from rotating the panorama */
    ['mousedown', 'touchstart', 'pointerdown', 'mousemove', 'touchmove', 'pointermove'].forEach(function(eventName) {
      panel.addEventListener(eventName, function (e) {
        e.stopPropagation();
      });
    });

    return wrapper;
  }

  /* ---- Populate sidebar scene list ------------------------- */
  var groups = {};
  var groupOrder = [];

  APP_DATA.scenes.forEach(function (sceneData) {
    var groupName = sceneData.name || 'Other Locations';
    if (!groups[groupName]) {
      groups[groupName] = [];
      groupOrder.push(groupName);
    }
    groups[groupName].push(sceneData);
  });

  groupOrder.forEach(function (groupName) {
    var scenesInGroup = groups[groupName];

    var groupLi = document.createElement('li');
    groupLi.classList.add('scene-group');

    var groupHeader = document.createElement('div');
    groupHeader.classList.add('scene-group-header');
    
    var groupTitle = document.createElement('span');
    groupTitle.classList.add('scene-group-title');
    groupTitle.textContent = groupName;
    
    var groupToggle = document.createElement('span');
    groupToggle.classList.add('scene-group-toggle');
    groupToggle.innerHTML = '&#9660;'; /* down caret */

    groupHeader.appendChild(groupTitle);
    groupHeader.appendChild(groupToggle);

    var subList = document.createElement('ul');
    subList.classList.add('scene-group-items', 'collapsed'); // Start collapsed!
    groupHeader.classList.add('collapsed'); // Rotate caret initially

    /* Toggle expanding/collapsing */
    groupHeader.addEventListener('click', function() {
      subList.classList.toggle('collapsed');
      groupHeader.classList.toggle('collapsed');
    });

    scenesInGroup.forEach(function (sceneData) {
      var li = document.createElement('li');
      li.dataset.sceneId = sceneData.id;

      var a = document.createElement('a');
      a.href = 'javascript:void(0)';

      /* Thumbnail / emoji placeholder */
      var thumb = document.createElement('span');
      thumb.classList.add('scene-thumb-placeholder');
      thumb.textContent = sceneData.emoji || '📷';

      /* Text */
      var infoDiv = document.createElement('div');
      infoDiv.classList.add('scene-info-text');

      var titleSpan = document.createElement('span');
      titleSpan.classList.add('scene-title');
      
      /* Use the subtitle as the item name, fallback to name */
      titleSpan.textContent = sceneData.subtitle || sceneData.name;

      infoDiv.appendChild(titleSpan);

      a.appendChild(thumb);
      a.appendChild(infoDiv);
      li.appendChild(a);
      subList.appendChild(li);

      a.addEventListener('click', function () {
        switchScene(sceneData.id);
      });
    });

    groupLi.appendChild(groupHeader);
    groupLi.appendChild(subList);
    sceneListEl.appendChild(groupLi);
  });

  /* ---- Image error detection ------------------------------- */
  /**
   * Attempt to load the image for a scene.  If it fails (404 / local file
   * missing), show the no-image notice so the user knows what to add.
   */
  function checkImageExists(url, onMissing) {
    var img = new Image();
    img.onload  = function () {};   /* image present — nothing to do */
    img.onerror = function () { onMissing(url); };
    img.src = url;
  }

  /* ---- Switch scene ---------------------------------------- */
  function switchScene(sceneId) {
    var sceneObj = scenes[sceneId];
    if (!sceneObj) { return; }

    noImageEl.style.display = 'none';
    showLoading();

    /* Reset view to initial parameters */
    var params = sceneObj.data.initialViewParameters;
    sceneObj.view.setParameters({
      yaw:   params.yaw,
      pitch: params.pitch,
      fov:   params.fov
    });

    sceneObj.marzipanoScene.switchTo(
      { transitionDuration: 1000 },
      function () {
        /* Called when transition completes */
        hideLoading();
        currentSceneId = sceneId;
        updateUI(sceneObj.data);

        /* Check whether the image actually loaded */
        checkImageExists(sceneObj.data.imagePath, function (url) {
          hideLoading();
          missingPathEl.textContent = url;
          noImageEl.style.display = 'flex';
        });
      }
    );
  }

  /* ---- Update header / sidebar UI -------------------------- */
  function updateUI(sceneData) {
    sceneNameEl.textContent = sceneData.name;
    sceneDescEl.textContent = sceneData.description || '';

    /* Highlight active item in sidebar */
    var items = sceneListEl.querySelectorAll('li[data-scene-id]');
    items.forEach(function (item) {
      var isActive = (item.dataset.sceneId === sceneData.id);
      item.classList.toggle('active', isActive);

      /* Automatically expand the group this scene belongs to */
      if (isActive) {
        var subList = item.closest('ul.scene-group-items');
        if (subList) {
          subList.classList.remove('collapsed');
          var groupLi = subList.closest('li.scene-group');
          if (groupLi) {
            var header = groupLi.querySelector('.scene-group-header');
            if (header) {
              header.classList.remove('collapsed');
            }
          }
        }
      }
    });

    buildEdgeIndicators(sceneData);
  }

  /* ---- Edge Indicators ------------------------------------- */
  var edgeIndicatorsContainer = document.getElementById('edge-indicators');
  var currentEdgeIndicators = [];

  function buildEdgeIndicators(sceneData) {
    if (!edgeIndicatorsContainer) return;
    edgeIndicatorsContainer.innerHTML = '';
    currentEdgeIndicators = [];

    (sceneData.linkHotspots || []).forEach(function (hotspot) {
      var el = document.createElement('div');
      el.classList.add('edge-indicator');

      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'M12 2L8 10h3v10h2V10h3z'); // Up arrow
      svg.appendChild(path);
      el.appendChild(svg);

      el.addEventListener('click', function(e) {
        e.stopPropagation();
        switchScene(hotspot.target);
      });

      edgeIndicatorsContainer.appendChild(el);

      currentEdgeIndicators.push({
        element: el,
        yaw: hotspot.yaw,
        pitch: hotspot.pitch,
        target: hotspot.target
      });
    });
  }

  function updateEdgeIndicators() {
    if (!currentSceneId || !scenes[currentSceneId] || !edgeIndicatorsContainer) {
      requestAnimationFrame(updateEdgeIndicators);
      return;
    }

    var sceneObj = scenes[currentSceneId];
    var view = sceneObj.view;
    var containerRect = edgeIndicatorsContainer.getBoundingClientRect();
    var width = containerRect.width;
    var height = containerRect.height;
    
    // If the container has zero size (e.g. hidden), skip
    if (width === 0 || height === 0) {
      requestAnimationFrame(updateEdgeIndicators);
      return;
    }

    // Dynamic right boundary to account for open sidebar
    var rightBoundary = width;
    if (sidebarEl && !sidebarEl.classList.contains('hidden')) {
      var sidebarRect = sidebarEl.getBoundingClientRect();
      if (sidebarRect.left > 0) {
        rightBoundary = sidebarRect.left;
      }
    }

    var cx = width / 2;
    var cy = height / 2;
    var padding = 24; 
    
    // Calculate precise bounds relative to center
    // Take into account 56px top header bar
    var bLeft = -cx + padding;
    var bRight = (rightBoundary - cx) - padding;
    var bTop = -cy + 56 + padding;
    var bBottom = cy - padding;

    currentEdgeIndicators.forEach(function(item) {
      var coords = view.coordinatesToScreen({ yaw: item.yaw, pitch: item.pitch });
      var isOffScreen = false;

      if (!coords) {
        isOffScreen = true; // Behind the camera
      } else if (coords.x < 0 || coords.x > rightBoundary || coords.y < 56 || coords.y > height) {
        isOffScreen = true; // Outside visible unoccluded screen bounds
      }

      if (isOffScreen) {
        item.element.style.display = 'flex';

        var dirX, dirY;

        if (coords) {
          // Point is theoretically in front of the camera, just off the boundaries.
          // Direct vector from center of screen to the projected coordinates gives pinpoint accuracy.
          dirX = coords.x - cx;
          dirY = coords.y - cy;
        } else {
          // Point is behind the camera (Marzipano returns null).
          // Fallback to relative view angles.
          var yawDist = item.yaw - view.yaw();
          
          // Normalize yaw difference to -PI to PI
          while (yawDist > Math.PI) yawDist -= 2 * Math.PI;
          while (yawDist < -Math.PI) yawDist += 2 * Math.PI;

          // In a spherical viewer, the only way to look behind you is to pan left or right.
          // Looking up or down just gets stuck at the floor/ceiling.
          // So if an object is behind the camera, point strictly left or right to guide the user to turn around.
          dirX = yawDist > 0 ? 1 : -1;
          dirY = 0; // Lock the vertical direction so they don't get guided into the floor
        }

        var theta = Math.atan2(dirY, dirX);
        var sin = Math.sin(theta);
        var cos = Math.cos(theta);

        // Raycasting to screen bounds
        var tMin = Infinity;
        if (cos > 0.0001) tMin = Math.min(tMin, bRight / cos);
        else if (cos < -0.0001) tMin = Math.min(tMin, bLeft / cos);

        if (sin > 0.0001) tMin = Math.min(tMin, bBottom / sin);
        else if (sin < -0.0001) tMin = Math.min(tMin, bTop / sin);

        var x = cx + tMin * cos;
        var y = cy + tMin * sin;

        item.element.style.left = x + 'px';
        item.element.style.top = y + 'px';
        
        // Arrow naturally points UP (in SVG), so we offset by PI/2
        var arrowRot = theta + Math.PI / 2;
        item.element.querySelector('svg').style.transform = 'rotate(' + arrowRot + 'rad)';
      } else {
        item.element.style.display = 'none';
      }
    });

    requestAnimationFrame(updateEdgeIndicators);
  }

  // Start the render loop
  requestAnimationFrame(updateEdgeIndicators);

  /* ---- Loading overlay helpers ----------------------------- */
  function showLoading() {
    loadingEl.classList.remove('hidden');
  }

  function hideLoading() {
    loadingEl.classList.add('hidden');
  }

  /* ---- Keyboard navigation --------------------------------- */
  document.addEventListener('keydown', function (e) {
    if (!currentSceneId) { return; }
    var sceneIds  = APP_DATA.scenes.map(function (s) { return s.id; });
    var idx       = sceneIds.indexOf(currentSceneId);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      switchScene(sceneIds[(idx + 1) % sceneIds.length]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      switchScene(sceneIds[(idx - 1 + sceneIds.length) % sceneIds.length]);
    }
  });

  /* ---- Start with the first scene -------------------------- */
  // Find the Engineering Center Entrance scene
  var defaultSceneId = null;
  var targetSceneId = '3d-printlab-ecg'; // The ID of the Engineering Space entrance
  
  if (APP_DATA.scenes.length > 0) {
    // Try to find the targeted scene, fallback to the first scene if missing
    var targetScene = APP_DATA.scenes.find(function(s) { return s.id === targetSceneId; });
    defaultSceneId = targetScene ? targetScene.id : APP_DATA.scenes[0].id;
    
    switchScene(defaultSceneId);
  } else {
    hideLoading();
  }

  /* ---- Tutorial Overlay ------------------------------------ */
  var tutorialOverlay = document.getElementById('tutorial-overlay');
  var tutorialStartBtn = document.getElementById('tutorial-start-btn');

  if (tutorialOverlay && tutorialStartBtn) {
    if (!localStorage.getItem('fseVrTourTutorialSeen')) {
      // Show tutorial on first visit
      tutorialOverlay.style.display = 'flex';
      
      tutorialStartBtn.addEventListener('click', function() {
        tutorialOverlay.style.display = 'none';
        localStorage.setItem('fseVrTourTutorialSeen', 'true');
      });
    } else {
      // Hide if already seen
      tutorialOverlay.style.display = 'none';
    }
  }

})();
