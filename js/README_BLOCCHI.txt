Questi file sono i sorgenti di lavoro.
Il browser carica ancora app.js unico per stabilita' e per mantenere l'apertura semplice da index.html.

Flusso:
1. modifica il blocco interessato in js/;
2. esegui node tools/build-app.js dalla cartella principale;
3. esegui node tools/check-js.js;
4. ricarica index.html.

Se app.js diventa temporaneamente la versione piu' aggiornata, usa:
node tools/split-app.js

Nota: 95_safety_bindings.js contiene i binding finali di pennello e drag/drop che nel bundle erano in fondo al file.
