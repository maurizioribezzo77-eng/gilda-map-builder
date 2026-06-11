// ===== 90_main_init.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 90_main_init.js
// Collegamento eventi DOM, sincronizzazione finestra giocatori e avvio applicazione.

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
    groups:{},
    smartLayers:[],
    elements:[],
    layers:[],
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
document.getElementById("btnSmartWallDraw").onclick = () => setSmartWallTool("draw");
document.getElementById("btnSmartWallErase").onclick = () => setSmartWallTool("erase");
document.getElementById("btnSmartWallOff").onclick = () => setSmartWallTool(null);
document.getElementById("btnSketchPencil").onclick = () => setSketchTool("pencil");
document.getElementById("btnSketchEraser").onclick = () => setSketchTool("eraser");
document.getElementById("btnSketchOff").onclick = () => setSketchTool(null);
document.getElementById("btnRoomTool").onclick = () => setRoomTool(true);
document.getElementById("btnRoomToolOff").onclick = () => setRoomTool(false);
document.getElementById("roomShapeSelect").onchange = e => setRoomShape(e.target.value);
document.getElementById("btnCorridorTool").onclick = () => setElementTool("corridor");
document.getElementById("btnDoorTool").onclick = () => setElementTool("door");
document.getElementById("btnStairTool").onclick = () => setElementTool("stair");
document.getElementById("btnElementToolOff").onclick = () => setElementTool(null);
document.getElementById("smartBrushKind").onchange = e => setSmartBrushKind(e.target.value);
document.getElementById("smartBrushPreset").onchange = e => setSmartBrushPreset(e.target.value);
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
updateRoomToolStatus();
updateSketchStatus();
updateElementToolStatus();
applyZoom();
render();
applyModeUI();
applyColumnUI();
updatePlayerViewFromEditor(true);
