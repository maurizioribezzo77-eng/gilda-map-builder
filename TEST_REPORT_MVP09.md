# Test report MVP 0.9 Smart Wall Prototype

Data: 2026-06-09

## Analisi core richiesta

- Oggetti mappa: `js/30_objects_properties.js`, funzione `renderObjects()`.
- Layer: `js/10_ui.js`, funzioni `ensureLayers()`, `layerState()`, `objectVisibleForMaster()`, `objectVisibleForPlayer()`.
- Rendering asset: `js/30_objects_properties.js`, funzioni `renderObjects()`, `assetSrcForObject()`.
- Pennello: `js/40_brush_assets.js`, funzioni `handleCanvasPointerDown()`, `handleCanvasPointerMove()`, `finishBrushDraw()`.
- Salvataggio: `js/50_storage_settings.js`, funzioni `saveLocal()`, `loadLocal()`, `exportJson()`, `importJson()`.
- Player view/sync: `js/30_objects_properties.js`, funzioni `publishProject()`, `loadProjectRaw()`, e `js/90_main_init.js`.

## Modifiche MVP 0.9

- Aggiunto `js/60_smart_walls.js`.
- Aggiunta struttura `map.smartLayers`.
- Aggiunto layer procedurale DOM `#smartLayer`.
- Aggiunti controlli UI `Smart Wall Prototype`.
- Aggiunte modalita' disegna/cancella/stop.
- Aggiunto rendering SVG con fill celle e bordo esterno.
- Aggiunta compatibilita' layer `architettura`.
- Aggiunta compatibilita' salvataggio/player view tramite dati progetto.

## Controlli automatici eseguiti

```sh
node tools/build-app.js
node tools/check-js.js
node --check app.js
node --check tileset_loader.js
node tools/validate-tileset.js sample_tileset_gilda_base_v1.zip
node tools/validate-tileset.js gilda_mini_premium_01.zip
```

## Test manuali consigliati

- Aprire `index.html`.
- Cliccare `Disegna muro smart`.
- Disegnare una cella singola.
- Disegnare due o piu' celle adiacenti.
- Verificare che le giunzioni interne non abbiano bordo.
- Cliccare `Cancella muro smart` e rimuovere celle.
- Salvare localmente e ricaricare.
- Aprire `?player=1` e verificare il render del muro smart.
- Verificare che asset statici e tileset loader continuino a funzionare.

## Limiti noti

- Grafica smart wall semplice e procedurale.
- Nessun autotiling PNG avanzato.
- Nessuna smart region o path asset ancora implementata.
