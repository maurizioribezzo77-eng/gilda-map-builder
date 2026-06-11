// ===== 05_geometry.js =====

// Geometrie pure e renderer SVG leggero per gli elementi Sketch to Dungeon.

const SVG_NS = "http://www.w3.org/2000/svg";

function point(x, y) {
  return { x, y };
}

function regularPolygonPoints(cx, cy, radius, sides, startAngleDeg = -90) {
  const pts = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = (startAngleDeg + i * 360 / sides) * Math.PI / 180;
    pts.push(point(
      Math.round(cx + Math.cos(angle) * radius),
      Math.round(cy + Math.sin(angle) * radius)
    ));
  }
  return pts;
}

function createRectGeometry(x, y, width, height) {
  return { kind:"rect", x:Number(x), y:Number(y), width:Number(width), height:Number(height) };
}

function createCircleGeometry(cx, cy, radius) {
  return { kind:"circle", cx:Number(cx), cy:Number(cy), radius:Number(radius) };
}

function createRegularPolygonGeometry(cx, cy, radius, sides, rotation = 0) {
  const count = Math.max(3, Math.floor(Number(sides) || 0));
  const centerX = Number(cx);
  const centerY = Number(cy);
  const r = Number(radius);
  const startAngleDeg = Number(rotation) || 0;
  const points = [];

  for (let i = 0; i < count; i += 1) {
    const angle = (startAngleDeg + i * 360 / count) * Math.PI / 180;
    points.push(point(centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r));
  }

  return createPolygonGeometry(points);
}

function createPolygonGeometry(points) {
  return { kind:"polygon", points:points.map(p => point(p.x, p.y)) };
}

function createPolylineGeometry(points, width, closed = false) {
  return { kind:"polyline", points:points.map(p => point(p.x, p.y)), width, closed };
}

function createPointGeometry(x, y) {
  return { kind:"point", x:Number(x), y:Number(y) };
}

function isPolylineGeometry(geometry) {
  return geometry && geometry.kind === "polyline" && Array.isArray(geometry.points);
}

function isCircleGeometry(geometry) {
  return geometry && geometry.kind === "circle";
}

function isPolygonGeometry(geometry) {
  return geometry && geometry.kind === "polygon" && Array.isArray(geometry.points);
}

function createPentagonGeometry(cx, cy, radius) {
  return createRegularPolygonGeometry(cx, cy, radius, 5, -90);
}

function createHexagonGeometry(cx, cy, radius) {
  return createRegularPolygonGeometry(cx, cy, radius, 6, -90);
}

function getGeometryBounds(geometry) {
  const bounds = geometryBounds(geometry);
  return { x:bounds.x, y:bounds.y, width:bounds.w, height:bounds.h };
}

function getGeometryCenter(geometry) {
  return geometryCenter(geometry);
}

function pointInGeometry(p, geometry) {
  if (geometry.kind === "rect") return p.x >= geometry.x && p.x <= geometry.x + geometry.width && p.y >= geometry.y && p.y <= geometry.y + geometry.height;
  if (geometry.kind === "circle") return distance(p, point(geometry.cx, geometry.cy)) <= geometry.radius;
  if (geometry.kind === "polygon") return pointInPolygon(p, geometry.points || []);
  if (geometry.kind === "polyline") return distanceToPolyline(p, geometry.points || [], !!geometry.closed) <= Math.max(1, Number(geometry.width || 1) / 2);
  return p.x === geometry.x && p.y === geometry.y;
}

function snapGeometryToGrid(geometry, gridSize) {
  const size = Number(gridSize);
  if (!Number.isFinite(size) || size <= 0) return geometry;
  const center = getGeometryCenter(geometry);
  const snapped = point(Math.round(center.x / size) * size, Math.round(center.y / size) * size);
  return moveGeometry(geometry, snapped.x - center.x, snapped.y - center.y);
}

function moveGeometry(geometry, dx, dy) {
  if (geometry.kind === "rect") return createRectGeometry(geometry.x + dx, geometry.y + dy, geometry.width, geometry.height);
  if (geometry.kind === "circle") return createCircleGeometry(geometry.cx + dx, geometry.cy + dy, geometry.radius);
  if (geometry.kind === "point") return createPointGeometry(geometry.x + dx, geometry.y + dy);
  if (geometry.kind === "polygon") return createPolygonGeometry((geometry.points || []).map(p => point(p.x + dx, p.y + dy)));
  return createPolylineGeometry((geometry.points || []).map(p => point(p.x + dx, p.y + dy)), geometry.width, geometry.closed);
}

function rotateGeometry(geometry, angleDeg, origin = getGeometryCenter(geometry)) {
  const rotatePoint = p => {
    const angle = angleDeg * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = p.x - origin.x;
    const dy = p.y - origin.y;
    return point(origin.x + dx * cos - dy * sin, origin.y + dx * sin + dy * cos);
  };

  if (geometry.kind === "rect") {
    return createPolygonGeometry([
      rotatePoint(point(geometry.x, geometry.y)),
      rotatePoint(point(geometry.x + geometry.width, geometry.y)),
      rotatePoint(point(geometry.x + geometry.width, geometry.y + geometry.height)),
      rotatePoint(point(geometry.x, geometry.y + geometry.height))
    ]);
  }
  if (geometry.kind === "circle") return createCircleGeometry(...Object.values(rotatePoint(point(geometry.cx, geometry.cy))), geometry.radius);
  if (geometry.kind === "point") return createPointGeometry(...Object.values(rotatePoint(geometry)));
  if (geometry.kind === "polygon") return createPolygonGeometry((geometry.points || []).map(rotatePoint));
  return createPolylineGeometry((geometry.points || []).map(rotatePoint), geometry.width, geometry.closed);
}

function geometryIntersectsGeometry(a, b) {
  const ab = getGeometryBounds(a);
  const bb = getGeometryBounds(b);
  return ab.x <= bb.x + bb.width &&
    ab.x + ab.width >= bb.x &&
    ab.y <= bb.y + bb.height &&
    ab.y + ab.height >= bb.y;
}

function createDemoElements() {
  return [
    {
      id:"demo_room_rect",
      type:"room",
      name:"Sala rettangolare",
      geometry:{ kind:"rect", x:300, y:300, width:600, height:400 },
      rotation:0,
      visibleToPlayers:true,
      notesMaster:"",
      notesPlayer:"",
      linkedMapId:null,
      style:{ fill:"rgba(191,194,183,.92)", stroke:"#1f2321", strokeWidth:6, label:"Rect" },
      layerId:"architettura"
    },
    {
      id:"demo_room_circle",
      type:"room",
      name:"Sala circolare",
      geometry:{ kind:"circle", cx:1450, cy:520, radius:230 },
      rotation:0,
      visibleToPlayers:true,
      notesMaster:"",
      notesPlayer:"",
      linkedMapId:null,
      style:{ fill:"rgba(196,184,157,.9)", stroke:"#26231d", strokeWidth:6, label:"Circle" },
      layerId:"architettura"
    },
    {
      id:"demo_room_hex",
      type:"room",
      name:"Sala esagonale",
      geometry:{ kind:"polygon", points:regularPolygonPoints(2350, 520, 250, 6, -90) },
      rotation:0,
      visibleToPlayers:true,
      notesMaster:"",
      notesPlayer:"",
      linkedMapId:null,
      style:{ fill:"rgba(159,190,178,.9)", stroke:"#1f2b2a", strokeWidth:6, label:"Hex" },
      layerId:"architettura"
    },
    {
      id:"demo_corridor_polyline",
      type:"corridor",
      name:"Corridoio",
      geometry:{ kind:"polyline", points:[point(900, 500), point(1120, 500), point(1220, 520)], width:90 },
      rotation:0,
      visibleToPlayers:true,
      notesMaster:"",
      notesPlayer:"",
      linkedMapId:null,
      style:{ stroke:"#2b2c29", strokeWidth:90, opacity:.55 },
      layerId:"architettura"
    },
    {
      id:"demo_door_rect",
      type:"door",
      name:"Porta",
      geometry:{ kind:"rect", x:895, y:460, width:34, height:82 },
      rotation:0,
      visibleToPlayers:true,
      notesMaster:"",
      notesPlayer:"",
      linkedMapId:null,
      style:{ fill:"#7b4b26", stroke:"#24170f", strokeWidth:4, label:"Door" },
      layerId:"porte"
    },
    {
      id:"demo_stair_point",
      type:"stair",
      name:"Scala",
      geometry:{ kind:"point", x:1680, y:650 },
      rotation:0,
      visibleToPlayers:true,
      notesMaster:"",
      notesPlayer:"",
      linkedMapId:null,
      style:{ fill:"#d8c07a", stroke:"#352811", strokeWidth:4, label:"Stair" },
      layerId:"interattivi"
    },
    {
      id:"demo_pin_secret",
      type:"pin",
      name:"Pin segreto",
      geometry:{ kind:"point", x:2050, y:280 },
      rotation:0,
      visibleToPlayers:false,
      notesMaster:"Visibile solo al Master.",
      notesPlayer:"",
      linkedMapId:null,
      style:{ fill:"#9b3434", stroke:"#260b0b", strokeWidth:4, label:"M" },
      layerId:"layer-sketch"
    },
    {
      id:"demo_token_circle",
      type:"token",
      name:"Token visibile",
      geometry:{ kind:"circle", cx:540, cy:520, radius:45 },
      rotation:0,
      visibleToPlayers:true,
      notesMaster:"",
      notesPlayer:"",
      linkedMapId:null,
      style:{ fill:"#526da8", stroke:"#101928", strokeWidth:5, label:"T" },
      layerId:"token"
    },
    {
      id:"demo_tile_rect",
      type:"tile",
      name:"Tile pavimento",
      geometry:{ kind:"rect", x:300, y:820, width:200, height:200 },
      rotation:0,
      visibleToPlayers:true,
      notesMaster:"",
      notesPlayer:"",
      linkedMapId:null,
      style:{ fill:"rgba(125,133,127,.82)", stroke:"rgba(31,35,33,.42)", strokeWidth:3, label:"Tile" },
      layerId:"pavimenti"
    },
    {
      id:"demo_sketch_stroke",
      type:"sketchStroke",
      name:"Schizzo",
      geometry:{ kind:"polyline", points:[point(640, 920), point(760, 840), point(880, 940), point(1020, 860)], width:22 },
      rotation:0,
      visibleToPlayers:false,
      notesMaster:"Tratto preparatorio nascosto ai giocatori.",
      notesPlayer:"",
      linkedMapId:null,
      style:{ stroke:"#5b2e2e", strokeWidth:22, opacity:.75 },
      layerId:"note_master"
    }
  ];
}

function normalizeElement(element) {
  element.id = element.id || uid();
  element.type = element.type || "room";
  element.name = element.name || element.type;
  element.rotation = Number(element.rotation || 0);
  if (typeof element.visibleToPlayers !== "boolean") element.visibleToPlayers = element.type === "pin" ? false : true;
  element.notesMaster = element.notesMaster || "";
  element.notesPlayer = element.notesPlayer || "";
  element.linkedMapId = element.linkedMapId || null;
  element.style = element.style || {};
  element.layerId = LAYERS.includes(element.layerId) ? element.layerId : defaultLayerForElementType(element.type);
  element.geometry = normalizeGeometry(element.geometry);
  return element;
}

function normalizeGeometry(geometry) {
  if (!geometry || !geometry.kind) return { kind:"point", x:0, y:0 };
  if (geometry.kind === "rect") {
    return {
      kind:"rect",
      x:Number(geometry.x || 0),
      y:Number(geometry.y || 0),
      width:Math.max(1, Number(geometry.width || geometry.w || 1)),
      height:Math.max(1, Number(geometry.height || geometry.h || 1))
    };
  }
  if (geometry.kind === "circle") {
    return {
      kind:"circle",
      cx:Number(geometry.cx || 0),
      cy:Number(geometry.cy || 0),
      radius:Math.max(1, Number(geometry.radius || 1))
    };
  }
  if (geometry.kind === "polygon" || geometry.kind === "polyline") {
    return {
      kind:geometry.kind,
      points:(geometry.points || []).map(p => point(Number(p.x || 0), Number(p.y || 0))),
      width:geometry.width === undefined ? undefined : Math.max(1, Number(geometry.width)),
      closed:!!geometry.closed
    };
  }
  return { kind:"point", x:Number(geometry.x || 0), y:Number(geometry.y || 0) };
}

function defaultLayerForElementType(type) {
  if (type === "tile") return "pavimenti";
  if (type === "door") return "porte";
  if (type === "stair") return "interattivi";
  if (type === "sketchStroke") return "layer-sketch";
  if (type === "pin") return "note_master";
  if (type === "token") return "token";
  return "architettura";
}

function elementLayerId(element) {
  if (!element.layerId || !LAYERS.includes(element.layerId)) element.layerId = defaultLayerForElementType(element.type);
  return element.layerId;
}

function elementVisibleForMaster(element) {
  return true;
}

function elementVisibleForPlayer(element) {
  return element.visibleToPlayers === true;
}

function renderGeometryElements() {
  let layer = document.getElementById("elementLayer");
  if (!layer) {
    layer = document.createElementNS(SVG_NS, "svg");
    layer.id = "elementLayer";
    layer.classList.add("elementLayer");
    canvas.insertBefore(layer, viewportLayer);
  }

  const map = activeMap();
  layer.setAttribute("viewBox", `0 0 ${map.width} ${map.height}`);
  layer.setAttribute("width", map.width);
  layer.setAttribute("height", map.height);
  layer.innerHTML = "";

  const elements = (map.elements || []).filter(element => {
    if (element.type === "sketchStroke") return false;
    if (project.mode === "play" || isPlayerWindow) return elementVisibleForPlayer(element);
    return elementVisibleForMaster(element);
  });

  elements
    .slice()
    .sort((a, b) => layerBaseZ(elementLayerId(a)) - layerBaseZ(elementLayerId(b)))
    .forEach(element => layer.appendChild(renderGeometryElementNode(element)));
}

function renderGeometryElementNode(element) {
  const group = document.createElementNS(SVG_NS, "g");
  const selected = isSelected(element.id);
  group.classList.add("geometryElement", `geometry-${element.type}`, selected ? "selected" : "notSelected");
  if (element.visibleToPlayers === false && !isPlayerWindow && project.mode === "editor") group.classList.add("hiddenPlayer");
  group.dataset.id = element.id;

  const shape = shapeNodeForElement(element);
  group.appendChild(shape);

  const label = labelForElement(element);
  if (label) group.appendChild(label);
  return group;
}

function shapeNodeForElement(element) {
  const g = element.geometry;
  const style = styleForElement(element);
  let node;

  if (g.kind === "rect") {
    node = document.createElementNS(SVG_NS, "rect");
    node.setAttribute("x", g.x);
    node.setAttribute("y", g.y);
    node.setAttribute("width", g.width);
    node.setAttribute("height", g.height);
  } else if (g.kind === "circle") {
    node = document.createElementNS(SVG_NS, "circle");
    node.setAttribute("cx", g.cx);
    node.setAttribute("cy", g.cy);
    node.setAttribute("r", g.radius);
  } else if (g.kind === "polygon") {
    node = document.createElementNS(SVG_NS, "polygon");
    node.setAttribute("points", pointsAttr(g.points));
  } else if (g.kind === "polyline") {
    node = document.createElementNS(SVG_NS, "polyline");
    node.setAttribute("points", pointsAttr(g.points));
    node.setAttribute("fill", "none");
    node.setAttribute("stroke-linecap", "round");
    node.setAttribute("stroke-linejoin", "round");
  } else {
    node = document.createElementNS(SVG_NS, "circle");
    node.setAttribute("cx", g.x);
    node.setAttribute("cy", g.y);
    node.setAttribute("r", pointRadiusForElement(element));
  }

  node.classList.add("geometryShape");
  node.setAttribute("fill", style.fill);
  node.setAttribute("stroke", style.stroke);
  node.setAttribute("stroke-width", style.strokeWidth);
  node.setAttribute("opacity", style.opacity);
  return node;
}

function styleForElement(element) {
  const base = defaultStyleForElementType(element.type);
  const style = element.style || {};
  return {
    fill: style.fill || base.fill,
    stroke: style.stroke || base.stroke,
    strokeWidth: Number(style.strokeWidth || style.strokeWidth === 0 ? style.strokeWidth : base.strokeWidth),
    opacity: Number(style.opacity || style.opacity === 0 ? style.opacity : base.opacity)
  };
}

function defaultStyleForElementType(type) {
  const styles = {
    room:{ fill:"rgba(188,191,181,.9)", stroke:"#20231f", strokeWidth:5, opacity:1 },
    corridor:{ fill:"none", stroke:"#30302b", strokeWidth:70, opacity:.55 },
    door:{ fill:"#774722", stroke:"#20140c", strokeWidth:4, opacity:1 },
    stair:{ fill:"#d5bd73", stroke:"#332713", strokeWidth:4, opacity:1 },
    pin:{ fill:"#9b3434", stroke:"#270b0b", strokeWidth:4, opacity:1 },
    token:{ fill:"#526da8", stroke:"#101928", strokeWidth:5, opacity:1 },
    tile:{ fill:"rgba(125,133,127,.8)", stroke:"rgba(31,35,33,.42)", strokeWidth:2, opacity:1 },
    sketchStroke:{ fill:"none", stroke:"#5b2e2e", strokeWidth:16, opacity:.72 }
  };
  return styles[type] || styles.room;
}

function pointRadiusForElement(element) {
  if (element.type === "pin") return 30;
  if (element.type === "stair") return 42;
  if (element.type === "token") return 45;
  return 24;
}

function pointsAttr(points) {
  return (points || []).map(p => `${p.x},${p.y}`).join(" ");
}

function labelForElement(element) {
  const text = element.style?.label;
  if (!text) return null;
  const center = geometryCenter(element.geometry);
  const label = document.createElementNS(SVG_NS, "text");
  label.classList.add("geometryLabel");
  label.setAttribute("x", center.x);
  label.setAttribute("y", center.y);
  label.textContent = text;
  return label;
}

function geometryCenter(geometry) {
  const b = geometryBounds(geometry);
  return point(b.x + b.w / 2, b.y + b.h / 2);
}

function geometryBounds(geometry) {
  if (geometry.kind === "rect") return { x:geometry.x, y:geometry.y, w:geometry.width, h:geometry.height };
  if (geometry.kind === "circle") return { x:geometry.cx - geometry.radius, y:geometry.cy - geometry.radius, w:geometry.radius * 2, h:geometry.radius * 2 };
  if (geometry.kind === "point") {
    const r = 50;
    return { x:geometry.x - r, y:geometry.y - r, w:r * 2, h:r * 2 };
  }
  const pts = geometry.points || [];
  if (!pts.length) return { x:0, y:0, w:0, h:0 };
  const minX = Math.min(...pts.map(p => p.x));
  const minY = Math.min(...pts.map(p => p.y));
  const maxX = Math.max(...pts.map(p => p.x));
  const maxY = Math.max(...pts.map(p => p.y));
  const pad = Math.max(0, Number(geometry.width || 0) / 2);
  return { x:minX - pad, y:minY - pad, w:maxX - minX + pad * 2, h:maxY - minY + pad * 2 };
}

function selectElementAtPoint(canvasPoint, event) {
  const element = hitTestElements(canvasPoint);
  if (!element) return false;

  if (event && (event.shiftKey || event.ctrlKey || event.metaKey)) toggleObjectSelection(element.id);
  else setSingleSelection(element.id);

  if (event && element.type === "token" && project.mode === "editor" && !isPlayerWindow && element.geometry?.kind === "point") {
    elementDragState = {
      id:element.id,
      startX:event.clientX,
      startY:event.clientY,
      origin:{ x:element.geometry.x, y:element.geometry.y },
      pointerId:event.pointerId
    };
    if (canvas.setPointerCapture && event.pointerId !== undefined) {
      try { canvas.setPointerCapture(event.pointerId); } catch (err) {}
    }
  }

  selectedAssetId = null;
  updateBrushStatus();
  renderObjects();
  renderGeometryElements();
  renderProperties();
  status(`Selezionato: ${element.name}`);
  return true;
}

function hitTestElements(canvasPoint) {
  const map = activeMap();
  return (map.elements || [])
    .filter(element => {
      if (element.type === "sketchStroke") return false;
      if (project.mode === "play" || isPlayerWindow) return elementVisibleForPlayer(element);
      return elementVisibleForMaster(element);
    })
    .slice()
    .sort((a, b) => layerBaseZ(elementLayerId(b)) - layerBaseZ(elementLayerId(a)))
    .find(element => geometryHitTest(element, canvasPoint)) || null;
}

function geometryHitTest(element, p) {
  const g = element.geometry;
  const tolerance = Math.max(10, Number(element.style?.strokeWidth || 0) / 2);
  if (g.kind === "rect") return p.x >= g.x - tolerance && p.x <= g.x + g.width + tolerance && p.y >= g.y - tolerance && p.y <= g.y + g.height + tolerance;
  if (g.kind === "circle") return distance(p, point(g.cx, g.cy)) <= g.radius + tolerance;
  if (g.kind === "polygon") return pointInPolygon(p, g.points || []) || distanceToPolyline(p, g.points || [], true) <= tolerance;
  if (g.kind === "polyline") return distanceToPolyline(p, g.points || [], !!g.closed) <= Math.max(tolerance, Number(g.width || element.style?.strokeWidth || 20) / 2);
  if (g.kind === "point") return distance(p, point(g.x, g.y)) <= pointRadiusForElement(element) + tolerance;
  return false;
}

function pointInPolygon(p, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const pi = points[i];
    const pj = points[j];
    const intersects = ((pi.y > p.y) !== (pj.y > p.y)) &&
      (p.x < (pj.x - pi.x) * (p.y - pi.y) / Math.max(.00001, pj.y - pi.y) + pi.x);
    if (intersects) inside = !inside;
  }
  return inside;
}

function distanceToPolyline(p, points, closed = false) {
  if (!points || points.length < 2) return Infinity;
  let min = Infinity;
  for (let i = 0; i < points.length - 1; i++) min = Math.min(min, distanceToSegment(p, points[i], points[i + 1]));
  if (closed) min = Math.min(min, distanceToSegment(p, points[points.length - 1], points[0]));
  return min;
}

function distanceToSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (!len2) return distance(p, a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return distance(p, point(a.x + t * dx, a.y + t * dy));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function scaleElementGeometry(geometry, factor) {
  if (!geometry || !Number.isFinite(factor)) return;
  if (geometry.kind === "rect") {
    geometry.x = Math.round(geometry.x * factor);
    geometry.y = Math.round(geometry.y * factor);
    geometry.width = Math.round(geometry.width * factor);
    geometry.height = Math.round(geometry.height * factor);
  } else if (geometry.kind === "circle") {
    geometry.cx = Math.round(geometry.cx * factor);
    geometry.cy = Math.round(geometry.cy * factor);
    geometry.radius = Math.round(geometry.radius * factor);
  } else if (geometry.kind === "point") {
    geometry.x = Math.round(geometry.x * factor);
    geometry.y = Math.round(geometry.y * factor);
  } else if (Array.isArray(geometry.points)) {
    geometry.points.forEach(p => {
      p.x = Math.round(p.x * factor);
      p.y = Math.round(p.y * factor);
    });
    if (geometry.width) geometry.width = Math.round(geometry.width * factor);
  }
}

function selectedElement() {
  return (activeMap().elements || []).find(element => element.id === selectedId) || null;
}

function selectedTreeEntry() {
  if (!selectedId) return null;
  const map = activeMap();
  const element = (map.elements || []).find(item => item.id === selectedId);
  if (element) {
    return {
      source:"element",
      element,
      type:element.type,
      geometryKind:element.geometry?.kind || ""
    };
  }

  const object = (map.objects || []).find(item => item.id === selectedId);
  if (!object) return null;
  return {
    source:"object",
    element:object,
    type:object.type || "tile",
    geometryKind:"rect"
  };
}

function normalizeElementFields(element) {
  normalizeElement(element);
}

function normalizeObjectElementFields(object) {
  object.type = object.type || "tile";
  object.geometry = {
    kind:"rect",
    x:Number(object.x || 0),
    y:Number(object.y || 0),
    width:Number(object.w || 1),
    height:Number(object.h || 1)
  };
  object.visibleToPlayers = object.visiblePlayer !== false;
  object.notesMaster = object.notesMaster || object.note || "";
  object.notesPlayer = object.notesPlayer || "";
  object.linkedMapId = object.linkedMapId || null;
  object.layerId = objectLayerId(object);
}

function renderElementProperties(box, element) {
  const bounds = geometryBounds(element.geometry);
  box.innerHTML = `
    <label>Nome <input data-element-prop="name" value="${esc(element.name)}"></label>
    <label>Tipo <input value="${esc(element.type)}" disabled></label>
    <label>Geometria <input value="${esc(element.geometry.kind)}" disabled></label>
    <label>Layer
      <select data-element-prop="layerId">${layerOptionsHtml(elementLayerId(element))}</select>
    </label>
    <div class="row2">
      <label>X q. <input value="${cellsFromPx(bounds.x)}" disabled></label>
      <label>Y q. <input value="${cellsFromPx(bounds.y)}" disabled></label>
    </div>
    <div class="row2">
      <label>Larg. q. <input value="${cellsFromPx(bounds.w)}" disabled></label>
      <label>Alt. q. <input value="${cellsFromPx(bounds.h)}" disabled></label>
    </div>
    <label><input data-element-prop="visibleToPlayers" type="checkbox" ${element.visibleToPlayers !== false ? "checked" : ""}> Visibile Giocatore</label>
    <label>Nota master <textarea data-element-prop="notesMaster" rows="3">${esc(element.notesMaster || "")}</textarea></label>
    <p class="small">Elemento geometry-based. La selezione usa hit testing su ${esc(element.geometry.kind)}.</p>
  `;

  box.querySelectorAll("[data-element-prop]").forEach(input => {
    input.oninput = input.onchange = () => updateElementProperty(input);
  });
}

function updateElementProperty(input) {
  const element = selectedElement();
  if (!element) return;
  const key = input.dataset.elementProp;
  if (input.type === "checkbox") element[key] = input.checked;
  else element[key] = input.value;
  normalizeElement(element);
  renderGeometryElements();
  renderProperties();
  publishProject();
}

function ensureSketchMapLayer(map = activeMap()) {
  map.elements = Array.isArray(map.elements) ? map.elements : [];
}

function renderSketchLayer() {
  if (sketchLayer) sketchLayer.innerHTML = "";
}

function handleSketchPointerDown() {
  return false;
}

function handleSketchPointerMove() {
  return false;
}
