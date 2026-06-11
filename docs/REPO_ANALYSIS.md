# Repository Analysis

Analisi preparatoria per lo sviluppo modulare di Sketch to Dungeon sul repository esistente Gilda Map Builder.

## Stack rilevato

- App web statica, avviabile direttamente da `index.html`.
- JavaScript vanilla senza framework frontend.
- CSS plain in `style.css`.
- Rendering editor basato su DOM HTML/CSS dentro `#canvas`, con layer sovrapposti e SVG procedurale per smart walls.
- Build locale Node.js usata per comporre `app.js` dai blocchi sorgente in `js/`.
- Nessun package manager lockfile e nessuna dipendenza npm dichiarata.
- Tileset ZIP validati e letti in browser da `tileset_loader.js`.

## Framework e librerie

- Nessun framework applicativo rilevato.
- Nessun bundler esterno rilevato.
- API browser usate direttamente: DOM, localStorage, BroadcastChannel, FileReader, Blob, URL, DecompressionStream.
- Script Node.js custom in `tools/`.

## Struttura attuale

```text
repo/
  index.html
  style.css
  app.js
  tileset_loader.js
  package.json
  js/
    00_config.js
    10_ui.js
    20_canvas_view.js
    30_objects_properties.js
    40_brush_assets.js
    50_storage_settings.js
    60_smart_walls.js
    90_main_init.js
    95_safety_bindings.js
  tools/
    build-app.js
    split-app.js
    check-js.js
    check-bundle.js
    validate-tileset.js
    generate-smart-textures.js
  assets/
    base/
    muri/
    porte/
    scale_botole/
    oggetti/
    overlay/
    token/
    icone/
    smart/
  tilesets/
    sample_base_single_wall/
    gilda_mini_premium_01/
  dev/
    app_mvp03j_legacy.js
```

## File principali

- `index.html`: layout dell'app, barre laterali, canvas, toolbar, menu file, menu canvas/VTT, proprieta, layer e tileset.
- `style.css`: layout, canvas, griglia, oggetti, layer, player mode, tileset e smart brush styling.
- `app.js`: bundle unico caricato dal browser. E' generato dai file in `js/`.
- `tileset_loader.js`: loader e validatore runtime per tileset ZIP v1.
- `js/00_config.js`: costanti globali, preset mappa, layer, asset base, stato `project`, riferimenti DOM e utility.
- `js/10_ui.js`: albero progetto, layer, libreria asset, normalizzazione, render generale, modalita editor/play.
- `js/20_canvas_view.js`: canvas, griglia, zoom, viewport TV, vista player, viste salvate, pan.
- `js/30_objects_properties.js`: oggetti piazzati, selezione, gruppi, drag, proprieta, z-order, copia/incolla, visibilita player.
- `js/40_brush_assets.js`: pennello asset, preview, piazzamento, import PNG custom.
- `js/50_storage_settings.js`: localStorage, import/export JSON, grid size, zoom, sincronizzazione controlli.
- `js/60_smart_walls.js`: smart dungeon brush e wall brush, celle, path, geometria SVG procedurale.
- `js/90_main_init.js`: binding eventi DOM, sync player window, bootstrap.
- `js/95_safety_bindings.js`: binding finali pointer/drag/drop.
- `tools/build-app.js`: genera `app.js` dai blocchi `js/`.
- `tools/check-js.js`: syntax check dei file JavaScript.
- `tools/check-bundle.js`: verifica che `app.js` sia allineato ai sorgenti `js/`.

## Come avviare il progetto

Opzione semplice:

```bash
open index.html
```

Opzione con server locale:

```bash
npm run serve
```

Poi aprire:

```text
http://localhost:8765
```

## Comandi disponibili

```bash
npm run build
npm run check
npm run check:bundle
npm run validate:tileset
npm run serve
```

`npm run build` esegue `node tools/build-app.js` e rigenera `app.js` dai blocchi in `js/`.

## Gestione stato rilevata

Lo stato centrale attuale e' una variabile globale `project` definita in `js/00_config.js`.

Campi principali attuali:

- `project.name`
- `project.activeMapId`
- `project.mode`
- `project.showGrid`
- `project.snap`
- `project.snapDivisor`
- `project.gridSize`
- `project.mapPreset`
- `project.showViewport`
- `project.playerFollowEditor`
- `project.playerZoom`
- `project.customAssets`
- `project.layers`
- `project.ui`
- `project.maps`
- `project.tilesets` aggiunto dal tileset loader

Ogni mappa attuale usa:

- `id`, `name`
- `width`, `height`
- `squaresW`, `squaresH`
- `viewportX`, `viewportY`
- `views`
- `groups`
- `playerView`
- `objects`
- `smartLayers`

Gli oggetti attuali sono asset piazzati con `x`, `y`, `w`, `h`, `cellsW`, `cellsH`, `rot`/`rotation`, `layer`, `visibleMaster`, `visiblePlayer`, `opacity`, `z`, `assetId`.

## Canvas/editor gia presente

Presente e funzionante:

- Canvas DOM in `#canvas`, contenuto da `#canvasStage` e `#canvasWrap`.
- Griglia VTT disegnata come linee DOM in `#gridLayer`.
- Oggetti mappa come div `.mapObject` con immagine interna.
- Layer visuali HTML sovrapposti: griglia, smart layer, viewport TV, player view, brush preview.
- Selezione singola e multipla.
- Gruppi.
- Drag and drop asset.
- Pennello asset.
- Smart Dungeon Brush e Wall Cell Brush.
- Vista player in finestra separata.
- Modalita play locale.

## Persistenza dati

Persistenza presente:

- Salvataggio locale in `localStorage` tramite `STORAGE_KEY`.
- Caricamento locale da browser.
- Export JSON del `project`.
- Import JSON del `project`.
- Sync player window con `BroadcastChannel`, `localStorage` event e polling.

Non presenti:

- Backend.
- Database.
- Autenticazione.
- Salvataggio cloud.
- Migrazioni dati versionate formali.

## Problemi trovati

- La cartella workspace contiene il repository reale in `repo/`; la root superiore non e' una working tree Git.
- Il branch `develop` non e' presente localmente al momento dell'analisi.
- Working tree gia modificata prima della task: `SVILUPPO.md` risulta modificato e non e' stato toccato.
- Stato globale e funzioni globali rendono difficile assegnare moduli indipendenti senza conflitti.
- Il modello oggetti attuale e' asset/pixel based, non geometry based.
- Le stanze future non devono essere modellate come soli `x`, `y`, `w`, `h`; serve un campo `geometry`.
- `app.js` e `js/` devono restare sincronizzati. Gli agenti devono modificare `js/` e poi eseguire build.
- Il render e la mutazione dati sono accoppiati: molte funzioni modificano `project` e aggiornano il DOM nello stesso punto.
- Mancano test automatici di comportamento UI; esistono check sintattici e bundle consistency.
- Alcune note storiche e report MVP sono in root, non organizzati sotto `docs/`.

## Parti riutilizzabili

- Layout esistente di editor, pannelli laterali, proprieta e albero.
- Sistema layer master/player.
- Griglia VTT, snap, zoom, pan e viewport player.
- Import/export JSON e salvataggio locale.
- Player window sync.
- Libreria asset e import PNG custom.
- Tileset ZIP v1 e validazione manifest.
- Smart brush cell-based come base per sketch layer o generazione dungeon.
- Rendering SVG procedurale di muri e dungeon.
- Selezione, gruppi, z-order, copia/incolla.

## Parti da rifattorizzare

- Estrarre un data model centrale da `project` globale.
- Introdurre `Element` geometry based mantenendo compatibilita con gli `objects` legacy.
- Separare geometria pura da rendering DOM/SVG.
- Separare tools/editor state da persistenza.
- Formalizzare `Layer` con ordine, lock e visibilita.
- Formalizzare albero progetto e proprieta come viste del modello dati, non come dati testuali hardcoded.
- Introdurre una migrazione legacy: `objects[]` attuali verso `elements[]` con `geometry`.
- Portare room/corridor/door/stair/pin/token/tile a `ElementType`.
- Aggiungere test dati e conversioni prima di sostituire parti UI.

## Regola operativa per agenti successivi

- Modificare i sorgenti in `js/`, non direttamente `app.js`, salvo interventi di emergenza.
- Dopo modifiche in `js/`, eseguire `npm run build`.
- Poi eseguire `npm run check` e `npm run check:bundle`.
- Non eliminare `objects[]` finche la migrazione a `elements[]` non e' implementata e verificata.
