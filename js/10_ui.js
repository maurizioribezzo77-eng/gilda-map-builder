// ===== 10_ui.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 10_ui.js
// Interfaccia: albero mappe, layer, libreria asset, normalizzazione progetto, render generale, colonne laterali, modalità editor/gioco.

const TREE_ELEMENT_GROUPS = [
  { type:"room", label:"Stanze" },
  { type:"corridor", label:"Corridoi" },
  { type:"door", label:"Porte" },
  { type:"stair", label:"Scale" },
  { type:"pin", label:"Pin" },
  { type:"token", label:"Token" },
  { type:"tile", label:"Tile" },
  { type:"sketchStroke", label:"Sketch" }
];

function buildTree() {
  const tree = document.getElementById("projectTree");
  tree.innerHTML = "";
  const map = activeMap();
  const root = node("▾ Progetto: " + (project.name || "Senza nome"), "treeProject");
  tree.appendChild(root);

  const mapNode = node("▾ Mappa attiva: " + (map?.name || "Nessuna mappa"), "child treeMap activeMap");
  mapNode.onclick = () => {
    clearSelection();
    renderObjects();
    renderProperties();
    buildTree();
  };
  tree.appendChild(mapNode);

  if (!map) return;

  const entries = treeSelectableEntries(map);
  TREE_ELEMENT_GROUPS.forEach(group => {
    const groupEntries = entries.filter(entry => entry.type === group.type);
    const folder = node(`▾ ${group.label} (${groupEntries.length})`, "child treeFolder");
    tree.appendChild(folder);

    groupEntries.forEach(entry => {
      const el = node("↳ " + entry.name, "child treeElement" + (entry.id === selectedId ? " selectedTreeNode" : ""));
      el.title = `${entry.id} · ${entry.geometryKind}`;
      el.onclick = e => {
        e.stopPropagation();
        setSingleSelection(entry.id);
        renderObjects();
        renderProperties();
        buildTree();
      };
      tree.appendChild(el);
    });
  });
}
function node(text, cls="") {
  const el = document.createElement("div");
  el.className = "node " + cls;
  el.textContent = text;
  return el;
}

function treeSelectableEntries(map = activeMap()) {
  if (!map) return [];
  const entries = [];

  (map.elements || []).forEach(element => {
    normalizeElementFields(element);
    entries.push({
      source:"element",
      id:element.id,
      type:element.type,
      name:element.name || element.id,
      geometryKind:element.geometry?.kind || "unknown",
      element
    });
  });

  (map.objects || []).forEach(obj => {
    normalizeObjectElementFields(obj);
    entries.push({
      source:"object",
      id:obj.id,
      type:objectElementType(obj),
      name:obj.name || obj.id,
      geometryKind:"rect",
      element:obj
    });
  });

  return entries;
}

function normalizeElementFields(element) {
  if (!element) return;
  if (!element.name) element.name = element.id || "Elemento";
  if (typeof element.notesMaster !== "string") element.notesMaster = element.note || "";
  if (typeof element.notesPlayer !== "string") element.notesPlayer = "";
  if (typeof element.visibleToPlayers !== "boolean") element.visibleToPlayers = true;
  if (!("linkedMapId" in element)) element.linkedMapId = null;
  if (!("layerId" in element)) element.layerId = "";
}

function normalizeObjectElementFields(obj) {
  if (!obj) return;
  if (!obj.name) obj.name = obj.id || "Oggetto";
  if (typeof obj.notesMaster !== "string") obj.notesMaster = obj.note || "";
  if (typeof obj.notesPlayer !== "string") obj.notesPlayer = "";
  if (typeof obj.visibleToPlayers !== "boolean") obj.visibleToPlayers = obj.visiblePlayer !== false;
  if (!("linkedMapId" in obj)) obj.linkedMapId = null;
  if (!obj.layerId) obj.layerId = objectLayerId(obj);
  obj.note = obj.notesMaster;
  obj.visiblePlayer = obj.visibleToPlayers;
  obj.layer = migrateLayer(obj.layerId || obj.layer, assetById(obj.assetId));
  obj.layerId = obj.layer;
}

function objectElementType(obj) {
  const asset = assetById(obj?.assetId);
  if (!asset) return "tile";
  if (asset.cat === "Porte") return "door";
  if (asset.cat === "Scale e botole") return "stair";
  if (asset.cat === "Token") return "token";
  if (asset.cat === "Icone") return "pin";
  if (asset.cat === "Muri") return "corridor";
  return "tile";
}

function selectedTreeEntry() {
  return treeSelectableEntries(activeMap()).find(entry => entry.id === selectedId) || null;
}


function defaultLayerConfig(id) {
  return DEFAULT_LAYER_DEFS.find(l => l.id === id) || DEFAULT_LAYER_DEFS[0];
}

function ensureLayers() {
  project.layers = project.layers || {};
  DEFAULT_LAYER_DEFS.forEach(def => {
    if (!project.layers[def.id]) project.layers[def.id] = {...def};
    project.layers[def.id].id = def.id;
    project.layers[def.id].name = project.layers[def.id].name || def.name;
    if (typeof project.layers[def.id].visibleMaster !== "boolean") project.layers[def.id].visibleMaster = def.visibleMaster;
    if (typeof project.layers[def.id].visiblePlayer !== "boolean") project.layers[def.id].visiblePlayer = def.visiblePlayer;
    if (typeof project.layers[def.id].locked !== "boolean") project.layers[def.id].locked = def.locked;
  });
}

function layerState(id) {
  ensureLayers();
  return project.layers[id] || defaultLayerConfig(id);
}

function layerName(id) {
  return layerState(id).name || id;
}

function layerOptionsHtml(selected) {
  return LAYERS.map(id => `<option value="${id}" ${selected===id ? "selected" : ""}>${layerName(id)}</option>`).join("");
}

function assetDefaultLayer(asset) {
  if (!asset) return "arredi";
  if (asset.defaultLayer && LAYERS.includes(asset.defaultLayer)) return asset.defaultLayer;
  return defaultLayer(asset.cat);
}

function migrateLayer(layer, asset) {
  const map = {
    "Base":"pavimenti",
    "Architettura":"architettura",
    "Oggetti":"arredi",
    "Overlay":"effetti",
    "Master":"note_master",
    "Player":"token",
    "base":"pavimenti",
    "architettura":"architettura",
    "oggetti":"arredi",
    "overlay":"effetti",
    "master":"note_master",
    "player":"token"
  };
  if (LAYERS.includes(layer)) return layer;
  if (map[layer]) {
    if (layer === "Player" || layer === "player") return assetDefaultLayer(asset);
    return map[layer];
  }
  return assetDefaultLayer(asset);
}

function objectLayerId(obj) {
  const asset = assetById(obj.assetId);
  if (!obj.layer || !LAYERS.includes(obj.layer)) obj.layer = migrateLayer(obj.layer, asset);
  return obj.layer;
}

function objectLayerLocked(obj) {
  return !!layerState(objectLayerId(obj)).locked;
}

function objectVisibleForMaster(obj) {
  return obj.visibleMaster !== false && layerState(objectLayerId(obj)).visibleMaster !== false;
}

function objectVisibleForPlayer(obj) {
  return obj.visiblePlayer !== false && layerState(objectLayerId(obj)).visiblePlayer !== false;
}

function setLayerVisibleMaster(id) {
  const l = layerState(id);
  l.visibleMaster = !l.visibleMaster;
  project.layers[id] = l;
  buildLayerControls();
  renderSketchLayer();
  renderGeometryElements();
  renderObjects();
  publishProject();
}

function setLayerVisiblePlayer(id) {
  const l = layerState(id);
  l.visiblePlayer = !l.visiblePlayer;
  project.layers[id] = l;
  buildLayerControls();
  renderSketchLayer();
  renderGeometryElements();
  renderObjects();
  publishProject();
}

function toggleLayerLocked(id) {
  const l = layerState(id);
  l.locked = !l.locked;
  project.layers[id] = l;
  buildLayerControls();
  renderSketchLayer();
  renderGeometryElements();
  renderObjects();
  publishProject();
}

function buildLayerControls() {
  ensureLayers();
  const box = document.getElementById("layerControls");
  if (!box) return;
  box.innerHTML = "";

  LAYERS.forEach(id => {
    const l = layerState(id);
    const row = document.createElement("div");
    row.className = "layerRow" + (l.visibleMaster ? "" : " hiddenMaster") + (l.locked ? " locked" : "");

    row.innerHTML = `
      <div class="layerName" title="${l.name}">${l.name}</div>
      <button class="layerBtn ${l.visibleMaster ? "active" : ""}" title="Visibile al master">M</button>
      <button class="layerBtn ${l.visiblePlayer ? "active" : "playerOff"}" title="Visibile ai giocatori">P</button>
      <button class="layerBtn ${l.locked ? "active" : ""}" title="Blocca/sblocca editing">${l.locked ? "🔒" : "🔓"}</button>
    `;

    const buttons = row.querySelectorAll("button");
    buttons[0].onclick = () => setLayerVisibleMaster(id);
    buttons[1].onclick = () => setLayerVisiblePlayer(id);
    buttons[2].onclick = () => toggleLayerLocked(id);

    box.appendChild(row);
  });

  const note = document.createElement("div");
  note.className = "layerHint";
  note.textContent = "Gli asset ereditano il layer predefinito, ma ogni oggetto può cambiarlo dalle proprietà.";
  box.appendChild(note);
}

function visibleLayers() {
  ensureLayers();
  return LAYERS.filter(id => layerState(id).visibleMaster);
}


function buildLibrary() {
  const lib = document.getElementById("assetLibrary");
  lib.innerHTML = "";
  project.ui = project.ui || { assetCollapsed:{} };
  project.ui.assetCollapsed = project.ui.assetCollapsed || {};

  const assets = allAssets().filter(a => a.cat !== "Muri");
  const cats = [...new Set(assets.map(a => libraryCategoryForAsset(a)))];

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

    assets.filter(a => libraryCategoryForAsset(a) === cat).forEach(a => {
      const tile = document.createElement("div");
      tile.className = "assetTile" + (selectedAssetId === a.id ? " brushSelected" : "");
      tile.draggable = true;
      tile.dataset.assetId = a.id;
      tile.ondragstart = e => e.dataTransfer.setData("text/plain", a.id);

      // Click semplice: mostra nello status le dimensioni di partenza.
      // Il comportamento principale resta drag & drop, quindi le proprietà degli oggetti piazzati restano a destra come prima.
      tile.onclick = () => selectAssetBrush(a.id);

      tile.innerHTML = `<img src="${a.src}" alt=""><span>${a.name}</span><span class="size">${a.cellsW}×${a.cellsH} q. · ${layerName(assetDefaultLayer(a))}</span>${a.tilesetName ? `<span class="tilesetName">${a.tilesetName}</span>` : ""}`;
      gridBox.appendChild(tile);
    });

    sec.appendChild(gridBox);
    lib.appendChild(sec);
  });
}

function libraryCategoryForAsset(asset) {
  if (!asset) return "Oggetti Decorativi";
  if (asset.cat === "Porte" || asset.cat === "Scale e botole") return "Oggetti Interattivi";
  if (asset.cat === "Token") return "Token";
  if (asset.cat === "Overlay" || asset.cat === "Icone") return "Overlay / Effetti";
  return "Oggetti Decorativi";
}


function normalizeProject() {
  project.customAssets = project.customAssets || [];
  project.ui = project.ui || { leftCollapsed:false, rightCollapsed:false, assetCollapsed:{} };
  project.ui.assetCollapsed = project.ui.assetCollapsed || {};
  project.ui.rightCollapsed = false;
  project.playerFollowEditor = project.playerFollowEditor !== false;
  project.playerZoom = project.playerZoom || 100;
  ensureLayers();

  (project.customAssets || []).forEach(a => {
    if (!a.defaultLayer || !LAYERS.includes(a.defaultLayer)) a.defaultLayer = "arredi";
  });

  project.maps.forEach(m => {
    m.elements = m.elements || [];
    m.treeNodes = m.treeNodes || [];
    m.squaresW = m.squaresW || Math.round(m.width / grid());
    m.squaresH = m.squaresH || Math.round(m.height / grid());
    m.viewportX = m.viewportX || 0;
    m.viewportY = m.viewportY || 0;
    m.views = m.views || [];
    m.groups = m.groups || {};
    m.elements = Array.isArray(m.elements) ? m.elements : [];
    if (m.id === "blank_dungeon" && !m.elements.length && !(m.objects || []).length) {
      m.elements = createDemoElements();
    }
    m.elements.forEach(normalizeElement);
    m.layers = Array.isArray(m.layers) ? m.layers : [];
    ensureSketchMapLayer(m);
    ensureSmartLayers(m);

    (m.objects || []).forEach(obj => {
      const asset = assetById(obj.assetId);
      obj.layer = migrateLayer(obj.layer, asset);
      obj.layerId = obj.layer;
      if (typeof obj.visibleMaster !== "boolean") obj.visibleMaster = true;
      if (typeof obj.visiblePlayer !== "boolean") obj.visiblePlayer = true;
      normalizeObjectElementFields(obj);
      if (typeof obj.opacity !== "number") obj.opacity = 1;
      obj.z = layerBaseZ(obj.layer) + (obj.z || 0) % 100;
    });

    (m.elements || []).forEach(normalizeElementFields);

    rebuildGroupMeta(m);
    if (!m.playerView) {
      m.playerView = { x:m.viewportX || 0, y:m.viewportY || 0, w:Math.round(TV_VIEWPORT.squaresW * grid()), h:Math.round(TV_VIEWPORT.squaresH * grid()) };
    }
  });
}

function render() {
  normalizeProject();
  buildTree();
  buildLayerControls();
  applyCanvasSettings();
  renderSmartLayers();
  renderSketchLayer();
  renderGeometryElements();
  renderObjects();
  renderProperties();
  updateMapInfo();
  renderSavedViews();
  publishProject();
}



function applyColumnUI() {
  project.ui = project.ui || {};
  project.ui.rightCollapsed = false;
  document.body.classList.toggle("leftCollapsed", !!project.ui.leftCollapsed);
  document.body.classList.remove("rightCollapsed");

  const l = document.getElementById("btnToggleLeft");
  const r = document.getElementById("btnToggleRight");
  if (l) {
    l.textContent = project.ui.leftCollapsed ? "Mostra sinistra" : "Nascondi sinistra";
    l.classList.toggle("active", project.ui.leftCollapsed);
  }
  if (r) {
    r.textContent = "Destra fissa";
    r.classList.remove("active");
    r.disabled = true;
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
  project.ui.rightCollapsed = false;
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
