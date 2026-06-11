// ===== 60_smart_walls.js =====

// MVP 0.9+ Smart Brush Refactor.
// Base ibrida per pennelli smart cell-based: Dungeon Brush e Wall Cell Brush.
// Le celle sono dati leggeri; il rendering e' procedurale e deterministico.

const SMART_WALL_LAYER_ID = "smart_wall_architettura";
const SMART_DUNGEON_LAYER_ID = "smart_dungeon_architettura";

const SMART_BRUSH_DEFS = {
  dungeon:{
    id:SMART_DUNGEON_LAYER_ID,
    name:"Dungeon Brush",
    smartMode:"dungeon_cells",
    layer:"architettura",
    fillClass:"smartDungeonFloor",
    outlineClass:"smartDungeonOutline"
  },
  wall:{
    id:SMART_WALL_LAYER_ID,
    name:"Wall Cell Brush",
    smartMode:"solid_wall",
    layer:"architettura",
    fillClass:"smartWallFill",
    outlineClass:"smartWallOutline"
  }
};

const SMART_BRUSH_PRESETS = {
  inhabited:{ label:"Abitato", edgeRandomness:0.05, decay:0.12, dirt:0.18 },
  abandoned:{ label:"Abbandonato", edgeRandomness:0.16, decay:0.45, dirt:0.52 },
  ruin:{ label:"Rovina", edgeRandomness:0.24, decay:0.72, dirt:0.62 },
  rough:{ label:"Tunnel grezzo", edgeRandomness:0.20, decay:0.35, dirt:0.42 }
};

function ensureSmartLayers(map = activeMap()) {
  if (!map) return [];
  map.smartLayers = Array.isArray(map.smartLayers) ? map.smartLayers : [];
  if (!map.smartSeed) map.smartSeed = `map_${map.id || uid()}`;

  Object.keys(SMART_BRUSH_DEFS).forEach(kind => {
    const def = SMART_BRUSH_DEFS[kind];
    let layer = map.smartLayers.find(l => l.id === def.id);
    if (!layer) {
      layer = {
        id:def.id,
        name:def.name,
        type:"smart_tile",
        smartKind:kind,
        smartMode:def.smartMode,
        preset:"inhabited",
        visualStyle:"stone_battlemap_v1",
        layer:def.layer,
        visibleMaster:true,
        visiblePlayer:true,
        cells:[]
      };
      map.smartLayers.push(layer);
    }

    layer.type = "smart_tile";
    layer.smartKind = kind;
    layer.smartMode = def.smartMode;
    layer.layer = LAYERS.includes(layer.layer) ? layer.layer : def.layer;
    layer.preset = SMART_BRUSH_PRESETS[layer.preset] ? layer.preset : "inhabited";
    layer.visualStyle = layer.visualStyle || "stone_battlemap_v1";
    layer.cells = Array.isArray(layer.cells) ? layer.cells.filter(c => Number.isFinite(Number(c.x)) && Number.isFinite(Number(c.y))) : [];
    layer.paths = Array.isArray(layer.paths) ? layer.paths.filter(isValidSmartPath) : [];
    if (typeof layer.visibleMaster !== "boolean") layer.visibleMaster = true;
    if (typeof layer.visiblePlayer !== "boolean") layer.visiblePlayer = true;
  });

  return map.smartLayers;
}

function smartBrushLayer(kind = smartBrushKind, map = activeMap()) {
  ensureSmartLayers(map);
  const def = SMART_BRUSH_DEFS[kind] || SMART_BRUSH_DEFS.dungeon;
  return map.smartLayers.find(l => l.id === def.id);
}

function smartLayerVisible(layer) {
  if (!layer) return false;
  const state = layerState(layer.layer || "architettura");
  if (isPlayerWindow || project.mode === "play") {
    return layer.visiblePlayer !== false && state.visiblePlayer !== false;
  }
  return layer.visibleMaster !== false && state.visibleMaster !== false;
}

function smartCellKey(x, y) {
  return `${x},${y}`;
}

function smartCellFromEvent(e) {
  const p = canvasPointFromEvent(e);
  return {
    x:clamp(Math.floor(p.x / grid()), 0, Math.max(0, activeMap().squaresW - 1)),
    y:clamp(Math.floor(p.y / grid()), 0, Math.max(0, activeMap().squaresH - 1))
  };
}

function smartPathPointFromEvent(e) {
  const p = canvasPointFromEvent(e);
  const step = project.snap ? grid() / 2 : 1;
  return {
    x:project.snap ? Math.round(p.x / step) * step : Math.round(p.x),
    y:project.snap ? Math.round(p.y / step) * step : Math.round(p.y)
  };
}

function isValidSmartPath(path) {
  return path && Array.isArray(path.points) && path.points.length >= 2 &&
    path.points.every(p => Number.isFinite(Number(p.x)) && Number.isFinite(Number(p.y)));
}

function setSmartCell(kind, cell, filled) {
  const layer = smartBrushLayer(kind);
  const key = smartCellKey(cell.x, cell.y);
  const existing = new Set(layer.cells.map(c => smartCellKey(Number(c.x), Number(c.y))));

  if (filled) existing.add(key);
  else existing.delete(key);

  layer.preset = smartBrushPreset;
  layer.visualStyle = layer.visualStyle || "stone_battlemap_v1";
  layer.cells = [...existing].map(k => {
    const [x, y] = k.split(",").map(Number);
    return { x, y };
  }).sort((a, b) => a.y - b.y || a.x - b.x);
}

function paintSmartWallCellFromEvent(e) {
  const mode = smartToolMode;
  if (!mode) return;
  const cell = smartCellFromEvent(e);
  setSmartCell(smartBrushKind, cell, mode === "draw");
  renderSmartLayers();
  updatePlayerViewFromEditor(true);
  publishProject();
  updateSmartWallStatus();
}

function addSmartWallPath(start, end) {
  const layer = smartBrushLayer("wall");
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const minLength = grid() / 3;
  if (Math.hypot(dx, dy) < minLength) {
    setSmartCell("wall", {
      x:Math.floor(start.x / grid()),
      y:Math.floor(start.y / grid())
    }, true);
    return;
  }

  layer.preset = smartBrushPreset;
  layer.paths = layer.paths || [];
  layer.paths.push({
    id:uid(),
    type:"path",
    smartKind:"wall",
    preset:smartBrushPreset,
    visualStyle:"stone_battlemap_v1",
    width:0.55,
    points:[
      { x:Math.round(start.x), y:Math.round(start.y) },
      { x:Math.round(end.x), y:Math.round(end.y) }
    ]
  });
}

function distanceToSegment(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (!lenSq) return Math.hypot(point.x - a.x, point.y - a.y);
  const t = clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq, 0, 1);
  const x = a.x + t * dx;
  const y = a.y + t * dy;
  return Math.hypot(point.x - x, point.y - y);
}

function eraseSmartWallAtEvent(e) {
  const point = smartPathPointFromEvent(e);
  const cell = smartCellFromEvent(e);
  setSmartCell(smartBrushKind, cell, false);

  if (smartBrushKind === "wall") {
    const layer = smartBrushLayer("wall");
    const threshold = grid() * 0.75;
    layer.paths = (layer.paths || []).filter(path => {
      const pts = path.points || [];
      for (let i = 0; i < pts.length - 1; i++) {
        if (distanceToSegment(point, pts[i], pts[i + 1]) <= threshold) return false;
      }
      return true;
    });
  }

  renderSmartLayers();
  updatePlayerViewFromEditor(true);
  publishProject();
  updateSmartWallStatus();
}

function setSmartBrushKind(kind) {
  smartBrushKind = SMART_BRUSH_DEFS[kind] ? kind : "dungeon";
  const select = document.getElementById("smartBrushKind");
  if (select) select.value = smartBrushKind;
  updateSmartWallStatus();
}

function setSmartBrushPreset(preset) {
  smartBrushPreset = SMART_BRUSH_PRESETS[preset] ? preset : "inhabited";
  const select = document.getElementById("smartBrushPreset");
  if (select) select.value = smartBrushPreset;
  const layer = smartBrushLayer(smartBrushKind);
  if (layer) layer.preset = smartBrushPreset;
  renderSmartLayers();
  publishProject();
  updateSmartWallStatus();
}

function setSmartWallTool(mode) {
  if (mode) setSketchTool(null);
  if (mode) setRoomTool(false);
  smartToolMode = mode;
  smartDragState = null;
  if (mode) elementToolMode = null;
  if (mode) {
    selectedAssetId = null;
    brushDrawState = null;
    hideBrushPreview();
  }
  updateBrushStatus();
  buildLibrary();
  updateSmartWallStatus();
}

function updateSmartWallStatus() {
  const box = document.getElementById("smartWallStatus");
  const draw = document.getElementById("btnSmartWallDraw");
  const erase = document.getElementById("btnSmartWallErase");
  const off = document.getElementById("btnSmartWallOff");
  const kindSelect = document.getElementById("smartBrushKind");
  const presetSelect = document.getElementById("smartBrushPreset");
  const layer = smartBrushLayer(smartBrushKind);
  const count = layer ? layer.cells.length : 0;
  const def = SMART_BRUSH_DEFS[smartBrushKind] || SMART_BRUSH_DEFS.dungeon;
  const preset = SMART_BRUSH_PRESETS[smartBrushPreset] || SMART_BRUSH_PRESETS.inhabited;

  if (kindSelect) kindSelect.value = smartBrushKind;
  if (presetSelect) presetSelect.value = smartBrushPreset;
  if (draw) draw.classList.toggle("active", smartToolMode === "draw");
  if (erase) erase.classList.toggle("active", smartToolMode === "erase");
  if (off) off.classList.toggle("active", !smartToolMode);
  if (box) {
    const label = smartToolMode === "draw" ? "disegno" : smartToolMode === "erase" ? "cancellazione" : "spento";
    box.textContent = `${def.name}: ${label} · ${preset.label} · ${count} celle`;
  }
}

function handleSmartWallPointerDown(e) {
  e.preventDefault();
  e.stopPropagation();
  smartDragState = {
    pointerId:e.pointerId,
    kind:smartBrushKind,
    mode:smartToolMode,
    start:smartPathPointFromEvent(e),
    current:smartPathPointFromEvent(e)
  };
  if (canvas.setPointerCapture) {
    try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
  }

  if (smartBrushKind === "wall" && smartToolMode === "draw") {
    renderSmartLayers();
  } else if (smartToolMode === "erase") {
    eraseSmartWallAtEvent(e);
  } else {
    paintSmartWallCellFromEvent(e);
  }
}

function handleSmartWallPointerMove(e) {
  if (!smartDragState) return;
  e.preventDefault();
  smartDragState.current = smartPathPointFromEvent(e);

  if (smartDragState.kind === "wall" && smartDragState.mode === "draw") {
    renderSmartLayers();
  } else if (smartDragState.mode === "erase") {
    eraseSmartWallAtEvent(e);
  } else {
    paintSmartWallCellFromEvent(e);
  }
}

function finishSmartWallDraw(e) {
  const state = smartDragState;
  const pointerId = smartDragState && smartDragState.pointerId;
  smartDragState = null;

  if (state && state.kind === "wall" && state.mode === "draw") {
    addSmartWallPath(state.start, state.current || state.start);
    renderSmartLayers();
    updatePlayerViewFromEditor(true);
    publishProject();
    updateSmartWallStatus();
  }

  if (canvas.releasePointerCapture && pointerId !== undefined) {
    try { canvas.releasePointerCapture(pointerId); } catch(err) {}
  }
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function smartHash(value) {
  let h = 2166136261;
  const s = String(value);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function smartJitter(map, layer, cell, side, amount) {
  const preset = SMART_BRUSH_PRESETS[layer.preset] || SMART_BRUSH_PRESETS.inhabited;
  const randomness = Number(preset.edgeRandomness || 0) * amount;
  if (!randomness) return 0;
  const seed = `${map.smartSeed}|${layer.id}|${layer.preset}|${cell.x}|${cell.y}|${side}`;
  return (smartHash(seed) - 0.5) * randomness;
}

function smartLayerCells(layer) {
  return (layer.cells || []).map(c => ({ x:Number(c.x), y:Number(c.y) }));
}

function smartOccupiedSet(cells) {
  return new Set(cells.map(c => smartCellKey(c.x, c.y)));
}

function computeDungeonFloorGeometry(map, layer) {
  const g = grid();
  const cells = smartLayerCells(layer);
  const rects = [];
  const details = [];

  cells.forEach(c => {
    const x = c.x * g;
    const y = c.y * g;
    rects.push(`<rect class="smartDungeonFloorTile" x="${x}" y="${y}" width="${g}" height="${g}"></rect>`);

    const detail = smartHash(`${map.smartSeed}|${layer.id}|${layer.preset}|detail|${c.x}|${c.y}`);
    if (layer.smartKind === "dungeon" && detail > 0.68) {
      const cx = x + g * (0.25 + smartHash(`${c.x}:cx:${c.y}`) * 0.5);
      const cy = y + g * (0.25 + smartHash(`${c.x}:cy:${c.y}`) * 0.5);
      details.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${Math.max(2, g * 0.025).toFixed(1)}"></circle>`);
    }
  });

  return {
    rects:rects.join(""),
    details:details.join("")
  };
}

function computeBoundaryEdges(map, layer) {
  const g = grid();
  const cells = smartLayerCells(layer);
  const occupied = smartOccupiedSet(cells);
  const edges = [];

  cells.forEach(c => {
    const x = c.x * g;
    const y = c.y * g;
    const n = smartJitter(map, layer, c, "n", g);
    const e = smartJitter(map, layer, c, "e", g);
    const s = smartJitter(map, layer, c, "s", g);
    const w = smartJitter(map, layer, c, "w", g);
    if (!occupied.has(smartCellKey(c.x, c.y - 1))) edges.push({ side:"n", d:`M ${x} ${(y + n).toFixed(1)} H ${x + g}`, x, y, cell:c });
    if (!occupied.has(smartCellKey(c.x + 1, c.y))) edges.push({ side:"e", d:`M ${(x + g + e).toFixed(1)} ${y} V ${y + g}`, x, y, cell:c });
    if (!occupied.has(smartCellKey(c.x, c.y + 1))) edges.push({ side:"s", d:`M ${x + g} ${(y + g + s).toFixed(1)} H ${x}`, x, y, cell:c });
    if (!occupied.has(smartCellKey(c.x - 1, c.y))) edges.push({ side:"w", d:`M ${(x + w).toFixed(1)} ${y + g} V ${y}`, x, y, cell:c });
  });

  return edges;
}

function rectPolygon(x, y, w, h) {
  return [
    `${x.toFixed(1)},${y.toFixed(1)}`,
    `${(x + w).toFixed(1)},${y.toFixed(1)}`,
    `${(x + w).toFixed(1)},${(y + h).toFixed(1)}`,
    `${x.toFixed(1)},${(y + h).toFixed(1)}`
  ].join(" ");
}

function computeDungeonWallBand(map, layer) {
  const g = grid();
  const edges = computeBoundaryEdges(map, layer);
  const preset = SMART_BRUSH_PRESETS[layer.preset] || SMART_BRUSH_PRESETS.inhabited;
  const half = Math.max(10, g * (layer.preset === "rough" ? 0.34 : 0.30));
  const innerLip = Math.max(4, g * 0.07);
  const overlap = Math.max(3, g * 0.05);
  const polygons = [];
  const rubble = [];

  edges.forEach(edge => {
    const x = edge.x;
    const y = edge.y;
    const decay = Number(preset.decay || 0);
    const wobble = decay * g * 0.05;
    const j = (smartHash(`${map.smartSeed}|${layer.id}|band|${edge.cell.x}|${edge.cell.y}|${edge.side}`) - 0.5) * wobble;
    if (edge.side === "n") polygons.push(`<polygon points="${rectPolygon(x - overlap, y - half + j, g + overlap * 2, half + innerLip)}"></polygon>`);
    if (edge.side === "e") polygons.push(`<polygon points="${rectPolygon(x + g - innerLip, y - overlap, half + innerLip + j, g + overlap * 2)}"></polygon>`);
    if (edge.side === "s") polygons.push(`<polygon points="${rectPolygon(x - overlap, y + g - innerLip, g + overlap * 2, half + innerLip + j)}"></polygon>`);
    if (edge.side === "w") polygons.push(`<polygon points="${rectPolygon(x - half + j, y - overlap, half + innerLip, g + overlap * 2)}"></polygon>`);

    if (smartHash(`${map.smartSeed}|${layer.id}|rubble|${edge.cell.x}|${edge.cell.y}|${edge.side}`) < (0.18 + decay * 0.34)) {
      const rx = x + g * smartHash(`${edge.cell.x}|rx|${edge.side}`);
      const ry = y + g * smartHash(`${edge.cell.y}|ry|${edge.side}`);
      rubble.push(`<circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="${Math.max(2.4, g * 0.035).toFixed(1)}"></circle>`);
    }
  });

  return {
    polygons:polygons.join(""),
    rubble:rubble.join(""),
    outline:edges.map(edge => edge.d).join(" ")
  };
}

function computeWallCellGeometry(map, layer) {
  const g = grid();
  const cells = smartLayerCells(layer);
  const rects = [];
  const edges = computeBoundaryEdges(map, layer);

  cells.forEach(c => {
    const x = c.x * g;
    const y = c.y * g;
    rects.push(`<rect x="${x}" y="${y}" width="${g}" height="${g}"></rect>`);
  });

  return {
    rects:rects.join(""),
    outline:edges.map(edge => edge.d).join(" ")
  };
}

function smartPatternDefs(layer) {
  const safeId = String(layer.id).replace(/[^a-z0-9_-]/gi, "_");
  const floorId = `${safeId}_stone_floor_light`;
  const wallId = `${safeId}_wall_stone_mass`;
  const edgeId = `${safeId}_wall_edge_dark`;
  const rubbleId = `${safeId}_rubble_noise`;
  const shadowId = `${safeId}_shadow_soft`;
  const crackId = `${safeId}_crack_detail`;
  return {
    floorId,
    wallId,
    edgeId,
    rubbleId,
    shadowId,
    crackId,
    defs:`
      <defs>
        <pattern id="${floorId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/stone_floor_light.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${wallId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/wall_stone_mass.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${edgeId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/wall_edge_dark.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${rubbleId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/rubble_noise.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${shadowId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/shadow_soft.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${crackId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/crack_detail.png" width="256" height="256"></image>
        </pattern>
        <filter id="${safeId}_soft_shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="4" dy="6" stdDeviation="3" flood-color="#000" flood-opacity=".35"></feDropShadow>
        </filter>
      </defs>
    `
  };
}

function computeWallPathPolygon(path, width) {
  const pts = path.points || [];
  if (pts.length < 2) return "";
  const a = pts[0];
  const b = pts[pts.length - 1];
  const dx = Number(b.x) - Number(a.x);
  const dy = Number(b.y) - Number(a.y);
  const len = Math.hypot(dx, dy);
  if (!len) return "";

  const nx = -dy / len;
  const ny = dx / len;
  const half = width / 2;
  return [
    `${(Number(a.x) + nx * half).toFixed(1)},${(Number(a.y) + ny * half).toFixed(1)}`,
    `${(Number(b.x) + nx * half).toFixed(1)},${(Number(b.y) + ny * half).toFixed(1)}`,
    `${(Number(b.x) - nx * half).toFixed(1)},${(Number(b.y) - ny * half).toFixed(1)}`,
    `${(Number(a.x) - nx * half).toFixed(1)},${(Number(a.y) - ny * half).toFixed(1)}`
  ].join(" ");
}

function renderSmartTextureLayer(cls, markup, fillId, extra = "") {
  if (!markup) return "";
  return `<g class="${cls}" fill="url(#${fillId})" ${extra}>${markup}</g>`;
}

function smartPathMarkup(map, layer, patterns) {
  const g = grid();
  const paths = [...(layer.paths || [])];

  if (smartDragState && smartDragState.kind === "wall" && smartDragState.mode === "draw" && layer.smartKind === "wall") {
    paths.push({
      id:"preview",
      preset:smartBrushPreset,
      width:0.55,
      points:[smartDragState.start, smartDragState.current || smartDragState.start],
      preview:true
    });
  }

  return paths.map(path => {
    const pts = path.points || [];
    if (pts.length < 2) return "";
    const width = Math.max(8, Number(path.width || 0.55) * g);
    const points = computeWallPathPolygon(path, width);
    if (!points) return "";
    const cls = path.preview ? "smartWallPath preview" : "smartWallPath";
    const seed = `${map.smartSeed}|${layer.id}|${path.id}|path`;
    const detailOpacity = 0.34 + smartHash(seed) * 0.24;
    return `
      <polygon class="smartWallPathShadow" points="${points}"></polygon>
      <polygon class="${cls}" points="${points}" fill="url(#${patterns.wallId})"></polygon>
      <polygon class="smartWallPathRubble" points="${points}" fill="url(#${patterns.rubbleId})" style="opacity:${detailOpacity.toFixed(2)}"></polygon>
      <polygon class="smartWallPathCracks" points="${points}" fill="url(#${patterns.crackId})"></polygon>
      <polygon class="smartWallPathInnerLine" points="${points}"></polygon>
    `;
  }).join("");
}

function renderSmartLayers() {
  if (!smartLayer) return;
  const map = activeMap();
  ensureSmartLayers(map);
  smartLayer.innerHTML = "";
  smartLayer.style.width = map.width + "px";
  smartLayer.style.height = map.height + "px";

  (map.smartLayers || []).forEach(layer => {
    const hasCells = !!(layer.cells && layer.cells.length);
    const hasPaths = !!(layer.paths && layer.paths.length);
    const hasPreview = !!(smartDragState && smartDragState.kind === "wall" && smartDragState.mode === "draw" && layer.smartKind === "wall");
    if (!smartLayerVisible(layer) || (!hasCells && !hasPaths && !hasPreview)) return;
    const def = SMART_BRUSH_DEFS[layer.smartKind] || SMART_BRUSH_DEFS.wall;
    const patterns = smartPatternDefs(layer);
    const floorGeo = layer.smartKind === "dungeon" ? computeDungeonFloorGeometry(map, layer) : { rects:"", details:"" };
    const wallBand = layer.smartKind === "dungeon" ? computeDungeonWallBand(map, layer) : { polygons:"", rubble:"", outline:"" };
    const wallGeo = layer.smartKind === "wall" ? computeWallCellGeometry(map, layer) : { rects:"", outline:"" };
    const pathMarkup = smartPathMarkup(map, layer, patterns);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `smartBrushSvg ${layer.smartKind === "dungeon" ? "smartDungeonSvg" : "smartWallSvg"}`);
    svg.setAttribute("viewBox", `0 0 ${map.width} ${map.height}`);
    svg.setAttribute("width", String(map.width));
    svg.setAttribute("height", String(map.height));
    svg.style.zIndex = String(20000 + layerBaseZ(layer.layer || "architettura") - 20);
    svg.innerHTML = `
      ${patterns.defs}
      ${layer.smartKind === "dungeon" ? `
        ${renderSmartTextureLayer(def.fillClass, floorGeo.rects, patterns.floorId)}
        <g class="smartBrushCracks" fill="url(#${patterns.crackId})">${floorGeo.rects}</g>
        <g class="smartBrushDetails">${floorGeo.details}</g>
        <g class="smartDungeonWallShadow">${wallBand.polygons}</g>
        ${renderSmartTextureLayer("smartDungeonWallBand", wallBand.polygons, patterns.wallId, `filter="url(#${String(layer.id).replace(/[^a-z0-9_-]/gi, "_")}_soft_shadow)"`)}
        <g class="smartDungeonWallRubble" fill="url(#${patterns.rubbleId})">${wallBand.polygons}</g>
        <g class="smartDungeonWallCracks" fill="url(#${patterns.crackId})">${wallBand.polygons}</g>
        <g class="smartDungeonRubbleBits">${wallBand.rubble}</g>
        <path class="${def.outlineClass}" d="${wallBand.outline}"></path>
      ` : `
        ${renderSmartTextureLayer(def.fillClass, wallGeo.rects, patterns.wallId)}
        <g class="smartWallCellRubble" fill="url(#${patterns.rubbleId})">${wallGeo.rects}</g>
        <g class="smartBrushCracks" fill="url(#${patterns.crackId})">${wallGeo.rects}</g>
        <path class="${def.outlineClass}" d="${wallGeo.outline}"></path>
      `}
      <g class="smartPathGroup">${pathMarkup}</g>
    `;
    smartLayer.appendChild(svg);
  });

  updateSmartWallStatus();
}
