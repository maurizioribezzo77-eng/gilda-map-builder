# Agent Tasks

Moduli assegnabili ad agenti separati per evolvere il repository verso Sketch to Dungeon.

## Regole comuni

- Non riscrivere l'app da zero.
- Non cancellare funzioni esistenti se non sono rotte e inutilizzate.
- Modificare i sorgenti in `js/`, poi eseguire `npm run build`.
- Eseguire `npm run check` e `npm run check:bundle`.
- Mantenere compatibilita con `project.maps[].objects` fino a migrazione completata.
- Ogni stanza nuova deve usare `Element.geometry`.
- Documentare limiti o debiti trovati invece di nasconderli.

## 1. Data Model

Obiettivo:

- introdurre `schemaVersion`;
- aggiungere factory e normalizzatori per `Project`, `DungeonMap`, `Element`, `Layer`, `TreeNode`;
- aggiungere `elements[]` senza rompere `objects[]`;
- creare adapter legacy object to element.

File da toccare:

- `js/00_config.js`
- `js/10_ui.js`
- eventualmente nuovo `js/05_data_model.js`
- `tools/build-app.js`
- `tools/check-bundle.js`

Output atteso:

- modello dati iniziale in codice;
- migrazione non distruttiva;
- documentazione aggiornata se cambia il modello.

## 2. Geometry

Obiettivo:

- implementare funzioni pure per `RectGeometry`, `CircleGeometry`, `PolygonGeometry`, `PolylineGeometry`, `PointGeometry`;
- bounds, hit test, snap, transform, rotate, scale;
- conversione geometry to SVG/DOM style.

File da toccare:

- eventuale nuovo `js/15_geometry.js`
- `js/20_canvas_view.js`
- `js/30_objects_properties.js`
- `tools/build-app.js`
- `tools/check-bundle.js`

Output atteso:

- API geometry riutilizzabile dai tool;
- nessuna stanza salvata solo come `x`, `y`, `w`, `h`.

## 3. Canvas/Grid

Obiettivo:

- rendere il canvas capace di renderizzare `elements[]`;
- mantenere render legacy `objects[]`;
- consolidare griglia, zoom, pan e snap;
- separare coordinate mappa da coordinate DOM.

File da toccare:

- `js/20_canvas_view.js`
- `js/30_objects_properties.js`
- `style.css`

Output atteso:

- rendering misto legacy + elements;
- viewport e player view invariati.

## 4. Sketch Layer

Obiettivo:

- aggiungere tool sketch stroke;
- salvare stroke come `ElementType: "sketchStroke"` con `PolylineGeometry`;
- supportare colore, spessore, opacita;
- opzionalmente layer master-only.

File da toccare:

- `js/40_brush_assets.js`
- `js/95_safety_bindings.js`
- `js/30_objects_properties.js`
- `style.css`

Output atteso:

- disegno libero base;
- stroke selezionabile o almeno cancellabile;
- export/import funzionante.

## 5. Room Tools

Obiettivo:

- tool stanza rettangolare con `RectGeometry`;
- tool stanza circolare con `CircleGeometry`;
- tool stanza poligonale regolare con `PolygonGeometry`;
- predisposizione stanza libera con `PolygonGeometry`.

File da toccare:

- eventuale nuovo `js/45_room_tools.js`
- `js/95_safety_bindings.js`
- `js/30_objects_properties.js`
- `style.css`
- `index.html` per controlli UI minimi

Output atteso:

- `ElementType: "room"`;
- proprieta stanza modificabili;
- nessuna stanza modellata solo come `x`, `y`, `width`, `height`.

## 6. Tree/Properties

Obiettivo:

- estendere albero progetto per mostrare mappe, layer ed elementi;
- collegare selezione al canvas;
- pannello proprieta per `Element`;
- note master/player e `linkedMapId`.

File da toccare:

- `js/10_ui.js`
- `js/30_objects_properties.js`
- `index.html`
- `style.css`

Output atteso:

- albero non piu solo statico;
- proprieta geometry-aware;
- compatibilita con oggetti legacy.

## 7. Pin/Token

Obiettivo:

- implementare `pin` e `token` come `Element`;
- supportare `PointGeometry` e/o `CircleGeometry`;
- supportare label, note, visibilita player, link mappa.

File da toccare:

- `js/40_brush_assets.js`
- `js/30_objects_properties.js`
- `js/10_ui.js`
- `style.css`

Output atteso:

- pin e token salvati nel nuovo modello;
- render player-safe.

## 8. Tileset

Obiettivo:

- mantenere loader ZIP v1;
- collegare tile assets a `ElementType: "tile"`;
- aggiungere `TileSetRef` nel modello;
- evitare rotture nella libreria asset esistente.

File da toccare:

- `tileset_loader.js`
- `js/00_config.js`
- `js/10_ui.js`
- `js/40_brush_assets.js`
- `tools/validate-tileset.js`

Output atteso:

- tile piazzabili come elementi geometry based;
- compatibilita con tileset esistenti.

## 9. Persistence/Export

Obiettivo:

- introdurre migrazioni dati versionate;
- salvare/caricare `elements[]`;
- export project completo;
- export player safe;
- mantenere import legacy.

File da toccare:

- `js/50_storage_settings.js`
- `js/10_ui.js`
- eventuale nuovo `js/55_migrations.js`
- `tools/build-app.js`
- `tools/check-bundle.js`

Output atteso:

- import/export stabile;
- localStorage non distruttivo;
- player window continua a sincronizzarsi.

## 10. Integration Review

Obiettivo:

- verificare che i moduli funzionino insieme;
- controllare bundle, syntax, avvio e flussi principali;
- rivedere compatibilita legacy;
- aggiornare documentazione.

File da toccare:

- `docs/`
- eventuali fix nei moduli toccati dagli agenti precedenti.

Checklist:

- `npm run build`
- `npm run check`
- `npm run check:bundle`
- `npm run serve`
- apertura editor
- import/export JSON
- salvataggio locale
- player window
- tileset base
- oggetti legacy ancora visibili
- elementi geometry based visibili

## Ordine consigliato

1. Data Model
2. Geometry
3. Persistence/Export
4. Canvas/Grid
5. Sketch Layer
6. Room Tools
7. Tree/Properties
8. Pin/Token
9. Tileset
10. Integration Review
