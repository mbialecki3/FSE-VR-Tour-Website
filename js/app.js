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
    title.textContent = hotspot.title;

    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.textContent = hotspot.text;

    panel.appendChild(title);
    panel.appendChild(text);
    wrapper.appendChild(badge);
    wrapper.appendChild(panel);

    return wrapper;
  }

  /* ---- Populate sidebar scene list ------------------------- */
  APP_DATA.scenes.forEach(function (sceneData) {
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
    titleSpan.textContent = sceneData.name;

    var subtitleSpan = document.createElement('span');
    subtitleSpan.classList.add('scene-subtitle');
    subtitleSpan.textContent = sceneData.subtitle || '';

    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(subtitleSpan);

    a.appendChild(thumb);
    a.appendChild(infoDiv);
    li.appendChild(a);
    sceneListEl.appendChild(li);

    a.addEventListener('click', function () {
      switchScene(sceneData.id);
    });
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
    var items = sceneListEl.querySelectorAll('li');
    items.forEach(function (item) {
      item.classList.toggle('active', item.dataset.sceneId === sceneData.id);
    });
  }

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
  if (APP_DATA.scenes.length > 0) {
    switchScene(APP_DATA.scenes[0].id);
  } else {
    hideLoading();
  }

})();
