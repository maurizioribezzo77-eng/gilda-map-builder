# Sketch to Dungeon Architecture

Architettura prevista per evolvere Gilda Map Builder in Sketch to Dungeon senza riscrivere l'app da zero.

## Principi

- Conservare l'app statica esistente e migrare per moduli.
- Tenere `index.html`, `style.css`, `js/` e `app.js` compatibili durante la transizione.
- Introdurre un modello dati geometry based accanto al modello legacy.
- Mantenere import/export JSON e localStorage.
- Trattare le stanze come elementi con `geometry`, mai come soli `x`, `y`, `width`, `height`.
- Separare progressivamente data model, geometria, tool, rendering e persistenza.

## Vista ad alto livello

```text
Project
  DungeonMap[]
    Layer[]
    Element[]
    TreeNode[]
    TileSetRef[]

EditorState
  activeMapId
  activeTool
  selection
  viewport
  brush

Rendering
  canvas/grid
  sketch layer
  element renderers
  smart geometry renderers

Persistence
  localStorage
  JSON import/export
  legacy migration
```

## Canvas

Il canvas resta inizialmente DOM based:

- `#canvasWrap`: scroll/pan container.
- `#canvasStage`: dimensione scalata.
- `#canvas`: superficie mappa in pixel.
- `#gridLayer`: griglia VTT.
- `#smartLayer`: geometrie procedurali attuali.
- `#viewportLayer`: riferimento TV.
- `#playerViewLayer`: area vista player.
- `.mapObject`: elementi renderizzati.

Evoluzione prevista:

- aggiungere renderer per `Element.geometry`;
- mantenere renderer legacy per `objects[]`;
- spostare conversioni coordinate in un modulo geometry;
- unificare snap e misure su coordinate mappa, non su DOM.

File da toccare:

- `js/20_canvas_view.js`
- `js/30_objects_properties.js`
- `js/60_smart_walls.js`
- `style.css`

## Strumenti

Tool attuali:

- asset brush;
- drag/drop;
- smart dungeon brush;
- wall cell brush;
- selezione e gruppo;
- proprieta;
- layer visibility/lock.

Tool previsti:

- sketch stroke;
- room rectangle;
- room circle;
- room polygon regular;
- room free polygon;
- corridor;
- door;
- stair;
- pin;
- token;
- tile placement.

Ogni tool dovrebbe avere:

- `id`;
- `label`;
- `cursor`;
- `onPointerDown`;
- `onPointerMove`;
- `onPointerUp`;
- `cancel`;
- `commitElement`.

File di partenza:

- `js/40_brush_assets.js`
- `js/60_smart_walls.js`
- `js/95_safety_bindings.js`
- `js/90_main_init.js`

## Modello dati

Il modello target e' descritto in `docs/DATA_MODEL.md`.

Transizione consigliata:

1. Aggiungere funzioni pure di normalizzazione e creazione elementi.
2. Lasciare `project.maps[].objects` per compatibilita.
3. Aggiungere `project.maps[].elements`.
4. Renderizzare prima `objects`, poi `elements`.
5. Migrare gradualmente i tool a `elements`.
6. Solo dopo, convertire export/import e proprieta al nuovo modello.

## Geometrie

Geometry e' il centro della nuova app.

Tipi previsti:

- `RectGeometry`;
- `CircleGeometry`;
- `PolygonGeometry`;
- `PolylineGeometry`;
- `PointGeometry`.

Uso previsto:

- `room`: `RectGeometry`, `CircleGeometry` o `PolygonGeometry`;
- `corridor`: `PolylineGeometry` o `PolygonGeometry`;
- `door`: `RectGeometry` o `PolylineGeometry` breve;
- `stair`: `RectGeometry`, `PolygonGeometry` o `PointGeometry` con stile;
- `pin`: `PointGeometry`;
- `token`: `PointGeometry` o `CircleGeometry`;
- `tile`: `RectGeometry`;
- `sketchStroke`: `PolylineGeometry`.

Regola sulle stanze:

- stanza rettangolare: `RectGeometry`;
- stanza circolare: `CircleGeometry`;
- stanza pentagonale: `PolygonGeometry` con 5 punti;
- stanza esagonale: `PolygonGeometry` con 6 punti;
- stanza libera futura: `PolygonGeometry` con numero variabile di punti.

## Albero

L'albero attuale e' generato in `buildTree()` con voci statiche.

Target:

- `TreeNode` separato dal DOM;
- node per project, maps, folders, layers, elements, handouts, exports;
- supporto a `linkedMapId` per collegamenti tra mappe;
- selezione sincronizzata con canvas e proprieta.

File iniziale:

- `js/10_ui.js`

## Proprieta

Il pannello proprieta attuale lavora sugli oggetti legacy.

Target:

- pannello basato su `Element`;
- editor per nome, tipo, layer, rotazione, visibilita player, note master/player, linked map, stile;
- editor geometry specifici:
  - rect: x, y, width, height;
  - circle: cx, cy, radius;
  - polygon: lista punti;
  - polyline: lista punti, width opzionale;
  - point: x, y.

File iniziale:

- `js/30_objects_properties.js`

## Salvataggio

Persistenza attuale:

- `localStorage`;
- export/import JSON;
- player sync.

Target:

- aggiungere `schemaVersion`;
- aggiungere migration pipeline;
- mantenere lettura progetti legacy;
- esportare sia dati editor sia dati player safe;
- distinguere export project, export map, export player map.

File iniziali:

- `js/50_storage_settings.js`
- `js/10_ui.js` per `normalizeProject()`

## Esportazione

Export previsti:

- JSON completo progetto;
- JSON singola mappa;
- JSON player safe senza note master e elementi non visibili;
- immagine PNG futura;
- tileset manifest futuro.

Per la prima fase basta formalizzare JSON e migrazioni.

## Tile set

Tileset attuale:

- formato `map-generator-tileset`;
- versione 1;
- cell size 256;
- massimo 4 celle;
- categorie mappate sui layer app.

Target:

- mantenere loader attuale;
- aggiungere `TileSetRef` nel data model;
- legare `tile` elements ad asset tileset via `assetId` o `tileId`;
- non duplicare data URL piu del necessario nei progetti futuri;
- mantenere compatibilita con ZIP v1.

File iniziale:

- `tileset_loader.js`

## Compatibilita legacy

Ogni elemento legacy `object` puo essere rappresentato come:

```json
{
  "id": "legacy-id",
  "type": "tile",
  "name": "Nome asset",
  "geometry": {
    "kind": "rect",
    "x": 0,
    "y": 0,
    "width": 100,
    "height": 100
  },
  "rotation": 0,
  "visibleToPlayers": true,
  "style": {
    "assetId": "stone_floor",
    "opacity": 1
  },
  "layerId": "pavimenti"
}
```

Non bisogna cancellare `objects[]` finche UI, export, import e player window non supportano `elements[]`.
