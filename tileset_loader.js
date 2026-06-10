
// MAP GENERATOR TILESET v1 loader — MVP 0.7h.
// Regola: gli asset del tileset vengono fusi nelle categorie esistenti dell'app.
// Nessuna categoria "Tileset / ..." deve comparire nella libreria asset.

const MG_TILESET_FORMAT = "map-generator-tileset";
const MG_TILESET_VERSION = 1;
const MG_TILESET_CELL_SIZE = 256;
const MG_TILESET_MAX_CELLS = 4;

const MG_TILESET_CATEGORIES = [
  "floor","wall","door","secret_door","stairs","hatch","pillar",
  "furniture","container","trap","token","overlay","marker"
];

const MG_CATEGORY_TO_APP_CATEGORY = {
  floor:"Base",
  wall:"Muri",
  door:"Porte",
  secret_door:"Porte",
  stairs:"Scale e botole",
  hatch:"Scale e botole",
  pillar:"Oggetti",
  furniture:"Oggetti",
  container:"Oggetti",
  trap:"Icone",
  token:"Token",
  overlay:"Overlay",
  marker:"Icone"
};

const MG_CATEGORY_TO_LAYER = {
  floor:"pavimenti",
  wall:"architettura",
  door:"porte",
  secret_door:"porte",
  stairs:"interattivi",
  hatch:"interattivi",
  pillar:"architettura",
  furniture:"arredi",
  container:"arredi",
  trap:"trappole",
  token:"token",
  overlay:"nebbia",
  marker:"note_master"
};

(function installTilesetLoader(){
  const originalAllAssets = allAssets;

  project.tilesets = project.tilesets || [];

  // Normalizza eventuali tileset già salvati da build precedenti:
  // niente categorie "Tileset / ...", niente prefisso [TS].
  function normalizeImportedAsset(asset) {
    if (!asset) return asset;

    if (asset.tilesetCategory && MG_CATEGORY_TO_APP_CATEGORY[asset.tilesetCategory]) {
      asset.cat = MG_CATEGORY_TO_APP_CATEGORY[asset.tilesetCategory];
    }

    // Recupero anche asset importati con vecchie categorie testuali.
    const legacy = {
      "Tileset / Pavimenti":"Base",
      "Tileset / Muri":"Muri",
      "Tileset / Porte":"Porte",
      "Tileset / Porte segrete":"Porte",
      "Tileset / Scale":"Scale e botole",
      "Tileset / Botole":"Scale e botole",
      "Tileset / Pilastri":"Oggetti",
      "Tileset / Arredi":"Oggetti",
      "Tileset / Contenitori":"Oggetti",
      "Tileset / Trappole":"Icone",
      "Tileset / Token":"Token",
      "Tileset / Overlay":"Overlay",
      "Tileset / Marker":"Icone"
    };
    if (legacy[asset.cat]) asset.cat = legacy[asset.cat];

    if (typeof asset.name === "string") {
      asset.name = asset.name.replace(/^\[TS\]\s*/,"");
    }

    return asset;
  }

  (project.tilesets || []).forEach(ts => {
    (ts.assets || []).forEach(normalizeImportedAsset);
  });

  allAssets = function() {
    const tsAssets = (project.tilesets || []).flatMap(ts => (ts.assets || []).map(normalizeImportedAsset));
    return originalAllAssets().concat(tsAssets);
  };

  function htmlEsc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[ch]));
  }

  function setTilesetStatus(message="", error=false) {
    const status = document.getElementById("tilesetStatus");
    const list = document.getElementById("tilesetList");
    const loaded = project.tilesets || [];

    if (status) {
      if (message) {
        status.innerHTML = `<span class="${error ? "validationError" : "validationOk"}">${htmlEsc(message)}</span>`;
      } else {
        status.textContent = loaded.length
          ? `${loaded.length} tileset ZIP caricato/i. Gli asset sono fusi nelle categorie esistenti.`
          : "Base integrato. Nessun tileset ZIP caricato.";
      }
    }

    if (list) {
      list.innerHTML = "";
      const base = document.createElement("div");
      base.className = "tilesetItem";
      base.innerHTML = `<strong>Base integrato</strong><br><small>Asset interni dell'app</small>`;
      list.appendChild(base);

      loaded.forEach(ts => {
        const item = document.createElement("div");
        item.className = "tilesetItem";
        item.innerHTML = `<strong>${htmlEsc(ts.name || ts.id)}</strong><br><small>ID: ${htmlEsc(ts.id)} · ${(ts.assets || []).length} tile · fusi nelle categorie base</small>`;
        list.appendChild(item);
      });
    }
  }

  function u16(dv, off) { return dv.getUint16(off, true); }
  function u32(dv, off) { return dv.getUint32(off, true); }

  function normalizeZipPath(path) {
    return String(path || "").replace(/\\/g, "/").replace(/^\.?\//, "");
  }

  function dirname(path) {
    const p = normalizeZipPath(path);
    const i = p.lastIndexOf("/");
    return i >= 0 ? p.slice(0, i + 1) : "";
  }

  function joinZipPath(base, file) {
    return normalizeZipPath((base || "") + normalizeZipPath(file));
  }

  function textFromBytes(bytes) {
    return new TextDecoder("utf-8").decode(bytes);
  }

  function dataUrlFromBytes(bytes, mime="image/png") {
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return `data:${mime};base64,${btoa(binary)}`;
  }

  async function inflateDeflateRaw(bytes) {
    if (!("DecompressionStream" in window)) {
      throw new Error("ZIP compresso non supportato da questo browser. Crea lo ZIP tileset in modalità store/non compressa.");
    }
    const ds = new DecompressionStream("deflate-raw");
    const stream = new Blob([bytes]).stream().pipeThrough(ds);
    const arr = await new Response(stream).arrayBuffer();
    return new Uint8Array(arr);
  }

  async function parseZip(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const dv = new DataView(buffer);
    const entries = {};
    let pos = 0;

    while (pos + 30 <= bytes.length) {
      const sig = u32(dv, pos);
      if (sig !== 0x04034b50) break;

      const flags = u16(dv, pos + 6);
      const method = u16(dv, pos + 8);
      const compSize = u32(dv, pos + 18);
      const nameLen = u16(dv, pos + 26);
      const extraLen = u16(dv, pos + 28);

      if (flags & 0x08) {
        throw new Error("ZIP con data descriptor non supportato. Crea lo ZIP in modalità store/non compressa.");
      }

      const nameStart = pos + 30;
      const name = normalizeZipPath(textFromBytes(bytes.slice(nameStart, nameStart + nameLen)));
      const dataStart = nameStart + nameLen + extraLen;
      const dataEnd = dataStart + compSize;

      if (dataEnd > bytes.length) throw new Error("ZIP corrotto o non leggibile.");

      if (!name.endsWith("/")) {
        let data = bytes.slice(dataStart, dataEnd);
        if (method === 0) {
          // store
        } else if (method === 8) {
          data = await inflateDeflateRaw(data);
        } else {
          throw new Error(`Metodo ZIP non supportato (${method}) per ${name}`);
        }
        entries[name] = data;
      }

      pos = dataEnd;
    }

    if (!Object.keys(entries).length) throw new Error("Nessun file leggibile nello ZIP.");
    return entries;
  }

  function findManifest(entries) {
    const keys = Object.keys(entries);
    return keys.find(k => k.toLowerCase() === "tileset.json")
        || keys.find(k => k.toLowerCase().endsWith("/tileset.json"));
  }

  function validateManifest(manifest, entries, basePath) {
    const errors = [];
    if (manifest.format !== MG_TILESET_FORMAT) errors.push(`format deve essere "${MG_TILESET_FORMAT}"`);
    if (manifest.version !== MG_TILESET_VERSION) errors.push("version deve essere 1");
    if (manifest.grid !== "square") errors.push("grid deve essere square");
    if (manifest.cellSize !== MG_TILESET_CELL_SIZE) errors.push("cellSize deve essere 256");
    if (Number(manifest.maxTileCells || 0) > MG_TILESET_MAX_CELLS) errors.push("maxTileCells massimo 4");
    if (!Array.isArray(manifest.tiles)) errors.push("tiles deve essere un array");

    const allowedRot = [0,90,180,270];

    (manifest.tiles || []).forEach((t, i) => {
      const p = `tiles[${i}]`;
      if (!t.id) errors.push(`${p}.id mancante`);
      if (!t.name) errors.push(`${p}.name mancante`);
      if (!MG_TILESET_CATEGORIES.includes(t.category)) errors.push(`${p}.category non valida`);
      if (!LAYERS.includes(t.layer)) errors.push(`${p}.layer non valido`);
      if (!t.file) errors.push(`${p}.file mancante`);
      if (t.file && !t.file.toLowerCase().endsWith(".png")) errors.push(`${p}.file deve essere PNG`);
      if (Number(t.cellsW) <= 0 || Number(t.cellsH) <= 0) errors.push(`${p}.cellsW/cellsH non validi`);
      if (Number(t.cellsW) > 4 || Number(t.cellsH) > 4) errors.push(`${p} supera 4×4 celle`);
      ["walkable","blocks_sight","interactive","linkable"].forEach(flag => {
        if (typeof t[flag] !== "boolean") errors.push(`${p}.${flag} deve essere boolean`);
      });
      if ((t.rotations || []).some(r => !allowedRot.includes(r))) errors.push(`${p}.rotations non valide`);
      if (t.file && !entries[joinZipPath(basePath, t.file)]) errors.push(`${p}.file non trovato: ${t.file}`);
    });

    return errors;
  }

  function tileToAsset(tile, manifest, entries, basePath) {
    const data = entries[joinZipPath(basePath, tile.file)];
    const layer = tile.layer || MG_CATEGORY_TO_LAYER[tile.category] || "arredi";

    return normalizeImportedAsset({
      id:`${manifest.id}__${tile.id}`,
      name:tile.name,
      cat:MG_CATEGORY_TO_APP_CATEGORY[tile.category] || "Oggetti",
      src:dataUrlFromBytes(data, "image/png"),
      cellsW:Number(tile.cellsW),
      cellsH:Number(tile.cellsH),
      defaultLayer:layer,
      drawMode:tile.drawMode || (tile.category === "wall" ? "line" : tile.category === "floor" ? "rect" : "stamp"),
      drawThickness:tile.drawThickness || (tile.category === "wall" ? Number(tile.cellsH) : undefined),
      rotations:tile.rotations || manifest.allowedRotations || [0,90,180,270],
      walkable:tile.walkable,
      blocks_sight:tile.blocks_sight,
      interactive:tile.interactive,
      linkable:tile.linkable,
      states:tile.states || [],
      tilesetId:manifest.id,
      tilesetName:manifest.name || manifest.id,
      tilesetCategory:tile.category
    });
  }

  async function loadTilesetFile(file) {
    try {
      setTilesetStatus("Caricamento tileset...", false);

      const entries = await parseZip(file);
      const manifestPath = findManifest(entries);
      if (!manifestPath) throw new Error("tileset.json non trovato nello ZIP.");

      const basePath = dirname(manifestPath);
      const manifest = JSON.parse(textFromBytes(entries[manifestPath]));
      const errors = validateManifest(manifest, entries, basePath);
      if (errors.length) throw new Error("Tileset non valido:\n- " + errors.join("\n- "));

      const assets = manifest.tiles.map(tile => tileToAsset(tile, manifest, entries, basePath));
      const tileset = {
        id:manifest.id,
        name:manifest.name || manifest.id,
        author:manifest.author || "",
        cellSize:manifest.cellSize,
        assets
      };

      const existing = project.tilesets.findIndex(ts => ts.id === tileset.id);
      if (existing >= 0) project.tilesets[existing] = tileset;
      else project.tilesets.push(tileset);

      buildLibrary();
      renderObjects();
      renderProperties();
      setTilesetStatus(`Caricato: ${tileset.name} (${assets.length} tile). Asset fusi nelle categorie esistenti.`, false);
      saveLocal();
      publishProject();
      status(`Tileset caricato: ${tileset.name}`);
    } catch (err) {
      console.error(err);
      setTilesetStatus(err.message || String(err), true);
      alert(err.message || String(err));
    }
  }

  const input = document.getElementById("tilesetZipInput");
  if (input) {
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".zip")) {
        setTilesetStatus("Seleziona un file .zip", true);
        input.value = "";
        return;
      }
      loadTilesetFile(file);
      input.value = "";
    });
  }

  setTilesetStatus();
  buildLibrary();
})();
