# Gilda Map Builder MVP 0.4 — struttura a blocchi

Questa versione non aggiunge funzioni nuove importanti: serve soprattutto a rendere il codice più ordinato e modificabile.

## Struttura principale

- `index.html`  
  Struttura della pagina e caricamento dei blocchi JavaScript.

- `style.css`  
  Aspetto grafico, layout, menu, colonne, canvas, griglia, viewport, pennello.

- `js/00_config.js`  
  Costanti, preset mappa, asset base, stato iniziale del progetto, riferimenti DOM, utility minime.

- `js/10_ui.js`  
  Albero mappe, layer, libreria asset, categorie richiudibili, normalizzazione progetto, render generale, colonne laterali e modalità editor/gioco.

- `js/20_canvas_view.js`  
  Canvas, griglia, dimensioni in quadretti, area TV, vista player, viste salvate, navigazione mappa.

- `js/30_objects_properties.js`  
  Oggetti piazzati, proprietà, drag, scala, rotazione, copia/incolla, z-order, eliminazione.

- `js/40_brush_assets.js`  
  Pennello, anteprima asset, punto di aggancio, piazzamento su griglia, import PNG come asset.

- `js/50_storage_settings.js`  
  Salvataggio locale, caricamento, import/export JSON, impostazioni griglia, zoom e scorciatoie.

- `js/90_main_init.js`  
  Collegamento dei pulsanti, listener mouse/tastiera, sincronizzazione finestra giocatori e avvio applicazione.

- `dev/app_mvp03j_legacy.js`  
  Copia del vecchio file unico, lasciata solo come backup di confronto. Non viene caricata dall’app.

- `tools/build-app.js`  
  Rigenera `app.js` dai blocchi in `js/`.

- `tools/check-js.js`  
  Controlla la sintassi JavaScript dei file principali.

- `tools/split-app.js`  
  Ricrea i blocchi `js/` partendo da `app.js`, utile solo quando il bundle e' la fonte piu' aggiornata.

## Regola pratica per le prossime modifiche

- Problemi con il pennello: modificare `js/40_brush_assets.js`.
- Problemi con rotazione/scalatura/proprietà oggetti: modificare `js/30_objects_properties.js`.
- Problemi con griglia, canvas, zoom e vista giocatori: modificare `js/20_canvas_view.js`.
- Problemi con menu, colonne, asset library: modificare `js/10_ui.js`.
- Problemi con salvataggi/import/export: modificare `js/50_storage_settings.js`.

## Nota

I file sono caricati come script classici, non come moduli ES6. Questo mantiene l’app semplice e apribile direttamente con doppio clic su `index.html`, senza server locale.


## Nota MVP 0.4b

La 0.4 pura caricava direttamente più file JavaScript separati.
In alcuni contesti questo ha rotto pennello e drag & drop.

Per stabilità, la 0.4b torna a caricare un `app.js` unico generato dai blocchi.
I file in `js/` restano come divisione concettuale e sorgente di lavoro, ma l'app runtime usa `app.js`.

Flusso consigliato:
1. si modifica il blocco interessato in `js/`;
2. si rigenera `app.js` con `node tools/build-app.js`;
3. l'app continua a essere stabile apribile con doppio click.


## MVP 0.5 — Layer

La gestione layer ora è parte centrale del progetto.

- Le definizioni base sono in `DEFAULT_LAYER_DEFS`.
- Lo stato modificabile è in `project.layers`.
- Ogni oggetto piazzato ha `layer`.
- Ogni asset ha un layer predefinito tramite `assetDefaultLayer(asset)`.
- La visibilità usa:
  - `objectVisibleForMaster(obj)`
  - `objectVisibleForPlayer(obj)`
- Il blocco editing usa:
  - `objectLayerLocked(obj)`

Il dungeon di esempio è dentro il progetto iniziale, nella mappa `sample_dungeon`.


## MVP 0.6 — Disegno rapido

Il pennello ora distingue tre modalità:

- `stamp`: piazza asset singolo.
- `line`: usato dai muri, disegna una linea orizzontale/verticale con spessore 0,5 quadretti.
- `rect`: usato dai pavimenti, disegna un rettangolo.

Funzioni principali:
- `brushDrawMode(asset)`
- `computeDrawBox(asset, start, current)`
- `handleCanvasPointerDown(e)`
- `handleCanvasPointerMove(e)`
- `finishBrushDraw(e)`
- `addAssetBox(assetId, box)`


## MVP 0.6b — Disegno modulare

La funzione `addAssetBox(assetId, box)` ora non crea più un unico asset scalato per muri e pavimenti.

- `rect`: genera una griglia di oggetti 1×1.
- `line`: genera una sequenza di oggetti:
  - orizzontale: 1×0,5;
  - verticale: 0,5×1.

Questo mantiene il disegno coerente con asset modulari e non con immagini deformate.


## MVP 0.6c — Asset grafici integrati

Sono stati sostituiti i principali asset SVG con PNG illustrati.

Nuova logica:
- `asset.src` = variante standard / orizzontale
- `asset.srcVertical` = variante verticale, quando necessaria

Funzioni aggiunte:
- `assetSrcForBox(asset, w, h)`
- `assetSrcForObject(asset, obj)`

Uso:
- il render della mappa sceglie automaticamente la variante verticale se `h > w`;
- il brush preview usa la stessa logica, così l'anteprima è coerente.


## MVP 0.6d — Asset edge-to-edge

Correzione fondamentale:
- prima il canvas usava `object-fit: contain`, che lasciava spazio interno visibile;
- ora usa `object-fit: fill` per gli oggetti mappa e per il brush preview.

In più, gli asset modulari principali sono stati ridisegnati come SVG edge-to-edge:
- nessun margine trasparente;
- nessuna “cornice” indesiderata;
- pavimento pensato per tassellarsi meglio;
- muri pensati per moduli da 1×0,5 e 0,5×1.
