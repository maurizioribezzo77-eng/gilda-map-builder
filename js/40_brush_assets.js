// ===== 40_brush_assets.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 40_brush_assets.js
// Pennello asset, anteprima con punto di aggancio, piazzamento su griglia e import PNG custom.

function selectAssetBrush(assetId) {
  setElementTool(null);
  setSmartWallTool(null);
  setSketchTool(null);
  setRoomTool(false);
  selectedAssetId = assetId;
  const asset = assetById(assetId);
  selectedId = null;
  updateBrushStatus();
  buildLibrary();
  renderObjects();
  renderProperties();
  if (asset) status(`Pennello attivo: ${asset.name} — clicca su uno spazio vuoto per piazzarlo`);
}

function clearAssetBrush() {
  selectedAssetId = null;
  updateBrushStatus();
  buildLibrary();
  canvas.classList.remove("brushMode");
  cancelBrushDraw();
  hideBrushPreview();
}

function setElementTool(mode) {
  elementToolMode = mode === "pin" || mode === "token" ? mode : null;
  elementDragState = null;

  if (elementToolMode) {
    setSmartWallTool(null);
    setSketchTool(null);
    setRoomTool(false);
    selectedAssetId = null;
    brushDrawState = null;
    hideBrushPreview();
    clearSelection();
  }

  updateElementToolStatus();
  updateBrushStatus();
  renderObjects();
  renderGeometryElements();
  renderProperties();
}

function updateElementToolStatus() {
  const pin = document.getElementById("btnPinTool");
  const token = document.getElementById("btnTokenTool");
  const off = document.getElementById("btnElementToolOff");
  const box = document.getElementById("elementToolStatus");

  if (pin) pin.classList.toggle("active", elementToolMode === "pin");
  if (token) token.classList.toggle("active", elementToolMode === "token");
  if (off) off.classList.toggle("active", !elementToolMode);
  if (canvas) {
    canvas.classList.toggle("pinToolMode", elementToolMode === "pin");
    canvas.classList.toggle("tokenToolMode", elementToolMode === "token");
  }
  if (box) {
    box.textContent = elementToolMode === "pin"
      ? "Pin / Nota: clic sul canvas"
      : elementToolMode === "token"
        ? "Token: clic sul canvas"
        : "Strumento: selezione";
  }
}

function nextPointElementName(type) {
  const prefix = type === "token" ? "Token" : "Nota";
  const used = new Set((activeMap().elements || [])
    .filter(element => element.type === type)
    .map(element => element.name || ""));
  let index = 1;
  while (used.has(`${prefix} ${index}`)) index += 1;
  return `${prefix} ${index}`;
}

function createPointElement(type, canvasPoint) {
  const element = normalizeElement({
    id:uid(),
    type,
    name:nextPointElementName(type),
    geometry:{
      kind:"point",
      x:project.snap ? snapValue(canvasPoint.x) : Math.round(canvasPoint.x),
      y:project.snap ? snapValue(canvasPoint.y) : Math.round(canvasPoint.y)
    },
    rotation:0,
    visibleToPlayers:type === "token",
    notesMaster:"",
    notesPlayer:"",
    linkedMapId:null,
    style:type === "token"
      ? { fill:"#526da8", stroke:"#101928", strokeWidth:5, opacity:1 }
      : { fill:"#d1a35a", stroke:"#2a1808", strokeWidth:4, opacity:1, label:"!" },
    layerId:type === "token" ? "token" : "note_master"
  });

  activeMap().elements = Array.isArray(activeMap().elements) ? activeMap().elements : [];
  activeMap().elements.push(element);
  setSingleSelection(element.id);
  renderGeometryElements();
  renderObjects();
  renderProperties();
  buildTree();
  updatePlayerViewFromEditor(true);
  publishProject();
  status(type === "token" ? `Creato ${element.name}` : `Creata ${element.name}`);
}

function updateBrushStatus() {
  const box = document.getElementById("brushStatus");
  const asset = selectedAssetId ? assetById(selectedAssetId) : null;
  canvas.classList.toggle("brushMode", !!asset);

  if (!box) return;
  if (elementToolMode) {
    box.classList.add("active");
    box.textContent = elementToolMode === "pin"
      ? "Strumento Pin/Nota: clicca sul canvas per creare una nota."
      : "Strumento Token: clicca sul canvas per creare una pedina.";
    return;
  }
  if (!asset) {
    box.classList.remove("active");
    box.textContent = "Pennello: nessun asset selezionato";
    return;
  }

  box.classList.add("active");
  const modeText = brushDrawMode(asset) === "line"
    ? "Click = segmento. Click tenuto + trascina = disegna muro."
    : brushDrawMode(asset) === "rect"
      ? "Click = 1 quadretto. Click tenuto + trascina = disegna area."
      : "Click su spazio vuoto per piazzare.";
  box.innerHTML = `<b>Pennello attivo:</b><br>${asset.name}<br>${asset.cellsW}×${asset.cellsH} quadretti<br><small>${modeText}<br>Punto rosso = aggancio alto/sinistra. Esc annulla.</small>`;
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


function brushDrawMode(asset) {
  if (!asset) return "stamp";
  if (asset.drawMode) return asset.drawMode;
  if (asset.cat === "Muri") return "line";
  if (asset.cat === "Base") return "rect";
  return "stamp";
}

function isDrawableBrush(asset) {
  return ["line", "rect"].includes(brushDrawMode(asset));
}

function drawSnapStep(asset) {
  if (brushDrawMode(asset) === "line") return grid() / 2;
  if (brushDrawMode(asset) === "rect") return grid();
  return snapStep();
}

function snapPointForAsset(point, asset) {
  const step = drawSnapStep(asset);
  return {
    x: project.snap ? Math.floor(point.x / step) * step : Math.round(point.x),
    y: project.snap ? Math.floor(point.y / step) * step : Math.round(point.y)
  };
}

function computeDrawBox(asset, start, current) {
  const mode = brushDrawMode(asset);
  const s = snapPointForAsset(start, asset);
  const c = snapPointForAsset(current, asset);

  if (mode === "line") {
    const thickness = pxFromCells(asset.drawThickness || asset.cellsH || 0.5);
    const baseLength = pxFromCells(asset.cellsW || 1);
    const dx = c.x - s.x;
    const dy = c.y - s.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);

    if (horizontal) {
      const x = dx < 0 ? c.x : s.x;
      const y = s.y;
      const w = Math.max(baseLength, Math.abs(dx) + baseLength);
      return { x, y, w, h:thickness, orientation:"horizontal" };
    } else {
      const x = s.x;
      const y = dy < 0 ? c.y : s.y;
      const h = Math.max(baseLength, Math.abs(dy) + baseLength);
      return { x, y, w:thickness, h, orientation:"vertical" };
    }
  }

  if (mode === "rect") {
    const cell = grid();
    const dx = c.x - s.x;
    const dy = c.y - s.y;
    const x = dx < 0 ? c.x : s.x;
    const y = dy < 0 ? c.y : s.y;
    const w = Math.max(cell, Math.abs(dx) + cell);
    const h = Math.max(cell, Math.abs(dy) + cell);
    return { x, y, w, h, orientation:"rect" };
  }

  const pos = placementPointFromCanvasPoint(start);
  return { x:pos.x, y:pos.y, w:pxFromCells(asset.cellsW), h:pxFromCells(asset.cellsH), orientation:"stamp" };
}

function showBrushPreviewBox(asset, box, drawing=false) {
  if (!brushPreview || !asset) return;
  brushPreviewImg.src = assetSrcForBox(asset, box.w, box.h);
  brushPreview.style.left = box.x + "px";
  brushPreview.style.top = box.y + "px";
  brushPreview.style.width = box.w + "px";
  brushPreview.style.height = box.h + "px";
  brushPreview.classList.toggle("drawing", !!drawing);
  brushPreview.classList.add("visible");
}

function makeObjectFromBox(asset, box, nameSuffix="") {
  const assignedLayer = assetDefaultLayer(asset);
  return {
    id:uid(),
    assetId:asset.id,
    x:Math.round(box.x),
    y:Math.round(box.y),
    w:Math.max(1, Math.round(box.w)),
    h:Math.max(1, Math.round(box.h)),
    cellsW:cellsFromPx(Math.max(1, Math.round(box.w))),
    cellsH:cellsFromPx(Math.max(1, Math.round(box.h))),
    rot:Number(box.rot || 0),
    rotation:Number(box.rot || 0),
    opacity:1,
    layer:assignedLayer,
    visibleMaster:true,
    visiblePlayer:true,
    name:asset.name + nameSuffix,
    z:layerBaseZ(assignedLayer)
  };
}

function addAssetBox(assetId, box) {
  const asset = assetById(assetId);
  if (!asset) return null;

  const mode = brushDrawMode(asset);
  const created = [];
  const map = activeMap();
  const cell = grid();
  const half = grid() / 2;

  if (mode === "rect") {
    // Il pavimento non viene più scalato: viene riempito con piastrelle 1×1.
    const cols = Math.max(1, Math.round(box.w / cell));
    const rows = Math.max(1, Math.round(box.h / cell));

    for (let yy = 0; yy < rows; yy++) {
      for (let xx = 0; xx < cols; xx++) {
        created.push(makeObjectFromBox(asset, {
          x:box.x + xx * cell,
          y:box.y + yy * cell,
          w:cell,
          h:cell
        }));
      }
    }
  } else if (mode === "line") {
    // Il muro non viene più scalato: viene riempito con moduli ripetuti.
    if (box.orientation === "vertical") {
      const rows = Math.max(1, Math.round(box.h / cell));
      for (let yy = 0; yy < rows; yy++) {
        const slotX = box.x;
        const slotY = box.y + yy * cell;
        created.push(makeObjectFromBox(asset, {
          x:slotX + (half - cell) / 2,
          y:slotY + (cell - half) / 2,
          w:cell,
          h:half,
          rot:90
        }));
      }
    } else {
      const cols = Math.max(1, Math.round(box.w / cell));
      for (let xx = 0; xx < cols; xx++) {
        created.push(makeObjectFromBox(asset, {
          x:box.x + xx * cell,
          y:box.y,
          w:cell,
          h:half
        }));
      }
    }
  } else {
    created.push(makeObjectFromBox(asset, box));
  }

  if (!created.length) return null;

  map.objects.push(...created);
  selectedIds = created.map(o => o.id);
  selectedId = selectedIds[selectedIds.length - 1];

  renderObjects();
  renderProperties();
  updatePlayerViewFromEditor(true);
  publishProject();

  status(created.length > 1
    ? `Disegnati ${created.length} moduli: ${asset.name}`
    : `Disegnato: ${asset.name}`);

  return created[created.length - 1];
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

  if (brushDrawState) {
    const box = computeDrawBox(asset, brushDrawState.start, p);
    showBrushPreviewBox(asset, box, true);
    return;
  }

  let box;
  if (isDrawableBrush(asset)) {
    const start = snapPointForAsset(p, asset);
    box = computeDrawBox(asset, start, start);
  } else {
    const pos = placementPointFromCanvasPoint(p);
    box = { x:pos.x, y:pos.y, w:pxFromCells(asset.cellsW), h:pxFromCells(asset.cellsH) };
  }

  showBrushPreviewBox(asset, box, false);
}

function hideBrushPreview() {
  if (brushPreview) {
    brushPreview.classList.remove("visible");
    brushPreview.classList.remove("drawing");
  }
}



function addAssetAtPoint(assetId, point) {
  const asset = assetById(assetId);
  if (!asset) return;

  const pos = placementPointFromCanvasPoint(point);

  const assignedLayer = assetDefaultLayer(asset);

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
    rotation:0,
    opacity:1,
    layer:assignedLayer,
    visibleMaster:true,
    visiblePlayer:true,
    name:asset.name,
    z:layerBaseZ(assignedLayer)
  };

  activeMap().objects.push(obj);
  setSingleSelection(obj.id);
  renderObjects();
  renderProperties();
  updatePlayerViewFromEditor(true);
  publishProject();
  status(`Piazzato: ${asset.name} — aggancio in alto a sinistra`);
}

function handleCanvasPointerDown(e) {
  if (isPlayerWindow || project.mode !== "editor") return;

  if (handleElementPointerDown(e)) return;
  if (handleSketchPointerDown(e)) return;
  if (handleRoomPointerDown(e)) return;

  if (e.target.closest && e.target.closest(".mapObject")) return;
  if (e.target.closest && e.target.closest(".groupProxy")) return;
  if (e.target.closest && e.target.closest("#viewportHandle")) return;

  if (smartToolMode) {
    handleSmartWallPointerDown(e);
    return;
  }

  const p = canvasPointFromEvent(e);
  if (elementToolMode) {
    e.preventDefault();
    e.stopPropagation();
    createPointElement(elementToolMode, p);
    return;
  }

  if (selectElementAtPoint(p, e)) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (selectedAssetId) {
    const asset = assetById(selectedAssetId);
    if (!asset) return;

    e.preventDefault();
    e.stopPropagation();

    const start = snapPointForAsset(p, asset);

    brushDrawState = {
      assetId:selectedAssetId,
      start,
      current:start,
      moved:false,
      pointerId:e.pointerId
    };

    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
    }

    const box = isDrawableBrush(asset)
      ? computeDrawBox(asset, start, start)
      : { x:start.x, y:start.y, w:pxFromCells(asset.cellsW), h:pxFromCells(asset.cellsH) };
    showBrushPreviewBox(asset, box, true);
    return;
  }

  clearSelection();
  renderGeometryElements();
  renderObjects();
  renderProperties();
}

function handleCanvasPointerMove(e) {
  if (elementDragState) {
    const element = elementById(elementDragState.id);
    if (element?.geometry?.kind === "point") {
      const scale = zoomScale();
      const dx = (e.clientX - elementDragState.startX) / scale;
      const dy = (e.clientY - elementDragState.startY) / scale;
      element.geometry.x = project.snap ? snapValue(elementDragState.origin.x + dx) : Math.round(elementDragState.origin.x + dx);
      element.geometry.y = project.snap ? snapValue(elementDragState.origin.y + dy) : Math.round(elementDragState.origin.y + dy);
      renderGeometryElements();
      updateLiveElementPoint(element);
    }
    e.preventDefault();
    return;
  }

  if (handleElementPointerMove(e)) return;
  if (handleRoomPointerMove(e)) return;
  if (handleSketchPointerMove(e)) return;

  if (smartDragState) {
    handleSmartWallPointerMove(e);
    return;
  }

  if (brushDrawState) {
    const asset = assetById(brushDrawState.assetId);
    if (!asset) return;

    const p = canvasPointFromEvent(e);
    const current = snapPointForAsset(p, asset);
    brushDrawState.current = current;

    if (Math.abs(current.x - brushDrawState.start.x) >= drawSnapStep(asset) ||
        Math.abs(current.y - brushDrawState.start.y) >= drawSnapStep(asset)) {
      brushDrawState.moved = true;
    }

    const box = isDrawableBrush(asset)
      ? computeDrawBox(asset, brushDrawState.start, current)
      : { x:brushDrawState.start.x, y:brushDrawState.start.y, w:pxFromCells(asset.cellsW), h:pxFromCells(asset.cellsH) };

    showBrushPreviewBox(asset, box, true);
    e.preventDefault();
    return;
  }

  updateBrushPreview(e);
}

function finishBrushDraw(e) {
  if (elementDragState) {
    const state = elementDragState;
    elementDragState = null;
    renderProperties();
    buildTree();
    publishProject();
    if (canvas.releasePointerCapture && state.pointerId !== undefined) {
      try { canvas.releasePointerCapture(state.pointerId); } catch(err) {}
    }
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }

  if (finishElementDraw(e)) return;
  if (finishRoomDraw(e)) return;
  if (finishSketchDraw(e)) return;

  if (smartDragState) {
    finishSmartWallDraw(e);
    return;
  }

  if (!brushDrawState) return;

  const state = brushDrawState;
  brushDrawState = null;

  const asset = assetById(state.assetId);
  if (!asset) {
    hideBrushPreview();
    return;
  }

  const current = state.current || state.start;

  if (isDrawableBrush(asset)) {
    const box = computeDrawBox(asset, state.start, current);
    addAssetBox(state.assetId, box);
  } else {
    addAssetAtPoint(state.assetId, state.start);
  }

  hideBrushPreview();

  if (canvas.releasePointerCapture && state.pointerId !== undefined) {
    try { canvas.releasePointerCapture(state.pointerId); } catch(err) {}
  }

  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function cancelBrushDraw() {
  brushDrawState = null;
  hideBrushPreview();
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
      defaultLayer:"arredi",
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
