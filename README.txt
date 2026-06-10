Gilda Map Builder - MVP 0.10 Hybrid Dungeon Visuals

NUOVE FUNZIONI
- MVP 0.10: resa ibrida per Dungeon Brush e muri smart in stile battlemap grigio/pietra.
- Avvio pulito: il canvas iniziale ora apre una mappa vuota, senza dungeon dimostrativo gia' piazzato.
- Nuovo visual atlas interno in assets/smart con texture ripetibili per pavimento, massa muro, bordo scuro, ombra, crepe e rumore.
- Dungeon Brush: le celle salvate restano pavimento calpestabile; il muro perimetrale viene generato come fascia spessa texturizzata.
- Le celle adiacenti fondono i lati interni: una stanza 2x2 o 5x4 non produce muri interni.
- Wall Brush: click breve = cella muro; trascinamento = muro diagonale/libero come poligono texturizzato, non scaletta di quadretti e non stroke stirato.
- I vecchi smart layer senza visualStyle continuano a funzionare e usano stone_battlemap_v1.
- Canvas 4K orizzontale 3840x2160.
- Canvas 4K verticale 2160x3840.
- Griglia VTT: 1 quadretto = 5 piedi / 1,5 m.
- Dimensione quadretto selezionabile: 120, 100, 96, 80 px.
- Asset dimensionati in quadretti.
- Magnete ON/OFF: gli asset si agganciano alla griglia durante inserimento e spostamento.
- Proprietà in quadretti, non più solo in pixel.
- La scala degli oggetti esistenti si adatta quando cambi la dimensione del quadretto.

COME APRIRE
1. Estrai lo ZIP.
2. Apri la cartella.
3. Doppio click su index.html.

TEST CONSIGLIATO
1. Lascia formato 4K orizzontale e quadretto 120 px.
2. Trascina un Token: deve essere 1x1 quadretto.
3. Trascina una porta: deve essere 1 quadretto di larghezza.
4. Sposta gli oggetti: devono agganciarsi alla griglia.
5. Spegni Magnete OFF e prova a muoverli liberamente.


CORREZIONE 0.2b
- Griglia più visibile.
- Linee minori più chiare.
- Linee maggiori ogni 5 quadretti.
- Spessore della griglia adattato allo zoom per evitare che le linee spariscano quando il canvas è ridotto.


CORREZIONE 0.2c
- La griglia non è più un background CSS.
- Ora è composta da linee reali sovrapposte al canvas.
- Le linee vengono ridisegnate quando cambi zoom, formato o dimensione quadretto.
- Questo evita lo sfarfallio/comparsa-scomparsa causato dallo scaling del background.
- Salvataggio locale separato dalla 0.2/0.2b per evitare conflitti.


CORREZIONE 0.2d
- Risolto problema dello zoom: ora la mappa rimane interamente raggiungibile con le barre di scorrimento.
- Aggiunto un contenitore interno che si ridimensiona in base allo zoom.
- Transform-origin spostato in alto a sinistra per rendere lo scroll prevedibile.
- Salvataggio locale separato dalla 0.2c.


CORREZIONE 0.2e
- Ctrl + rotellina mouse: zoom in / zoom out.
- Su Mac funziona anche Cmd + rotellina.
- Lo zoom cerca di mantenere fermo il punto sotto il mouse.
- Shift + click sinistro trascinato: sposta/panna la mappa.
- Salvataggio locale separato dalla 0.2d.


CORREZIONE 0.2f
- Aggiunte scorciatoie nella lista visibile.
- Aggiunto Aggancio VTT: 1 quadretto, 1/2 quadretto, 1/4 quadretto.
- Default più vincolante: aggancio a 1 quadretto.
- I campi X/Y/Larghezza/Altezza lavorano meglio in quadretti.
- Aggiunti pulsanti Scala + e Scala -.
- Aggiunto tasto + / - per scalare l'oggetto selezionato.
- Aggiunto Alt/Option + rotellina per scalare l'oggetto selezionato.
- Aggiunto pulsante Aggancia a griglia.
- Aggiunto pulsante Misura base.
- Aggiunte frecce direzionali per spostare l'oggetto a scatti VTT.
- Salvataggio locale separato dalla 0.2e.


MVP 0.3
- Il canvas ora è definito in quadretti, non più solo in pixel.
- Default: 100 px per quadretto VTT.
- Preset mappa:
  Stanza 30x20
  Tana 50x30
  Dungeon medio 80x50
  Dungeon grande 120x80
  Mega struttura 200x120
  Personalizzata
- Area TV 4K: 38,4 x 21,6 quadretti.
- Pulsante Area TV ON/OFF.
- Pulsante Imposta area TV dalla vista.
- Pulsante Vai all’area TV.
- Pulsante Vedi tutta la mappa.
- Pulsante Zoom TV 1:1.
- Viste salvate per navigare rapidamente su mappe grandi.
- Salvataggio locale separato dalla 0.2f.

TEST
1. Apri l’app.
2. Scegli Dungeon medio 80x50.
3. Clicca Vedi tutta la mappa.
4. Salva una vista chiamata Ingresso.
5. Spostati e salva una vista chiamata Cuore.
6. Usa i pulsanti delle viste per saltare tra le zone.
7. Usa Imposta area TV dalla vista e poi Vai all’area TV.


MVP 0.3b
- Modalità Gioco ripensata: mostra solo l'Area TV.
- In modalità Gioco spariscono pannelli, griglia, riquadro blu e tavola esterna.
- Pulsante Esci dalla modalità gioco in alto a destra.
- Tasto Esc torna alla modalità Editor.
- Eliminato l'uso pratico di Zoom TV 1:1.
- Imposta area TV dalla vista ora centra il riquadro TV sulla vista di lavoro, invece di usare sempre l'angolo alto sinistro.
- La vista TV resta uno strumento di lavoro per capire cosa vedranno i giocatori.

TEST
1. Posizionati su una parte della mappa.
2. Clicca "Imposta area TV dalla vista".
3. Clicca "Gioco".
4. Controlla che si veda solo la porzione di mappa, senza griglia e senza riquadro.
5. Premi Esc o il pulsante in alto a destra per tornare all'editor.


MVP 0.3c
- Aggiunto "Apri schermo giocatori" per usare un secondo schermo/finestra.
- Il master può tenere aperto l'editor mentre la pagina giocatori resta in visualizzazione pulita.
- La pagina giocatori si sincronizza con l'editor tramite BroadcastChannel/localStorage/polling.
- La pagina giocatori mostra solo asset visibili ai giocatori.
- Griglia, riquadro Area TV, pannelli e sfondo marrone del canvas non vengono mostrati ai giocatori.
- Aggiunto Zoom giocatori: l'Area TV si ridimensiona in base allo zoom dei giocatori.
- Aggiunta maniglia "trascina area TV" per spostare direttamente la finestra dei giocatori sulla mappa.
- La modalità "Gioco locale" resta disponibile come anteprima rapida sullo stesso schermo.

TEST SECONDO SCHERMO
1. Apri index.html.
2. Clicca "Apri schermo giocatori".
3. Sposta la nuova finestra sul secondo monitor e mettila a tutto schermo.
4. Nell'editor inserisci un asset e verifica che compaia nella finestra giocatori.
5. Togli "Visibile Giocatore" a un oggetto e verifica che sparisca.
6. Trascina la maniglia blu "trascina area TV" e verifica che la finestra giocatori segua l'area.
7. Cambia Zoom giocatori e verifica che l'area blu si allarghi/restringa.


MVP 0.3d
- Pulsanti File messi in menu a tendina.
- Caratteristiche Canvas/VTT messe in menu a tendina.
- Aggiunto "Segui editor ON": la finestra giocatori segue pan e zoom dell'editor.
- Se zoomi su una stanza nell'editor, la pagina giocatori mostra quella porzione adattata allo schermo.
- Il riquadro azzurro resta come riferimento massimo TV 4K.
- Aggiunta cornice verde "Vista player" che mostra la porzione effettivamente inviata ai giocatori.
- Se trascini il riquadro azzurro o usi "Zoom area TV fissa", il sistema passa a "Segui editor OFF".
- Aggiunta importazione PNG come asset custom.
- Per ogni PNG importato puoi scegliere nome, larghezza e altezza iniziale in quadretti.
- La pagina giocatori resta pulita: niente griglia, niente foglio marrone, solo asset visibili ai giocatori su sfondo nero.

TEST
1. Apri l'editor e poi "Schermo giocatori".
2. Lascia "Segui editor ON".
3. Zooma su una stanza o su una porzione della mappa.
4. La finestra giocatori deve aggiornarsi mostrando quella stessa porzione adattata allo schermo.
5. Importa un PNG come asset e scegli dimensione iniziale in quadretti.
6. Trascinalo sulla mappa e verifica che compaia anche nella finestra giocatori se "Visibile Giocatore" è attivo.


MVP 0.3e
- Corretto errore JavaScript che impediva il caricamento dell'editor.
- Asset library e canvas tornano visibili.
- Corretto problema dei menu a tendina che finivano dietro la finestra editor.
- Menu File e Canvas/VTT ora hanno z-index alto e non vengono tagliati dalla barra superiore.

TEST
1. Apri index.html.
2. Controlla che canvas e asset siano visibili.
3. Apri il menu File e verifica che resti sopra l'editor.
4. Apri Canvas/VTT e verifica che resti sopra l'editor.
5. Prova Importa PNG come asset.


MVP 0.3f
- Colonna sinistra richiudibile.
- Colonna destra richiudibile.
- Pulsanti "Nascondi/Mostra sinistra" e "Nascondi/Mostra destra" nella barra superiore.
- Categorie della libreria asset richiudibili singolarmente.
- Click su un asset della libreria: mostra nome e dimensioni nello status; il drag & drop resta invariato.
- Le proprietà degli oggetti piazzati restano nella colonna destra come prima.
- Corretto il calcolo della cornice "Vista player" per seguire meglio la porzione reale visibile dell'editor.
- La cornice verde viene leggermente rientrata quando segue l'editor, così resta tutta visibile e non si perde sui bordi.

TEST
1. Apri l'editor.
2. Premi "Nascondi sinistra" e "Nascondi destra".
3. Riapri le colonne.
4. Nella libreria asset clicca sulle intestazioni Base, Muri, Porte ecc. e verifica che si chiudano/aprano.
5. Lascia "Segui editor ON", zooma/panna: la cornice verde deve restare visibile nell'editor.


MVP 0.3g
- Inserimento asset cambiato verso modalità pennello.
- Clic su un asset nella libreria = seleziona il pennello.
- Finché il pennello è attivo, ogni clic su uno spazio vuoto della mappa piazza quell'asset.
- Esc annulla il pennello.
- L'asset selezionato come pennello viene evidenziato nella libreria.
- Nella colonna destra compare lo stato del pennello.
- Il drag & drop resta disponibile, ma il flusso principale ora è: seleziona asset → clicca sulla mappa.
- Quando importi un PNG, viene selezionato automaticamente come pennello.


MVP 0.3h
- Corretto il pennello: ora il click su uno spazio vuoto della mappa piazza l'asset selezionato.
- Il click sugli oggetti già piazzati continua a selezionare l'oggetto, senza piazzare sopra.
- Gli asset piazzati ora stanno sopra sfondo e griglia.
- La griglia resta sotto agli oggetti.
- Le cornici Area TV / Vista Player restano sopra agli oggetti come riferimento editor.
- Il piazzamento a pennello usa il quadretto in cui clicchi, agganciandosi alla griglia.


MVP 0.3i
- Ripristinata la rotazione degli asset piazzati.
- Q/E ruotano l'oggetto selezionato.
- I pulsanti ruota -15° / +15° tornano ad aggiornare subito l'asset quando presenti.
- La rotazione viene salvata e sincronizzata con lo schermo giocatori.
- Aggiunto transform-origin al centro dell'oggetto.


MVP 0.3j
- Aggiunta anteprima del pennello direttamente sul canvas.
- Il cursore ora mostra l'asset selezionato come sagoma/anteprima prima del piazzamento.
- Aggiunto punto di aggancio visibile: pallino rosso e croce.
- L'aggancio attuale è alto/sinistra dell'asset.
- Il piazzamento usa lo stesso punto indicato dall'anteprima, così non lo scopri più provando.
- Il messaggio del pennello indica chiaramente il punto di aggancio.


MVP 0.4 — REFACTOR A BLOCCHI
- Nessuna funzione principale cambiata intenzionalmente.
- Il vecchio app.js unico è stato diviso in blocchi dentro la cartella js/.
- Questo serve a correggere o ampliare le parti senza toccare ogni volta tutto il codice.
- Aggiunto ARCHITETTURA.md con la mappa dei file.
- Lasciato backup del vecchio file unico in dev/app_mvp03j_legacy.js.
- Salvataggio locale separato: gildaMapBuilderProject04.

TEST
1. Apri index.html.
2. Controlla che editor, asset, pennello, rotazione, vista player e schermo giocatori funzionino come nella 0.3j.
3. Se qualcosa non funziona, usa la 0.3j come riferimento stabile e segnala quale blocco si è rotto.


MVP 0.4b — HOTFIX PENNELLO / DRAG & DROP
- Corretto il problema nato dal refactor a più file.
- L'app ora carica di nuovo un app.js unico per stabilità.
- I blocchi js/ restano nella cartella come riferimento organizzativo, ma non vengono caricati direttamente.
- Ripristinato pennello: seleziona asset -> clicca su canvas.
- Ripristinato drag & drop.
- Salvataggio locale separato: gildaMapBuilderProject04b.

TEST
1. Seleziona un asset dalla libreria.
2. Muovi il mouse sul canvas: deve comparire l'anteprima.
3. Clicca su una zona vuota: deve piazzare l'asset.
4. Trascina un asset sul canvas: deve piazzarlo.


MVP 0.4c — SELEZIONE MULTIPLA
- Aggiunta selezione multipla.
- Shift/Ctrl/Cmd + click su un oggetto: aggiunge/toglie dalla selezione.
- Trascinando un oggetto selezionato si muove tutto il gruppo selezionato.
- Frecce direzionali: spostano il gruppo.
- Q/E: ruotano tutti gli oggetti selezionati.
- + / -: scalano tutti gli oggetti selezionati.
- Canc/Backspace: elimina tutto il gruppo selezionato.
- Ctrl/Cmd + C: copia gruppo.
- Ctrl/Cmd + V: incolla gruppo.
- Ctrl/Cmd + A: seleziona tutti gli oggetti della mappa.
- La colonna proprietà mostra un pannello gruppo quando ci sono più oggetti selezionati.
- Salvataggio locale separato: gildaMapBuilderProject04c.

TEST
1. Piazza tre asset.
2. Shift-click su due asset.
3. Trascina uno dei due: devono muoversi entrambi.
4. Premi Q/E: devono ruotare entrambi.
5. Premi Canc: devono sparire entrambi.


MVP 0.4d — GRUPPI E TRASFORMAZIONI COMUNI
- Rotazione multipla corretta: gli oggetti selezionati ruotano attorno al centro comune del gruppo, non ognuno sul proprio centro.
- Scala multipla corretta: il gruppo scala dal centro comune, mantenendo le distanze proporzionali tra gli oggetti.
- Movimento multiplo resta vincolato come gruppo.
- Aggiunta funzione Raggruppa.
- Aggiunta funzione Sciogli gruppo.
- Tasto G: raggruppa gli oggetti selezionati.
- Tasto U: scioglie il gruppo selezionato.
- Clic normale su un oggetto già raggruppato seleziona tutto il gruppo.
- Shift/Ctrl/Cmd + click resta utile per selezioni manuali.
- Gli oggetti raggruppati hanno un piccolo indicatore blu.
- Copia/incolla conserva i gruppi copiati creando nuovi ID gruppo.

TEST
1. Piazza tre asset vicini.
2. Selezionali con Shift-click.
3. Premi G.
4. Clicca uno solo degli asset raggruppati: deve selezionare tutto il gruppo.
5. Premi Q/E: il gruppo deve ruotare attorno al centro comune.
6. Premi + / -: il gruppo deve scalare dal centro comune.
7. Premi U: il gruppo deve sciogliersi.


MVP 0.4e — GRUPPI COME OGGETTO UNICO
- Corretto il comportamento dei gruppi: un gruppo ora ha un proxy/contorno proprio.
- Quando premi G, gli asset selezionati vengono vincolati dentro un gruppo reale.
- Q/E sul gruppo ruotano il gruppo come oggetto unico.
- + / - sul gruppo scalano il gruppo come oggetto unico.
- Lo spostamento del gruppo muove il proxy del gruppo, non i singoli oggetti uno per uno.
- Clic su un membro del gruppo seleziona tutto il gruppo.
- Il gruppo ha una cornice/proxy blu selezionabile.
- U scioglie il gruppo e applica la trasformazione finale ai singoli oggetti.

TEST
1. Piazza due o tre asset, meglio se rettangolari.
2. Selezionali con Shift-click.
3. Premi G.
4. Clicca il gruppo.
5. Premi Q o E: la composizione deve ruotare come un blocco unico.
6. Premi + o -: la composizione deve scalare come un blocco unico.
7. Premi U: gli oggetti vengono sciolti mantenendo la trasformazione visiva.


MVP 0.5 — LAYER VERI + DUNGEON DI ESEMPIO
- Aggiunto sistema layer predefinito.
- Ogni asset ha un layer predefinito dedotto dalla categoria:
  Pavimenti, Architettura, Porte e passaggi, Arredi, Oggetti interattivi,
  Trappole, Token / Creature, Effetti, Nebbia / Oscurità, Note Master.
- Quando piazzi un asset, l'oggetto eredita automaticamente il suo layer.
- Ogni oggetto può comunque cambiare layer dalle proprietà.
- La selezione multipla può spostare tutto il gruppo selezionato in un layer.
- Il pannello Layer ora ha:
  M = visibile master
  P = visibile giocatori
  🔒 = blocco editing
- I layer bloccati impediscono lo spostamento accidentale degli oggetti.
- Le trappole e le note master sono nascoste ai giocatori di default.
- Aggiunta mappa iniziale già preparata:
  “Esempio - piccolo dungeon”.
- La mappa contiene pavimenti, muri, porte, arredi, token, trappole nascoste,
  nebbia e note master, già assegnati ai layer corretti.
- Salvataggio locale separato: gildaMapBuilderProject05.

TEST
1. Apri index.html.
2. Dovresti vedere già un piccolo dungeon di esempio.
3. Prova a spegnere P sul layer Trappole: i giocatori non devono vederle.
4. Prova a spegnere M su Note Master: spariscono anche per il master.
5. Prova a spostare un muro: se Architettura è bloccato, non deve muoversi.
6. Sblocca Architettura e riprova.
7. Seleziona un oggetto e cambia il suo layer dalle proprietà.


MVP 0.5b — HOTFIX LAYER / MOVIMENTO / FINESTRA GIOCATORI
- Ripristinata la funzione di trascinamento degli oggetti.
- Ora, se un layer viene sbloccato, gli oggetti di quel layer si possono muovere.
- Rimossa l'icona lucchetto sopra ogni asset: era antiestetica.
- La finestra giocatori non mostra più decorazioni da editor:
  selezione, lucchetti, indicatori di gruppo o marker di blocco.
- Il blocco resta gestito dal pannello Layer, non disegnato sopra la mappa.
- Salvataggio locale separato: gildaMapBuilderProject05b.

TEST
1. Apri index.html.
2. Prova a muovere un muro: con Architettura bloccato non deve muoversi.
3. Sblocca Architettura dal pannello Layer.
4. Ora il muro deve muoversi.
5. Apri lo schermo giocatori: non devono comparire lucchetti sugli asset.


MVP 0.6 — DISEGNO RAPIDO MURI / PAVIMENTI
- Migliorata la costruzione mappe.
- Gli asset muro hanno ora base 1×0,5 quadretti.
- L'asset pavimento ha ora base 1×1 quadretto.
- Seleziona un muro e fai click tenuto + trascina sul canvas:
  disegni un muro orizzontale o verticale.
- Lo spessore del muro è 1/2 quadretto.
- Seleziona il pavimento e fai click tenuto + trascina:
  disegni un'area rettangolare di pavimento.
- Click semplice continua a piazzare un singolo elemento.
- Il pennello mostra l'anteprima della linea/area mentre trascini.
- Drag & drop e click singolo restano funzionanti.

TEST
1. Seleziona Muratura o Roccia.
2. Tieni premuto sul canvas e trascina in orizzontale: deve creare un muro lungo.
3. Ripeti in verticale: deve creare un muro verticale spesso 1/2 quadretto.
4. Seleziona Pavimento.
5. Tieni premuto e trascina: deve creare un rettangolo di pavimento.
6. Click semplice su muro o pavimento deve ancora piazzare un singolo pezzo.


MVP 0.6b — HOTFIX DISEGNO A MODULI
- Corretto il problema del muro/pavimento scalato come un unico asset.
- Ora il disegno rapido non allarga più un solo SVG.
- Pavimenti: il rettangolo viene riempito con moduli 1×1.
- Muri orizzontali: la linea viene riempita con moduli 1×0,5.
- Muri verticali: la linea viene riempita con moduli 0,5×1.
- La selezione dopo il disegno include tutti i moduli creati.
- Questo rende il comportamento più vicino a un vero editor di mappe modulare.

TEST
1. Seleziona Pavimento.
2. Click tenuto + trascina un rettangolo 4×3: devono crearsi 12 pezzi di pavimento, non un solo asset stirato.
3. Seleziona Muratura.
4. Trascina un muro lungo 5 quadretti: devono crearsi 5 moduli di muro.
5. Trascina in verticale: devono crearsi moduli verticali da 0,5×1.


MVP 0.6c — AGGIORNAMENTO GRAFICO ASSET
- Ho integrato direttamente nell'applicazione i nuovi asset generati.
- Sostituiti gli asset principali con versioni più curate:
  - Pavimento in pietra
  - Muratura (orizzontale e verticale)
  - Roccia (orizzontale e verticale)
  - Porta in legno
  - Porta segreta in pietra
  - Scala verso il basso
  - Botola
  - Cassa
- I muri ora usano automaticamente una variante grafica diversa in base all'orientamento:
  - orizzontale
  - verticale
- Gli asset non sono solo allegati: sono già collegati e attivi nell'editor.

NOTA
- Alcuni asset secondari restano ancora quelli vecchi (es. tavolo, nebbia, token, icone).
- Questa build serve a portare dentro subito il nuovo stile, mantenendo l'editor stabile.

TEST
1. Apri la libreria asset e verifica il nuovo look.
2. Disegna muri orizzontali e verticali:
   devono usare una grafica coerente con l'orientamento.
3. Disegna pavimenti: deve comparire il nuovo asset in pietra.
4. Piazza una porta, una botola e una scala: devono essere quelle nuove.


MVP 0.6d — ASSET MODULARI CALIBRATI PER LA GRIGLIA
- Risolto il problema degli asset che non riempivano il quadretto.
- Risolto il problema del bordo a scacchi / trasparenza visibile.
- Sostituiti i principali asset modulari con nuove versioni SVG pulite e calibrate:
  - pavimento roccioso seamless 1×1
  - muratura 1×0,5 e 0,5×1
  - roccia 1×0,5 e 0,5×1
  - porta
  - porta segreta
  - scala
  - botola
  - cassa
- Gli asset ora calzano sul modulo della tavola VTT perché riempiono per intero il box.
- Sul canvas e nel brush preview le immagini usano ora `object-fit: fill` invece di `contain`.
- Il pavimento roccioso non è più “incorniciato”: è una texture piena, pensata per essere affiancata.
- I muri sono modulari senza soluzione di continuità evidente.

NOTA
- Le dimensioni degli oggetti continuano ad adattarsi automaticamente alla griglia (80 px, 100 px, ecc.)
  perché l'editor ragiona in quadretti/celle; gli asset ora sono semplicemente disegnati bene per quel sistema.

TEST
1. Disegna una grande area di pavimento: i quadretti devono riempirsi completamente senza bordi a scacchi.
2. Disegna muri orizzontali e verticali: i segmenti devono risultare continui.
3. Cambia griglia da 100 a 80: gli asset devono continuare a calzare.


MVP 0.7e — LOADER TILESET ADDITIVO
- Ripartito dalla 0.6d stabile.
- Il core dell'editor non è stato modificato: canvas, griglia, layer, pennello, gruppi restano quelli della 0.6d.
- Il loader tileset è in un file separato: tileset_loader.js.
- Il caricamento avviene con un input file visibile nel pannello Tileset ZIP v1.
- Il pannello mostra sempre Base integrato e i tileset caricati.
- Gli asset caricati dal tileset compaiono con prefisso [TS] e categorie "Tileset / ...".
- Incluso sample_tileset_gilda_base_v1.zip.

TEST
1. Apri index.html.
2. Il canvas e la griglia devono essere presenti come nella 0.6d.
3. Nel pannello Tileset ZIP v1 usa il selettore file.
4. Carica sample_tileset_gilda_base_v1.zip.
5. Deve comparire Gilda Base v1 Sample con 4 tile.
6. In Libreria asset devono comparire categorie "Tileset / Pavimenti", "Tileset / Muri", "Tileset / Porte".


MVP 0.7f — TILESET SAMPLE MIGLIORATO + VARIANTE VERTICALE
- Nota storica: questa build supportava il campo opzionale `fileVertical`.
- Nota MVP 0.8: per i muri dei tileset questa strada e' stata superata; ora si usa un solo PNG senza variante verticale/orizzontale.
- Il tileset sample è stato ricreato esportando in PNG gli asset base già funzionanti della 0.6d.
- Il sample ora si chiama:
  Gilda Base Export v1
  ID: gilda_base_export_v1
- Contiene 8 tile:
  pavimento roccioso
  muro muratura con file singolo
  muro roccia con file singolo
  porta
  porta segreta
  scala
  botola
  cassa

NOTA STANDARD
Da MVP 0.8, i muri dei tileset non devono usare `fileVertical`.
La regola corrente e' un solo asset muro con un solo PNG.

TEST
1. Apri index.html.
2. Carica sample_tileset_gilda_base_v1.zip.
3. Deve comparire Gilda Base Export v1.
4. Disegna il muro muratura in orizzontale e verticale.
5. In verticale non deve più usare blocchi separati/stirati male.


MVP 0.7g — TILESET DENTRO LE CATEGORIE ESISTENTI
- Gli asset importati non vengono più messi in categorie separate "Tileset / ...".
- Ora vengono aggiunti direttamente alle categorie già presenti nell'editor:
  floor -> Base
  wall -> Muri
  door / secret_door -> Porte
  stairs / hatch -> Scale e botole
  pillar / furniture / container -> Oggetti
  overlay -> Overlay
  token -> Token
  trap / marker -> Icone
- I muri del tileset restano un solo asset logico e, da MVP 0.8, usano un solo PNG.
- In libreria non vedi due muri separati verticale/orizzontale.
- Sotto il nome dell'asset compare il nome del tileset di provenienza, per distinguerlo dal set base.

NOTA
Le grafiche del sample restano ancora di transizione. La prossima fase consigliata è costruire un vero tileset curato,
non un semplice export di asset tecnici.


MVP 0.7h — HOTFIX CATEGORIE TILESET
- Corretto definitivamente il comportamento della libreria asset:
  gli asset importati da tileset vengono fusi nelle categorie esistenti.
- Non devono più comparire categorie "Tileset / ...".
- Mapping:
  floor -> Base
  wall -> Muri
  door / secret_door -> Porte
  stairs / hatch -> Scale e botole
  pillar / furniture / container -> Oggetti
  overlay -> Overlay
  token -> Token
  trap / marker -> Icone
- Il loader normalizza anche eventuali tileset salvati da build precedenti che avevano categorie legacy.
- Salvataggio locale separato: gildaMapBuilderProject07h.

NOTA GRAFICA
Il tileset gilda_sotterranei_01.zip creato prima non è considerato definitivo graficamente.
Serve solo per testare il caricamento.


MVP 0.8 — CONSOLIDAMENTO SVILUPPO E TEST
- Creata una base di sviluppo piu' pulita senza riscrivere il core editor.
- Riallineati i blocchi sorgente in js/ partendo dal bundle app.js stabile.
- Aggiunto js/95_safety_bindings.js per mantenere separati i binding finali di pennello e drag/drop.
- Aggiunto tools/build-app.js per rigenerare app.js dai blocchi sorgente.
- Aggiunto tools/check-js.js per controllare la sintassi dei file JavaScript principali.
- Aggiunto tools/split-app.js per ricreare i blocchi partendo da app.js quando necessario.
- Aggiunto tools/validate-tileset.js per validare ZIP MAP GENERATOR TILESET v1.
- Aggiunto SVILUPPO.md come guida operativa breve.
- Creato gilda_mini_premium_01.zip con 4 tile:
  floor_stone_premium_01
  wall_stone_premium_01
  door_wood_iron_premium_01
  crate_premium_01
- Il muro premium resta un singolo asset logico con un solo PNG, senza `fileVertical` e senza file separati orizzontale/verticale.
- Anche il sample tileset incluso e' stato riallineato alla stessa regola: i muri non usano piu' file `_h` / `_v`.
- Corretto il disegno verticale dei muri: il modulo non viene piu' stirato in una casella verticale, ma viene ruotato a 90 gradi usando lo stesso PNG singolo.
- Confermati i layer ufficiali:
  sfondo, pavimenti, architettura, porte, arredi, interattivi,
  trappole, token, effetti, nebbia, note_master.
- Confermato il mapping categorie tileset dentro le categorie esistenti:
  floor -> Base
  wall -> Muri
  door / secret_door -> Porte
  stairs / hatch -> Scale e botole
  pillar / furniture / container -> Oggetti
  overlay -> Overlay
  token -> Token
  trap / marker -> Icone

COMANDI DI CONTROLLO MVP 0.8
Da cartella principale:
node tools/build-app.js
node tools/check-js.js
node tools/validate-tileset.js sample_tileset_gilda_base_v1.zip
node tools/validate-tileset.js gilda_mini_premium_01.zip

NOTE
- app.js resta il file caricato dal browser.
- tileset_loader.js resta separato e additivo.
- Nessuna dipendenza da server obbligatorio.
- Per nuove modifiche: editare js/, rigenerare app.js, controllare sintassi, aggiornare README.


MVP 0.9 — SMART WALL PROTOTYPE
- Introdotta la prima struttura `smartLayers` per mappa.
- Aggiunto prototipo `Smart Wall Prototype` nel pannello destro.
- Aggiunte modalita':
  Disegna muro smart
  Cancella muro smart
  Stop smart
- Le celle muro smart vengono salvate come coordinate di griglia, non come PNG piazzati.
- Il render usa SVG procedurale:
  riempimento delle celle occupate;
  bordo solo sui lati esterni;
  nessun bordo sulle giunzioni interne.
- Le celle adiacenti appaiono come massa continua.
- Il layer logico usato e' `architettura`, quindi resta compatibile con visibilita' Master/Giocatori.
- La player view riceve i dati tramite lo stesso salvataggio/sync del progetto.
- Esc disattiva lo strumento Smart Wall, come il pennello asset.
- Gli asset statici, il pennello tradizionale e il loader tileset restano separati.

STRUTTURA DATI MVP 0.9
Ogni mappa puo' contenere:
smartLayers:[{
  id:"smart_wall_architettura",
  name:"Muro smart",
  type:"smart_tile",
  smartMode:"solid_wall",
  layer:"architettura",
  visibleMaster:true,
  visiblePlayer:true,
  cells:[{x:0,y:0}]
}]

LIMITI NOTI MVP 0.9
- Grafica volutamente semplice e procedurale.
- Non ci sono ancora regioni morbide, path asset o marching squares.
- Il prototipo dimostra il comportamento base: celle adiacenti -> forma unica.


MVP 0.9+ — SMART BRUSH REFACTOR
- Il pannello Smart Wall Prototype diventa `Pennelli Smart`.
- Aggiunto selettore `Tipo pennello`:
  Dungeon Brush
  Wall Cell Brush
- Aggiunto selettore `Preset`:
  Abitato
  Abbandonato
  Rovina
  Tunnel grezzo
- Il sistema smart ora distingue layer intelligenti diversi:
  smart_dungeon_architettura
  smart_wall_architettura
- Il Dungeon Brush salva celle in `smartLayers` e renderizza:
  pavimento interno;
  perimetro esterno continuo;
  piccoli dettagli deterministici.
- Il Wall Cell Brush resta disponibile come pennello smart cell-based.
- La libreria asset e' riorganizzata in categorie funzionali:
  Oggetti Interattivi
  Oggetti Decorativi
  Token
  Overlay / Effetti
- Gli asset muro legacy vengono nascosti dalla libreria principale: il muro diventa uno strumento smart.
- Aggiunta randomicita' deterministica dei bordi tramite hash stabile basato su:
  seed mappa;
  id layer;
  preset;
  coordinate cella;
  lato della cella.
- Nessun uso di `Math.random()` nel rendering smart.
- La struttura resta orientata a:
  objects
  smartLayers
  regions
  paths

LIMITI NOTI MVP 0.9+
- Dungeon Brush resta cell-based.
- Wall Cell Brush ora supporta anche segmenti path-based per muri diagonali/liberi.
- Non sono ancora implementati smart regions morbide o path tools complessi.
- I preset cambiano gia' il carattere del bordo, ma non hanno ancora slider manuali.


MVP 0.9++ — WALL PATH E MIGLIORAMENTO GRAFICO
- Corretto il problema dei muri diagonali: il Wall Brush non produce piu' una scaletta di quadretti quando trascini in diagonale.
- Trascinamento con Wall Cell Brush:
  salva un segmento path-based;
  renderizza una linea muro spessa e continua;
  mantiene un solo sistema muro smart, senza asset verticale/orizzontale.
- Click breve con Wall Cell Brush:
  continua a creare una singola cella muro.
- Cancella smart:
  rimuove celle e segmenti muro vicini al puntatore.
- Il rendering procedurale e' migliorato:
  pattern interno leggero;
  ombra/contorno del muro;
  highlight;
  dettagli/crepe deterministiche.
- Il Dungeon Brush mantiene celle e perimetro continuo, ma con resa grafica meno piatta.


MVP 0.9+++ — INK MAP STYLE
- Avvicinata la resa grafica allo stile mappa old-school a inchiostro:
  sfondo pergamena;
  pavimenti chiari;
  griglia sottile scura;
  contorni neri marcati;
  masse muro/roccia con tratteggio;
  dettagli deterministici.
- I muri path-based diagonali hanno:
  corpo spesso continuo;
  ombra/contorno nero;
  tratteggio interno;
  highlight a inchiostro.
- Il Dungeon Brush usa un pavimento piu' chiaro e leggibile, con griglia integrata.
- Nessun PNG nuovo richiesto: il rendering resta procedurale SVG.


MVP 0.9++++ — WALL MASS FIX
- Corretto il problema dei muri lunghi che sembravano baccelli:
  i Wall Path non sono piu' semplici linee SVG stirate;
  ora sono poligoni rettangolari con contorno, riempimento e tratteggio.
- Corretto il Dungeon Brush che sembrava solo pavimento con bordo:
  ora genera una fascia muraria perimetrale spessa;
  il pavimento interno resta chiaro;
  il muro perimetrale ha tratteggio e massa visibile.
- Le estremita' dei muri path sono piu' nette e costruite, non arrotondate.
- Il rendering resta procedurale e compatibile con salvataggio/player view.
