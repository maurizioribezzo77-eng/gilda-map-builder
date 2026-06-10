// ===== 04b brush/drop safety bindings =====
function handleCanvasDragOver(e) {
  e.preventDefault();
}

function handleCanvasDrop(e) {
  if (isPlayerWindow || project.mode !== "editor") return;
  e.preventDefault();
  const assetId = e.dataTransfer.getData("text/plain");
  if (!assetId) return;
  const p = canvasPointFromEvent(e);
  addAssetAtPoint(assetId, p);
}

canvas.addEventListener("pointerdown", handleCanvasPointerDown);
canvas.addEventListener("pointermove", handleCanvasPointerMove);
canvas.addEventListener("pointerleave", e => { if (!brushDrawState) hideBrushPreview(); });
canvas.addEventListener("pointerup", finishBrushDraw);
document.addEventListener("pointerup", finishBrushDraw);
canvas.addEventListener("dragover", handleCanvasDragOver);
canvas.addEventListener("drop", handleCanvasDrop);
