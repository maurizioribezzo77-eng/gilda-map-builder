// ===== 50_storage_settings.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 50_storage_settings.js
// Salvataggio locale, caricamento, import/export JSON, impostazioni griglia, zoom, sincronizzazione controlli e scorciatoie.

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
  buildLayerControls();
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
  (map.elements || []).forEach(element => scaleElementGeometry(element.geometry, factor));

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
