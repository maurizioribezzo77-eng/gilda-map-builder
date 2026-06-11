// ===== 30_objects_properties.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 30_objects_properties.js
// Oggetti piazzati, drag, proprietà, scala, rotazione, copia/incolla, z-order ed eliminazione.


function getSelectionIds() {
  if (Array.isArray(selectedIds) && selectedIds.length) return selectedIds.slice();
  return selectedId ? [selectedId] : [];
}

function selectedObjects() {
  const ids = new Set(getSelectionIds());
  return activeMap().objects.filter(o => ids.has(o.id));
}

function selectedElements() {
  const ids = new Set(getSelectionIds());
  return (activeMap().elements || []).filter(element => ids.has(element.id));
}

function groupMembers(groupId) {
  if (!groupId) return [];
  return activeMap().objects.filter(o => o.groupId === groupId);
}

function rebuildGroupMeta(map = activeMap()) {
  map.groups = map.groups || {};
  const ids = [...new Set(map.objects.map(o => o.groupId).filter(Boolean))];

  ids.forEach(groupId => {
    if (!map.groups[groupId]) {
      const members = map.objects.filter(o => o.groupId === groupId);
      const b = getBoundsForObjects(members);
      map.groups[groupId] = { id:groupId, x:b.x, y:b.y, w:b.w, h:b.h, rot:0 };
    }
    refreshGroupMetaFromMembers(groupId, false);
  });

  Object.keys(map.groups).forEach(gid => {
    if (!ids.includes(gid)) delete map.groups[gid];
  });
}

function getBoundsForObjects(objs) {
  if (!objs || !objs.length) return { x:0, y:0, w:0, h:0, cx:0, cy:0 };
  const minX = Math.min(...objs.map(o => o.x));
  const minY = Math.min(...objs.map(o => o.y));
  const maxX = Math.max(...objs.map(o => o.x + o.w));
  const maxY = Math.max(...objs.map(o => o.y + o.h));
  return { x:minX, y:minY, w:maxX-minX, h:maxY-minY, cx:minX+(maxX-minX)/2, cy:minY+(maxY-minY)/2 };
}

function refreshGroupMetaFromMembers(groupId, keepRotation = true) {
  const map = activeMap();
  const members = groupMembers(groupId);
  if (!members.length) return null;
  const oldRot = map.groups?.[groupId]?.rot || 0;
  const b = getBoundsForObjects(members);
  map.groups = map.groups || {};
  map.groups[groupId] = {
    id:groupId,
    x:b.x,
    y:b.y,
    w:b.w,
    h:b.h,
    rot: keepRotation ? oldRot : (map.groups[groupId]?.rot || 0)
  };
  return map.groups[groupId];
}

function selectedGroups() {
  const gids = [...new Set(selectedObjects().map(o => o.groupId).filter(Boolean))];
  return gids.map(gid => activeMap().groups?.[gid]).filter(Boolean);
}

function renderGroupProxies() {
  canvas.querySelectorAll(".groupProxy").forEach(n => n.remove());
  if (project.mode === "play" || isPlayerWindow) return;

  const map = activeMap();
  map.groups = map.groups || {};
  const selected = new Set(getSelectionIds());

  Object.values(map.groups).forEach(g => {
    const members = groupMembers(g.id);
    if (!members.length) return;

    const visibleMembers = members.filter(o => objectVisibleForMaster(o));
    if (!visibleMembers.length) return;
    const isSelectedGroup = members.some(o => selected.has(o.id));
    const groupLocked = members.some(o => o.locked || objectLayerLocked(o));
    const proxy = document.createElement("div");
    proxy.className = "groupProxy" + (isSelectedGroup ? " selected" : "") + (groupLocked ? " layerLocked" : "");
    proxy.dataset.groupId = g.id;

    proxy.style.left = g.x + "px";
    proxy.style.top = g.y + "px";
    proxy.style.width = g.w + "px";
    proxy.style.height = g.h + "px";
    proxy.style.transform = `rotate(${g.rot || 0}deg)`;
    proxy.style.transformOrigin = "center center";

    proxy.onmousedown = e => startGroupDrag(e, g.id);
    proxy.onclick = e => e.stopPropagation();

    canvas.appendChild(proxy);
  });
}

function startGroupDrag(e, groupId) {
  if (project.mode !== "editor") return;
  const members = groupMembers(groupId);
  if (!members.length) return;
  if (members.some(o => o.locked || objectLayerLocked(o))) { status('Gruppo o layer bloccato'); return; }

  if (e.shiftKey || e.ctrlKey || e.metaKey) {
    members.forEach(o => toggleObjectSelection(o.id));
    renderObjects();
    renderProperties();
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  selectedIds = members.map(o => o.id);
  selectedId = selectedIds[selectedIds.length - 1];

  const origins = members
    .filter(o => !o.locked && !objectLayerLocked(o))
    .map(o => ({ id:o.id, x:o.x, y:o.y }));

  const group = activeMap().groups[groupId];
  dragState = { ids:selectedIds.slice(), groupId, startX:e.clientX, startY:e.clientY, origins, groupOrigin:{ x:group.x, y:group.y } };

  renderObjects();
  renderProperties();
  e.preventDefault();
  e.stopPropagation();
}

function rotateGroupAsSingleObject(groupId, deg) {
  const map = activeMap();
  const group = map.groups?.[groupId];
  if (!group) return;

  group.rot = normalizeRotation(Number(group.rot || 0) + Number(deg || 0));

  renderObjects();
  renderProperties();
  publishProject();
  status(`Gruppo ruotato come oggetto unico: ${group.rot}°`);
}

function scaleGroupAsSingleObject(groupId, deltaCells) {
  const map = activeMap();
  const group = map.groups?.[groupId];
  if (!group) return;

  const factor = deltaCells > 0 ? 1.1 : 0.9;
  const cx = group.x + group.w / 2;
  const cy = group.y + group.h / 2;

  group.w = Math.max(grid()/2, group.w * factor);
  group.h = Math.max(grid()/2, group.h * factor);
  group.x = snapValue(cx - group.w / 2);
  group.y = snapValue(cy - group.h / 2);

  renderObjects();
  renderProperties();
  publishProject();
  status("Gruppo scalato come oggetto unico");
}


function objectById(id) {
  return activeMap().objects.find(o => o.id === id);
}

function groupIdOfSelection() {
  const objs = selectedObjects();
  if (!objs.length) return null;
  const ids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];
  return ids.length === 1 ? ids[0] : null;
}

function getSelectionBounds(objs = selectedObjects()) {
  return getBoundsForObjects(objs);
}


function selectObjectRespectingGroup(id) {
  const obj = objectById(id);
  if (!obj) return;
  if (obj.groupId) {
    selectedIds = groupMembers(obj.groupId).map(o => o.id);
    selectedId = id;
  } else {
    setSingleSelection(id);
  }
}

function groupSelected() {
  const objs = selectedObjects();
  if (objs.length < 2) {
    status("Seleziona almeno due oggetti da raggruppare");
    return;
  }

  const groupId = "grp_" + uid();
  objs.forEach(o => {
    o.groupId = groupId;
    o.groupLocalRot = Number(o.rot || o.rotation || 0);
  });

  const b = getBoundsForObjects(objs);
  activeMap().groups = activeMap().groups || {};
  activeMap().groups[groupId] = { id:groupId, x:b.x, y:b.y, w:b.w, h:b.h, rot:0 };

  selectedIds = objs.map(o => o.id);
  selectedId = selectedIds[selectedIds.length - 1];
  renderObjects();
  renderProperties();
  publishProject();
  status(`${objs.length} oggetti raggruppati`);
}

function ungroupSelected() {
  const objs = selectedObjects();
  if (!objs.length) return;

  const groupIds = new Set(objs.map(o => o.groupId).filter(Boolean));
  if (!groupIds.size) {
    status("Nessun gruppo da sciogliere");
    return;
  }

  groupIds.forEach(groupId => {
    const group = activeMap().groups?.[groupId];
    const members = groupMembers(groupId);
    if (group) {
      const gx = group.x + group.w / 2;
      const gy = group.y + group.h / 2;
      const b = getBoundsForObjects(members);
      const bx = b.x + b.w / 2;
      const by = b.y + b.h / 2;
      const angle = Number(group.rot || 0) * Math.PI / 180;

      members.forEach(o => {
        const cx = o.x + o.w / 2;
        const cy = o.y + o.h / 2;
        const relativeX = group.x + (cx - b.x) * (group.w / Math.max(1, b.w));
        const relativeY = group.y + (cy - b.y) * (group.h / Math.max(1, b.h));
        const moved = transformPointAround(gx, gy, relativeX, relativeY, angle, 1);
        o.x = snapValue(moved.x - o.w / 2);
        o.y = snapValue(moved.y - o.h / 2);
        o.rot = normalizeRotation(Number(o.rot || o.rotation || 0) + Number(group.rot || 0));
        o.rotation = o.rot;
        delete o.groupId;
        delete o.groupLocalRot;
      });
    } else {
      members.forEach(o => { delete o.groupId; delete o.groupLocalRot; });
    }

    if (activeMap().groups) delete activeMap().groups[groupId];
  });

  renderObjects();
  renderProperties();
  publishProject();
  status("Gruppo sciolto");
}

function normalizeRotation(value) {
  return ((Number(value || 0) % 360) + 360) % 360;
}

function transformPointAround(cx, cy, px, py, angleRad, scale = 1) {
  const dx = (px - cx) * scale;
  const dy = (py - cy) * scale;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos
  };
}


function isSelected(id) {
  return getSelectionIds().includes(id);
}

function setSingleSelection(id) {
  selectedId = id || null;
  selectedIds = id ? [id] : [];
}

function clearSelection() {
  selectedId = null;
  selectedIds = [];
}

function toggleObjectSelection(id) {
  if (!id) return;
  const set = new Set(getSelectionIds());
  if (set.has(id)) set.delete(id);
  else set.add(id);
  selectedIds = Array.from(set);
  selectedId = selectedIds.length ? selectedIds[selectedIds.length - 1] : null;
}

function selectAllObjects() {
  selectedIds = activeMap().objects.map(o => o.id).concat((activeMap().elements || []).map(element => element.id));
  selectedId = selectedIds.length ? selectedIds[selectedIds.length - 1] : null;
  renderObjects();
  renderGeometryElements();
  renderProperties();
  status(`${selectedIds.length} elementi selezionati`);
}

function renderMultiProperties(box, ids) {
  box.innerHTML = `
    <div class="multiBox">
      <h3>${ids.length} oggetti selezionati</h3>
      <p class="small">Comandi di gruppo. Per modificare proprietà specifiche, seleziona un solo oggetto.</p>

      <div class="buttonRow">
        <button id="multiCopyBtn">Copia gruppo</button>
        <button id="multiPasteBtn">Incolla</button>
      </div>

      <div class="buttonRow">
        <button id="multiRotLBtn">Ruota -15°</button>
        <button id="multiRotRBtn">Ruota +15°</button>
      </div>

      <div class="buttonRow">
        <button id="multiScaleDownBtn">Scala -</button>
        <button id="multiScaleUpBtn">Scala +</button>
      </div>

      <div class="buttonRow">
        <button id="multiFitGridBtn">Aggancia a griglia</button>
        <button id="multiDeleteBtn" class="danger">Elimina gruppo</button>
      </div>

      <div class="buttonRow">
        <button id="multiForwardBtn">Avanti</button>
        <button id="multiBackBtn">Indietro</button>
      </div>

      <label>Sposta selezione nel layer
        <select id="multiLayerSelect">${layerOptionsHtml(selectedObjects()[0]?.layer || "arredi")}</select>
      </label>

      <div class="buttonRow">
        <button id="multiShowPlayerBtn">Visibile giocatore</button>
        <button id="multiHidePlayerBtn">Nascondi giocatore</button>
      </div>

      <div class="buttonRow">
        <button id="multiGroupBtn">Raggruppa</button>
        <button id="multiUngroupBtn">Sciogli gruppo</button>
      </div>

      <p class="small">Shift/Ctrl/Cmd + click sugli oggetti per aggiungere o togliere dalla selezione. Rotazione e scala usano il centro del gruppo come riferimento comune.</p>
    </div>
  `;

  document.getElementById("multiCopyBtn").onclick = copySelected;
  document.getElementById("multiPasteBtn").onclick = pasteClipboard;
  document.getElementById("multiDeleteBtn").onclick = deleteSelected;
  document.getElementById("multiRotLBtn").onclick = () => rotateSelected(-15);
  document.getElementById("multiRotRBtn").onclick = () => rotateSelected(15);
  document.getElementById("multiScaleDownBtn").onclick = () => scaleSelected(-0.25);
  document.getElementById("multiScaleUpBtn").onclick = () => scaleSelected(0.25);
  document.getElementById("multiFitGridBtn").onclick = fitSelectedToGrid;
  document.getElementById("multiForwardBtn").onclick = () => changeZ(10);
  document.getElementById("multiBackBtn").onclick = () => changeZ(-10);
  document.getElementById("multiShowPlayerBtn").onclick = () => setSelectedVisiblePlayer(true);
  document.getElementById("multiHidePlayerBtn").onclick = () => setSelectedVisiblePlayer(false);
  document.getElementById("multiGroupBtn").onclick = groupSelected;
  document.getElementById("multiUngroupBtn").onclick = ungroupSelected;
  document.getElementById("multiLayerSelect").onchange = e => setSelectedLayer(e.target.value);
}

function setSelectedVisiblePlayer(value) {
  selectedObjects().forEach(o => o.visiblePlayer = value);
  renderObjects();
  renderProperties();
  publishProject();
}

function setSelectedLayer(layerId) {
  if (!LAYERS.includes(layerId)) return;
  const objs = selectedObjects();
  objs.forEach(o => {
    o.layer = layerId;
    o.z = layerBaseZ(layerId);
  });
  renderObjects();
  renderProperties();
  publishProject();
  status(`Spostati ${objs.length} oggetti nel layer ${layerName(layerId)}`);
}


function renderObjects() {
  renderGeometryElements();
  canvas.querySelectorAll(".mapObject").forEach(n => n.remove());
  canvas.querySelectorAll(".groupProxy").forEach(n => n.remove());

  const map = activeMap();
  map.groups = map.groups || {};
  const selection = new Set(getSelectionIds());

  map.objects.forEach(obj => {
    if (project.mode === "play" || isPlayerWindow) {
      if (!objectVisibleForPlayer(obj)) return;
    } else {
      if (!objectVisibleForMaster(obj)) return;
    }

    const a = assetById(obj.assetId);
    if (!a) return;

    const isSel = selection.has(obj.id);
    const isPrimary = obj.id === selectedId;
    const group = obj.groupId ? map.groups[obj.groupId] : null;

    const el = document.createElement("div");
    const editorDecorations = !isPlayerWindow && project.mode === "editor";
    el.className = "mapObject"
      + (editorDecorations && obj.groupId ? " grouped" : "")
      + (editorDecorations && objectLayerLocked(obj) ? " layerLocked" : "")
      + (editorDecorations && isSel ? (isPrimary ? " selected" : " multiSelected") : "")
      + (editorDecorations && obj.visiblePlayer === false ? " hiddenPlayer" : "");
    el.dataset.id = obj.id;

    let x = obj.x;
    let y = obj.y;
    let rot = Number(obj.rot || obj.rotation || 0);
    let w = obj.w;
    let h = obj.h;

    if (group) {
      const members = groupMembers(obj.groupId);
      const b = getBoundsForObjects(members);
      const localCx = obj.x + obj.w / 2;
      const localCy = obj.y + obj.h / 2;

      // Scala del gruppo come bounding-box unica.
      const scaledCx = group.x + (localCx - b.x) * (group.w / Math.max(1, b.w));
      const scaledCy = group.y + (localCy - b.y) * (group.h / Math.max(1, b.h));

      // Rotazione del gruppo come oggetto unico attorno al centro comune.
      const groupCx = group.x + group.w / 2;
      const groupCy = group.y + group.h / 2;
      const moved = transformPointAround(groupCx, groupCy, scaledCx, scaledCy, Number(group.rot || 0) * Math.PI / 180, 1);

      w = obj.w * (group.w / Math.max(1, b.w));
      h = obj.h * (group.h / Math.max(1, b.h));
      x = moved.x - w / 2;
      y = moved.y - h / 2;
      rot = normalizeRotation(rot + Number(group.rot || 0));
    }

    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.opacity = obj.opacity ?? 1;
    el.style.transform = `rotate(${rot}deg)`;
    el.style.transformOrigin = "center center";
    el.style.zIndex = String(20000 + layerBaseZ(objectLayerId(obj)) + ((obj.z || 0) % 100));

    el.innerHTML = `<img src="${assetSrcForObject(a, {w,h})}" alt="">`;

    if (!isPlayerWindow) {
      el.onclick = e => { e.stopPropagation(); };
      el.onmousedown = e => startDrag(e, obj.id);
    }

    canvas.appendChild(el);
  });

  renderGroupProxies();
}


function assetSrcForBox(asset, w, h) {
  if (!asset) return "";
  if (asset.srcVertical && h > w) return asset.srcVertical;
  return asset.src;
}

function assetSrcForObject(asset, obj) {
  if (!asset || !obj) return asset ? asset.src : "";
  return assetSrcForBox(asset, Number(obj.w || 0), Number(obj.h || 0));
}


function layerBaseZ(layer) {
  const idx = LAYERS.indexOf(layer);
  return ((idx >= 0 ? idx : LAYERS.length) + 1) * 100;
}


function startDrag(e, id) {
  if (project.mode !== "editor" || isPlayerWindow) return;

  const obj = activeMap().objects.find(o => o.id === id);
  if (!obj) return;

  // Shift/Ctrl/Cmd serve sempre per costruire o togliere selezioni manuali.
  if (e.shiftKey || e.ctrlKey || e.metaKey) {
    toggleObjectSelection(id);
    renderObjects();
    renderProperties();
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (obj.locked || objectLayerLocked(obj)) {
    status("Oggetto o layer bloccato");
    selectObjectRespectingGroup(id);
    renderObjects();
    renderProperties();
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (obj.groupId) {
    const members = groupMembers(obj.groupId);
    if (!members.length) return;

    if (members.some(o => o.locked || objectLayerLocked(o))) {
      status("Gruppo o layer bloccato");
      selectedIds = members.map(o => o.id);
      selectedId = id;
      renderObjects();
      renderProperties();
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    selectedIds = members.map(o => o.id);
    selectedId = id;

    const group = activeMap().groups[obj.groupId] || refreshGroupMetaFromMembers(obj.groupId);
    dragState = {
      groupId: obj.groupId,
      startX: e.clientX,
      startY: e.clientY,
      groupOrigin: { x: group.x, y: group.y }
    };
  } else {
    if (!isSelected(id)) setSingleSelection(id);
    else selectedId = id;

    const ids = getSelectionIds();
    const origins = activeMap().objects
      .filter(o => ids.includes(o.id) && !o.locked && !objectLayerLocked(o))
      .map(o => ({ id:o.id, x:o.x, y:o.y }));

    if (!origins.length) {
      status("Selezione bloccata");
      renderObjects();
      renderProperties();
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    dragState = {
      ids,
      startX: e.clientX,
      startY: e.clientY,
      origins
    };
  }

  renderObjects();
  renderProperties();
  e.preventDefault();
  e.stopPropagation();
}

document.addEventListener("mousemove", e => {
  if (!dragState) return;

  const scale = zoomScale();
  const dx = (e.clientX - dragState.startX) / scale;
  const dy = (e.clientY - dragState.startY) / scale;

  if (dragState.groupId) {
    const group = activeMap().groups?.[dragState.groupId];
    if (group) {
      group.x = snapValue(dragState.groupOrigin.x + dx);
      group.y = snapValue(dragState.groupOrigin.y + dy);
    }
  } else {
    dragState.origins.forEach(origin => {
      const obj = activeMap().objects.find(o => o.id === origin.id);
      if (!obj || obj.locked || objectLayerLocked(obj)) return;
      obj.x = snapValue(origin.x + dx);
      obj.y = snapValue(origin.y + dy);
    });
  }

  renderObjects();

  const primary = activeMap().objects.find(o => o.id === selectedId);
  if (primary) updateLiveXY(primary);
});
document.addEventListener("mouseup", () => {
  if (dragState) publishProject();
  dragState = null;
});

// canvas click handled by pointerdown listener for brush mode


function defaultLayer(cat) {
  if (cat === "Base") return "pavimenti";
  if (cat === "Muri") return "architettura";
  if (cat === "Porte") return "porte";
  if (cat === "Scale e botole") return "interattivi";
  if (cat === "Overlay") return "nebbia";
  if (cat === "Token") return "token";
  if (cat === "Icone") return "note_master";
  if (cat === "Importati") return "arredi";
  return "arredi";
}

function renderProperties() {
  const ids = getSelectionIds();
  if (ids.length > 1) {
    const box = document.getElementById("properties");
    renderMultiProperties(box, ids);
    buildTree();
    return;
  }

  const box = document.getElementById("properties");
  const entry = selectedTreeEntry();
  if (!entry) {
    box.innerHTML = `<p class="hint">Seleziona un oggetto sulla mappa.</p>`;
    buildTree();
    return;
  }

  const element = entry.element;
  if (entry.source === "object") normalizeObjectElementFields(element);
  else normalizeElementFields(element);

  const hasLinkedMap = "linkedMapId" in element;
  const hasLayer = "layerId" in element;
  const pointGeometry = entry.source === "element" && element.geometry?.kind === "point";

  box.innerHTML = `
    <div class="readonlyGrid">
      <label>Id <input value="${esc(element.id || "")}" readonly></label>
      <label>Tipo <input value="${esc(entry.type || element.type || "")}" readonly></label>
      <label>Geometry kind <input value="${esc(entry.geometryKind || element.geometry?.kind || "rect")}" readonly></label>
    </div>

    <label>Nome <input data-element-prop="name" value="${esc(element.name || "")}"></label>
    ${pointGeometry ? `
      <div class="row2">
        <label>X quadretti <input data-element-point="x" type="number" step="0.5" value="${cellsFromPx(element.geometry.x)}"></label>
        <label>Y quadretti <input data-element-point="y" type="number" step="0.5" value="${cellsFromPx(element.geometry.y)}"></label>
      </div>
    ` : ""}
    <label>Note master <textarea data-element-prop="notesMaster" rows="4">${esc(element.notesMaster || "")}</textarea></label>
    <label>Note giocatore <textarea data-element-prop="notesPlayer" rows="4">${esc(element.notesPlayer || "")}</textarea></label>
    <label><input data-element-prop="visibleToPlayers" type="checkbox" ${element.visibleToPlayers === true ? "checked" : ""}> Visibile ai giocatori</label>

    ${hasLinkedMap ? `<label>Linked map id <input data-element-prop="linkedMapId" value="${esc(element.linkedMapId || "")}" placeholder="Nessuna mappa collegata"></label>` : ""}
    ${hasLayer ? `<label>Layer id <input data-element-prop="layerId" value="${esc(element.layerId || "")}"></label>` : ""}

    ${entry.source === "object" ? `
      <div class="legacyObjectTools">
        <p class="small">Oggetto canvas legacy: posizione, scala e rotazione restano gestite dal canvas.</p>
        <div class="buttonRow">
          <button id="copyBtn">Copia</button>
          <button id="duplicateBtn">Duplica</button>
        </div>
        <div class="buttonRow">
          <button id="bringForwardBtn">Avanti</button>
          <button id="deleteBtn" class="danger">Elimina</button>
        </div>
      </div>
    ` : `
      <div class="buttonRow">
        <button id="deleteBtn" class="danger">Elimina</button>
      </div>
    `}
  `;

  box.querySelectorAll("[data-element-prop]").forEach(input => {
    input.oninput = input.onchange = () => updateElementProperty(input, entry.source);
  });
  box.querySelectorAll("[data-element-point]").forEach(input => {
    input.oninput = () => updateElementPointProperty(input, false);
    input.onchange = () => updateElementPointProperty(input, true);
  });

  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) copyBtn.onclick = copySelected;
  const duplicateBtn = document.getElementById("duplicateBtn");
  if (duplicateBtn) duplicateBtn.onclick = duplicateSelected;
  const deleteBtn = document.getElementById("deleteBtn");
  if (deleteBtn) deleteBtn.onclick = deleteSelected;
  const bringForwardBtn = document.getElementById("bringForwardBtn");
  if (bringForwardBtn) bringForwardBtn.onclick = () => changeZ(10);

  buildTree();
}

function updateElementProperty(input, source) {
  const entry = selectedTreeEntry();
  if (!entry) return;
  const element = entry.element;
  const key = input.dataset.elementProp;
  const value = input.type === "checkbox" ? input.checked : input.value;

  element[key] = key === "linkedMapId" && value === "" ? null : value;

  if (source === "object") {
    if (key === "notesMaster") element.note = element.notesMaster;
    if (key === "visibleToPlayers") element.visiblePlayer = element.visibleToPlayers;
    if (key === "layerId") {
      element.layer = migrateLayer(element.layerId, assetById(element.assetId));
      element.layerId = element.layer;
      element.z = layerBaseZ(element.layer) + ((element.z || 0) % 100);
      buildLayerControls();
    }
    normalizeObjectElementFields(element);
  } else {
    normalizeElementFields(element);
  }

  renderObjects();
  renderGeometryElements();
  buildTree();
  publishProject();
}

function updateElementPointProperty(input, finalUpdate = false) {
  const entry = selectedTreeEntry();
  if (!entry || entry.source !== "element") return;
  const element = entry.element;
  if (!element.geometry || element.geometry.kind !== "point") return;

  const numeric = Number(input.value);
  if (!Number.isFinite(numeric)) return;
  const value = numeric * grid();
  element.geometry[input.dataset.elementPoint] = project.snap ? snapValue(value) : Math.round(value);
  renderGeometryElements();
  if (finalUpdate) renderProperties();
  publishProject();
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

function updateLiveElementPoint(element) {
  if (!element?.geometry || element.geometry.kind !== "point") return;
  const x = document.querySelector('[data-element-point="x"]');
  const y = document.querySelector('[data-element-point="y"]');
  if (x) x.value = cellsFromPx(element.geometry.x);
  if (y) y.value = cellsFromPx(element.geometry.y);
}

function updateProperty(input) {
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) return;
  const key = input.dataset.prop;
  if (input.type === "checkbox") obj[key] = input.checked;
  else if (["rotation","opacity"].includes(key)) obj[key] = Number(input.value);
  else obj[key] = input.value;
  if (key === "layer") { obj.layer = migrateLayer(obj.layer, assetById(obj.assetId)); obj.z = layerBaseZ(obj.layer); buildLayerControls(); }
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
  const objs = selectedObjects();
  if (!objs.length) {
    status("Seleziona uno o più oggetti da ruotare");
    return;
  }

  const gids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];

  // Caso principale: un gruppo già creato si comporta davvero come un solo oggetto.
  if (gids.length === 1 && objs.every(o => o.groupId === gids[0])) {
    rotateGroupAsSingleObject(gids[0], deg);
    return;
  }

  if (objs.length === 1) {
    const obj = objs[0];
    obj.rot = normalizeRotation(Number(obj.rot || obj.rotation || 0) + Number(deg || 0));
    obj.rotation = obj.rot;
  } else {
    const bounds = getSelectionBounds(objs);
    const angle = Number(deg || 0) * Math.PI / 180;

    objs.forEach(obj => {
      const centerX = obj.x + obj.w / 2;
      const centerY = obj.y + obj.h / 2;
      const moved = transformPointAround(bounds.cx, bounds.cy, centerX, centerY, angle, 1);

      obj.x = snapValue(moved.x - obj.w / 2);
      obj.y = snapValue(moved.y - obj.h / 2);
      obj.rot = normalizeRotation(Number(obj.rot || obj.rotation || 0) + Number(deg || 0));
      obj.rotation = obj.rot;
    });
  }

  renderObjects();
  renderProperties();
  publishProject();
  status(objs.length > 1 ? `Selezione ruotata attorno al centro comune` : `Rotazione: ${objs[0].rot}°`);
}



function selectedObject() {
  return activeMap().objects.find(o => o.id === selectedId);
}


function scaleSelected(deltaCells) {
  const objs = selectedObjects();
  if (!objs.length) return;

  const gids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];

  // Caso principale: un gruppo già creato scala come un solo oggetto.
  if (gids.length === 1 && objs.every(o => o.groupId === gids[0])) {
    scaleGroupAsSingleObject(gids[0], deltaCells);
    return;
  }

  if (objs.length === 1) {
    const obj = objs[0];
    const currentW = cellsFromPx(obj.w);
    const currentH = cellsFromPx(obj.h);
    const minSize = 0.25;

    const newWCells = Math.max(minSize, roundToStep(currentW + deltaCells, 0.25));
    const newHCells = Math.max(minSize, roundToStep(currentH + deltaCells, 0.25));

    obj.w = pxFromCells(newWCells);
    obj.h = pxFromCells(newHCells);
    obj.cellsW = newWCells;
    obj.cellsH = newHCells;
  } else {
    const bounds = getSelectionBounds(objs);
    const factor = deltaCells > 0 ? 1.1 : 0.9;
    const quarter = grid() / 4;

    objs.forEach(obj => {
      const centerX = obj.x + obj.w / 2;
      const centerY = obj.y + obj.h / 2;
      const moved = transformPointAround(bounds.cx, bounds.cy, centerX, centerY, 0, factor);

      obj.w = Math.max(quarter, Math.round((obj.w * factor) / quarter) * quarter);
      obj.h = Math.max(quarter, Math.round((obj.h * factor) / quarter) * quarter);
      obj.x = snapValue(moved.x - obj.w / 2);
      obj.y = snapValue(moved.y - obj.h / 2);
      obj.cellsW = cellsFromPx(obj.w);
      obj.cellsH = cellsFromPx(obj.h);
    });
  }

  fitSelectedToGrid(false);
  renderObjects();
  renderProperties();
  publishProject();
  status(objs.length > 1 ? `Selezione scalata dal centro comune` : "Scala aggiornata");
}

function resetSelectedSize() {
  const objs = selectedObjects();
  if (!objs.length) return;

  objs.forEach(obj => {
    const a = assetById(obj.assetId);
    if (!a) return;
    obj.w = pxFromCells(a.cellsW);
    obj.h = pxFromCells(a.cellsH);
    obj.cellsW = a.cellsW;
    obj.cellsH = a.cellsH;
  });

  fitSelectedToGrid(false);
  renderObjects();
  renderProperties();
  publishProject();
  status(objs.length > 1 ? "Misure base ripristinate" : "Misura base ripristinata");
}

function fitSelectedToGrid(refresh = true) {
  const objs = selectedObjects();
  if (!objs.length) return;

  const gids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];

  if (gids.length === 1 && objs.every(o => o.groupId === gids[0])) {
    const group = activeMap().groups?.[gids[0]];
    if (group) {
      const quarter = grid() / 4;
      group.x = snapValue(group.x);
      group.y = snapValue(group.y);
      group.w = Math.max(quarter, Math.round(group.w / quarter) * quarter);
      group.h = Math.max(quarter, Math.round(group.h / quarter) * quarter);
    }
  } else {
    const quarter = grid() / 4;
    objs.forEach(obj => {
      obj.x = snapValue(obj.x);
      obj.y = snapValue(obj.y);
      obj.w = Math.max(quarter, Math.round(obj.w / quarter) * quarter);
      obj.h = Math.max(quarter, Math.round(obj.h / quarter) * quarter);
      obj.cellsW = cellsFromPx(obj.w);
      obj.cellsH = cellsFromPx(obj.h);
    });
  }

  if (refresh) {
    renderObjects();
    renderProperties();
    publishProject();
    status(objs.length > 1 ? "Gruppo agganciato alla griglia" : "Oggetto agganciato alla griglia");
  }
}

function roundToStep(value, step) {
  return Math.round(value / step) * step;
}

function nudgeSelected(dx, dy) {
  const objs = selectedObjects();
  const elements = selectedElements();
  if (!objs.length && !elements.length) return;
  const gids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];

  if (gids.length === 1 && objs.every(o => o.groupId === gids[0])) {
    const group = activeMap().groups?.[gids[0]];
    if (group) {
      group.x = snapValue(group.x + dx);
      group.y = snapValue(group.y + dy);
    }
  } else {
    objs.forEach(obj => {
      obj.x = snapValue(obj.x + dx);
      obj.y = snapValue(obj.y + dy);
    });
  }

  elements.forEach(element => {
    if (element.geometry?.kind !== "point") return;
    element.geometry.x = snapValue(element.geometry.x + dx);
    element.geometry.y = snapValue(element.geometry.y + dy);
  });

  renderObjects();
  renderGeometryElements();
  renderProperties();
  publishProject();
}


function copySelected() {
  const objs = selectedObjects();
  if (!objs.length) return;

  const minX = Math.min(...objs.map(o => o.x));
  const minY = Math.min(...objs.map(o => o.y));

  clipboard = {
    type:"objects",
    groups: JSON.parse(JSON.stringify(activeMap().groups || {})),
    objects:objs.map(o => {
      const c = JSON.parse(JSON.stringify(o));
      c.offsetX = c.x - minX;
      c.offsetY = c.y - minY;
      return c;
    })
  };

  status(objs.length > 1 ? `${objs.length} oggetti copiati` : "Oggetto copiato");
}

function pasteClipboard() {
  if (!clipboard) return status("Nessun oggetto copiato");

  const map = activeMap();
  let newObjects = [];

  if (clipboard.type === "objects" && Array.isArray(clipboard.objects)) {
    const baseX = snapValue((map.objects.length ? Math.max(...map.objects.map(o => o.x)) : 0) + snapStep());
    const baseY = snapValue((map.objects.length ? Math.max(...map.objects.map(o => o.y)) : 0) + snapStep());
    const groupMap = new Map();

    newObjects = clipboard.objects.map(src => {
      const copy = JSON.parse(JSON.stringify(src));
      delete copy.offsetX;
      delete copy.offsetY;
      copy.id = uid();
      copy.name = (copy.name || "Oggetto") + " copia";
      copy.x = snapValue(baseX + (src.offsetX || 0));
      copy.y = snapValue(baseY + (src.offsetY || 0));
      copy.z = (copy.z || layerBaseZ(copy.layer)) + 1;

      if (src.groupId) {
        if (!groupMap.has(src.groupId)) groupMap.set(src.groupId, "grp_" + uid());
        copy.groupId = groupMap.get(src.groupId);
      }

      return copy;
    });

    // Ricrea anche i proxy dei gruppi copiati.
    activeMap().groups = activeMap().groups || {};
    groupMap.forEach((newGid, oldGid) => {
      const oldGroup = clipboard.groups?.[oldGid];
      if (oldGroup) {
        activeMap().groups[newGid] = {
          id:newGid,
          x:snapValue(baseX + (oldGroup.x - (clipboard.objects.length ? Math.min(...clipboard.objects.map(o => o.x - (o.offsetX || 0))) : 0))),
          y:snapValue(baseY + (oldGroup.y - (clipboard.objects.length ? Math.min(...clipboard.objects.map(o => o.y - (o.offsetY || 0))) : 0))),
          w:oldGroup.w,
          h:oldGroup.h,
          rot:oldGroup.rot || 0
        };
      }
    });
  } else {
    const copy = JSON.parse(JSON.stringify(clipboard));
    copy.id = uid();
    copy.name = copy.name + " copia";
    copy.x = snapValue(copy.x + snapStep());
    copy.y = snapValue(copy.y + snapStep());
    copy.z = (copy.z || layerBaseZ(copy.layer)) + 1;
    if (copy.groupId) copy.groupId = "grp_" + uid();
    newObjects = [copy];
  }

  map.objects.push(...newObjects);
  selectedIds = newObjects.map(o => o.id);
  selectedId = selectedIds[selectedIds.length - 1] || null;
  status(newObjects.length > 1 ? `${newObjects.length} oggetti incollati` : "Oggetto incollato");
  render();
}

function duplicateSelected() { 
  copySelected(); 
  pasteClipboard(); 
}

function deleteSelected() {
  const ids = new Set(getSelectionIds());
  if (!ids.size) return;
  const map = activeMap();
  const beforeElements = (map.elements || []).length;
  map.elements = (map.elements || []).filter(element => !ids.has(element.id));
  map.objects = map.objects.filter(o => !ids.has(o.id));
  if (map.groups) {
    Object.keys(map.groups).forEach(gid => {
      if (!map.objects.some(o => o.groupId === gid)) delete map.groups[gid];
    });
  }
  clearSelection();
  const removedElements = beforeElements - (map.elements || []).length;
  status(removedElements
    ? (removedElements > 1 ? `${removedElements} elementi eliminati` : "Elemento eliminato")
    : (ids.size > 1 ? `${ids.size} oggetti eliminati` : "Oggetto eliminato"));
  render();
}

function changeZ(delta) {
  const objs = selectedObjects();
  if (!objs.length) return;
  objs.forEach(obj => obj.z = (obj.z || layerBaseZ(obj.layer)) + delta);
  renderObjects();
  publishProject();
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
  if (e.key === "Escape" && smartToolMode) {
    e.preventDefault();
    setSmartWallTool(null);
    status("Smart Wall disattivato");
    return;
  }

  if (e.key === "Escape" && roomToolActive) {
    e.preventDefault();
    setRoomTool(false);
    status("Strumento stanza disattivato");
    return;
  }

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
  if (mod && e.key.toLowerCase() === "a") { e.preventDefault(); selectAllObjects(); }
  if (mod && e.key.toLowerCase() === "c") { e.preventDefault(); copySelected(); }
  if (mod && e.key.toLowerCase() === "v") { e.preventDefault(); pasteClipboard(); }
  if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
  if (e.key.toLowerCase() === "q") { e.preventDefault(); rotateSelected(-15); }
  if (e.key.toLowerCase() === "e") { e.preventDefault(); rotateSelected(15); }
  if (!mod && e.key.toLowerCase() === "g") { e.preventDefault(); groupSelected(); }
  if (!mod && e.key.toLowerCase() === "u") { e.preventDefault(); ungroupSelected(); }
  if (e.key === "+" || e.key === "=") { e.preventDefault(); scaleSelected(0.25); }
  if (e.key === "-" || e.key === "_") { e.preventDefault(); scaleSelected(-0.25); }

  const step = snapStep();
  if (e.key === "ArrowLeft") { e.preventDefault(); nudgeSelected(-step, 0); }
  if (e.key === "ArrowRight") { e.preventDefault(); nudgeSelected(step, 0); }
  if (e.key === "ArrowUp") { e.preventDefault(); nudgeSelected(0, -step); }
  if (e.key === "ArrowDown") { e.preventDefault(); nudgeSelected(0, step); }
});
