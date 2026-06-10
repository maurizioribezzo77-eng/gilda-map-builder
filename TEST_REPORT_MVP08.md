# Test report MVP 0.8

Data: 2026-06-09

## Controlli automatici eseguiti

```sh
node tools/build-app.js
node tools/check-js.js
node --check app.js
node --check tileset_loader.js
node tools/validate-tileset.js sample_tileset_gilda_base_v1.zip
node tools/validate-tileset.js gilda_mini_premium_01.zip
```

Esito: superato.

## Tileset validati

- `sample_tileset_gilda_base_v1.zip`: 8 tile.
- `gilda_mini_premium_01.zip`: 4 tile.

## Requisiti MVP 0.8 coperti da controllo automatico

- Sintassi JavaScript core.
- Sintassi JavaScript loader tileset.
- Presenza e parsing `tileset.json`.
- Formato MAP GENERATOR TILESET v1.
- PNG obbligatori.
- Categorie tileset valide.
- Layer ufficiali validi.
- Rotazioni consentite.
- Tile massimo 4x4 celle.
- Muri dei tileset come singolo asset logico con un solo PNG.
- Nessun `fileVertical` nei tile di categoria `wall`.
- Nessun suffisso `_h` / `_v` nei file muro dei tileset validati.
- Segmenti muro verticali creati ruotando a 90 gradi il modulo singolo, non stirando il PNG.

## Test manuali consigliati

- Aprire `index.html`.
- Verificare canvas centrale e griglia.
- Disegnare pavimenti con rettangolo.
- Disegnare muri orizzontali e verticali.
- Piazzare porta e cassa dal tileset premium.
- Verificare che non compaiano categorie `Tileset / ...`.
- Salvare localmente, ricaricare, esportare e importare JSON.
- Aprire la vista giocatori con `?player=1`.

## Nota

Il controllo visivo nel browser integrato non e' stato eseguito per blocco della policy locale del browser. La build resta apribile direttamente da `index.html` o tramite server locale.
