const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceFile = path.join(root, "app.js");
const outputDir = path.join(root, "js");
const app = fs.readFileSync(sourceFile, "utf8");

const markerRe = /^\/\/ ===== (.+?) =====$/gm;
const markers = [];
let match;

while ((match = markerRe.exec(app))) {
  markers.push({ name: match[1], start: match.index });
}

if (!markers.length) {
  throw new Error("No section markers found in app.js.");
}

for (let i = 0; i < markers.length; i += 1) {
  const current = markers[i];
  const next = markers[i + 1];
  const content = app
    .slice(current.start, next ? next.start : app.length)
    .replace(/^\n+/, "")
    .replace(/\s+$/, "\n");

  let fileName = current.name;
  if (fileName === "04b brush/drop safety bindings") {
    fileName = "95_safety_bindings.js";
  }

  fs.writeFileSync(path.join(outputDir, fileName), content, "utf8");
}

console.log(`Split app.js into ${markers.length} source blocks.`);
