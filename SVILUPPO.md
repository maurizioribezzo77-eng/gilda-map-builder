# Gilda Map Builder - guida sviluppo

Questa cartella e' la base di sviluppo pulita dell'app.

## Avvio

L'app resta statica: puoi aprire `index.html` con doppio click.

In alternativa, per provarla via server locale:

```sh
python3 -m http.server 8765
```

Poi apri:

```text
http://127.0.0.1:8765/index.html
```

## File principali

- `index.html`: struttura della pagina.
- `style.css`: grafica e layout.
- `tileset_loader.js`: import dei tileset ZIP.
- `app.js`: bundle unico caricato dal browser.
- `js/`: sorgenti divisi in blocchi, da modificare durante lo sviluppo.
- `tools/`: script locali per build e controlli.

## Flusso consigliato

1. Modifica i file in `js/`.
2. Rigenera `app.js`:

```sh
node tools/build-app.js
```

3. Controlla la sintassi:

```sh
node tools/check-js.js
```

4. Riapri o ricarica `index.html`.

## Blocchi sorgente

- `js/00_config.js`: configurazione, stato iniziale, asset base, utility.
- `js/10_ui.js`: UI, libreria asset, layer, modalita' editor/gioco.
- `js/20_canvas_view.js`: canvas, zoom, griglia, area TV, viste.
- `js/30_objects_properties.js`: oggetti, selezione, drag, proprieta', gruppi.
- `js/40_brush_assets.js`: pennello, disegno rapido, import PNG.
- `js/50_storage_settings.js`: salvataggio locale, import/export JSON.
- `js/60_smart_walls.js`: smartLayers e prototipo Smart Wall MVP 0.9.
- `js/90_main_init.js`: collegamento pulsanti, eventi globali, avvio.
- `js/95_safety_bindings.js`: binding finali per pennello e drag/drop.

## Script disponibili

```sh
node tools/build-app.js
```

Rigenera `app.js` dai blocchi in `js/`.

```sh
node tools/check-js.js
```

Controlla la sintassi JavaScript dei file principali.

```sh
node tools/check-bundle.js
```

Controlla che `app.js` corrisponda ai blocchi in `js/`. Se modifichi `js/`, rigenera `app.js` con `node tools/build-app.js` prima di committare. Non modificare `app.js` direttamente quando deriva dai blocchi sorgente.

```sh
node tools/validate-tileset.js gilda_mini_premium_01.zip
```

Valida un tileset ZIP nel formato MAP GENERATOR TILESET v1.
Per i muri, il validatore blocca `fileVertical` e suffissi `_h` / `_v`: ogni muro deve essere un solo asset con un solo PNG.

```sh
node tools/split-app.js
```

Ricrea i blocchi in `js/` partendo da `app.js`. Usalo solo se `app.js` e' diventato la fonte piu' aggiornata.

## Regola pratica

Non modificare `app.js` a mano per nuove funzioni. Modifica prima il blocco giusto in `js/`, poi rigenera `app.js`.
