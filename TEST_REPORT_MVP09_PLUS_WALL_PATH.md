# Test report MVP 0.9++ Wall Path

Data: 2026-06-09

## Modifiche principali

- Il Wall Brush supporta segmenti path-based.
- Trascinare in diagonale crea un muro diagonale vero, non una scaletta di celle.
- Il click breve continua a creare una singola cella muro.
- La cancellazione smart rimuove sia celle sia segmenti vicini al puntatore.
- Il rendering procedurale usa:
  - pattern interno;
  - contorno/ombra;
  - highlight;
  - crepe/dettagli deterministici.

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

- Selezionare `Pennelli Smart > Wall Cell Brush`.
- Trascinare in diagonale.
- Verificare che il muro sia una linea diagonale continua.
- Fare click breve e verificare una cella singola.
- Usare `Cancella smart` su una diagonale.
- Salvare e ricaricare.
- Verificare `?player=1`.

## Limiti noti

- I path sono segmenti lineari semplici a due punti.
- Non esiste ancora editing dei nodi del path.
- Non esistono ancora curve o muri circolari.
