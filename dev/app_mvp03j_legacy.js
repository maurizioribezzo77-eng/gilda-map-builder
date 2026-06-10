const STORAGE_KEY = "gildaMapBuilderProject04";
const CHANNEL_NAME = "gildaMapBuilderChannel04";
const isPlayerWindow = new URLSearchParams(window.location.search).get("player") === "1";
const syncChannel = ("BroadcastChannel" in window) ? new BroadcastChannel(CHANNEL_NAME) : null;

const MAP_PRESETS = {
  "room": { name:"Stanza", squaresW:30, squaresH:20, zoom:50 },
  "small_lair": { name:"Tana piccola", squaresW:50, squaresH:30, zoom:35 },
  "medium_dungeon": { name:"Dungeon medio", squaresW:80, squaresH:50, zoom:20 },
  "large_dungeon": { name:"Dungeon grande", squaresW:120, squaresH:80, zoom:15 },
  "mega_structure": { name:"Mega struttura", squaresW:200, squaresH:120, zoom:8 },
  "custom": { name:"Personalizzata", squaresW:80, squaresH:50, zoom:20 }
};

const TV_VIEWPORT = {
  name: "TV 50 pollici 4K orizzontale",
  squaresW: 38.4,
  squaresH: 21.6
};

const LAYERS = ["Base", "Architettura", "Oggetti", "Overlay", "Master", "Player"];

const ASSETS = [
  { id:"stone_floor", name:"Pavimento 2×2", cat:"Base", src:"assets/base/stone_floor.svg", cellsW:2, cellsH:2 },
  { id:"rough_wall", name:"Roccia 3×0.5", cat:"Muri", src:"assets/muri/rough_wall.svg", cellsW:3, cellsH:0.5 },
  { id:"old_wall", name:"Muratura 3×0.5", cat:"Muri", src:"assets/muri/old_wall.svg", cellsW:3, cellsH:0.5 },
  { id:"wood_door", name:"Porta 1×0.25", cat:"Porte", src:"assets/porte/wood_door.svg", cellsW:1, cellsH:0.25 },
  { id:"secret_door", name:"Porta segreta 1×0.25", cat:"Porte", src:"assets/porte/secret_door.svg", cellsW:1, cellsH:0.25 },
  { id:"stairs_down", name:"Scala 1×1", cat:"Scale e botole", src:"assets/scale_botole/stairs_down.svg", cellsW:1, cellsH:1 },
  { id:"hatch", name:"Botola 0.5×0.5", cat:"Scale e botole", src:"assets/scale_botole/hatch.svg", cellsW:0.5, cellsH:0.5 },
  { id:"crate", name:"Cassa 0.5×0.5", cat:"Oggetti", src:"assets/oggetti/crate.svg", cellsW:0.5, cellsH:0.5 },
  { id:"table", name:"Tavolo 1.5×1", cat:"Oggetti", src:"assets/oggetti/table.svg", cellsW:1.5, cellsH:1 },
  { id:"fog", name:"Oscurità 3×2", cat:"Overlay", src:"assets/overlay/fog.svg", cellsW:3, cellsH:2 },
  { id:"token", name:"Token 1×1", cat:"Token", src:"assets/token/token.svg", cellsW:1, cellsH:1 },
  { id:"marker_a1", name:"A1", cat:"Icone", src:"assets/icone/marker_a1.svg", cellsW:0.5, cellsH:0.5 },
  { id:"marker_a2", name:"A2", cat:"Icone", src:"assets/icone/marker_a2.svg", cellsW:0.5, cellsH:0.5 },
  { id:"sigil", name:"Sigillo 1×1", cat:"Icone", src:"assets/icone/sigil.svg", cellsW:1, cellsH:1 }
];

let project = {
  name:"Gilda delle Ombre - Prova",
  activeMapId:"mappa_test",
  mode:"editor",
  showGrid:true,
  snap:true,
  snapDivisor:1,
  gridSize:100,
  mapPreset:"medium_dungeon",
  showViewport:true,
  playerFollowEditor:true,
  playerZoom:100,
  customAssets:[],
  ui:{ leftCollapsed:false, rightCollapsed:false, assetCollapsed:{} },
  maps:[{
    id:"mappa_test",
    name:"Accessi e Labirinti - test",
    width:8000,
    height:5000,
    squaresW:80,
    squaresH:50,
    viewportX:0,
    viewportY:0,
    views:[],
    playerView:{x:0,y:0,w:3840,h:2160},
    objects:[]
  }]
};

let selectedId = null;
let selectedAssetId = null;
let clipboard = null;
let dragState = null;
let panState = null;
let viewportDragState = null;
let lastSyncedRaw = "";

const canvas = document.getElementById("canvas");
const canvasStage = document.getElementById("canvasStage");
const canvasWrap = document.getElementById("canvasWrap");
const viewportLayer = document.getElementById("viewportLayer");
const viewportHandle = document.getElementById("viewportHandle");
const playerViewLayer = document.getElementById("playerViewLayer");
const brushPreview = document.getElementById("brushPreview");
const brushPreviewImg = document.getElementById("brushPreviewImg");
const statusEl = document.getElementById("status");

function activeMap() { return project.maps.find(m => m.id === project.activeMapId); }
function uid() { return "obj_" + Math.random().toString(36).slice(2,10); }
function allAssets() { return ASSETS.concat(project.customAssets || []); }
function assetById(id) { return allAssets().find(a => a.id === id); }
function status(msg) { if (statusEl) statusEl.textContent = msg; }
function grid() { return Number(project.gridSize || 120); }
function snapStep() { return grid() / Number(project.snapDivisor || 1); }
function pxFromCells(cells) { return Math.max(1, Math.round(cells * grid())); }
function cellsFromPx(px) { return +(px / grid()).toFixed(2); }
function snapValue(v) { return project.snap ? Math.round(v / snapStep()) * snapStep() : Math.round(v); }

function buildTree() {
  const tree = document.getElementById("projectTree");
  tree.innerHTML = "";
  tree.appendChild(node("▾ " + project.name));
  tree.appendChild(node("▾ Mappe", "child"));
  project.maps.forEach(m => {
    const el = node("↳ " + m.name, "child" + (m.id === project.activeMapId ? " activeMap" : ""));
    el.onclick = () => { project.activeMapId = m.id; selectedId = null; render(); };
    tree.appendChild(el);
  });
  ["Scene", "Asset", "Handout", "Token", "Collegamenti", "Versioni esportate"].forEach(t => tree.appendChild(node("• " + t, "child")));
}
function node(text, cls="") {
  const el = document.createElement("div");
  el.className = "node " + cls;
  el.textContent = text;
  return el;
}

function buildLayerControls() {
  const box = document.getElementById("layerControls");
  box.innerHTML = "";
  LAYERS.forEach(layer => {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = true;
    cb.dataset.layer = layer;
    cb.onchange = renderObjects;
    label.appendChild(cb);
    label.appendChild(document.createTextNode(layer));
    box.appendChild(label);
  });
}
function visibleLayers() {
  return Array.from(document.querySelectorAll("#layerControls input")).filter(i => i.checked).map(i => i.dataset.layer);
}

function buildLibrary() {
  const lib = document.getElementById("assetLibrary");
  lib.innerHTML = "";
  project.ui = project.ui || { assetCollapsed:{} };
  project.ui.assetCollapsed = project.ui.assetCollapsed || {};

  const assets = allAssets();
  const cats = [...new Set(assets.map(a => a.cat))];

  cats.forEach(cat => {
    const sec = document.createElement("div");
    const collapsed = !!project.ui.assetCollapsed[cat];
    sec.className = "assetCategory" + (collapsed ? " collapsed" : "");

    const h = document.createElement("h3");
    const title = document.createElement("span");
    title.textContent = cat;
    const arrow = document.createElement("span");
    arrow.className = "catArrow";
    arrow.textContent = collapsed ? "▶" : "▼";
    h.appendChild(title);
    h.appendChild(arrow);

    h.onclick = () => {
      project.ui.assetCollapsed[cat] = !project.ui.assetCollapsed[cat];
      buildLibrary();
      publishProject();
    };

    sec.appendChild(h);

    const gridBox = document.createElement("div");
    gridBox.className = "assetGrid";

    assets.filter(a => a.cat === cat).forEach(a => {
      const tile = document.createElement("div");
      tile.className = "assetTile" + (selectedAssetId === a.id ? " brushSelected" : "");
      tile.draggable = true;
      tile.dataset.assetId = a.id;
      tile.ondragstart = e => e.dataTransfer.setData("text/plain", a.id);

      // Click semplice: mostra nello status le dimensioni di partenza.
      // Il comportamento principale resta drag & drop, quindi le proprietà degli oggetti piazzati restano a destra come prima.
      tile.onclick = () => selectAssetBrush(a.id);

      tile.innerHTML = `<img src="${a.src}" alt=""><span>${a.name}</span><span class="size">${a.cellsW}×${a.cellsH} q.</span>`;
      gridBox.appendChild(tile);
    });

    sec.appendChild(gridBox);
    lib.appendChild(sec);
  });
}


function normalizeProject() {
  project.customAssets = project.customAssets || [];
  project.ui = project.ui || { leftCollapsed:false, rightCollapsed:false, assetCollapsed:{} };
  project.ui.assetCollapsed = project.ui.assetCollapsed || {};
  project.playerFollowEditor = project.playerFollowEditor !== false;
  project.playerZoom = project.playerZoom || 100;
  project.maps.forEach(m => {
    m.squaresW = m.squaresW || Math.round(m.width / grid());
    m.squaresH = m.squaresH || Math.round(m.height / grid());
    m.viewportX = m.viewportX || 0;
    m.viewportY = m.viewportY || 0;
    m.views = m.views || [];
    if (!m.playerView) {
      m.playerView = { x:m.viewportX || 0, y:m.viewportY || 0, w:Math.round(TV_VIEWPORT.squaresW * grid()), h:Math.round(TV_VIEWPORT.squaresH * grid()) };
    }
  });
}

function render() {
  normalizeProject();
  buildTree();
  applyCanvasSettings();
  renderObjects();
  renderProperties();
  updateMapInfo();
  renderSavedViews();
  publishProject();
}



function applyColumnUI() {
  project.ui = project.ui || {};
  document.body.classList.toggle("leftCollapsed", !!project.ui.leftCollapsed);
  document.body.classList.toggle("rightCollapsed", !!project.ui.rightCollapsed);

  const l = document.getElementById("btnToggleLeft");
  const r = document.getElementById("btnToggleRight");
  if (l) {
    l.textContent = project.ui.leftCollapsed ? "Mostra sinistra" : "Nascondi sinistra";
    l.classList.toggle("active", project.ui.leftCollapsed);
  }
  if (r) {
    r.textContent = project.ui.rightCollapsed ? "Mostra destra" : "Nascondi destra";
    r.classList.toggle("active", project.ui.rightCollapsed);
  }

  // Dopo il cambio colonne, aggiorno la cornice player seguendo le nuove dimensioni dell'editor.
  setTimeout(() => updatePlayerViewFromEditor(true), 0);
}

function toggleLeftColumn() {
  project.ui = project.ui || {};
  project.ui.leftCollapsed = !project.ui.leftCollapsed;
  applyColumnUI();
  publishProject();
}

function toggleRightColumn() {
  project.ui = project.ui || {};
  project.ui.rightCollapsed = !project.ui.rightCollapsed;
  applyColumnUI();
  publishProject();
}

function applyModeUI() {
  const isPlay = project.mode === "play" || isPlayerWindow;
  document.body.classList.toggle("playMode", project.mode === "play" && !isPlayerWindow);
  document.body.classList.toggle("playerWindow", isPlayerWindow);
  document.getElementById("btnEditor").classList.toggle("active", !isPlay);
  document.getElementById("btnPlay").classList.toggle("active", isPlay && !isPlayerWindow);
  applyColumnUI();
  applyZoom();
}

function enterEditorMode() {
  project.mode = "editor";
  selectedId = null;
  applyModeUI();
  status("Modalità Editor");
  render();
}

function enterPlayMode() {
  project.mode = "play";
  selectedId = null;
  applyModeUI();
  status("Modalità Gioco: solo area TV, senza griglia");
  render();
}

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

function renderObjects() {
  canvas.querySelectorAll(".mapObject").forEach(n => n.remove());
  const map = activeMap();

  map.objects.forEach(obj => {
    if ((project.mode === "play" || isPlayerWindow) && obj.visiblePlayer === false) return;

    const a = assetById(obj.assetId);
    if (!a) return;

    const el = document.createElement("div");
    el.className = "mapObject" + (obj.id === selectedId ? " selected" : "") + (obj.visiblePlayer === false ? " hiddenPlayer" : "");
    el.dataset.id = obj.id;

    el.style.left = obj.x + "px";
    el.style.top = obj.y + "px";
    el.style.width = obj.w + "px";
    el.style.height = obj.h + "px";
    el.style.opacity = obj.opacity ?? 1;
    el.style.transform = `rotate(${obj.rot || 0}deg)`;
    el.style.zIndex = String(20000 + (obj.z || 0));

    el.innerHTML = `<img src="${a.src}" alt="">`;

    if (!isPlayerWindow) {
      el.onclick = e => { e.stopPropagation(); selectedId = obj.id; renderObjects(); renderProperties(); };
      el.onmousedown = e => startDrag(e, obj.id);
    }

    canvas.appendChild(el);
  });
}

function layerBaseZ(layer) { return (LAYERS.indexOf(layer) + 1) * 100; }

function startDrag(e, id) {
  if (project.mode !== "editor") return;
  const obj = activeMap().objects.find(o => o.id === id);
  if (!obj || obj.locked) return;
  selectedId = id;
  dragState = { id, startX:e.clientX, startY:e.clientY, origX:obj.x, origY:obj.y };
  renderObjects();
  renderProperties();
  e.preventDefault();
}

document.addEventListener("mousemove", e => {
  if (!dragState) return;
  const obj = activeMap().objects.find(o => o.id === dragState.id);
  const scale = zoomScale();
  let x = dragState.origX + (e.clientX - dragState.startX) / scale;
  let y = dragState.origY + (e.clientY - dragState.startY) / scale;
  obj.x = snapValue(x);
  obj.y = snapValue(y);
  renderObjects();
  updateLiveXY(obj);
});
document.addEventListener("mouseup", () => dragState = null);

// canvas click handled by pointerdown listener for brush mode

canvas.addEventListener("pointerdown", handleCanvasClick);
canvas.addEventListener("pointermove", updateBrushPreview);
canvas.addEventListener("pointerleave", hideBrushPreview);
canvas.ondragover = e => e.preventDefault();
canvas.ondrop = e => {
  e.preventDefault();
  const assetId = e.dataTransfer.getData("text/plain");
  const a = assetById(assetId);
  if (!a) return;

  const rect = canvas.getBoundingClientRect();
  const scale = zoomScale();
  const w = pxFromCells(a.cellsW);
  const h = pxFromCells(a.cellsH);
  const rawX = (e.clientX - rect.left) / scale - w/2;
  const rawY = (e.clientY - rect.top) / scale - h/2;

  const layer = defaultLayer(a.cat);
  const obj = {
    id:uid(),
    name:a.name,
    type:"asset",
    assetId:a.id,
    x:snapValue(rawX),
    y:snapValue(rawY),
    w,
    h,
    cellsW:a.cellsW,
    cellsH:a.cellsH,
    rotation:0,
    opacity:1,
    layer,
    visibleMaster:true,
    visiblePlayer: a.cat !== "Icone",
    locked:false,
    note:"",
    z: layerBaseZ(layer)
  };
  activeMap().objects.push(obj);
  selectedId = obj.id;
  status("Inserito e agganciato alla griglia: " + a.name);
  render();
};

function defaultLayer(cat) {
  if (cat === "Base") return "Base";
  if (cat === "Muri" || cat === "Porte" || cat === "Scale e botole") return "Architettura";
  if (cat === "Overlay") return "Overlay";
  if (cat === "Icone") return "Master";
  return "Oggetti";
}

function renderProperties() {
  const box = document.getElementById("properties");
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) {
    box.innerHTML = `<p class="hint">Seleziona un oggetto sulla mappa.</p>`;
    return;
  }

  box.innerHTML = `
    <label>Nome <input data-prop="name" value="${esc(obj.name)}"></label>
    <label>Tipo <input data-prop="type" value="${esc(obj.type || "")}"></label>

    <label>Layer
      <select data-prop="layer">${LAYERS.map(l => `<option ${obj.layer===l ? "selected" : ""}>${l}</option>`).join("")}</select>
    </label>

    <div class="row2">
      <label>X quadretti <input data-prop-cells="x" type="number" step="0.5" value="${cellsFromPx(obj.x)}"></label>
      <label>Y quadretti <input data-prop-cells="y" type="number" step="0.5" value="${cellsFromPx(obj.y)}"></label>
    </div>

    <div class="row2">
      <label>Larghezza q. <input data-prop-cells="w" type="number" step="0.25" min="0.25" value="${cellsFromPx(obj.w)}"></label>
      <label>Altezza q. <input data-prop-cells="h" type="number" step="0.25" min="0.25" value="${cellsFromPx(obj.h)}"></label>
    </div>

    <label>Rotazione: <b id="rotationValue">${obj.rotation || 0}°</b>
      <input data-prop="rotation" type="range" min="-180" max="180" step="1" value="${obj.rotation || 0}">
    </label>
    <div class="buttonRow">
      <button id="rotateLeftBtn">Ruota -15°</button>
      <button id="rotateRightBtn">Ruota +15°</button>
    </div>

    <label>Opacità: <b id="opacityValue">${Math.round((obj.opacity ?? 1)*100)}%</b>
      <input data-prop="opacity" type="range" min="0" max="1" step="0.05" value="${obj.opacity ?? 1}">
    </label>

    <div class="buttonRow">
      <button id="scaleDownBtn">Scala -</button>
      <button id="scaleUpBtn">Scala +</button>
    </div>
    <div class="buttonRow">
      <button id="fitGridBtn">Aggancia a griglia</button>
      <button id="resetSizeBtn">Misura base</button>
    </div>

    <div class="buttonRow">
      <button id="copyBtn">Copia</button>
      <button id="pasteBtn">Incolla</button>
    </div>

    <div class="buttonRow">
      <button id="duplicateBtn">Duplica</button>
      <button id="deleteBtn" class="danger">Elimina</button>
    </div>

    <div class="buttonRow">
      <button id="bringForwardBtn">Avanti</button>
      <button id="sendBackBtn">Indietro</button>
    </div>

    <label><input data-prop="visibleMaster" type="checkbox" ${obj.visibleMaster ? "checked" : ""}> Visibile Master</label>
    <label><input data-prop="visiblePlayer" type="checkbox" ${obj.visiblePlayer ? "checked" : ""}> Visibile Giocatore</label>
    <label><input data-prop="locked" type="checkbox" ${obj.locked ? "checked" : ""}> Bloccato</label>

    <label>Nota master <textarea data-prop="note" rows="3">${esc(obj.note || "")}</textarea></label>
    <p class="small">Le misure sono in quadretti VTT. Con Magnete ON posizione e movimento si allineano alla griglia.</p>
  `;

  box.querySelectorAll("[data-prop]").forEach(input => input.oninput = input.onchange = () => updateProperty(input));
  box.querySelectorAll("[data-prop-cells]").forEach(input => { input.oninput = () => updateCellProperty(input, false); input.onchange = () => updateCellProperty(input, true); });

  document.getElementById("rotateLeftBtn").onclick = () => rotateSelected(-15);
  document.getElementById("rotateRightBtn").onclick = () => rotateSelected(15);
  document.getElementById("scaleDownBtn").onclick = () => scaleSelected(-0.25);
  document.getElementById("scaleUpBtn").onclick = () => scaleSelected(0.25);
  document.getElementById("fitGridBtn").onclick = fitSelectedToGrid;
  document.getElementById("resetSizeBtn").onclick = resetSelectedSize;
  document.getElementById("copyBtn").onclick = copySelected;
  document.getElementById("pasteBtn").onclick = pasteClipboard;
  document.getElementById("duplicateBtn").onclick = duplicateSelected;
  document.getElementById("deleteBtn").onclick = deleteSelected;
  document.getElementById("bringForwardBtn").onclick = () => changeZ(10);
  document.getElementById("sendBackBtn").onclick = () => changeZ(-10);
  bindRotationButtons();
}


function updateCellProperty(input, finalUpdate = false) {
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) return;
  const key = input.dataset.propCells;
  const numeric = Number(input.value);
  if (!Number.isFinite(numeric)) return;

  const valuePx = numeric * grid();
  obj[key] = project.snap ? snapValue(valuePx) : Math.round(valuePx);
  if (key === "w") obj.cellsW = numeric;
  if (key === "h") obj.cellsH = numeric;

  renderObjects();

  // Evita il fastidioso refresh completo mentre stai digitando.
  // Lo facciamo solo quando l'input viene confermato.
  if (finalUpdate) renderProperties();
}

function updateLiveXY(obj) {
  const x = document.querySelector('[data-prop-cells="x"]');
  const y = document.querySelector('[data-prop-cells="y"]');
  if (x) x.value = cellsFromPx(obj.x);
  if (y) y.value = cellsFromPx(obj.y);
}

function updateProperty(input) {
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) return;
  const key = input.dataset.prop;
  if (input.type === "checkbox") obj[key] = input.checked;
  else if (["rotation","opacity"].includes(key)) obj[key] = Number(input.value);
  else obj[key] = input.value;
  if (key === "layer") obj.z = layerBaseZ(obj.layer);
  renderObjects();
  if (key === "rotation") document.getElementById("rotationValue").textContent = `${obj.rotation || 0}°`;
  if (key === "opacity") document.getElementById("opacityValue").textContent = `${Math.round((obj.opacity ?? 1)*100)}%`;
}



function bindRotationButtons() {
  const candidates = [
    ["rotLeftBtn", -15], ["rotRightBtn", 15],
    ["rotateLeftBtn", -15], ["rotateRightBtn", 15],
    ["btnRotateLeft", -15], ["btnRotateRight", 15]
  ];

  candidates.forEach(([id, deg]) => {
    const b = document.getElementById(id);
    if (b) b.onclick = () => rotateSelected(deg);
  });
}


function rotateSelected(deg) {
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) {
    status("Seleziona un oggetto da ruotare");
    return;
  }

  obj.rot = Number(obj.rot || 0) + Number(deg || 0);
  obj.rot = ((obj.rot % 360) + 360) % 360;

  const el = canvas.querySelector(`.mapObject[data-id="${obj.id}"]`);
  if (el) {
    el.style.transform = `rotate(${obj.rot}deg)`;
    el.style.transformOrigin = "center center";
  } else {
    renderObjects();
  }

  renderProperties();
  publishProject();
  status(`Rotazione: ${obj.rot}°`);
}



function selectedObject() {
  return activeMap().objects.find(o => o.id === selectedId);
}

function scaleSelected(deltaCells) {
  const obj = selectedObject();
  if (!obj) return;

  const currentW = cellsFromPx(obj.w);
  const currentH = cellsFromPx(obj.h);
  const minSize = 0.25;

  const newWCells = Math.max(minSize, roundToStep(currentW + deltaCells, 0.25));
  const newHCells = Math.max(minSize, roundToStep(currentH + deltaCells, 0.25));

  obj.w = pxFromCells(newWCells);
  obj.h = pxFromCells(newHCells);
  obj.cellsW = newWCells;
  obj.cellsH = newHCells;

  fitSelectedToGrid(false);
  renderObjects();
  renderProperties();
  status(`Scala: ${newWCells}×${newHCells} quadretti`);
}

function resetSelectedSize() {
  const obj = selectedObject();
  if (!obj) return;
  const a = assetById(obj.assetId);
  if (!a) return;
  obj.w = pxFromCells(a.cellsW);
  obj.h = pxFromCells(a.cellsH);
  obj.cellsW = a.cellsW;
  obj.cellsH = a.cellsH;
  fitSelectedToGrid(false);
  renderObjects();
  renderProperties();
  status("Misura base ripristinata");
}

function fitSelectedToGrid(refresh = true) {
  const obj = selectedObject();
  if (!obj) return;

  obj.x = snapValue(obj.x);
  obj.y = snapValue(obj.y);

  // In modalità VTT, le dimensioni si agganciano almeno al quarto di quadretto.
  const quarter = grid() / 4;
  obj.w = Math.max(quarter, Math.round(obj.w / quarter) * quarter);
  obj.h = Math.max(quarter, Math.round(obj.h / quarter) * quarter);
  obj.cellsW = cellsFromPx(obj.w);
  obj.cellsH = cellsFromPx(obj.h);

  if (refresh) {
    renderObjects();
    renderProperties();
    status("Oggetto agganciato alla griglia");
  }
}

function roundToStep(value, step) {
  return Math.round(value / step) * step;
}

function nudgeSelected(dx, dy) {
  const obj = selectedObject();
  if (!obj) return;
  obj.x = snapValue(obj.x + dx);
  obj.y = snapValue(obj.y + dy);
  renderObjects();
  renderProperties();
}


function copySelected() {
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) return;
  clipboard = JSON.parse(JSON.stringify(obj));
  status("Oggetto copiato");
}
function pasteClipboard() {
  if (!clipboard) return status("Nessun oggetto copiato");
  const copy = JSON.parse(JSON.stringify(clipboard));
  copy.id = uid();
  copy.name = copy.name + " copia";
  copy.x = snapValue(copy.x + snapStep());
  copy.y = snapValue(copy.y + snapStep());
  copy.z = (copy.z || layerBaseZ(copy.layer)) + 1;
  activeMap().objects.push(copy);
  selectedId = copy.id;
  status("Oggetto incollato");
  render();
}
function duplicateSelected() { copySelected(); pasteClipboard(); }
function deleteSelected() {
  const map = activeMap();
  map.objects = map.objects.filter(o => o.id !== selectedId);
  selectedId = null;
  status("Oggetto eliminato");
  render();
}
function changeZ(delta) {
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) return;
  obj.z = (obj.z || layerBaseZ(obj.layer)) + delta;
  renderObjects();
}



function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function publishProject() {
  if (isPlayerWindow) return;
  try {
    const raw = JSON.stringify(project);
    if (raw === lastSyncedRaw) return;
    lastSyncedRaw = raw;
    localStorage.setItem(STORAGE_KEY, raw);
    if (syncChannel) syncChannel.postMessage({ type:"project", raw });
  } catch (err) {
    console.warn("Sync non riuscito", err);
  }
}

function loadProjectRaw(raw) {
  if (!raw) return false;
  try {
    project = JSON.parse(raw);
    normalizeProject();
    project.mode = isPlayerWindow ? "play" : (project.mode || "editor");
    buildLibrary();
    selectedId = null;
    syncTopControls();
    render();
    applyModeUI();
    return true;
  } catch (err) {
    console.warn("Caricamento progetto non riuscito", err);
    return false;
  }
}

function openPlayerWindow() {
  publishProject();
  const url = window.location.href.split("?")[0] + "?player=1";
  const w = window.open(url, "gildaPlayerScreen");
  if (!w) alert("Il browser ha bloccato la finestra giocatori. Consenti i popup per questa pagina.");
  else status("Schermo giocatori aperto");
}

function setPlayerZoom(value) {
  project.playerFollowEditor = false;
  project.playerZoom = Number(value);
  const map = activeMap();
  const size = playerViewportSizePx();
  map.viewportX = clamp(map.viewportX || 0, 0, Math.max(0, map.width - size.w));
  map.viewportY = clamp(map.viewportY || 0, 0, Math.max(0, map.height - size.h));
  updateViewportLayer();
  updateMapInfo();
  publishProject();
}

function startViewportDrag(e) {
  if (project.mode !== "editor" || isPlayerWindow) return;
  e.preventDefault();
  e.stopPropagation();

  project.playerFollowEditor = false;
  const map = activeMap();
  viewportDragState = {
    startX:e.clientX,
    startY:e.clientY,
    origX:map.viewportX || 0,
    origY:map.viewportY || 0
  };
  viewportLayer.classList.add("dragging");
}

function moveViewportDrag(e) {
  if (!viewportDragState) return;
  e.preventDefault();

  const map = activeMap();
  const s = zoomScale();
  const size = playerViewportSizePx();
  const dx = (e.clientX - viewportDragState.startX) / s;
  const dy = (e.clientY - viewportDragState.startY) / s;

  map.viewportX = clamp(snapValue(viewportDragState.origX + dx), 0, Math.max(0, map.width - size.w));
  map.viewportY = clamp(snapValue(viewportDragState.origY + dy), 0, Math.max(0, map.height - size.h));
  updateViewportLayer();
  updatePlayerViewLayer();
  publishProject();
}

function endViewportDrag() {
  if (!viewportDragState) return;
  viewportDragState = null;
  viewportLayer.classList.remove("dragging");
}


function setZoomPercent(newPercent, anchorClientX = null, anchorClientY = null) {
  const zoomInput = document.getElementById("zoom");
  const oldScale = zoomScale();

  const min = Number(zoomInput.min);
  const max = Number(zoomInput.max);
  const clamped = Math.max(min, Math.min(max, newPercent));

  let mapX = null;
  let mapY = null;
  let wrapRect = null;

  if (anchorClientX !== null && anchorClientY !== null) {
    wrapRect = canvasWrap.getBoundingClientRect();
    mapX = (canvasWrap.scrollLeft + (anchorClientX - wrapRect.left)) / oldScale;
    mapY = (canvasWrap.scrollTop + (anchorClientY - wrapRect.top)) / oldScale;
  }

  zoomInput.value = clamped;
  applyZoom();

  if (mapX !== null && mapY !== null) {
    const newScale = zoomScale();
    canvasWrap.scrollLeft = mapX * newScale - (anchorClientX - wrapRect.left);
    canvasWrap.scrollTop = mapY * newScale - (anchorClientY - wrapRect.top);
  }
  updatePlayerViewFromEditor(true);
}

function handleWheelZoom(e) {
  // Alt/Option + rotellina = scala oggetto selezionato
  if (e.altKey) {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    scaleSelected(direction * 0.25);
    return;
  }

  // Ctrl/Cmd + rotellina = zoom canvas
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();

  const current = Number(document.getElementById("zoom").value);
  const direction = e.deltaY > 0 ? -1 : 1;
  const step = current < 50 ? 5 : 10;
  setZoomPercent(current + direction * step, e.clientX, e.clientY);
}

function startPan(e) {
  if (!e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  panState = {
    startX: e.clientX,
    startY: e.clientY,
    scrollLeft: canvasWrap.scrollLeft,
    scrollTop: canvasWrap.scrollTop
  };
  canvasWrap.classList.add("panning");
}

function movePan(e) {
  if (!panState) return;
  e.preventDefault();
  canvasWrap.scrollLeft = panState.scrollLeft - (e.clientX - panState.startX);
  canvasWrap.scrollTop = panState.scrollTop - (e.clientY - panState.startY);
}

function endPan() {
  if (!panState) return;
  panState = null;
  canvasWrap.classList.remove("panning");
}


document.addEventListener("keydown", e => {
  if (e.key === "Escape" && selectedAssetId) {
    e.preventDefault();
    clearAssetBrush();
    status("Pennello annullato");
    return;
  }

  if (e.key === "Escape" && project.mode === "play") {
    e.preventDefault();
    enterEditorMode();
    return;
  }

  const tag = document.activeElement?.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === "c") { e.preventDefault(); copySelected(); }
  if (mod && e.key.toLowerCase() === "v") { e.preventDefault(); pasteClipboard(); }
  if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
  if (e.key.toLowerCase() === "q") { e.preventDefault(); rotateSelected(-15); }
  if (e.key.toLowerCase() === "e") { e.preventDefault(); rotateSelected(15); }
  if (e.key === "+" || e.key === "=") { e.preventDefault(); scaleSelected(0.25); }
  if (e.key === "-" || e.key === "_") { e.preventDefault(); scaleSelected(-0.25); }

  const step = snapStep();
  if (e.key === "ArrowLeft") { e.preventDefault(); nudgeSelected(-step, 0); }
  if (e.key === "ArrowRight") { e.preventDefault(); nudgeSelected(step, 0); }
  if (e.key === "ArrowUp") { e.preventDefault(); nudgeSelected(0, -step); }
  if (e.key === "ArrowDown") { e.preventDefault(); nudgeSelected(0, step); }
});



function selectAssetBrush(assetId) {
  selectedAssetId = assetId;
  const asset = assetById(assetId);
  selectedId = null;
  updateBrushStatus();
  buildLibrary();
  renderObjects();
  if (asset) status(`Pennello attivo: ${asset.name} — clicca su uno spazio vuoto per piazzarlo`);
}

function clearAssetBrush() {
  selectedAssetId = null;
  updateBrushStatus();
  buildLibrary();
  canvas.classList.remove("brushMode");
  hideBrushPreview();
}

function updateBrushStatus() {
  const box = document.getElementById("brushStatus");
  const asset = selectedAssetId ? assetById(selectedAssetId) : null;
  canvas.classList.toggle("brushMode", !!asset);

  if (!box) return;
  if (!asset) {
    box.classList.remove("active");
    box.textContent = "Pennello: nessun asset selezionato";
    return;
  }

  box.classList.add("active");
  box.innerHTML = `<b>Pennello attivo:</b><br>${asset.name}<br>${asset.cellsW}×${asset.cellsH} quadretti<br><small>Click su spazio vuoto per piazzare. Punto rosso = aggancio alto/sinistra. Esc annulla.</small>`;
}

function canvasPointFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const s = zoomScale();
  const x = (e.clientX - rect.left) / s;
  const y = (e.clientY - rect.top) / s;
  return {
    x: Math.max(0, Math.min(activeMap().width, x)),
    y: Math.max(0, Math.min(activeMap().height, y))
  };
}


function placementPointFromCanvasPoint(point) {
  const step = snapStep();
  return {
    x: project.snap ? Math.floor(point.x / step) * step : Math.round(point.x),
    y: project.snap ? Math.floor(point.y / step) * step : Math.round(point.y)
  };
}

function updateBrushPreview(e) {
  if (!brushPreview || isPlayerWindow || project.mode !== "editor" || !selectedAssetId) {
    hideBrushPreview();
    return;
  }

  const asset = assetById(selectedAssetId);
  if (!asset) {
    hideBrushPreview();
    return;
  }

  const p = canvasPointFromEvent(e);
  const pos = placementPointFromCanvasPoint(p);

  brushPreviewImg.src = asset.src;
  brushPreview.style.left = pos.x + "px";
  brushPreview.style.top = pos.y + "px";
  brushPreview.style.width = pxFromCells(asset.cellsW) + "px";
  brushPreview.style.height = pxFromCells(asset.cellsH) + "px";
  brushPreview.classList.add("visible");
}

function hideBrushPreview() {
  if (brushPreview) brushPreview.classList.remove("visible");
}



function addAssetAtPoint(assetId, point) {
  const asset = assetById(assetId);
  if (!asset) return;

  const pos = placementPointFromCanvasPoint(point);

  const obj = {
    id:uid(),
    assetId:asset.id,
    x:pos.x,
    y:pos.y,
    w:pxFromCells(asset.cellsW),
    h:pxFromCells(asset.cellsH),
    cellsW:asset.cellsW,
    cellsH:asset.cellsH,
    rot:0,
    opacity:1,
    layer:"player",
    visiblePlayer:true,
    name:asset.name,
    z:0
  };

  activeMap().objects.push(obj);
  selectedId = obj.id;
  renderObjects();
  renderProperties();
  updatePlayerViewFromEditor(true);
  publishProject();
  status(`Piazzato: ${asset.name} — aggancio in alto a sinistra`);
}

function handleCanvasClick(e) {
  if (isPlayerWindow || project.mode !== "editor") return;

  if (e.target.closest && e.target.closest(".mapObject")) return;
  if (e.target.closest && e.target.closest("#viewportHandle")) return;

  if (selectedAssetId) {
    e.preventDefault();
    e.stopPropagation();
    const p = canvasPointFromEvent(e);
    addAssetAtPoint(selectedAssetId, p);
    return;
  }

  selectedId = null;
  renderObjects();
  renderProperties();
}

function importPngAsset(file) {
  if (!file || file.type !== "image/png") {
    alert("Seleziona un file PNG.");
    return;
  }

  const defaultName = file.name.replace(/\.png$/i, "");
  const name = prompt("Nome asset:", defaultName) || defaultName;
  const w = Number(prompt("Larghezza iniziale in quadretti:", "2"));
  const h = Number(prompt("Altezza iniziale in quadretti:", "2"));

  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    alert("Dimensioni non valide.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    project.customAssets = project.customAssets || [];
  project.ui = project.ui || { leftCollapsed:false, rightCollapsed:false, assetCollapsed:{} };
  project.ui.assetCollapsed = project.ui.assetCollapsed || {};
    project.customAssets.push({
      id:"custom_" + uid(),
      name,
      cat:"Importati",
      src:reader.result,
      cellsW:w,
      cellsH:h,
      custom:true
    });
    selectedAssetId = project.customAssets[project.customAssets.length - 1].id;
    buildLibrary();
    updateBrushStatus();
    publishProject();
    status("Asset PNG importato e selezionato come pennello: " + name);
  };
  reader.readAsDataURL(file);
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  status("Salvato nel browser");
}
function loadLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { alert("Nessun salvataggio locale trovato."); return; }
  project = JSON.parse(raw);
  normalizeProject();
  selectedId = null;
  buildLibrary();
  updateBrushStatus();
  syncTopControls();
  render();
  status("Caricato dal browser");
}
function exportJson() {
  const blob = new Blob([JSON.stringify(project, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = project.name.replaceAll(" ", "_") + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    project = JSON.parse(reader.result);
    normalizeProject();
    selectedId = null;
    buildLibrary();
    updateBrushStatus();
    syncTopControls();
    render();
    status("JSON importato");
  };
  reader.readAsText(file);
}

function setGridSize(value) {
  const map = activeMap();
  const old = grid();
  const neu = Number(value);
  const factor = neu / old;
  project.gridSize = neu;

  map.objects.forEach(o => {
    o.x = Math.round(o.x * factor);
    o.y = Math.round(o.y * factor);
    o.w = Math.round(o.w * factor);
    o.h = Math.round(o.h * factor);
  });

  map.viewportX = Math.round((map.viewportX || 0) * factor);
  map.viewportY = Math.round((map.viewportY || 0) * factor);
  map.width = Math.round((map.squaresW || map.width / old) * neu);
  map.height = Math.round((map.squaresH || map.height / old) * neu);

  render();
}

function zoomScale() { return Number(document.getElementById("zoom").value) / 100; }
function applyZoom() {
  if (project.mode === "play" || isPlayerWindow) {
    updateStageSize();
    updateGridLineWeight();
    updateViewportLayer();
    return;
  }

  const s = zoomScale();
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.transform = `scale(${s})`;
  updateStageSize();
  updateGridLineWeight();
  updateViewportLayer();
  document.getElementById("zoomText").textContent = Math.round(s*100) + "%";
  updatePlayerViewFromEditor(true);
}
function syncTopControls() {
  document.getElementById("mapPreset").value = project.mapPreset || "medium_dungeon";
  document.getElementById("mapSquaresW").value = activeMap().squaresW || Math.round(activeMap().width / grid());
  document.getElementById("mapSquaresH").value = activeMap().squaresH || Math.round(activeMap().height / grid());
  document.getElementById("gridSize").value = String(project.gridSize || 120);
  document.getElementById("btnSnap").classList.toggle("active", project.snap);
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

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}

document.getElementById("btnNewMap").onclick = () => {
  const name = prompt("Nome nuova mappa:", "Nuova mappa");
  if (!name) return;
  const preset = MAP_PRESETS[project.mapPreset || "medium_dungeon"];
  const m = {
    id:uid(),
    name,
    squaresW:preset.squaresW,
    squaresH:preset.squaresH,
    width:Math.round(preset.squaresW * grid()),
    height:Math.round(preset.squaresH * grid()),
    viewportX:0,
    viewportY:0,
    views:[],
    objects:[]
  };
  project.maps.push(m);
  project.activeMapId = m.id;
  selectedId = null;
  render();
};
document.getElementById("btnSaveLocal").onclick = saveLocal;
document.getElementById("btnLoadLocal").onclick = loadLocal;
document.getElementById("btnExportJson").onclick = exportJson;
document.getElementById("inputImportJson").onchange = e => { const file = e.target.files[0]; if (file) importJson(file); };
document.getElementById("inputAssetPng").onchange = e => { const file = e.target.files[0]; if (file) importPngAsset(file); e.target.value = ""; };
document.getElementById("btnGrid").onclick = () => { project.showGrid = !project.showGrid; render(); };
document.getElementById("btnSnap").onclick = () => { project.snap = !project.snap; render(); };
document.getElementById("snapDivisor").onchange = e => { project.snapDivisor = Number(e.target.value); render(); };
document.getElementById("mapPreset").onchange = e => setMapPreset(e.target.value);
document.getElementById("gridSize").onchange = e => setGridSize(e.target.value);
document.getElementById("btnApplyMapSize").onclick = () => {
  project.mapPreset = "custom";
  applyMapSizeFromSquares(Number(document.getElementById("mapSquaresW").value), Number(document.getElementById("mapSquaresH").value));
};
document.getElementById("btnViewport").onclick = () => {
  project.showViewport = !project.showViewport;
  document.getElementById("btnViewport").classList.toggle("active", project.showViewport);
  document.getElementById("btnViewport").textContent = project.showViewport ? "Area TV ON" : "Area TV OFF";
  updateViewportLayer();
};
document.getElementById("btnFollowEditor").onclick = () => { project.playerFollowEditor = project.playerFollowEditor === false; syncTopControls(); updatePlayerViewFromEditor(true); updatePlayerViewLayer(); publishProject(); };
document.getElementById("btnSetViewportFromView").onclick = setViewportFromCurrentView;
document.getElementById("btnGoViewport").onclick = goToViewport;
document.getElementById("btnFitMap").onclick = fitWholeMap;
document.getElementById("btnSaveView").onclick = saveCurrentView;
document.getElementById("btnToggleLeft").onclick = toggleLeftColumn;
document.getElementById("btnToggleRight").onclick = toggleRightColumn;
document.getElementById("btnEditor").onclick = enterEditorMode;
document.getElementById("btnPlay").onclick = enterPlayMode;
document.getElementById("btnOpenPlayer").onclick = openPlayerWindow;
document.getElementById("btnOpenPlayerSide").onclick = openPlayerWindow;
document.getElementById("btnExitPlay").onclick = enterEditorMode;
document.getElementById("zoom").oninput = applyZoom;
document.getElementById("playerZoom").oninput = e => setPlayerZoom(e.target.value);


canvasWrap.addEventListener("wheel", handleWheelZoom, { passive:false });
canvasWrap.addEventListener("mousedown", startPan);
canvasWrap.addEventListener("scroll", () => { updatePlayerViewFromEditor(true); hideBrushPreview(); });
document.addEventListener("mousemove", movePan);
document.addEventListener("mousemove", moveViewportDrag);
document.addEventListener("mouseup", endPan);
document.addEventListener("mouseup", endViewportDrag);
document.addEventListener("mouseleave", endPan);
document.addEventListener("mouseleave", endViewportDrag);
viewportHandle.addEventListener("mousedown", startViewportDrag);


function handleGlobalRotateKeys(e) {
  const tag = document.activeElement?.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;
  if (e.key.toLowerCase() === "q") { e.preventDefault(); rotateSelected(-15); }
  if (e.key.toLowerCase() === "e") { e.preventDefault(); rotateSelected(15); }
}
document.addEventListener("keydown", handleGlobalRotateKeys, true);


window.addEventListener("resize", () => { applyZoom(); updatePlayerViewFromEditor(true); });


if (syncChannel) {
  syncChannel.onmessage = ev => {
    if (!isPlayerWindow) return;
    if (ev.data?.type === "project") loadProjectRaw(ev.data.raw);
  };
}

window.addEventListener("storage", ev => {
  if (!isPlayerWindow) return;
  if (ev.key === STORAGE_KEY && ev.newValue) loadProjectRaw(ev.newValue);
});

if (isPlayerWindow) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { project = JSON.parse(raw); } catch (e) {}
  }
  project.mode = "play";
  setInterval(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && raw !== lastSyncedRaw) {
      lastSyncedRaw = raw;
      loadProjectRaw(raw);
    }
  }, 600);
}


buildLibrary();
buildLayerControls();
syncTopControls();
applyZoom();
render();
applyModeUI();
applyColumnUI();
updatePlayerViewFromEditor(true);
