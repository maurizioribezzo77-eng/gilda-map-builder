const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = [
  "app.js",
  "tileset_loader.js",
  "tools/build-app.js",
  "tools/split-app.js",
  "tools/validate-tileset.js",
  "js/00_config.js",
  "js/10_ui.js",
  "js/20_canvas_view.js",
  "js/30_objects_properties.js",
  "js/40_brush_assets.js",
  "js/50_storage_settings.js",
  "js/60_smart_walls.js",
  "js/90_main_init.js",
  "js/95_safety_bindings.js"
];

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", path.join(root, file)], {
    encoding: "utf8"
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
}

console.log(`JavaScript syntax OK (${files.length} files).`);
