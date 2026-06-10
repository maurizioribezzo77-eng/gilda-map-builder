# Checkpoint MVP10 Stable

This checkpoint documents the stable MVP10 repository state after these commits:

- `766fc13 Restore full MVP10 project structure from ZIP`
- `9ffaa57 Add bundle consistency check`
- `d2ed7f5 Clean repository metadata for MVP10`

## 1. Repository State

The repository now contains the complete MVP10 project structure for `gilda-map-builder-mvp10-hybrid-dungeon-visuals`.

The runtime app remains a static browser application loaded from `index.html`. The app logic is still served through the generated bundle `app.js`, with source blocks stored under `js/`.

Repository metadata has been aligned with MVP10:

- `package.json` version: `0.10-hybrid-dungeon-visuals`
- `.gitignore` ignores `.DS_Store`

## 2. Main Folders

Main project folders currently present:

- `assets/`: base runtime assets used by `app.js`.
- `assets/smart/`: MVP10 smart dungeon texture atlas.
- `dev/`: legacy development reference file.
- `js/`: modular source blocks used to generate `app.js`.
- `tilesets/`: unpacked tileset source folders and tile PNG files.
- `tools/`: build, syntax, bundle consistency, texture, split, and tileset validation scripts.

## 3. Main Runtime Files

Primary runtime files:

- `index.html`: static app shell and DOM structure.
- `style.css`: layout, editor, canvas, play/player window, layer, object, and smart visual styling.
- `app.js`: generated runtime bundle loaded by the browser.
- `tileset_loader.js`: ZIP tileset import and validation loader loaded after `app.js`.

Supporting project files:

- `package.json`: local script definitions.
- `README.txt`: MVP10 user/development notes.
- `SVILUPPO.md`: technical development guide.
- `ARCHITETTURA.md`: architecture and historical MVP notes.

## 4. Relationship Between `js/` And `app.js`

`app.js` is generated from the source blocks in `js/` by `tools/build-app.js`.

Build order:

1. `js/00_config.js`
2. `js/10_ui.js`
3. `js/20_canvas_view.js`
4. `js/30_objects_properties.js`
5. `js/40_brush_assets.js`
6. `js/50_storage_settings.js`
7. `js/60_smart_walls.js`
8. `js/90_main_init.js`
9. `js/95_safety_bindings.js`

`tools/check-bundle.js` verifies that the generated bundle from `js/` exactly matches `app.js`.

Important rule: `app.js` must not be edited directly when it derives from `js/`. Change the relevant source block in `js/`, then run `node tools/build-app.js`, then run the checks.

## 5. Required Checks

Run these checks before committing changes:

```sh
node --check app.js
node --check tileset_loader.js
node tools/check-js.js
node tools/check-bundle.js
node tools/validate-tileset.js sample_tileset_gilda_base_v1.zip
node tools/validate-tileset.js gilda_mini_premium_01.zip
```

Available package scripts:

```sh
npm run check
npm run check:bundle
npm run validate:tileset -- sample_tileset_gilda_base_v1.zip
npm run validate:tileset -- gilda_mini_premium_01.zip
```

## 6. Tilesets Present And Validated

ZIP tilesets in the repository root:

- `sample_tileset_gilda_base_v1.zip`
- `gilda_mini_premium_01.zip`

Unpacked tileset folders:

- `tilesets/sample_base_single_wall/`
- `tilesets/gilda_mini_premium_01/`

Both root ZIP tilesets are expected to validate with `tools/validate-tileset.js`.

## 7. Rules Not To Break

- Do not edit `app.js` directly when changing app behavior; edit `js/` and rebuild.
- Do not change canvas/editor behavior without focused validation.
- Do not change layer semantics casually; visibility, locking, and z-order depend on them.
- Do not change smart brush geometry or texture paths without visual checks.
- Do not change `tileset_loader.js` without validating existing ZIP tilesets.
- Do not change player view synchronization without testing `?player=1`.
- Keep `assets/`, `assets/smart/`, `tools/`, `js/`, `tilesets/`, and `dev/` in the repository.
- Keep `tools/check-bundle.js` passing so `app.js` and `js/` do not drift.

## 8. Recommended Next Technical Step

The next safe technical step is to add a lightweight smoke-test checklist or script for opening the static app locally and confirming that referenced runtime assets are reachable.

Suggested scope:

- no app logic changes;
- no refactor;
- verify `index.html`, `app.js`, `style.css`, `tileset_loader.js`, and key `assets/` paths load correctly;
- keep the current MVP10 behavior unchanged.

## 9. Direct `app.js` Edit Warning

`app.js` is the browser runtime bundle, but it derives from the modular source blocks in `js/`.

Do not modify `app.js` directly for feature or bug work unless `app.js` is intentionally being treated as the source of truth. Under the current MVP10 workflow, edit `js/`, rebuild `app.js` with `node tools/build-app.js`, and verify with `node tools/check-bundle.js`.
