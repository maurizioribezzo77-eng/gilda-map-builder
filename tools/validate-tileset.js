const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const zipPath = process.argv[2];
if (!zipPath) {
  console.error("Usage: node tools/validate-tileset.js path/to/tileset.zip");
  process.exit(1);
}

const allowedCategories = new Set([
  "floor", "wall", "door", "secret_door", "stairs", "hatch", "pillar",
  "furniture", "container", "trap", "token", "overlay", "marker"
]);

const allowedLayers = new Set([
  "sfondo", "pavimenti", "architettura", "porte", "arredi", "interattivi",
  "trappole", "token", "effetti", "nebbia", "note_master"
]);

const allowedRotations = new Set([0, 90, 180, 270]);
const requiredBooleans = ["walkable", "blocks_sight", "interactive", "linkable"];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function unzipToTemp(file) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gilda-tileset-"));
  const result = spawnSync("unzip", ["-q", file, "-d", tempDir], { encoding: "utf8" });
  if (result.status !== 0) {
    fail(result.stderr || result.stdout || "Unable to unzip tileset.");
  }
  return tempDir;
}

function findManifest(dir) {
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.name.toLowerCase() === "tileset.json") return fullPath;
    }
  }
  return null;
}

function relExists(baseDir, relPath) {
  return fs.existsSync(path.join(baseDir, String(relPath || "")));
}

const extractedDir = unzipToTemp(path.resolve(zipPath));
const manifestPath = findManifest(extractedDir);
if (!manifestPath) fail("tileset.json mancante.");

const manifestDir = path.dirname(manifestPath);
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (err) {
  fail(`tileset.json non valido: ${err.message}`);
}

const errors = [];
if (manifest.format !== "map-generator-tileset") errors.push('format deve essere "map-generator-tileset"');
if (manifest.version !== 1) errors.push("version deve essere 1");
if (manifest.grid !== "square") errors.push("grid deve essere square");
if (manifest.cellSize !== 256) errors.push("cellSize deve essere 256");
if (Number(manifest.maxTileCells || 0) > 4) errors.push("maxTileCells massimo 4");
if (!Array.isArray(manifest.tiles)) errors.push("tiles deve essere un array");

const ids = new Set();
for (const [index, tile] of (manifest.tiles || []).entries()) {
  const prefix = `tiles[${index}]`;
  if (!tile.id) errors.push(`${prefix}.id mancante`);
  if (ids.has(tile.id)) errors.push(`${prefix}.id duplicato: ${tile.id}`);
  ids.add(tile.id);

  if (!tile.name) errors.push(`${prefix}.name mancante`);
  if (!allowedCategories.has(tile.category)) errors.push(`${prefix}.category non valida: ${tile.category}`);
  if (!allowedLayers.has(tile.layer)) errors.push(`${prefix}.layer non valido: ${tile.layer}`);
  if (!tile.file) errors.push(`${prefix}.file mancante`);
  if (tile.file && !String(tile.file).toLowerCase().endsWith(".png")) errors.push(`${prefix}.file deve essere PNG`);
  if (tile.file && !relExists(manifestDir, tile.file)) errors.push(`${prefix}.file non trovato: ${tile.file}`);
  if (tile.category === "wall" && tile.fileVertical) {
    errors.push(`${prefix}.fileVertical non ammesso per i muri: usare un solo PNG senza variante verticale/orizzontale`);
  } else {
    if (tile.fileVertical && !String(tile.fileVertical).toLowerCase().endsWith(".png")) errors.push(`${prefix}.fileVertical deve essere PNG`);
    if (tile.fileVertical && !relExists(manifestDir, tile.fileVertical)) errors.push(`${prefix}.fileVertical non trovato: ${tile.fileVertical}`);
  }

  if (Number(tile.cellsW) <= 0 || Number(tile.cellsH) <= 0) errors.push(`${prefix}.cellsW/cellsH non validi`);
  if (Number(tile.cellsW) > 4 || Number(tile.cellsH) > 4) errors.push(`${prefix} supera 4x4 celle`);
  for (const key of requiredBooleans) {
    if (typeof tile[key] !== "boolean") errors.push(`${prefix}.${key} deve essere boolean`);
  }
  for (const rotation of tile.rotations || manifest.allowedRotations || []) {
    if (!allowedRotations.has(rotation)) errors.push(`${prefix}.rotations contiene valore non valido: ${rotation}`);
  }

  const label = `${tile.id} ${tile.name}`.toLowerCase();
  if (tile.category === "wall" && (label.includes("orizzontale") || label.includes("verticale"))) {
    errors.push(`${prefix} non deve separare muri orizzontali/verticali come asset distinti`);
  }
  if (tile.category === "wall" && /(^|[_-])(h|v)(\.png)?$/i.test(String(tile.file || ""))) {
    errors.push(`${prefix}.file non deve usare suffissi di orientamento _h/_v`);
  }
}

if (errors.length) {
  fail(`Tileset non valido:\n- ${errors.join("\n- ")}`);
}

console.log(`Tileset OK: ${manifest.name || manifest.id} (${manifest.tiles.length} tile).`);
