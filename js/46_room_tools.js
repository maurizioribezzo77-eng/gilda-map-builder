// ===== 46_room_tools.js =====

// Tool stanze geometry-based su project.maps[].elements.

const ROOM_SHAPE_LABELS = {
  rect:"Rettangolo",
  square:"Quadrato",
  circle:"Cerchio",
  pentagon:"Pentagono",
  hexagon:"Esagono"
};

function setRoomTool(active) {
  roomToolActive = !!active;
  roomDrawState = null;
  clearRoomPreview();

  if (roomToolActive) {
    if (typeof elementToolMode !== "undefined") elementToolMode = null;
    selectedAssetId = null;
    smartToolMode = null;
    if (typeof setSketchTool === "function") setSketchTool(null);
    brushDrawState = null;
    hideBrushPreview();
    clearSelection();
  }

  updateBrushStatus();
  updateRoomToolStatus();
  updateSmartWallStatus();
  renderGeometryElements();
  renderObjects();
  renderProperties();
}

function setRoomShape(shape) {
  if (!ROOM_SHAPE_LABELS[shape]) return;
  roomShape = shape;
  if (!roomToolActive) roomToolActive = true;
  updateRoomToolStatus();
  status("Forma stanza: " + ROOM_SHAPE_LABELS[roomShape]);
}

function updateRoomToolStatus() {
  const select = document.getElementById("roomShapeSelect");
  const on = document.getElementById("btnRoomTool");
  const off = document.getElementById("btnRoomToolOff");
  const box = document.getElementById("roomToolStatus");

  if (select) select.value = roomShape;
  if (on) on.classList.toggle("active", roomToolActive);
  if (off) off.classList.toggle("active", !roomToolActive);
  if (canvas) canvas.classList.toggle("roomToolMode", roomToolActive);
  if (box) box.textContent = roomToolActive ? "Stanza: " + ROOM_SHAPE_LABELS[roomShape] : "Stanza: spento";
}

function roomElements(map = activeMap()) {
  map.elements = Array.isArray(map.elements) ? map.elements : [];
  return map.elements.filter(element => element.type === "room");
}

function nextRoomName(map = activeMap()) {
  const used = new Set(roomElements(map).map(element => element.name));
  let index = roomElements(map).length + 1;
  while (used.has("Stanza " + index)) index += 1;
  return "Stanza " + index;
}

function createRoomGeometryFromBox(shape, box) {
  const rawW = Math.abs(box.x2 - box.x1);
  const rawH = Math.abs(box.y2 - box.y1);
  const minSize = snapStep();
  let width = Math.max(minSize, rawW);
  let height = Math.max(minSize, rawH);

  if (shape === "square") {
    const side = Math.max(width, height);
    const x = box.x2 < box.x1 ? box.x1 - side : box.x1;
    const y = box.y2 < box.y1 ? box.y1 - side : box.y1;
    return createRectGeometry(x, y, side, side);
  }

  const x = Math.min(box.x1, box.x2);
  const y = Math.min(box.y1, box.y2);
  if (shape === "rect") return createRectGeometry(x, y, width, height);

  const cx = x + width / 2;
  const cy = y + height / 2;
  const radius = Math.max(minSize / 2, Math.min(width, height) / 2);
  if (shape === "circle") return createCircleGeometry(cx, cy, radius);
  if (shape === "pentagon") return createPentagonGeometry(cx, cy, radius);
  if (shape === "hexagon") return createHexagonGeometry(cx, cy, radius);
  return createRectGeometry(x, y, width, height);
}

function createRoomElement(shape, geometry) {
  return {
    id:uid(),
    type:"room",
    name:nextRoomName(),
    geometry,
    rotation:0,
    visibleToPlayers:false,
    notesMaster:"",
    notesPlayer:"",
    linkedMapId:null,
    style:{
      fill:"rgba(188,191,181,.9)",
      stroke:"#20231f",
      strokeWidth:5,
      opacity:1
    },
    layerId:"architettura"
  };
}

function handleRoomPointerDown(e) {
  if (!roomToolActive || isPlayerWindow || project.mode !== "editor") return false;
  if (e.target.closest && (e.target.closest(".mapObject") || e.target.closest(".geometryElement") || e.target.closest(".groupProxy") || e.target.closest("#viewportHandle"))) return false;

  e.preventDefault();
  e.stopPropagation();

  const point = canvasPointFromEvent(e);
  const start = {
    x:project.snap ? snapValue(point.x) : Math.round(point.x),
    y:project.snap ? snapValue(point.y) : Math.round(point.y)
  };
  roomDrawState = {
    pointerId:e.pointerId,
    shape:roomShape,
    start,
    current:start
  };
  if (canvas.setPointerCapture) {
    try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
  }
  renderRoomPreview();
  return true;
}

function handleRoomPointerMove(e) {
  if (!roomDrawState) return false;
  const point = canvasPointFromEvent(e);
  roomDrawState.current = {
    x:project.snap ? snapValue(point.x) : Math.round(point.x),
    y:project.snap ? snapValue(point.y) : Math.round(point.y)
  };
  renderRoomPreview();
  e.preventDefault();
  return true;
}

function finishRoomDraw(e) {
  if (!roomDrawState) return false;
  const state = roomDrawState;
  roomDrawState = null;
  clearRoomPreview();

  const geometry = createRoomGeometryFromBox(state.shape, {
    x1:state.start.x,
    y1:state.start.y,
    x2:state.current.x,
    y2:state.current.y
  });
  const element = createRoomElement(state.shape, geometry);
  activeMap().elements.push(element);
  setSingleSelection(element.id);
  render();
  status("Creata: " + element.name);

  if (canvas.releasePointerCapture && state.pointerId !== undefined) {
    try { canvas.releasePointerCapture(state.pointerId); } catch(err) {}
  }
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  return true;
}

function renderRoomPreview() {
  clearRoomPreview();
  if (!roomDrawState) return;

  const geometry = createRoomGeometryFromBox(roomDrawState.shape, {
    x1:roomDrawState.start.x,
    y1:roomDrawState.start.y,
    x2:roomDrawState.current.x,
    y2:roomDrawState.current.y
  });
  const previewElement = createRoomElement(roomDrawState.shape, geometry);
  let layer = document.getElementById("roomPreviewLayer");
  if (!layer) {
    layer = document.createElementNS(SVG_NS, "svg");
    layer.id = "roomPreviewLayer";
    layer.classList.add("elementLayer", "roomPreviewLayer");
    canvas.insertBefore(layer, viewportLayer);
  }
  const map = activeMap();
  layer.setAttribute("viewBox", `0 0 ${map.width} ${map.height}`);
  layer.setAttribute("width", map.width);
  layer.setAttribute("height", map.height);
  layer.innerHTML = "";
  const node = renderGeometryElementNode(previewElement);
  node.classList.add("roomPreview");
  layer.appendChild(node);
}

function clearRoomPreview() {
  const layer = document.getElementById("roomPreviewLayer");
  if (layer) layer.innerHTML = "";
}
