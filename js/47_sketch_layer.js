// ===== 47_sketch_layer.js =====

// Strumento schizzo libero: salva tratti come Element type="sketchStroke"
// con geometry kind="polyline", separati dagli oggetti giocabili.

const SKETCH_LAYER_ID = "layer-sketch";
const SKETCH_MIN_POINT_DISTANCE = 3;
const SKETCH_ERASER_DISTANCE = 14;

function ensureSketchMapLayer(map = activeMap()) {
  if (!map) return null;
  map.elements = Array.isArray(map.elements) ? map.elements : [];
  map.layers = Array.isArray(map.layers) ? map.layers : [];

  let layer = map.layers.find(l => l.id === SKETCH_LAYER_ID);
  if (!layer) {
    layer = {
      id: SKETCH_LAYER_ID,
      name: "Sketch Layer",
      type: "sketch",
      visible: true,
      locked: false
    };
    map.layers.push(layer);
  }

  return layer;
}

function sketchLayerState() {
  ensureLayers();
  return layerState(SKETCH_LAYER_ID);
}

function sketchVisibleForMaster(element) {
  return element.visibleMaster !== false && sketchLayerState().visibleMaster !== false;
}

function sketchVisibleForPlayer(element) {
  return element.visibleToPlayers !== false && sketchLayerState().visiblePlayer !== false;
}

function sketchElementVisible(element) {
  if (project.mode === "play" || isPlayerWindow) return sketchVisibleForPlayer(element);
  return sketchVisibleForMaster(element);
}

function setSketchTool(mode) {
  activeSketchTool = mode;
  activeSketchDrawState = null;
  if (mode) elementToolMode = null;

  if (mode) {
    setRoomTool(false);
    selectedAssetId = null;
    smartToolMode = null;
    brushDrawState = null;
    sketchToolMode = null;
    sketchDrawState = null;
    hideBrushPreview();
  }

  canvas.classList.toggle("sketchPencilMode", mode === "pencil");
  canvas.classList.toggle("sketchEraserMode", mode === "eraser");

  const pencil = document.getElementById("btnSketchPencil");
  const eraser = document.getElementById("btnSketchEraser");
  const off = document.getElementById("btnSketchOff");
  if (pencil) pencil.classList.toggle("active", mode === "pencil");
  if (eraser) eraser.classList.toggle("active", mode === "eraser");
  if (off) off.classList.toggle("active", !mode);

  const box = document.getElementById("sketchStatus");
  if (box) {
    box.textContent = mode === "pencil"
      ? "Schizzo: matita attiva"
      : mode === "eraser"
        ? "Schizzo: gomma attiva"
        : "Schizzo: spento";
  }

  updateBrushStatus();
  buildLibrary();
  updateSmartWallStatus();
}

function sketchPointFromEvent(e) {
  const point = canvasPointFromEvent(e);
  return {
    x: Math.round(point.x),
    y: Math.round(point.y)
  };
}

function createSketchStroke(points) {
  ensureSketchMapLayer();
  return {
    id: "sketch_" + uid(),
    type: "sketchStroke",
    name: "Tratto schizzo",
    geometry: {
      kind: "polyline",
      points: points.map(point => ({
        x: Math.round(point.x),
        y: Math.round(point.y)
      }))
    },
    rotation: 0,
    visibleToPlayers: true,
    visibleMaster: true,
    notesMaster: "",
    notesPlayer: "",
    linkedMapId: null,
    style: {
      stroke: "#2c241c",
      strokeWidth: 5,
      opacity: 0.86,
      lineCap: "round",
      lineJoin: "round"
    },
    layerId: SKETCH_LAYER_ID
  };
}

function handleSketchPointerDown(e) {
  if (isPlayerWindow || project.mode !== "editor" || !activeSketchTool) return false;
  if (e.target.closest && e.target.closest(".mapObject")) return false;
  if (e.target.closest && e.target.closest(".mapElement")) return false;
  if (e.target.closest && e.target.closest(".groupProxy")) return false;
  if (e.target.closest && e.target.closest("#viewportHandle")) return false;

  e.preventDefault();
  e.stopPropagation();

  const point = sketchPointFromEvent(e);

  if (activeSketchTool === "eraser") {
    eraseSketchStrokeAtPoint(point);
    return true;
  }

  activeSketchDrawState = {
    points: [point],
    pointerId: e.pointerId
  };

  if (canvas.setPointerCapture) {
    try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
  }

  renderSketchLayer();
  return true;
}

function handleSketchPointerMove(e) {
  if (!activeSketchDrawState) return false;

  const point = sketchPointFromEvent(e);
  const last = activeSketchDrawState.points[activeSketchDrawState.points.length - 1];
  const dx = point.x - last.x;
  const dy = point.y - last.y;

  if (Math.sqrt(dx * dx + dy * dy) >= SKETCH_MIN_POINT_DISTANCE) {
    activeSketchDrawState.points.push(point);
    renderSketchLayer();
  }

  e.preventDefault();
  return true;
}

function finishSketchDraw(e) {
  if (!activeSketchDrawState) return false;

  const state = activeSketchDrawState;
  activeSketchDrawState = null;

  if (state.points.length >= 2) {
    const map = activeMap();
    map.elements.push(createSketchStroke(state.points));
    renderSketchLayer();
    publishProject();
    status("Tratto schizzo salvato");
  } else {
    renderSketchLayer();
  }

  if (canvas.releasePointerCapture && state.pointerId !== undefined) {
    try { canvas.releasePointerCapture(state.pointerId); } catch(err) {}
  }

  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return true;
}

function eraseSketchStrokeAtPoint(point) {
  const map = activeMap();
  ensureSketchMapLayer(map);
  const target = findSketchStrokeAtPoint(point, map.elements);
  if (!target) {
    status("Nessun tratto schizzo vicino alla gomma");
    return;
  }

  map.elements = map.elements.filter(element => element.id !== target.id);
  renderSketchLayer();
  publishProject();
  status("Tratto schizzo cancellato");
}

function findSketchStrokeAtPoint(point, elements) {
  let closest = null;
  let closestDistance = Infinity;

  (elements || []).forEach(element => {
    if (element.type !== "sketchStroke" || !isPolylineGeometry(element.geometry)) return;
    if (!sketchVisibleForMaster(element)) return;

    const distance = sketchDistanceToPolyline(point, element.geometry.points);
    const strokeWidth = Number(element.style && element.style.strokeWidth || 5);
    const threshold = Math.max(SKETCH_ERASER_DISTANCE, strokeWidth + 8);
    if (distance <= threshold && distance < closestDistance) {
      closest = element;
      closestDistance = distance;
    }
  });

  return closest;
}

function sketchDistanceToPolyline(point, points) {
  if (!Array.isArray(points) || points.length < 2) return Infinity;
  let min = Infinity;

  for (let i = 1; i < points.length; i += 1) {
    min = Math.min(min, sketchDistanceToSegment(point, points[i - 1], points[i]));
  }

  return min;
}

function sketchDistanceToSegment(point, a, b) {
  const ax = Number(a.x) || 0;
  const ay = Number(a.y) || 0;
  const bx = Number(b.x) || 0;
  const by = Number(b.y) || 0;
  const px = Number(point.x) || 0;
  const py = Number(point.y) || 0;
  const dx = bx - ax;
  const dy = by - ay;

  if (dx === 0 && dy === 0) {
    const sx = px - ax;
    const sy = py - ay;
    return Math.sqrt(sx * sx + sy * sy);
  }

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  const x = ax + t * dx;
  const y = ay + t * dy;
  const sx = px - x;
  const sy = py - y;
  return Math.sqrt(sx * sx + sy * sy);
}

function renderSketchLayer() {
  if (!sketchLayer) return;
  const map = activeMap();
  if (!map) return;
  ensureSketchMapLayer(map);

  sketchLayer.innerHTML = "";
  sketchLayer.style.width = map.width + "px";
  sketchLayer.style.height = map.height + "px";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "sketchSvg");
  svg.setAttribute("viewBox", `0 0 ${map.width} ${map.height}`);
  svg.setAttribute("width", String(map.width));
  svg.setAttribute("height", String(map.height));

  (map.elements || []).forEach(element => {
    if (element.type !== "sketchStroke" || !isPolylineGeometry(element.geometry)) return;
    if (!sketchElementVisible(element)) return;
    appendSketchPolyline(svg, element, false);
  });

  if (activeSketchDrawState && activeSketchDrawState.points.length) {
    appendSketchPolyline(svg, createSketchStroke(activeSketchDrawState.points), true);
  }

  sketchLayer.appendChild(svg);
}

function appendSketchPolyline(svg, element, preview) {
  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  const style = element.style || {};
  const points = element.geometry.points.map(point => `${Math.round(point.x)},${Math.round(point.y)}`).join(" ");

  polyline.setAttribute("points", points);
  polyline.setAttribute("class", "sketchStroke" + (preview ? " preview" : "") + (element.visibleToPlayers === false ? " hiddenPlayer" : ""));
  polyline.setAttribute("stroke", String(style.stroke || "#2c241c"));
  polyline.setAttribute("stroke-width", String(style.strokeWidth || 5));
  polyline.setAttribute("opacity", String(style.opacity ?? 0.86));
  polyline.setAttribute("data-element-id", element.id);
  svg.appendChild(polyline);
}
