// ===== 20_canvas_view.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 20_canvas_view.js
// Canvas, griglia, dimensioni mappa, viewport TV, vista player, viste salvate e navigazione.

function applyCanvasSettings() {
  const map = activeMap();
  canvas.style.width = map.width + "px";
  canvas.style.height = map.height + "px";
  canvas.style.setProperty("--grid-size", grid() + "px");
  updateStageSize();
  updateGridLineWeight();
  updateViewportLayer();
  updatePlayerViewLayer();
  canvas.classList.toggle("gridOn", project.showGrid);
  document.getElementById("mapPreset").value = project.mapPreset || "medium_dungeon";
  document.getElementById("mapSquaresW").value = map.squaresW || Math.round(map.width / grid());
  document.getElementById("mapSquaresH").value = map.squaresH || Math.round(map.height / grid());
  document.getElementById("gridSize").value = String(project.gridSize);
  document.getElementById("btnSnap").classList.toggle("active", project.snap);
  document.getElementById("snapDivisor").value = String(project.snapDivisor || 1);
  document.getElementById("btnSnap").textContent = project.snap ? "Magnete ON" : "Magnete OFF";
  document.getElementById("snapDivisor").value = String(project.snapDivisor || 1);
  const pz = document.getElementById("playerZoom");
  if (pz) pz.value = String(project.playerZoom || 100);
  const pzt = document.getElementById("playerZoomText");
  if (pzt) pzt.textContent = Math.round(project.playerZoom || 100) + "%";
  const followBtn = document.getElementById("btnFollowEditor");
  if (followBtn) { 
    followBtn.classList.toggle("active", project.playerFollowEditor !== false); 
    followBtn.textContent = project.playerFollowEditor !== false ? "Segui editor ON" : "Segui editor OFF"; 
  }
}

function updateStageSize() {
  const map = activeMap();

  if (project.mode === "play" || isPlayerWindow) {
    const rect = activePlayerRect();
    const fit = Math.min(window.innerWidth / rect.w, window.innerHeight / rect.h);

    canvasStage.style.width = Math.ceil(rect.w * fit) + "px";
    canvasStage.style.height = Math.ceil(rect.h * fit) + "px";

    canvas.style.left = Math.round(-rect.x * fit) + "px";
    canvas.style.top = Math.round(-rect.y * fit) + "px";
    canvas.style.transform = `scale(${fit})`;
    return;
  }

  const s = zoomScale();
  canvasStage.style.width = Math.ceil(map.width * s) + "px";
  canvasStage.style.height = Math.ceil(map.height * s) + "px";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
}

function updateGridLineWeight() {
  drawGrid();
}

function drawGrid() {
  const layer = document.getElementById("gridLayer");
  if (!layer) return;
  layer.innerHTML = "";

  if (!project.showGrid || project.mode === "play" || isPlayerWindow) return;

  const map = activeMap();
  const g = grid();
  const z = zoomScale();

  // Spessore reale compensato rispetto allo zoom.
  // Dopo transform: scale(z), una linea larga 1/z px risulta circa 1px a schermo.
  const minorW = Math.max(2, Math.ceil(1.6 / z));
  const majorW = Math.max(4, Math.ceil(3.2 / z));

  for (let x = 0; x <= map.width; x += g) {
    const line = document.createElement("div");
    const isMajor = Math.round(x / g) % 5 === 0;
    line.className = "gridLine vertical " + (isMajor ? "major" : "minor");
    const w = isMajor ? majorW : minorW;
    line.style.left = Math.round(x - w / 2) + "px";
    line.style.width = w + "px";
    layer.appendChild(line);
  }

  for (let y = 0; y <= map.height; y += g) {
    const line = document.createElement("div");
    const isMajor = Math.round(y / g) % 5 === 0;
    line.className = "gridLine horizontal " + (isMajor ? "major" : "minor");
    const h = isMajor ? majorW : minorW;
    line.style.top = Math.round(y - h / 2) + "px";
    line.style.height = h + "px";
    layer.appendChild(line);
  }
}

function updateMapInfo() {
  const map = activeMap();
  const squaresW = (map.width / grid()).toFixed(1);
  const squaresH = (map.height / grid()).toFixed(1);
  document.getElementById("mapInfo").innerHTML =
    `${map.width}×${map.height}px<br>${squaresW}×${squaresH} quadretti dungeon<br>Area TV max: ${TV_VIEWPORT.squaresW}×${TV_VIEWPORT.squaresH} q.<br>Vista player: ${project.playerFollowEditor !== false ? "segue editor" : "area TV fissa"}<br>1 q. = 5 ft / 1,5 m<br>Passo aggancio: ${1/(project.snapDivisor || 1)} q.`;
}

function updateViewportLayer() {
  const map = activeMap();

  // Riquadro azzurro = riferimento massimo TV 4K, non obbliga più la vista player.
  const w = Math.round(TV_VIEWPORT.squaresW * grid());
  const h = Math.round(TV_VIEWPORT.squaresH * grid());

  viewportLayer.style.width = w + "px";
  viewportLayer.style.height = h + "px";
  viewportLayer.style.left = (map.viewportX || 0) + "px";
  viewportLayer.style.top = (map.viewportY || 0) + "px";
  viewportLayer.classList.toggle("hidden", !project.showViewport || project.mode === "play" || isPlayerWindow);

  const t = document.getElementById("playerZoomText");
  if (t) t.textContent = Math.round(project.playerZoom || 100) + "%";
  const z = document.getElementById("playerZoom");
  if (z) z.value = String(project.playerZoom || 100);
}

function updatePlayerViewLayer() {
  if (!playerViewLayer) return;

  const rect = activePlayerRect();
  let displayRect = { ...rect };

  // Se la vista player segue esattamente la finestra editor, la cornice cade sui bordi
  // e può sembrare tagliata. La mostro leggermente rientrata solo nell'editor.
  if (project.playerFollowEditor !== false && project.mode === "editor" && !isPlayerWindow) {
    const inset = Math.max(2, Math.round(12 / zoomScale()));
    displayRect.x = clamp(rect.x + inset, 0, activeMap().width);
    displayRect.y = clamp(rect.y + inset, 0, activeMap().height);
    displayRect.w = Math.max(20, rect.w - inset * 2);
    displayRect.h = Math.max(20, rect.h - inset * 2);
    playerViewLayer.classList.add("followInset");
  } else {
    playerViewLayer.classList.remove("followInset");
  }

  playerViewLayer.style.left = Math.round(displayRect.x) + "px";
  playerViewLayer.style.top = Math.round(displayRect.y) + "px";
  playerViewLayer.style.width = Math.round(displayRect.w) + "px";
  playerViewLayer.style.height = Math.round(displayRect.h) + "px";
  playerViewLayer.classList.toggle("hidden", project.mode === "play" || isPlayerWindow);
}

function playerZoomRatio() {
  return Math.max(0.1, Number(project.playerZoom || 100) / 100);
}

function playerViewportSizePx() {
  const ratio = playerZoomRatio();
  return {
    w: Math.round(TV_VIEWPORT.squaresW * grid() / ratio),
    h: Math.round(TV_VIEWPORT.squaresH * grid() / ratio)
  };
}

function activePlayerRect() {
  const map = activeMap();
  if (project.playerFollowEditor !== false && map.playerView) {
    return clampRect(map.playerView);
  }
  const size = playerViewportSizePx();
  return clampRect({ x:map.viewportX || 0, y:map.viewportY || 0, w:size.w, h:size.h });
}

function clampRect(rect) {
  const map = activeMap();
  const w = Math.max(50, Math.min(Math.round(rect.w || 1000), map.width));
  const h = Math.max(50, Math.min(Math.round(rect.h || 700), map.height));
  const x = clamp(Math.round(rect.x || 0), 0, Math.max(0, map.width - w));
  const y = clamp(Math.round(rect.y || 0), 0, Math.max(0, map.height - h));
  return { x, y, w, h };
}

function updatePlayerViewFromEditor(shouldPublish = true) {
  if (isPlayerWindow || project.mode !== "editor" || project.playerFollowEditor === false) return;
  const map = activeMap();
  map.playerView = clampRect(getCurrentViewAsMapRect());
  updatePlayerViewLayer();
  if (shouldPublish) publishProject();
}

function applyMapSizeFromSquares(squaresW, squaresH) {
  const map = activeMap();
  map.squaresW = Number(squaresW);
  map.squaresH = Number(squaresH);
  map.width = Math.round(map.squaresW * grid());
  map.height = Math.round(map.squaresH * grid());

  const size = playerViewportSizePx();
  map.viewportX = Math.min(map.viewportX || 0, Math.max(0, map.width - size.w));
  map.viewportY = Math.min(map.viewportY || 0, Math.max(0, map.height - size.h));

  render();
}

function setMapPreset(presetKey) {
  project.mapPreset = presetKey;
  const preset = MAP_PRESETS[presetKey] || MAP_PRESETS.medium_dungeon;
  document.getElementById("zoom").value = preset.zoom;
  applyMapSizeFromSquares(preset.squaresW, preset.squaresH);
  applyZoom();
}

function getCurrentViewAsMapRect() {
  const s = zoomScale();
  const map = activeMap();

  const wrapRect = canvasWrap.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  // Calcolo la porzione realmente visibile del canvas,
  // non solo scrollLeft/scrollTop: così padding, bordi e colonne richiuse non spostano la cornice.
  const x = clamp((wrapRect.left - canvasRect.left) / s, 0, map.width);
  const y = clamp((wrapRect.top - canvasRect.top) / s, 0, map.height);
  const w = clamp(wrapRect.width / s, 1, Math.max(1, map.width - x));
  const h = clamp(wrapRect.height / s, 1, Math.max(1, map.height - y));

  return {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
    zoom: Number(document.getElementById("zoom").value)
  };
}

function setViewportFromCurrentView() {
  const map = activeMap();
  const view = getCurrentViewAsMapRect();
  const size = playerViewportSizePx();

  const centerX = view.x + view.w / 2;
  const centerY = view.y + view.h / 2;

  map.viewportX = clamp(Math.round(centerX - size.w / 2), 0, Math.max(0, map.width - size.w));
  map.viewportY = clamp(Math.round(centerY - size.h / 2), 0, Math.max(0, map.height - size.h));
  updateViewportLayer();
  status("Area TV massima centrata sulla vista corrente");
  updatePlayerViewLayer();
  publishProject();
}

function goToViewport() {
  const map = activeMap();
  const s = zoomScale();
  canvasWrap.scrollLeft = (map.viewportX || 0) * s;
  canvasWrap.scrollTop = (map.viewportY || 0) * s;
}

function fitWholeMap() {
  const map = activeMap();
  const wrapW = canvasWrap.clientWidth - 40;
  const wrapH = canvasWrap.clientHeight - 40;
  const percent = Math.max(5, Math.min(160, Math.floor(Math.min(wrapW / map.width, wrapH / map.height) * 100)));
  setZoomPercent(percent);
  canvasWrap.scrollLeft = 0;
  canvasWrap.scrollTop = 0;
  status("Vista adattata alla mappa intera");
  updatePlayerViewFromEditor(true);
}

function fitTVOneToOne() { goToViewport(); }


function saveCurrentView() {
  const map = activeMap();
  const name = prompt("Nome vista:", "Nuova vista");
  if (!name) return;
  const view = getCurrentViewAsMapRect();
  map.views = map.views || [];
  map.views.push({ id: uid(), name, ...view });
  renderSavedViews();
  status("Vista salvata: " + name);
}

function goToSavedView(id) {
  const map = activeMap();
  const view = (map.views || []).find(v => v.id === id);
  if (!view) return;
  setZoomPercent(view.zoom || Number(document.getElementById("zoom").value));
  const s = zoomScale();
  canvasWrap.scrollLeft = view.x * s;
  canvasWrap.scrollTop = view.y * s;
  status("Vista: " + view.name);
  updatePlayerViewFromEditor(true);
}

function deleteSavedView(id) {
  const map = activeMap();
  map.views = (map.views || []).filter(v => v.id !== id);
  renderSavedViews();
  publishProject();
}

function renderSavedViews() {
  const box = document.getElementById("savedViews");
  if (!box) return;
  const map = activeMap();
  box.innerHTML = "";
  (map.views || []).forEach(v => {
    const row = document.createElement("div");
    row.className = "savedView";
    const go = document.createElement("button");
    go.className = "go";
    go.textContent = v.name;
    go.onclick = () => goToSavedView(v.id);
    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "×";
    del.onclick = () => deleteSavedView(v.id);
    row.appendChild(go);
    row.appendChild(del);
    box.appendChild(row);
  });
}
