const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "js");
const outputFile = path.join(root, "app.js");

const blocks = [
  "00_config.js",
  "10_ui.js",
  "20_canvas_view.js",
  "30_objects_properties.js",
  "40_brush_assets.js",
  "50_storage_settings.js",
  "60_smart_walls.js",
  "90_main_init.js",
  "95_safety_bindings.js"
];

function buildBundle() {
  return blocks.map(file => {
    const fullPath = path.join(sourceDir, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing source block: js/${file}`);
    }
    return fs.readFileSync(fullPath, "utf8").trim();
  }).join("\n\n\n") + "\n";
}

const expected = buildBundle();
const actual = fs.readFileSync(outputFile, "utf8");

if (actual !== expected) {
  console.error("Bundle mismatch: app.js is not in sync with the source blocks in js/.");
  console.error("Run `node tools/build-app.js` after changing files in js/, then commit both sources and app.js.");
  process.exit(1);
}

console.log("Bundle consistency OK: app.js matches js/ source blocks.");
