# Test report MVP 0.9+ Smart Brush Refactor

Data: 2026-06-09

## Modifiche principali

- Pannello `Pennelli Smart` con selezione tipo pennello e preset.
- `Dungeon Brush` cell-based.
- `Wall Cell Brush` cell-based.
- Preset: Abitato, Abbandonato, Rovina, Tunnel grezzo.
- Edge randomness deterministica tramite hash, senza `Math.random()` nel render.
- Libreria asset raggruppata per funzione:
  - Oggetti Interattivi
  - Oggetti Decorativi
  - Token
  - Overlay / Effetti
- Muri legacy nascosti dalla libreria principale.

## Struttura dati

Ogni mappa puo' contenere:

```json
{
  "objects": [],
  "smartLayers": [],
  "regions": [],
  "paths": []
}
```

In questa build sono attivi due smart layer:

```text
smart_dungeon_architettura
smart_wall_architettura
```

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
- Usare `Pennelli Smart > Dungeon Brush`.
- Disegnare una cella singola.
- Disegnare un corridoio trascinando.
- Disegnare una stanza 2x2 o piu' grande.
- Cambiare preset e verificare bordo stabile.
- Usare `Cancella smart`.
- Passare a `Wall Cell Brush`.
- Salvare localmente e ricaricare.
- Aprire `?player=1`.
- Verificare che asset statici e tileset loader restino funzionanti.

## Limiti noti

- Nessun Wall Path Brush ancora.
- Wall Brush aggiornato: trascinamento libero crea segmenti path-based per diagonali.
- Nessuna regione morbida ancora.
- Nessuno slider manuale dei preset ancora.
- Rendering procedurale volutamente semplice.
