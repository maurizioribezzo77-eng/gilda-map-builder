# Data Model

Questo documento descrive il modello dati centrale predisposto in `src/models/dataModel.ts`.
Il modello e' pensato per essere serializzabile in JSON: usa solo stringhe, numeri, booleani,
array, oggetti semplici e `null`.

## Entita' principali

- `Project`: contiene le mappe e l'id della mappa attiva.
- `DungeonMap`: contiene dimensioni, griglia, elementi, layer e nodi dell'albero.
- `Element`: rappresenta stanze, corridoi, porte, scale, pin, token, tile e tratti di sketch.
- `Geometry`: descrive la forma dell'elemento senza ridurre tutto a `x/y/width/height`.
- `Layer`: descrive visibilita' e blocco di un gruppo logico.
- `TreeNode`: rappresenta mappa, cartelle o elementi nell'albero laterale.

## Geometry

Le stanze devono avere sempre una `geometry`.
Una stanza rettangolare usa `RectGeometry`, una stanza circolare usa `CircleGeometry`,
mentre pentagoni, esagoni e altre stanze irregolari usano `PolygonGeometry`.

```json
{
  "kind": "rect",
  "x": 200,
  "y": 200,
  "width": 500,
  "height": 320
}
```

```json
{
  "kind": "circle",
  "cx": 1050,
  "cy": 360,
  "radius": 180
}
```

```json
{
  "kind": "polygon",
  "points": [
    { "x": 1560, "y": 220 },
    { "x": 1780, "y": 220 },
    { "x": 1900, "y": 410 },
    { "x": 1780, "y": 600 },
    { "x": 1560, "y": 600 },
    { "x": 1440, "y": 410 }
  ]
}
```

## Esempio JSON

`createDefaultProject()` restituisce un progetto con una mappa demo minima:
una stanza rettangolare, una stanza circolare, una stanza esagonale, un pin e un token.

```json
{
  "id": "project-default",
  "name": "Sketch to Dungeon - Progetto demo",
  "activeMapId": "map-demo-dungeon",
  "maps": [
    {
      "id": "map-demo-dungeon",
      "name": "Dungeon demo",
      "width": 2400,
      "height": 1600,
      "gridSize": 100,
      "layers": [
        {
          "id": "layer-architecture",
          "name": "Architettura",
          "type": "architecture",
          "visible": true,
          "locked": false
        },
        {
          "id": "layer-sketch",
          "name": "Sketch Layer",
          "type": "sketch",
          "visible": true,
          "locked": false
        },
        {
          "id": "layer-notes",
          "name": "Note e pin",
          "type": "notes",
          "visible": true,
          "locked": false
        },
        {
          "id": "layer-tokens",
          "name": "Token",
          "type": "tokens",
          "visible": true,
          "locked": false
        }
      ],
      "elements": [
        {
          "id": "room-rect-entrance",
          "type": "room",
          "name": "Sala rettangolare",
          "geometry": {
            "kind": "rect",
            "x": 200,
            "y": 200,
            "width": 500,
            "height": 320
          },
          "rotation": 0,
          "visibleToPlayers": true,
          "notesMaster": "Ingresso principale del dungeon.",
          "notesPlayer": "",
          "linkedMapId": null,
          "style": {
            "fill": "#d8d0bd",
            "stroke": "#3f3a31",
            "strokeWidth": 4
          },
          "layerId": "layer-architecture"
        },
        {
          "id": "room-circle-shrine",
          "type": "room",
          "name": "Sala circolare",
          "geometry": {
            "kind": "circle",
            "cx": 1050,
            "cy": 360,
            "radius": 180
          },
          "rotation": 0,
          "visibleToPlayers": true,
          "notesMaster": "Santuario con soffitto a cupola.",
          "notesPlayer": "",
          "linkedMapId": null,
          "style": {
            "fill": "#c9d5cf",
            "stroke": "#35433d",
            "strokeWidth": 4
          },
          "layerId": "layer-architecture"
        },
        {
          "id": "room-hex-library",
          "type": "room",
          "name": "Sala esagonale",
          "geometry": {
            "kind": "polygon",
            "points": [
              { "x": 1560, "y": 220 },
              { "x": 1780, "y": 220 },
              { "x": 1900, "y": 410 },
              { "x": 1780, "y": 600 },
              { "x": 1560, "y": 600 },
              { "x": 1440, "y": 410 }
            ]
          },
          "rotation": 0,
          "visibleToPlayers": true,
          "notesMaster": "Biblioteca esagonale.",
          "notesPlayer": "",
          "linkedMapId": null,
          "style": {
            "fill": "#d6c7db",
            "stroke": "#44364a",
            "strokeWidth": 4
          },
          "layerId": "layer-architecture"
        },
        {
          "id": "pin-secret-door",
          "type": "pin",
          "name": "Porta segreta",
          "geometry": {
            "kind": "point",
            "x": 710,
            "y": 320
          },
          "rotation": 0,
          "visibleToPlayers": false,
          "notesMaster": "CD 15 per notare il meccanismo.",
          "notesPlayer": "",
          "linkedMapId": null,
          "style": {
            "color": "#b33939",
            "icon": "pin"
          },
          "layerId": "layer-notes"
        },
        {
          "id": "token-scout",
          "type": "token",
          "name": "Esploratore",
          "geometry": {
            "kind": "point",
            "x": 1060,
            "y": 360
          },
          "rotation": 0,
          "visibleToPlayers": true,
          "notesMaster": "Creatura di guardia.",
          "notesPlayer": "",
          "linkedMapId": null,
          "style": {
            "color": "#4f7f52",
            "size": 1
          },
          "layerId": "layer-tokens"
        }
      ],
      "treeNodes": [
        {
          "id": "tree-map-demo-dungeon",
          "name": "Dungeon demo",
          "type": "map",
          "parentId": null,
          "elementId": null,
          "mapId": "map-demo-dungeon"
        }
      ]
    }
  ]
}
```
