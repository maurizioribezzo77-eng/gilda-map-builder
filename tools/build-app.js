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

const output = blocks.map(file => {
  const fullPath = path.join(sourceDir, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing source block: js/${file}`);
  }
  return fs.readFileSync(fullPath, "utf8").trim();
}).join("\n\n\n") + "\n";

fs.writeFileSync(outputFile, output, "utf8");
console.log(`Built app.js from ${blocks.length} source blocks.`);
