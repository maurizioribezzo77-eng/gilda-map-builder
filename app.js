// ===== 00_config.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 00_config.js
// Configurazione globale, preset VTT, asset base, stato progetto, riferimenti DOM e utility minime.

const STORAGE_KEY = "gildaMapBuilderProject07hb";
const CHANNEL_NAME = "gildaMapBuilderChannel07h";
const isPlayerWindow = new URLSearchParams(window.location.search).get("player") === "1";
const syncChannel = ("BroadcastChannel" in window) ? new BroadcastChannel(CHANNEL_NAME) : null;

const MAP_PRESETS = {
  "room": { name:"Stanza", squaresW:30, squaresH:20, zoom:50 },
  "small_lair": { name:"Tana piccola", squaresW:50, squaresH:30, zoom:35 },
  "medium_dungeon": { name:"Dungeon medio", squaresW:80, squaresH:50, zoom:20 },
  "large_dungeon": { name:"Dungeon grande", squaresW:120, squaresH:80, zoom:15 },
  "mega_structure": { name:"Mega struttura", squaresW:200, squaresH:120, zoom:8 },
  "custom": { name:"Personalizzata", squaresW:80, squaresH:50, zoom:20 }
};

const TV_VIEWPORT = {
  name: "TV 50 pollici 4K orizzontale",
  squaresW: 38.4,
  squaresH: 21.6
};

const DEFAULT_LAYER_DEFS = [
  { id:"sfondo", name:"Sfondo", visibleMaster:true, visiblePlayer:true, locked:true },
  { id:"pavimenti", name:"Pavimenti", visibleMaster:true, visiblePlayer:true, locked:true },
  { id:"architettura", name:"Architettura", visibleMaster:true, visiblePlayer:true, locked:true },
  { id:"porte", name:"Porte e passaggi", visibleMaster:true, visiblePlayer:true, locked:false },
  { id:"arredi", name:"Arredi", visibleMaster:true, visiblePlayer:true, locked:false },
  { id:"interattivi", name:"Oggetti interattivi", visibleMaster:true, visiblePlayer:true, locked:false },
  { id:"trappole", name:"Trappole", visibleMaster:true, visiblePlayer:false, locked:false },
  { id:"token", name:"Token / Creature", visibleMaster:true, visiblePlayer:true, locked:false },
  { id:"effetti", name:"Effetti", visibleMaster:true, visiblePlayer:true, locked:false },
  { id:"nebbia", name:"Nebbia / Oscurità", visibleMaster:true, visiblePlayer:true, locked:false },
  { id:"note_master", name:"Note Master", visibleMaster:true, visiblePlayer:false, locked:false }
];

const LAYERS = DEFAULT_LAYER_DEFS.map(l => l.id);

const ASSETS = [
  { id:"stone_floor", name:"Pavimento 1×1", cat:"Base", src:"assets/base/stone_floor_seamless.svg", cellsW:1, cellsH:1, drawMode:"rect" },
  { id:"rough_wall", name:"Roccia 1×0.5", cat:"Muri", src:"assets/muri/rough_wall.svg", cellsW:1, cellsH:0.5, drawMode:"line", drawThickness:0.5 },
  { id:"old_wall", name:"Muratura 1×0.5", cat:"Muri", src:"assets/muri/old_wall.svg", cellsW:1, cellsH:0.5, drawMode:"line", drawThickness:0.5 },
  { id:"wood_door", name:"Porta 1×0.25", cat:"Porte", src:"assets/porte/wood_door_clean.svg", cellsW:1, cellsH:0.25 },
  { id:"secret_door", name:"Porta segreta 1×0.25", cat:"Porte", src:"assets/porte/secret_door_clean.svg", cellsW:1, cellsH:0.25 },
  { id:"stairs_down", name:"Scala 1×1", cat:"Scale e botole", src:"assets/scale_botole/stairs_down_clean.svg", cellsW:1, cellsH:1 },
  { id:"hatch", name:"Botola 0.5×0.5", cat:"Scale e botole", src:"assets/scale_botole/hatch_clean.svg", cellsW:0.5, cellsH:0.5 },
  { id:"crate", name:"Cassa 0.5×0.5", cat:"Oggetti", src:"assets/oggetti/crate_clean.svg", cellsW:0.5, cellsH:0.5 },
  { id:"table", name:"Tavolo 1.5×1", cat:"Oggetti", src:"assets/oggetti/table.svg", cellsW:1.5, cellsH:1 },
  { id:"fog", name:"Oscurità 3×2", cat:"Overlay", src:"assets/overlay/fog.svg", cellsW:3, cellsH:2 },
  { id:"token", name:"Token 1×1", cat:"Token", src:"assets/token/token.svg", cellsW:1, cellsH:1 },
  { id:"marker_a1", name:"A1", cat:"Icone", src:"assets/icone/marker_a1.svg", cellsW:0.5, cellsH:0.5 },
  { id:"marker_a2", name:"A2", cat:"Icone", src:"assets/icone/marker_a2.svg", cellsW:0.5, cellsH:0.5 },
  { id:"sigil", name:"Sigillo 1×1", cat:"Icone", src:"assets/icone/sigil.svg", cellsW:1, cellsH:1 }
];

let project = {
  "name": "Gilda Map Builder - Esempio Layer",
  "activeMapId": "sample_dungeon",
  "mode": "editor",
  "showGrid": true,
  "snap": true,
  "snapDivisor": 1,
  "gridSize": 100,
  "mapPreset": "room",
  "showViewport": true,
  "playerFollowEditor": true,
  "playerZoom": 100,
  "customAssets": [],
  "layers": {
    "sfondo": {
      "id": "sfondo",
      "name": "Sfondo",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": true
    },
    "pavimenti": {
      "id": "pavimenti",
      "name": "Pavimenti",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": true
    },
    "architettura": {
      "id": "architettura",
      "name": "Architettura",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": true
    },
    "porte": {
      "id": "porte",
      "name": "Porte e passaggi",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": false
    },
    "arredi": {
      "id": "arredi",
      "name": "Arredi",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": false
    },
    "interattivi": {
      "id": "interattivi",
      "name": "Oggetti interattivi",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": false
    },
    "trappole": {
      "id": "trappole",
      "name": "Trappole",
      "visibleMaster": true,
      "visiblePlayer": false,
      "locked": false
    },
    "token": {
      "id": "token",
      "name": "Token / Creature",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": false
    },
    "effetti": {
      "id": "effetti",
      "name": "Effetti",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": false
    },
    "nebbia": {
      "id": "nebbia",
      "name": "Nebbia / Oscurità",
      "visibleMaster": true,
      "visiblePlayer": true,
      "locked": false
    },
    "note_master": {
      "id": "note_master",
      "name": "Note Master",
      "visibleMaster": true,
      "visiblePlayer": false,
      "locked": false
    }
  },
  "ui": {
    "leftCollapsed": false,
    "rightCollapsed": false,
    "assetCollapsed": {}
  },
  "maps": [
    {
      "id": "sample_dungeon",
      "name": "Esempio - piccolo dungeon",
      "width": 3000,
      "height": 2000,
      "squaresW": 30,
      "squaresH": 20,
      "viewportX": 0,
      "viewportY": 0,
      "views": [],
      "groups": {},
      "playerView": {
        "x": 0,
        "y": 0,
        "w": 3000,
        "h": 2000
      },
      "objects": [
        {
          "id": "sample_001",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 200,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_002",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 200,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_003",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 200,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_004",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 400,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_005",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 400,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_006",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 400,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_007",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 600,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_008",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 600,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_009",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 600,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_010",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 800,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_011",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 800,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_012",
          "assetId": "stone_floor",
          "name": "Pavimento sala d'ingresso",
          "x": 800,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_013",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1400,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_014",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1400,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_015",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1400,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_016",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1600,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_017",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1600,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_018",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1600,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_019",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1800,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_020",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1800,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_021",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 1800,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_022",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2000,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_023",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2000,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_024",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2000,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_025",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2200,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_026",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2200,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_027",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2200,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_028",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2400,
          "y": 200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_029",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2400,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_030",
          "assetId": "stone_floor",
          "name": "Pavimento archivio",
          "x": 2400,
          "y": 600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_031",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 800,
          "y": 1200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_032",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 800,
          "y": 1400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_033",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 800,
          "y": 1600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_034",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1000,
          "y": 1200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_035",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1000,
          "y": 1400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_036",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1000,
          "y": 1600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_037",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1200,
          "y": 1200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_038",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1200,
          "y": 1400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_039",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1200,
          "y": 1600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_040",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1400,
          "y": 1200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_041",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1400,
          "y": 1400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_042",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1400,
          "y": 1600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_043",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1600,
          "y": 1200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_044",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1600,
          "y": 1400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_045",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1600,
          "y": 1600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_046",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1800,
          "y": 1200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_047",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1800,
          "y": 1400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_048",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 1800,
          "y": 1600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_049",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 2000,
          "y": 1200,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_050",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 2000,
          "y": 1400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_051",
          "assetId": "stone_floor",
          "name": "Pavimento cripta",
          "x": 2000,
          "y": 1600,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_052",
          "assetId": "stone_floor",
          "name": "Corridoio centrale",
          "x": 1000,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_053",
          "assetId": "stone_floor",
          "name": "Corridoio centrale",
          "x": 1200,
          "y": 400,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_054",
          "assetId": "stone_floor",
          "name": "Corridoio discendente",
          "x": 1400,
          "y": 800,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_055",
          "assetId": "stone_floor",
          "name": "Corridoio discendente",
          "x": 1400,
          "y": 1000,
          "w": 200,
          "h": 200,
          "cellsW": 2,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "pavimenti",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 200
        },
        {
          "id": "sample_056",
          "assetId": "old_wall",
          "name": "Muro sala ingresso nord",
          "x": 150,
          "y": 150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_057",
          "assetId": "old_wall",
          "name": "Muro sala ingresso nord",
          "x": 450,
          "y": 150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_058",
          "assetId": "old_wall",
          "name": "Muro sala ingresso nord",
          "x": 750,
          "y": 150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_059",
          "assetId": "old_wall",
          "name": "Muro sala ingresso nord",
          "x": 1050,
          "y": 150,
          "w": 100,
          "h": 50,
          "cellsW": 1,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_060",
          "assetId": "old_wall",
          "name": "Muro sala ingresso sud",
          "x": 150,
          "y": 800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_061",
          "assetId": "old_wall",
          "name": "Muro sala ingresso sud",
          "x": 450,
          "y": 800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_062",
          "assetId": "old_wall",
          "name": "Muro sala ingresso sud",
          "x": 750,
          "y": 800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_063",
          "assetId": "old_wall",
          "name": "Muro sala ingresso ovest",
          "x": 150,
          "y": 200,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_064",
          "assetId": "old_wall",
          "name": "Muro sala ingresso ovest",
          "x": 150,
          "y": 500,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_065",
          "assetId": "old_wall",
          "name": "Muro sala ingresso est",
          "x": 1100,
          "y": 200,
          "w": 50,
          "h": 250,
          "cellsW": 0.5,
          "cellsH": 2.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_066",
          "assetId": "old_wall",
          "name": "Muro sala ingresso est",
          "x": 1100,
          "y": 600,
          "w": 50,
          "h": 200,
          "cellsW": 0.5,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_067",
          "assetId": "old_wall",
          "name": "Muro archivio nord",
          "x": 1350,
          "y": 150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_068",
          "assetId": "old_wall",
          "name": "Muro archivio nord",
          "x": 1650,
          "y": 150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_069",
          "assetId": "old_wall",
          "name": "Muro archivio nord",
          "x": 1950,
          "y": 150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_070",
          "assetId": "old_wall",
          "name": "Muro archivio nord",
          "x": 2250,
          "y": 150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_071",
          "assetId": "old_wall",
          "name": "Muro archivio nord",
          "x": 2550,
          "y": 150,
          "w": 100,
          "h": 50,
          "cellsW": 1,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_072",
          "assetId": "old_wall",
          "name": "Muro archivio sud",
          "x": 1350,
          "y": 800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_073",
          "assetId": "old_wall",
          "name": "Muro archivio sud",
          "x": 1650,
          "y": 800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_074",
          "assetId": "old_wall",
          "name": "Muro archivio sud",
          "x": 1950,
          "y": 800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_075",
          "assetId": "old_wall",
          "name": "Muro archivio sud",
          "x": 2250,
          "y": 800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_076",
          "assetId": "old_wall",
          "name": "Muro archivio sud",
          "x": 2550,
          "y": 800,
          "w": 100,
          "h": 50,
          "cellsW": 1,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_077",
          "assetId": "old_wall",
          "name": "Muro archivio ovest",
          "x": 1350,
          "y": 200,
          "w": 50,
          "h": 250,
          "cellsW": 0.5,
          "cellsH": 2.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_078",
          "assetId": "old_wall",
          "name": "Muro archivio ovest",
          "x": 1350,
          "y": 600,
          "w": 50,
          "h": 200,
          "cellsW": 0.5,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_079",
          "assetId": "old_wall",
          "name": "Muro archivio est",
          "x": 2650,
          "y": 200,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_080",
          "assetId": "old_wall",
          "name": "Muro archivio est",
          "x": 2650,
          "y": 500,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_081",
          "assetId": "old_wall",
          "name": "Muro cripta nord",
          "x": 750,
          "y": 1150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_082",
          "assetId": "old_wall",
          "name": "Muro cripta nord",
          "x": 1050,
          "y": 1150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_083",
          "assetId": "old_wall",
          "name": "Muro cripta nord",
          "x": 1350,
          "y": 1150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_084",
          "assetId": "old_wall",
          "name": "Muro cripta nord",
          "x": 1650,
          "y": 1150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_085",
          "assetId": "old_wall",
          "name": "Muro cripta nord",
          "x": 1950,
          "y": 1150,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_086",
          "assetId": "old_wall",
          "name": "Muro cripta sud",
          "x": 750,
          "y": 1800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_087",
          "assetId": "old_wall",
          "name": "Muro cripta sud",
          "x": 1050,
          "y": 1800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_088",
          "assetId": "old_wall",
          "name": "Muro cripta sud",
          "x": 1350,
          "y": 1800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_089",
          "assetId": "old_wall",
          "name": "Muro cripta sud",
          "x": 1650,
          "y": 1800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_090",
          "assetId": "old_wall",
          "name": "Muro cripta sud",
          "x": 1950,
          "y": 1800,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_091",
          "assetId": "old_wall",
          "name": "Muro cripta ovest",
          "x": 750,
          "y": 1200,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_092",
          "assetId": "old_wall",
          "name": "Muro cripta ovest",
          "x": 750,
          "y": 1500,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_093",
          "assetId": "old_wall",
          "name": "Muro cripta est",
          "x": 2250,
          "y": 1200,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_094",
          "assetId": "old_wall",
          "name": "Muro cripta est",
          "x": 2250,
          "y": 1500,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_095",
          "assetId": "old_wall",
          "name": "Muro corridoio nord",
          "x": 1050,
          "y": 350,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_096",
          "assetId": "old_wall",
          "name": "Muro corridoio sud",
          "x": 1050,
          "y": 650,
          "w": 300,
          "h": 50,
          "cellsW": 3,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_097",
          "assetId": "old_wall",
          "name": "Muro corridoio basso ovest",
          "x": 1350,
          "y": 800,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_098",
          "assetId": "old_wall",
          "name": "Muro corridoio basso ovest",
          "x": 1350,
          "y": 1100,
          "w": 50,
          "h": 100,
          "cellsW": 0.5,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_099",
          "assetId": "old_wall",
          "name": "Muro corridoio basso est",
          "x": 1600,
          "y": 800,
          "w": 50,
          "h": 300,
          "cellsW": 0.5,
          "cellsH": 3,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_100",
          "assetId": "old_wall",
          "name": "Muro corridoio basso est",
          "x": 1600,
          "y": 1100,
          "w": 50,
          "h": 100,
          "cellsW": 0.5,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "architettura",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 300
        },
        {
          "id": "sample_101",
          "assetId": "wood_door",
          "name": "Porta tra ingresso e corridoio",
          "x": 1080,
          "y": 490,
          "w": 25,
          "h": 100,
          "cellsW": 0.25,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "porte",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 400
        },
        {
          "id": "sample_102",
          "assetId": "wood_door",
          "name": "Porta dell'archivio",
          "x": 1330,
          "y": 490,
          "w": 25,
          "h": 100,
          "cellsW": 0.25,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "porte",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 400
        },
        {
          "id": "sample_103",
          "assetId": "wood_door",
          "name": "Porta della cripta",
          "x": 1400,
          "y": 1130,
          "w": 100,
          "h": 25,
          "cellsW": 1,
          "cellsH": 0.25,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "porte",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 400
        },
        {
          "id": "sample_104",
          "assetId": "secret_door",
          "name": "Passaggio segreto dietro gli scaffali",
          "x": 2300,
          "y": 780,
          "w": 100,
          "h": 25,
          "cellsW": 1,
          "cellsH": 0.25,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "porte",
          "visibleMaster": true,
          "visiblePlayer": false,
          "z": 400
        },
        {
          "id": "sample_105",
          "assetId": "table",
          "name": "Tavolo delle mappe",
          "x": 450,
          "y": 450,
          "w": 150,
          "h": 100,
          "cellsW": 1.5,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "arredi",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 500
        },
        {
          "id": "sample_106",
          "assetId": "crate",
          "name": "Cassa",
          "x": 800,
          "y": 650,
          "w": 50,
          "h": 50,
          "cellsW": 0.5,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "arredi",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 500
        },
        {
          "id": "sample_107",
          "assetId": "crate",
          "name": "Cassa",
          "x": 870,
          "y": 650,
          "w": 50,
          "h": 50,
          "cellsW": 0.5,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "arredi",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 500
        },
        {
          "id": "sample_108",
          "assetId": "table",
          "name": "Banco archivio",
          "x": 1800,
          "y": 420,
          "w": 150,
          "h": 100,
          "cellsW": 1.5,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "arredi",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 500
        },
        {
          "id": "sample_109",
          "assetId": "stairs_down",
          "name": "Scala verso il livello inferiore",
          "x": 2000,
          "y": 1500,
          "w": 100,
          "h": 100,
          "cellsW": 1,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "interattivi",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 600
        },
        {
          "id": "sample_110",
          "assetId": "hatch",
          "name": "Botola nascosta",
          "x": 900,
          "y": 1300,
          "w": 50,
          "h": 50,
          "cellsW": 0.5,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "interattivi",
          "visibleMaster": true,
          "visiblePlayer": false,
          "z": 600
        },
        {
          "id": "sample_111",
          "assetId": "sigil",
          "name": "Trappola del Nodo Spezzato",
          "x": 1200,
          "y": 500,
          "w": 100,
          "h": 100,
          "cellsW": 1,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 0.8,
          "layer": "trappole",
          "visibleMaster": true,
          "visiblePlayer": false,
          "z": 700
        },
        {
          "id": "sample_112",
          "assetId": "fog",
          "name": "Zona non rivelata",
          "x": 2000,
          "y": 1200,
          "w": 300,
          "h": 200,
          "cellsW": 3,
          "cellsH": 2,
          "rot": 0,
          "rotation": 0,
          "opacity": 0.55,
          "layer": "nebbia",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 1000
        },
        {
          "id": "sample_113",
          "assetId": "token",
          "name": "Token Thiefir prova",
          "x": 300,
          "y": 300,
          "w": 100,
          "h": 100,
          "cellsW": 1,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "token",
          "visibleMaster": true,
          "visiblePlayer": true,
          "z": 800
        },
        {
          "id": "sample_114",
          "assetId": "token",
          "name": "Guardia della Gilda",
          "x": 1800,
          "y": 600,
          "w": 100,
          "h": 100,
          "cellsW": 1,
          "cellsH": 1,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "token",
          "visibleMaster": true,
          "visiblePlayer": false,
          "z": 800
        },
        {
          "id": "sample_115",
          "assetId": "marker_a1",
          "name": "Nota Master A1 - accesso falso",
          "x": 200,
          "y": 100,
          "w": 50,
          "h": 50,
          "cellsW": 0.5,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "note_master",
          "visibleMaster": true,
          "visiblePlayer": false,
          "z": 1100
        },
        {
          "id": "sample_116",
          "assetId": "marker_a2",
          "name": "Nota Master A2 - leva nascosta",
          "x": 2300,
          "y": 700,
          "w": 50,
          "h": 50,
          "cellsW": 0.5,
          "cellsH": 0.5,
          "rot": 0,
          "rotation": 0,
          "opacity": 1,
          "layer": "note_master",
          "visibleMaster": true,
          "visiblePlayer": false,
          "z": 1100
        }
      ]
    }
  ]
};

function cleanDefaultProjectCanvas() {
  project.name = "Gilda Map Builder - Nuova mappa";
  project.activeMapId = "blank_dungeon";
  project.mode = "editor";
  project.showGrid = true;
  project.snap = true;
  project.snapDivisor = 1;
  project.gridSize = 100;
  project.mapPreset = "room";
  project.showViewport = true;
  project.customAssets = [];
  project.maps = [{
    id:"blank_dungeon",
    name:"Nuova mappa vuota",
    width:3000,
    height:2000,
    squaresW:30,
    squaresH:20,
    viewportX:0,
    viewportY:0,
    views:[],
    groups:{},
    smartLayers:[],
    playerView:{
      x:0,
      y:0,
      w:3000,
      h:2000
    },
    objects:[]
  }];
}

cleanDefaultProjectCanvas();

let selectedId = null;
let selectedIds = [];
let selectedAssetId = null;
let brushDrawState = null;
let smartBrushKind = "dungeon";
let smartBrushPreset = "inhabited";
let smartToolMode = null;
let smartDragState = null;
let clipboard = null;
let dragState = null;
let panState = null;
let viewportDragState = null;
let lastSyncedRaw = "";

const canvas = document.getElementById("canvas");
const canvasStage = document.getElementById("canvasStage");
const canvasWrap = document.getElementById("canvasWrap");
const smartLayer = document.getElementById("smartLayer");
const viewportLayer = document.getElementById("viewportLayer");
const viewportHandle = document.getElementById("viewportHandle");
const playerViewLayer = document.getElementById("playerViewLayer");
const brushPreview = document.getElementById("brushPreview");
const brushPreviewImg = document.getElementById("brushPreviewImg");
const statusEl = document.getElementById("status");

function activeMap() { return project.maps.find(m => m.id === project.activeMapId); }
function uid() { return "obj_" + Math.random().toString(36).slice(2,10); }
function allAssets() { return ASSETS.concat(project.customAssets || []); }
function assetById(id) { return allAssets().find(a => a.id === id); }
function status(msg) { if (statusEl) statusEl.textContent = msg; }
function grid() { return Number(project.gridSize || 120); }
function snapStep() { return grid() / Number(project.snapDivisor || 1); }
function pxFromCells(cells) { return Math.max(1, Math.round(cells * grid())); }
function cellsFromPx(px) { return +(px / grid()).toFixed(2); }
function snapValue(v) { return project.snap ? Math.round(v / snapStep()) * snapStep() : Math.round(v); }


// ===== 10_ui.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 10_ui.js
// Interfaccia: albero mappe, layer, libreria asset, normalizzazione progetto, render generale, colonne laterali, modalità editor/gioco.

function buildTree() {
  const tree = document.getElementById("projectTree");
  tree.innerHTML = "";
  tree.appendChild(node("▾ " + project.name));
  tree.appendChild(node("▾ Mappe", "child"));
  project.maps.forEach(m => {
    const el = node("↳ " + m.name, "child" + (m.id === project.activeMapId ? " activeMap" : ""));
    el.onclick = () => { project.activeMapId = m.id; selectedId = null; render(); };
    tree.appendChild(el);
  });
  ["Scene", "Asset", "Handout", "Token", "Collegamenti", "Versioni esportate"].forEach(t => tree.appendChild(node("• " + t, "child")));
}
function node(text, cls="") {
  const el = document.createElement("div");
  el.className = "node " + cls;
  el.textContent = text;
  return el;
}


function defaultLayerConfig(id) {
  return DEFAULT_LAYER_DEFS.find(l => l.id === id) || DEFAULT_LAYER_DEFS[0];
}

function ensureLayers() {
  project.layers = project.layers || {};
  DEFAULT_LAYER_DEFS.forEach(def => {
    if (!project.layers[def.id]) project.layers[def.id] = {...def};
    project.layers[def.id].id = def.id;
    project.layers[def.id].name = project.layers[def.id].name || def.name;
    if (typeof project.layers[def.id].visibleMaster !== "boolean") project.layers[def.id].visibleMaster = def.visibleMaster;
    if (typeof project.layers[def.id].visiblePlayer !== "boolean") project.layers[def.id].visiblePlayer = def.visiblePlayer;
    if (typeof project.layers[def.id].locked !== "boolean") project.layers[def.id].locked = def.locked;
  });
}

function layerState(id) {
  ensureLayers();
  return project.layers[id] || defaultLayerConfig(id);
}

function layerName(id) {
  return layerState(id).name || id;
}

function layerOptionsHtml(selected) {
  return LAYERS.map(id => `<option value="${id}" ${selected===id ? "selected" : ""}>${layerName(id)}</option>`).join("");
}

function assetDefaultLayer(asset) {
  if (!asset) return "arredi";
  if (asset.defaultLayer && LAYERS.includes(asset.defaultLayer)) return asset.defaultLayer;
  return defaultLayer(asset.cat);
}

function migrateLayer(layer, asset) {
  const map = {
    "Base":"pavimenti",
    "Architettura":"architettura",
    "Oggetti":"arredi",
    "Overlay":"effetti",
    "Master":"note_master",
    "Player":"token",
    "base":"pavimenti",
    "architettura":"architettura",
    "oggetti":"arredi",
    "overlay":"effetti",
    "master":"note_master",
    "player":"token"
  };
  if (LAYERS.includes(layer)) return layer;
  if (map[layer]) {
    if (layer === "Player" || layer === "player") return assetDefaultLayer(asset);
    return map[layer];
  }
  return assetDefaultLayer(asset);
}

function objectLayerId(obj) {
  const asset = assetById(obj.assetId);
  if (!obj.layer || !LAYERS.includes(obj.layer)) obj.layer = migrateLayer(obj.layer, asset);
  return obj.layer;
}

function objectLayerLocked(obj) {
  return !!layerState(objectLayerId(obj)).locked;
}

function objectVisibleForMaster(obj) {
  return obj.visibleMaster !== false && layerState(objectLayerId(obj)).visibleMaster !== false;
}

function objectVisibleForPlayer(obj) {
  return obj.visiblePlayer !== false && layerState(objectLayerId(obj)).visiblePlayer !== false;
}

function setLayerVisibleMaster(id) {
  const l = layerState(id);
  l.visibleMaster = !l.visibleMaster;
  project.layers[id] = l;
  buildLayerControls();
  renderObjects();
  publishProject();
}

function setLayerVisiblePlayer(id) {
  const l = layerState(id);
  l.visiblePlayer = !l.visiblePlayer;
  project.layers[id] = l;
  buildLayerControls();
  renderObjects();
  publishProject();
}

function toggleLayerLocked(id) {
  const l = layerState(id);
  l.locked = !l.locked;
  project.layers[id] = l;
  buildLayerControls();
  renderObjects();
  publishProject();
}

function buildLayerControls() {
  ensureLayers();
  const box = document.getElementById("layerControls");
  if (!box) return;
  box.innerHTML = "";

  LAYERS.forEach(id => {
    const l = layerState(id);
    const row = document.createElement("div");
    row.className = "layerRow" + (l.visibleMaster ? "" : " hiddenMaster") + (l.locked ? " locked" : "");

    row.innerHTML = `
      <div class="layerName" title="${l.name}">${l.name}</div>
      <button class="layerBtn ${l.visibleMaster ? "active" : ""}" title="Visibile al master">M</button>
      <button class="layerBtn ${l.visiblePlayer ? "active" : "playerOff"}" title="Visibile ai giocatori">P</button>
      <button class="layerBtn ${l.locked ? "active" : ""}" title="Blocca/sblocca editing">${l.locked ? "🔒" : "🔓"}</button>
    `;

    const buttons = row.querySelectorAll("button");
    buttons[0].onclick = () => setLayerVisibleMaster(id);
    buttons[1].onclick = () => setLayerVisiblePlayer(id);
    buttons[2].onclick = () => toggleLayerLocked(id);

    box.appendChild(row);
  });

  const note = document.createElement("div");
  note.className = "layerHint";
  note.textContent = "Gli asset ereditano il layer predefinito, ma ogni oggetto può cambiarlo dalle proprietà.";
  box.appendChild(note);
}

function visibleLayers() {
  ensureLayers();
  return LAYERS.filter(id => layerState(id).visibleMaster);
}


function buildLibrary() {
  const lib = document.getElementById("assetLibrary");
  lib.innerHTML = "";
  project.ui = project.ui || { assetCollapsed:{} };
  project.ui.assetCollapsed = project.ui.assetCollapsed || {};

  const assets = allAssets().filter(a => a.cat !== "Muri");
  const cats = [...new Set(assets.map(a => libraryCategoryForAsset(a)))];

  cats.forEach(cat => {
    const sec = document.createElement("div");
    const collapsed = !!project.ui.assetCollapsed[cat];
    sec.className = "assetCategory" + (collapsed ? " collapsed" : "");

    const h = document.createElement("h3");
    const title = document.createElement("span");
    title.textContent = cat;
    const arrow = document.createElement("span");
    arrow.className = "catArrow";
    arrow.textContent = collapsed ? "▶" : "▼";
    h.appendChild(title);
    h.appendChild(arrow);

    h.onclick = () => {
      project.ui.assetCollapsed[cat] = !project.ui.assetCollapsed[cat];
      buildLibrary();
      publishProject();
    };

    sec.appendChild(h);

    const gridBox = document.createElement("div");
    gridBox.className = "assetGrid";

    assets.filter(a => libraryCategoryForAsset(a) === cat).forEach(a => {
      const tile = document.createElement("div");
      tile.className = "assetTile" + (selectedAssetId === a.id ? " brushSelected" : "");
      tile.draggable = true;
      tile.dataset.assetId = a.id;
      tile.ondragstart = e => e.dataTransfer.setData("text/plain", a.id);

      // Click semplice: mostra nello status le dimensioni di partenza.
      // Il comportamento principale resta drag & drop, quindi le proprietà degli oggetti piazzati restano a destra come prima.
      tile.onclick = () => selectAssetBrush(a.id);

      tile.innerHTML = `<img src="${a.src}" alt=""><span>${a.name}</span><span class="size">${a.cellsW}×${a.cellsH} q. · ${layerName(assetDefaultLayer(a))}</span>${a.tilesetName ? `<span class="tilesetName">${a.tilesetName}</span>` : ""}`;
      gridBox.appendChild(tile);
    });

    sec.appendChild(gridBox);
    lib.appendChild(sec);
  });
}

function libraryCategoryForAsset(asset) {
  if (!asset) return "Oggetti Decorativi";
  if (asset.cat === "Porte" || asset.cat === "Scale e botole") return "Oggetti Interattivi";
  if (asset.cat === "Token") return "Token";
  if (asset.cat === "Overlay" || asset.cat === "Icone") return "Overlay / Effetti";
  return "Oggetti Decorativi";
}


function normalizeProject() {
  project.customAssets = project.customAssets || [];
  project.ui = project.ui || { leftCollapsed:false, rightCollapsed:false, assetCollapsed:{} };
  project.ui.assetCollapsed = project.ui.assetCollapsed || {};
  project.playerFollowEditor = project.playerFollowEditor !== false;
  project.playerZoom = project.playerZoom || 100;
  ensureLayers();

  (project.customAssets || []).forEach(a => {
    if (!a.defaultLayer || !LAYERS.includes(a.defaultLayer)) a.defaultLayer = "arredi";
  });

  project.maps.forEach(m => {
    m.squaresW = m.squaresW || Math.round(m.width / grid());
    m.squaresH = m.squaresH || Math.round(m.height / grid());
    m.viewportX = m.viewportX || 0;
    m.viewportY = m.viewportY || 0;
    m.views = m.views || [];
    m.groups = m.groups || {};
    ensureSmartLayers(m);

    (m.objects || []).forEach(obj => {
      const asset = assetById(obj.assetId);
      obj.layer = migrateLayer(obj.layer, asset);
      if (typeof obj.visibleMaster !== "boolean") obj.visibleMaster = true;
      if (typeof obj.visiblePlayer !== "boolean") obj.visiblePlayer = true;
      if (typeof obj.opacity !== "number") obj.opacity = 1;
      obj.z = layerBaseZ(obj.layer) + (obj.z || 0) % 100;
    });

    rebuildGroupMeta(m);
    if (!m.playerView) {
      m.playerView = { x:m.viewportX || 0, y:m.viewportY || 0, w:Math.round(TV_VIEWPORT.squaresW * grid()), h:Math.round(TV_VIEWPORT.squaresH * grid()) };
    }
  });
}

function render() {
  normalizeProject();
  buildTree();
  buildLayerControls();
  applyCanvasSettings();
  renderSmartLayers();
  renderObjects();
  renderProperties();
  updateMapInfo();
  renderSavedViews();
  publishProject();
}



function applyColumnUI() {
  project.ui = project.ui || {};
  document.body.classList.toggle("leftCollapsed", !!project.ui.leftCollapsed);
  document.body.classList.toggle("rightCollapsed", !!project.ui.rightCollapsed);

  const l = document.getElementById("btnToggleLeft");
  const r = document.getElementById("btnToggleRight");
  if (l) {
    l.textContent = project.ui.leftCollapsed ? "Mostra sinistra" : "Nascondi sinistra";
    l.classList.toggle("active", project.ui.leftCollapsed);
  }
  if (r) {
    r.textContent = project.ui.rightCollapsed ? "Mostra destra" : "Nascondi destra";
    r.classList.toggle("active", project.ui.rightCollapsed);
  }

  // Dopo il cambio colonne, aggiorno la cornice player seguendo le nuove dimensioni dell'editor.
  setTimeout(() => updatePlayerViewFromEditor(true), 0);
}

function toggleLeftColumn() {
  project.ui = project.ui || {};
  project.ui.leftCollapsed = !project.ui.leftCollapsed;
  applyColumnUI();
  publishProject();
}

function toggleRightColumn() {
  project.ui = project.ui || {};
  project.ui.rightCollapsed = !project.ui.rightCollapsed;
  applyColumnUI();
  publishProject();
}

function applyModeUI() {
  const isPlay = project.mode === "play" || isPlayerWindow;
  document.body.classList.toggle("playMode", project.mode === "play" && !isPlayerWindow);
  document.body.classList.toggle("playerWindow", isPlayerWindow);
  document.getElementById("btnEditor").classList.toggle("active", !isPlay);
  document.getElementById("btnPlay").classList.toggle("active", isPlay && !isPlayerWindow);
  applyColumnUI();
  applyZoom();
}

function enterEditorMode() {
  project.mode = "editor";
  selectedId = null;
  applyModeUI();
  status("Modalità Editor");
  render();
}

function enterPlayMode() {
  project.mode = "play";
  selectedId = null;
  applyModeUI();
  status("Modalità Gioco: solo area TV, senza griglia");
  render();
}


// ===== 20_canvas_view.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 20_canvas_view.js
// Canvas, griglia, dimensioni mappa, viewport TV, vista player, viste salvate e navigazione.

function applyCanvasSettings() {
  const map = activeMap();
  canvas.style.width = map.width + "px";
  canvas.style.height = map.height + "px";
  canvas.style.setProperty("--grid-size", grid() + "px");
  updateStageSize();
  updateGridLineWeight();
  updateViewportLayer();
  updatePlayerViewLayer();
  canvas.classList.toggle("gridOn", project.showGrid);
  document.getElementById("mapPreset").value = project.mapPreset || "medium_dungeon";
  document.getElementById("mapSquaresW").value = map.squaresW || Math.round(map.width / grid());
  document.getElementById("mapSquaresH").value = map.squaresH || Math.round(map.height / grid());
  document.getElementById("gridSize").value = String(project.gridSize);
  document.getElementById("btnSnap").classList.toggle("active", project.snap);
  document.getElementById("snapDivisor").value = String(project.snapDivisor || 1);
  document.getElementById("btnSnap").textContent = project.snap ? "Magnete ON" : "Magnete OFF";
  document.getElementById("snapDivisor").value = String(project.snapDivisor || 1);
  const pz = document.getElementById("playerZoom");
  if (pz) pz.value = String(project.playerZoom || 100);
  const pzt = document.getElementById("playerZoomText");
  if (pzt) pzt.textContent = Math.round(project.playerZoom || 100) + "%";
  const followBtn = document.getElementById("btnFollowEditor");
  if (followBtn) { 
    followBtn.classList.toggle("active", project.playerFollowEditor !== false); 
    followBtn.textContent = project.playerFollowEditor !== false ? "Segui editor ON" : "Segui editor OFF"; 
  }
}

function updateStageSize() {
  const map = activeMap();

  if (project.mode === "play" || isPlayerWindow) {
    const rect = activePlayerRect();
    const fit = Math.min(window.innerWidth / rect.w, window.innerHeight / rect.h);

    canvasStage.style.width = Math.ceil(rect.w * fit) + "px";
    canvasStage.style.height = Math.ceil(rect.h * fit) + "px";

    canvas.style.left = Math.round(-rect.x * fit) + "px";
    canvas.style.top = Math.round(-rect.y * fit) + "px";
    canvas.style.transform = `scale(${fit})`;
    return;
  }

  const s = zoomScale();
  canvasStage.style.width = Math.ceil(map.width * s) + "px";
  canvasStage.style.height = Math.ceil(map.height * s) + "px";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
}

function updateGridLineWeight() {
  drawGrid();
}

function drawGrid() {
  const layer = document.getElementById("gridLayer");
  if (!layer) return;
  layer.innerHTML = "";

  if (!project.showGrid || project.mode === "play" || isPlayerWindow) return;

  const map = activeMap();
  const g = grid();
  const z = zoomScale();

  // Spessore reale compensato rispetto allo zoom.
  // Dopo transform: scale(z), una linea larga 1/z px risulta circa 1px a schermo.
  const minorW = Math.max(2, Math.ceil(1.6 / z));
  const majorW = Math.max(4, Math.ceil(3.2 / z));

  for (let x = 0; x <= map.width; x += g) {
    const line = document.createElement("div");
    const isMajor = Math.round(x / g) % 5 === 0;
    line.className = "gridLine vertical " + (isMajor ? "major" : "minor");
    const w = isMajor ? majorW : minorW;
    line.style.left = Math.round(x - w / 2) + "px";
    line.style.width = w + "px";
    layer.appendChild(line);
  }

  for (let y = 0; y <= map.height; y += g) {
    const line = document.createElement("div");
    const isMajor = Math.round(y / g) % 5 === 0;
    line.className = "gridLine horizontal " + (isMajor ? "major" : "minor");
    const h = isMajor ? majorW : minorW;
    line.style.top = Math.round(y - h / 2) + "px";
    line.style.height = h + "px";
    layer.appendChild(line);
  }
}

function updateMapInfo() {
  const map = activeMap();
  const squaresW = (map.width / grid()).toFixed(1);
  const squaresH = (map.height / grid()).toFixed(1);
  document.getElementById("mapInfo").innerHTML =
    `${map.width}×${map.height}px<br>${squaresW}×${squaresH} quadretti dungeon<br>Area TV max: ${TV_VIEWPORT.squaresW}×${TV_VIEWPORT.squaresH} q.<br>Vista player: ${project.playerFollowEditor !== false ? "segue editor" : "area TV fissa"}<br>1 q. = 5 ft / 1,5 m<br>Passo aggancio: ${1/(project.snapDivisor || 1)} q.`;
}

function updateViewportLayer() {
  const map = activeMap();

  // Riquadro azzurro = riferimento massimo TV 4K, non obbliga più la vista player.
  const w = Math.round(TV_VIEWPORT.squaresW * grid());
  const h = Math.round(TV_VIEWPORT.squaresH * grid());

  viewportLayer.style.width = w + "px";
  viewportLayer.style.height = h + "px";
  viewportLayer.style.left = (map.viewportX || 0) + "px";
  viewportLayer.style.top = (map.viewportY || 0) + "px";
  viewportLayer.classList.toggle("hidden", !project.showViewport || project.mode === "play" || isPlayerWindow);

  const t = document.getElementById("playerZoomText");
  if (t) t.textContent = Math.round(project.playerZoom || 100) + "%";
  const z = document.getElementById("playerZoom");
  if (z) z.value = String(project.playerZoom || 100);
}

function updatePlayerViewLayer() {
  if (!playerViewLayer) return;

  const rect = activePlayerRect();
  let displayRect = { ...rect };

  // Se la vista player segue esattamente la finestra editor, la cornice cade sui bordi
  // e può sembrare tagliata. La mostro leggermente rientrata solo nell'editor.
  if (project.playerFollowEditor !== false && project.mode === "editor" && !isPlayerWindow) {
    const inset = Math.max(2, Math.round(12 / zoomScale()));
    displayRect.x = clamp(rect.x + inset, 0, activeMap().width);
    displayRect.y = clamp(rect.y + inset, 0, activeMap().height);
    displayRect.w = Math.max(20, rect.w - inset * 2);
    displayRect.h = Math.max(20, rect.h - inset * 2);
    playerViewLayer.classList.add("followInset");
  } else {
    playerViewLayer.classList.remove("followInset");
  }

  playerViewLayer.style.left = Math.round(displayRect.x) + "px";
  playerViewLayer.style.top = Math.round(displayRect.y) + "px";
  playerViewLayer.style.width = Math.round(displayRect.w) + "px";
  playerViewLayer.style.height = Math.round(displayRect.h) + "px";
  playerViewLayer.classList.toggle("hidden", project.mode === "play" || isPlayerWindow);
}

function playerZoomRatio() {
  return Math.max(0.1, Number(project.playerZoom || 100) / 100);
}

function playerViewportSizePx() {
  const ratio = playerZoomRatio();
  return {
    w: Math.round(TV_VIEWPORT.squaresW * grid() / ratio),
    h: Math.round(TV_VIEWPORT.squaresH * grid() / ratio)
  };
}

function activePlayerRect() {
  const map = activeMap();
  if (project.playerFollowEditor !== false && map.playerView) {
    return clampRect(map.playerView);
  }
  const size = playerViewportSizePx();
  return clampRect({ x:map.viewportX || 0, y:map.viewportY || 0, w:size.w, h:size.h });
}

function clampRect(rect) {
  const map = activeMap();
  const w = Math.max(50, Math.min(Math.round(rect.w || 1000), map.width));
  const h = Math.max(50, Math.min(Math.round(rect.h || 700), map.height));
  const x = clamp(Math.round(rect.x || 0), 0, Math.max(0, map.width - w));
  const y = clamp(Math.round(rect.y || 0), 0, Math.max(0, map.height - h));
  return { x, y, w, h };
}

function updatePlayerViewFromEditor(shouldPublish = true) {
  if (isPlayerWindow || project.mode !== "editor" || project.playerFollowEditor === false) return;
  const map = activeMap();
  map.playerView = clampRect(getCurrentViewAsMapRect());
  updatePlayerViewLayer();
  if (shouldPublish) publishProject();
}

function applyMapSizeFromSquares(squaresW, squaresH) {
  const map = activeMap();
  map.squaresW = Number(squaresW);
  map.squaresH = Number(squaresH);
  map.width = Math.round(map.squaresW * grid());
  map.height = Math.round(map.squaresH * grid());

  const size = playerViewportSizePx();
  map.viewportX = Math.min(map.viewportX || 0, Math.max(0, map.width - size.w));
  map.viewportY = Math.min(map.viewportY || 0, Math.max(0, map.height - size.h));

  render();
}

function setMapPreset(presetKey) {
  project.mapPreset = presetKey;
  const preset = MAP_PRESETS[presetKey] || MAP_PRESETS.medium_dungeon;
  document.getElementById("zoom").value = preset.zoom;
  applyMapSizeFromSquares(preset.squaresW, preset.squaresH);
  applyZoom();
}

function getCurrentViewAsMapRect() {
  const s = zoomScale();
  const map = activeMap();

  const wrapRect = canvasWrap.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  // Calcolo la porzione realmente visibile del canvas,
  // non solo scrollLeft/scrollTop: così padding, bordi e colonne richiuse non spostano la cornice.
  const x = clamp((wrapRect.left - canvasRect.left) / s, 0, map.width);
  const y = clamp((wrapRect.top - canvasRect.top) / s, 0, map.height);
  const w = clamp(wrapRect.width / s, 1, Math.max(1, map.width - x));
  const h = clamp(wrapRect.height / s, 1, Math.max(1, map.height - y));

  return {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
    zoom: Number(document.getElementById("zoom").value)
  };
}

function setViewportFromCurrentView() {
  const map = activeMap();
  const view = getCurrentViewAsMapRect();
  const size = playerViewportSizePx();

  const centerX = view.x + view.w / 2;
  const centerY = view.y + view.h / 2;

  map.viewportX = clamp(Math.round(centerX - size.w / 2), 0, Math.max(0, map.width - size.w));
  map.viewportY = clamp(Math.round(centerY - size.h / 2), 0, Math.max(0, map.height - size.h));
  updateViewportLayer();
  status("Area TV massima centrata sulla vista corrente");
  updatePlayerViewLayer();
  publishProject();
}

function goToViewport() {
  const map = activeMap();
  const s = zoomScale();
  canvasWrap.scrollLeft = (map.viewportX || 0) * s;
  canvasWrap.scrollTop = (map.viewportY || 0) * s;
}

function fitWholeMap() {
  const map = activeMap();
  const wrapW = canvasWrap.clientWidth - 40;
  const wrapH = canvasWrap.clientHeight - 40;
  const percent = Math.max(5, Math.min(160, Math.floor(Math.min(wrapW / map.width, wrapH / map.height) * 100)));
  setZoomPercent(percent);
  canvasWrap.scrollLeft = 0;
  canvasWrap.scrollTop = 0;
  status("Vista adattata alla mappa intera");
  updatePlayerViewFromEditor(true);
}

function fitTVOneToOne() { goToViewport(); }


function saveCurrentView() {
  const map = activeMap();
  const name = prompt("Nome vista:", "Nuova vista");
  if (!name) return;
  const view = getCurrentViewAsMapRect();
  map.views = map.views || [];
  map.views.push({ id: uid(), name, ...view });
  renderSavedViews();
  status("Vista salvata: " + name);
}

function goToSavedView(id) {
  const map = activeMap();
  const view = (map.views || []).find(v => v.id === id);
  if (!view) return;
  setZoomPercent(view.zoom || Number(document.getElementById("zoom").value));
  const s = zoomScale();
  canvasWrap.scrollLeft = view.x * s;
  canvasWrap.scrollTop = view.y * s;
  status("Vista: " + view.name);
  updatePlayerViewFromEditor(true);
}

function deleteSavedView(id) {
  const map = activeMap();
  map.views = (map.views || []).filter(v => v.id !== id);
  renderSavedViews();
  publishProject();
}

function renderSavedViews() {
  const box = document.getElementById("savedViews");
  if (!box) return;
  const map = activeMap();
  box.innerHTML = "";
  (map.views || []).forEach(v => {
    const row = document.createElement("div");
    row.className = "savedView";
    const go = document.createElement("button");
    go.className = "go";
    go.textContent = v.name;
    go.onclick = () => goToSavedView(v.id);
    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "×";
    del.onclick = () => deleteSavedView(v.id);
    row.appendChild(go);
    row.appendChild(del);
    box.appendChild(row);
  });
}


// ===== 30_objects_properties.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 30_objects_properties.js
// Oggetti piazzati, drag, proprietà, scala, rotazione, copia/incolla, z-order ed eliminazione.


function getSelectionIds() {
  if (Array.isArray(selectedIds) && selectedIds.length) return selectedIds.slice();
  return selectedId ? [selectedId] : [];
}

function selectedObjects() {
  const ids = new Set(getSelectionIds());
  return activeMap().objects.filter(o => ids.has(o.id));
}

function groupMembers(groupId) {
  if (!groupId) return [];
  return activeMap().objects.filter(o => o.groupId === groupId);
}

function rebuildGroupMeta(map = activeMap()) {
  map.groups = map.groups || {};
  const ids = [...new Set(map.objects.map(o => o.groupId).filter(Boolean))];

  ids.forEach(groupId => {
    if (!map.groups[groupId]) {
      const members = map.objects.filter(o => o.groupId === groupId);
      const b = getBoundsForObjects(members);
      map.groups[groupId] = { id:groupId, x:b.x, y:b.y, w:b.w, h:b.h, rot:0 };
    }
    refreshGroupMetaFromMembers(groupId, false);
  });

  Object.keys(map.groups).forEach(gid => {
    if (!ids.includes(gid)) delete map.groups[gid];
  });
}

function getBoundsForObjects(objs) {
  if (!objs || !objs.length) return { x:0, y:0, w:0, h:0, cx:0, cy:0 };
  const minX = Math.min(...objs.map(o => o.x));
  const minY = Math.min(...objs.map(o => o.y));
  const maxX = Math.max(...objs.map(o => o.x + o.w));
  const maxY = Math.max(...objs.map(o => o.y + o.h));
  return { x:minX, y:minY, w:maxX-minX, h:maxY-minY, cx:minX+(maxX-minX)/2, cy:minY+(maxY-minY)/2 };
}

function refreshGroupMetaFromMembers(groupId, keepRotation = true) {
  const map = activeMap();
  const members = groupMembers(groupId);
  if (!members.length) return null;
  const oldRot = map.groups?.[groupId]?.rot || 0;
  const b = getBoundsForObjects(members);
  map.groups = map.groups || {};
  map.groups[groupId] = {
    id:groupId,
    x:b.x,
    y:b.y,
    w:b.w,
    h:b.h,
    rot: keepRotation ? oldRot : (map.groups[groupId]?.rot || 0)
  };
  return map.groups[groupId];
}

function selectedGroups() {
  const gids = [...new Set(selectedObjects().map(o => o.groupId).filter(Boolean))];
  return gids.map(gid => activeMap().groups?.[gid]).filter(Boolean);
}

function renderGroupProxies() {
  canvas.querySelectorAll(".groupProxy").forEach(n => n.remove());
  if (project.mode === "play" || isPlayerWindow) return;

  const map = activeMap();
  map.groups = map.groups || {};
  const selected = new Set(getSelectionIds());

  Object.values(map.groups).forEach(g => {
    const members = groupMembers(g.id);
    if (!members.length) return;

    const visibleMembers = members.filter(o => objectVisibleForMaster(o));
    if (!visibleMembers.length) return;
    const isSelectedGroup = members.some(o => selected.has(o.id));
    const groupLocked = members.some(o => o.locked || objectLayerLocked(o));
    const proxy = document.createElement("div");
    proxy.className = "groupProxy" + (isSelectedGroup ? " selected" : "") + (groupLocked ? " layerLocked" : "");
    proxy.dataset.groupId = g.id;

    proxy.style.left = g.x + "px";
    proxy.style.top = g.y + "px";
    proxy.style.width = g.w + "px";
    proxy.style.height = g.h + "px";
    proxy.style.transform = `rotate(${g.rot || 0}deg)`;
    proxy.style.transformOrigin = "center center";

    proxy.onmousedown = e => startGroupDrag(e, g.id);
    proxy.onclick = e => e.stopPropagation();

    canvas.appendChild(proxy);
  });
}

function startGroupDrag(e, groupId) {
  if (project.mode !== "editor") return;
  const members = groupMembers(groupId);
  if (!members.length) return;
  if (members.some(o => o.locked || objectLayerLocked(o))) { status('Gruppo o layer bloccato'); return; }

  if (e.shiftKey || e.ctrlKey || e.metaKey) {
    members.forEach(o => toggleObjectSelection(o.id));
    renderObjects();
    renderProperties();
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  selectedIds = members.map(o => o.id);
  selectedId = selectedIds[selectedIds.length - 1];

  const origins = members
    .filter(o => !o.locked && !objectLayerLocked(o))
    .map(o => ({ id:o.id, x:o.x, y:o.y }));

  const group = activeMap().groups[groupId];
  dragState = { ids:selectedIds.slice(), groupId, startX:e.clientX, startY:e.clientY, origins, groupOrigin:{ x:group.x, y:group.y } };

  renderObjects();
  renderProperties();
  e.preventDefault();
  e.stopPropagation();
}

function rotateGroupAsSingleObject(groupId, deg) {
  const map = activeMap();
  const group = map.groups?.[groupId];
  if (!group) return;

  group.rot = normalizeRotation(Number(group.rot || 0) + Number(deg || 0));

  renderObjects();
  renderProperties();
  publishProject();
  status(`Gruppo ruotato come oggetto unico: ${group.rot}°`);
}

function scaleGroupAsSingleObject(groupId, deltaCells) {
  const map = activeMap();
  const group = map.groups?.[groupId];
  if (!group) return;

  const factor = deltaCells > 0 ? 1.1 : 0.9;
  const cx = group.x + group.w / 2;
  const cy = group.y + group.h / 2;

  group.w = Math.max(grid()/2, group.w * factor);
  group.h = Math.max(grid()/2, group.h * factor);
  group.x = snapValue(cx - group.w / 2);
  group.y = snapValue(cy - group.h / 2);

  renderObjects();
  renderProperties();
  publishProject();
  status("Gruppo scalato come oggetto unico");
}


function objectById(id) {
  return activeMap().objects.find(o => o.id === id);
}

function groupIdOfSelection() {
  const objs = selectedObjects();
  if (!objs.length) return null;
  const ids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];
  return ids.length === 1 ? ids[0] : null;
}

function getSelectionBounds(objs = selectedObjects()) {
  return getBoundsForObjects(objs);
}


function selectObjectRespectingGroup(id) {
  const obj = objectById(id);
  if (!obj) return;
  if (obj.groupId) {
    selectedIds = groupMembers(obj.groupId).map(o => o.id);
    selectedId = id;
  } else {
    setSingleSelection(id);
  }
}

function groupSelected() {
  const objs = selectedObjects();
  if (objs.length < 2) {
    status("Seleziona almeno due oggetti da raggruppare");
    return;
  }

  const groupId = "grp_" + uid();
  objs.forEach(o => {
    o.groupId = groupId;
    o.groupLocalRot = Number(o.rot || o.rotation || 0);
  });

  const b = getBoundsForObjects(objs);
  activeMap().groups = activeMap().groups || {};
  activeMap().groups[groupId] = { id:groupId, x:b.x, y:b.y, w:b.w, h:b.h, rot:0 };

  selectedIds = objs.map(o => o.id);
  selectedId = selectedIds[selectedIds.length - 1];
  renderObjects();
  renderProperties();
  publishProject();
  status(`${objs.length} oggetti raggruppati`);
}

function ungroupSelected() {
  const objs = selectedObjects();
  if (!objs.length) return;

  const groupIds = new Set(objs.map(o => o.groupId).filter(Boolean));
  if (!groupIds.size) {
    status("Nessun gruppo da sciogliere");
    return;
  }

  groupIds.forEach(groupId => {
    const group = activeMap().groups?.[groupId];
    const members = groupMembers(groupId);
    if (group) {
      const gx = group.x + group.w / 2;
      const gy = group.y + group.h / 2;
      const b = getBoundsForObjects(members);
      const bx = b.x + b.w / 2;
      const by = b.y + b.h / 2;
      const angle = Number(group.rot || 0) * Math.PI / 180;

      members.forEach(o => {
        const cx = o.x + o.w / 2;
        const cy = o.y + o.h / 2;
        const relativeX = group.x + (cx - b.x) * (group.w / Math.max(1, b.w));
        const relativeY = group.y + (cy - b.y) * (group.h / Math.max(1, b.h));
        const moved = transformPointAround(gx, gy, relativeX, relativeY, angle, 1);
        o.x = snapValue(moved.x - o.w / 2);
        o.y = snapValue(moved.y - o.h / 2);
        o.rot = normalizeRotation(Number(o.rot || o.rotation || 0) + Number(group.rot || 0));
        o.rotation = o.rot;
        delete o.groupId;
        delete o.groupLocalRot;
      });
    } else {
      members.forEach(o => { delete o.groupId; delete o.groupLocalRot; });
    }

    if (activeMap().groups) delete activeMap().groups[groupId];
  });

  renderObjects();
  renderProperties();
  publishProject();
  status("Gruppo sciolto");
}

function normalizeRotation(value) {
  return ((Number(value || 0) % 360) + 360) % 360;
}

function transformPointAround(cx, cy, px, py, angleRad, scale = 1) {
  const dx = (px - cx) * scale;
  const dy = (py - cy) * scale;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos
  };
}


function isSelected(id) {
  return getSelectionIds().includes(id);
}

function setSingleSelection(id) {
  selectedId = id || null;
  selectedIds = id ? [id] : [];
}

function clearSelection() {
  selectedId = null;
  selectedIds = [];
}

function toggleObjectSelection(id) {
  if (!id) return;
  const set = new Set(getSelectionIds());
  if (set.has(id)) set.delete(id);
  else set.add(id);
  selectedIds = Array.from(set);
  selectedId = selectedIds.length ? selectedIds[selectedIds.length - 1] : null;
}

function selectAllObjects() {
  selectedIds = activeMap().objects.map(o => o.id);
  selectedId = selectedIds.length ? selectedIds[selectedIds.length - 1] : null;
  renderObjects();
  renderProperties();
  status(`${selectedIds.length} oggetti selezionati`);
}

function renderMultiProperties(box, ids) {
  box.innerHTML = `
    <div class="multiBox">
      <h3>${ids.length} oggetti selezionati</h3>
      <p class="small">Comandi di gruppo. Per modificare proprietà specifiche, seleziona un solo oggetto.</p>

      <div class="buttonRow">
        <button id="multiCopyBtn">Copia gruppo</button>
        <button id="multiPasteBtn">Incolla</button>
      </div>

      <div class="buttonRow">
        <button id="multiRotLBtn">Ruota -15°</button>
        <button id="multiRotRBtn">Ruota +15°</button>
      </div>

      <div class="buttonRow">
        <button id="multiScaleDownBtn">Scala -</button>
        <button id="multiScaleUpBtn">Scala +</button>
      </div>

      <div class="buttonRow">
        <button id="multiFitGridBtn">Aggancia a griglia</button>
        <button id="multiDeleteBtn" class="danger">Elimina gruppo</button>
      </div>

      <div class="buttonRow">
        <button id="multiForwardBtn">Avanti</button>
        <button id="multiBackBtn">Indietro</button>
      </div>

      <label>Sposta selezione nel layer
        <select id="multiLayerSelect">${layerOptionsHtml(selectedObjects()[0]?.layer || "arredi")}</select>
      </label>

      <div class="buttonRow">
        <button id="multiShowPlayerBtn">Visibile giocatore</button>
        <button id="multiHidePlayerBtn">Nascondi giocatore</button>
      </div>

      <div class="buttonRow">
        <button id="multiGroupBtn">Raggruppa</button>
        <button id="multiUngroupBtn">Sciogli gruppo</button>
      </div>

      <p class="small">Shift/Ctrl/Cmd + click sugli oggetti per aggiungere o togliere dalla selezione. Rotazione e scala usano il centro del gruppo come riferimento comune.</p>
    </div>
  `;

  document.getElementById("multiCopyBtn").onclick = copySelected;
  document.getElementById("multiPasteBtn").onclick = pasteClipboard;
  document.getElementById("multiDeleteBtn").onclick = deleteSelected;
  document.getElementById("multiRotLBtn").onclick = () => rotateSelected(-15);
  document.getElementById("multiRotRBtn").onclick = () => rotateSelected(15);
  document.getElementById("multiScaleDownBtn").onclick = () => scaleSelected(-0.25);
  document.getElementById("multiScaleUpBtn").onclick = () => scaleSelected(0.25);
  document.getElementById("multiFitGridBtn").onclick = fitSelectedToGrid;
  document.getElementById("multiForwardBtn").onclick = () => changeZ(10);
  document.getElementById("multiBackBtn").onclick = () => changeZ(-10);
  document.getElementById("multiShowPlayerBtn").onclick = () => setSelectedVisiblePlayer(true);
  document.getElementById("multiHidePlayerBtn").onclick = () => setSelectedVisiblePlayer(false);
  document.getElementById("multiGroupBtn").onclick = groupSelected;
  document.getElementById("multiUngroupBtn").onclick = ungroupSelected;
  document.getElementById("multiLayerSelect").onchange = e => setSelectedLayer(e.target.value);
}

function setSelectedVisiblePlayer(value) {
  selectedObjects().forEach(o => o.visiblePlayer = value);
  renderObjects();
  renderProperties();
  publishProject();
}

function setSelectedLayer(layerId) {
  if (!LAYERS.includes(layerId)) return;
  const objs = selectedObjects();
  objs.forEach(o => {
    o.layer = layerId;
    o.z = layerBaseZ(layerId);
  });
  renderObjects();
  renderProperties();
  publishProject();
  status(`Spostati ${objs.length} oggetti nel layer ${layerName(layerId)}`);
}


function renderObjects() {
  canvas.querySelectorAll(".mapObject").forEach(n => n.remove());
  canvas.querySelectorAll(".groupProxy").forEach(n => n.remove());

  const map = activeMap();
  map.groups = map.groups || {};
  const selection = new Set(getSelectionIds());

  map.objects.forEach(obj => {
    if (project.mode === "play" || isPlayerWindow) {
      if (!objectVisibleForPlayer(obj)) return;
    } else {
      if (!objectVisibleForMaster(obj)) return;
    }

    const a = assetById(obj.assetId);
    if (!a) return;

    const isSel = selection.has(obj.id);
    const isPrimary = obj.id === selectedId;
    const group = obj.groupId ? map.groups[obj.groupId] : null;

    const el = document.createElement("div");
    const editorDecorations = !isPlayerWindow && project.mode === "editor";
    el.className = "mapObject"
      + (editorDecorations && obj.groupId ? " grouped" : "")
      + (editorDecorations && objectLayerLocked(obj) ? " layerLocked" : "")
      + (editorDecorations && isSel ? (isPrimary ? " selected" : " multiSelected") : "")
      + (editorDecorations && obj.visiblePlayer === false ? " hiddenPlayer" : "");
    el.dataset.id = obj.id;

    let x = obj.x;
    let y = obj.y;
    let rot = Number(obj.rot || obj.rotation || 0);
    let w = obj.w;
    let h = obj.h;

    if (group) {
      const members = groupMembers(obj.groupId);
      const b = getBoundsForObjects(members);
      const localCx = obj.x + obj.w / 2;
      const localCy = obj.y + obj.h / 2;

      // Scala del gruppo come bounding-box unica.
      const scaledCx = group.x + (localCx - b.x) * (group.w / Math.max(1, b.w));
      const scaledCy = group.y + (localCy - b.y) * (group.h / Math.max(1, b.h));

      // Rotazione del gruppo come oggetto unico attorno al centro comune.
      const groupCx = group.x + group.w / 2;
      const groupCy = group.y + group.h / 2;
      const moved = transformPointAround(groupCx, groupCy, scaledCx, scaledCy, Number(group.rot || 0) * Math.PI / 180, 1);

      w = obj.w * (group.w / Math.max(1, b.w));
      h = obj.h * (group.h / Math.max(1, b.h));
      x = moved.x - w / 2;
      y = moved.y - h / 2;
      rot = normalizeRotation(rot + Number(group.rot || 0));
    }

    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.opacity = obj.opacity ?? 1;
    el.style.transform = `rotate(${rot}deg)`;
    el.style.transformOrigin = "center center";
    el.style.zIndex = String(20000 + layerBaseZ(objectLayerId(obj)) + ((obj.z || 0) % 100));

    el.innerHTML = `<img src="${assetSrcForObject(a, {w,h})}" alt="">`;

    if (!isPlayerWindow) {
      el.onclick = e => { e.stopPropagation(); };
      el.onmousedown = e => startDrag(e, obj.id);
    }

    canvas.appendChild(el);
  });

  renderGroupProxies();
}


function assetSrcForBox(asset, w, h) {
  if (!asset) return "";
  if (asset.srcVertical && h > w) return asset.srcVertical;
  return asset.src;
}

function assetSrcForObject(asset, obj) {
  if (!asset || !obj) return asset ? asset.src : "";
  return assetSrcForBox(asset, Number(obj.w || 0), Number(obj.h || 0));
}


function layerBaseZ(layer) {
  const idx = LAYERS.indexOf(layer);
  return ((idx >= 0 ? idx : LAYERS.length) + 1) * 100;
}


function startDrag(e, id) {
  if (project.mode !== "editor" || isPlayerWindow) return;

  const obj = activeMap().objects.find(o => o.id === id);
  if (!obj) return;

  // Shift/Ctrl/Cmd serve sempre per costruire o togliere selezioni manuali.
  if (e.shiftKey || e.ctrlKey || e.metaKey) {
    toggleObjectSelection(id);
    renderObjects();
    renderProperties();
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (obj.locked || objectLayerLocked(obj)) {
    status("Oggetto o layer bloccato");
    selectObjectRespectingGroup(id);
    renderObjects();
    renderProperties();
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (obj.groupId) {
    const members = groupMembers(obj.groupId);
    if (!members.length) return;

    if (members.some(o => o.locked || objectLayerLocked(o))) {
      status("Gruppo o layer bloccato");
      selectedIds = members.map(o => o.id);
      selectedId = id;
      renderObjects();
      renderProperties();
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    selectedIds = members.map(o => o.id);
    selectedId = id;

    const group = activeMap().groups[obj.groupId] || refreshGroupMetaFromMembers(obj.groupId);
    dragState = {
      groupId: obj.groupId,
      startX: e.clientX,
      startY: e.clientY,
      groupOrigin: { x: group.x, y: group.y }
    };
  } else {
    if (!isSelected(id)) setSingleSelection(id);
    else selectedId = id;

    const ids = getSelectionIds();
    const origins = activeMap().objects
      .filter(o => ids.includes(o.id) && !o.locked && !objectLayerLocked(o))
      .map(o => ({ id:o.id, x:o.x, y:o.y }));

    if (!origins.length) {
      status("Selezione bloccata");
      renderObjects();
      renderProperties();
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    dragState = {
      ids,
      startX: e.clientX,
      startY: e.clientY,
      origins
    };
  }

  renderObjects();
  renderProperties();
  e.preventDefault();
  e.stopPropagation();
}

document.addEventListener("mousemove", e => {
  if (!dragState) return;

  const scale = zoomScale();
  const dx = (e.clientX - dragState.startX) / scale;
  const dy = (e.clientY - dragState.startY) / scale;

  if (dragState.groupId) {
    const group = activeMap().groups?.[dragState.groupId];
    if (group) {
      group.x = snapValue(dragState.groupOrigin.x + dx);
      group.y = snapValue(dragState.groupOrigin.y + dy);
    }
  } else {
    dragState.origins.forEach(origin => {
      const obj = activeMap().objects.find(o => o.id === origin.id);
      if (!obj || obj.locked || objectLayerLocked(obj)) return;
      obj.x = snapValue(origin.x + dx);
      obj.y = snapValue(origin.y + dy);
    });
  }

  renderObjects();

  const primary = activeMap().objects.find(o => o.id === selectedId);
  if (primary) updateLiveXY(primary);
});
document.addEventListener("mouseup", () => {
  if (dragState) publishProject();
  dragState = null;
});

// canvas click handled by pointerdown listener for brush mode


function defaultLayer(cat) {
  if (cat === "Base") return "pavimenti";
  if (cat === "Muri") return "architettura";
  if (cat === "Porte") return "porte";
  if (cat === "Scale e botole") return "interattivi";
  if (cat === "Overlay") return "nebbia";
  if (cat === "Token") return "token";
  if (cat === "Icone") return "note_master";
  if (cat === "Importati") return "arredi";
  return "arredi";
}

function renderProperties() {
  const ids = getSelectionIds();
  if (ids.length > 1) {
    const box = document.getElementById("properties");
    renderMultiProperties(box, ids);
    return;
  }

  const box = document.getElementById("properties");
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) {
    box.innerHTML = `<p class="hint">Seleziona un oggetto sulla mappa.</p>`;
    return;
  }

  const currentGroup = obj.groupId ? groupMembers(obj.groupId) : [];
  box.innerHTML = `
    ${obj.groupId ? `<div class="groupBox"><h3>Oggetto in gruppo</h3><p class="small">${currentGroup.length} oggetti vincolati. Clic normale su un membro seleziona tutto il gruppo.</p><div class="buttonRow"><button id="selectGroupBtn">Seleziona gruppo</button><button id="ungroupBtn">Sciogli gruppo</button></div></div>` : ""}

    <label>Nome <input data-prop="name" value="${esc(obj.name)}"></label>
    <label>Tipo <input data-prop="type" value="${esc(obj.type || "")}"></label>

    <label>Layer
      <select data-prop="layer">${layerOptionsHtml(objectLayerId(obj))}</select>
    </label>

    <div class="row2">
      <label>X quadretti <input data-prop-cells="x" type="number" step="0.5" value="${cellsFromPx(obj.x)}"></label>
      <label>Y quadretti <input data-prop-cells="y" type="number" step="0.5" value="${cellsFromPx(obj.y)}"></label>
    </div>

    <div class="row2">
      <label>Larghezza q. <input data-prop-cells="w" type="number" step="0.25" min="0.25" value="${cellsFromPx(obj.w)}"></label>
      <label>Altezza q. <input data-prop-cells="h" type="number" step="0.25" min="0.25" value="${cellsFromPx(obj.h)}"></label>
    </div>

    <label>Rotazione: <b id="rotationValue">${obj.rotation || 0}°</b>
      <input data-prop="rotation" type="range" min="-180" max="180" step="1" value="${obj.rotation || 0}">
    </label>
    <div class="buttonRow">
      <button id="rotateLeftBtn">Ruota -15°</button>
      <button id="rotateRightBtn">Ruota +15°</button>
    </div>

    <label>Opacità: <b id="opacityValue">${Math.round((obj.opacity ?? 1)*100)}%</b>
      <input data-prop="opacity" type="range" min="0" max="1" step="0.05" value="${obj.opacity ?? 1}">
    </label>

    <div class="buttonRow">
      <button id="scaleDownBtn">Scala -</button>
      <button id="scaleUpBtn">Scala +</button>
    </div>
    <div class="buttonRow">
      <button id="fitGridBtn">Aggancia a griglia</button>
      <button id="resetSizeBtn">Misura base</button>
    </div>

    <div class="buttonRow">
      <button id="copyBtn">Copia</button>
      <button id="pasteBtn">Incolla</button>
    </div>

    <div class="buttonRow">
      <button id="duplicateBtn">Duplica</button>
      <button id="deleteBtn" class="danger">Elimina</button>
    </div>

    <div class="buttonRow">
      <button id="bringForwardBtn">Avanti</button>
      <button id="sendBackBtn">Indietro</button>
    </div>

    <label><input data-prop="visibleMaster" type="checkbox" ${obj.visibleMaster !== false ? "checked" : ""}> Visibile Master</label>
    <label><input data-prop="visiblePlayer" type="checkbox" ${obj.visiblePlayer !== false ? "checked" : ""}> Visibile Giocatore</label>
    <label><input data-prop="locked" type="checkbox" ${obj.locked ? "checked" : ""}> Bloccato</label>

    <label>Nota master <textarea data-prop="note" rows="3">${esc(obj.note || "")}</textarea></label>
    <p class="small">Le misure sono in quadretti VTT. Con Magnete ON posizione e movimento si allineano alla griglia.</p>
  `;

  box.querySelectorAll("[data-prop]").forEach(input => input.oninput = input.onchange = () => updateProperty(input));
  box.querySelectorAll("[data-prop-cells]").forEach(input => { input.oninput = () => updateCellProperty(input, false); input.onchange = () => updateCellProperty(input, true); });

  const selectGroupBtn = document.getElementById("selectGroupBtn");
  if (selectGroupBtn) selectGroupBtn.onclick = () => { selectedIds = groupMembers(obj.groupId).map(o => o.id); selectedId = obj.id; renderObjects(); renderProperties(); };
  const ungroupBtn = document.getElementById("ungroupBtn");
  if (ungroupBtn) ungroupBtn.onclick = ungroupSelected;

  document.getElementById("rotateLeftBtn").onclick = () => rotateSelected(-15);
  document.getElementById("rotateRightBtn").onclick = () => rotateSelected(15);
  document.getElementById("scaleDownBtn").onclick = () => scaleSelected(-0.25);
  document.getElementById("scaleUpBtn").onclick = () => scaleSelected(0.25);
  document.getElementById("fitGridBtn").onclick = fitSelectedToGrid;
  document.getElementById("resetSizeBtn").onclick = resetSelectedSize;
  document.getElementById("copyBtn").onclick = copySelected;
  document.getElementById("pasteBtn").onclick = pasteClipboard;
  document.getElementById("duplicateBtn").onclick = duplicateSelected;
  document.getElementById("deleteBtn").onclick = deleteSelected;
  document.getElementById("bringForwardBtn").onclick = () => changeZ(10);
  document.getElementById("sendBackBtn").onclick = () => changeZ(-10);
  bindRotationButtons();
}


function updateCellProperty(input, finalUpdate = false) {
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) return;
  const key = input.dataset.propCells;
  const numeric = Number(input.value);
  if (!Number.isFinite(numeric)) return;

  const valuePx = numeric * grid();
  obj[key] = project.snap ? snapValue(valuePx) : Math.round(valuePx);
  if (key === "w") obj.cellsW = numeric;
  if (key === "h") obj.cellsH = numeric;

  renderObjects();

  // Evita il fastidioso refresh completo mentre stai digitando.
  // Lo facciamo solo quando l'input viene confermato.
  if (finalUpdate) renderProperties();
}

function updateLiveXY(obj) {
  const x = document.querySelector('[data-prop-cells="x"]');
  const y = document.querySelector('[data-prop-cells="y"]');
  if (x) x.value = cellsFromPx(obj.x);
  if (y) y.value = cellsFromPx(obj.y);
}

function updateProperty(input) {
  const obj = activeMap().objects.find(o => o.id === selectedId);
  if (!obj) return;
  const key = input.dataset.prop;
  if (input.type === "checkbox") obj[key] = input.checked;
  else if (["rotation","opacity"].includes(key)) obj[key] = Number(input.value);
  else obj[key] = input.value;
  if (key === "layer") { obj.layer = migrateLayer(obj.layer, assetById(obj.assetId)); obj.z = layerBaseZ(obj.layer); buildLayerControls(); }
  renderObjects();
  if (key === "rotation") document.getElementById("rotationValue").textContent = `${obj.rotation || 0}°`;
  if (key === "opacity") document.getElementById("opacityValue").textContent = `${Math.round((obj.opacity ?? 1)*100)}%`;
}



function bindRotationButtons() {
  const candidates = [
    ["rotLeftBtn", -15], ["rotRightBtn", 15],
    ["rotateLeftBtn", -15], ["rotateRightBtn", 15],
    ["btnRotateLeft", -15], ["btnRotateRight", 15]
  ];

  candidates.forEach(([id, deg]) => {
    const b = document.getElementById(id);
    if (b) b.onclick = () => rotateSelected(deg);
  });
}


function rotateSelected(deg) {
  const objs = selectedObjects();
  if (!objs.length) {
    status("Seleziona uno o più oggetti da ruotare");
    return;
  }

  const gids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];

  // Caso principale: un gruppo già creato si comporta davvero come un solo oggetto.
  if (gids.length === 1 && objs.every(o => o.groupId === gids[0])) {
    rotateGroupAsSingleObject(gids[0], deg);
    return;
  }

  if (objs.length === 1) {
    const obj = objs[0];
    obj.rot = normalizeRotation(Number(obj.rot || obj.rotation || 0) + Number(deg || 0));
    obj.rotation = obj.rot;
  } else {
    const bounds = getSelectionBounds(objs);
    const angle = Number(deg || 0) * Math.PI / 180;

    objs.forEach(obj => {
      const centerX = obj.x + obj.w / 2;
      const centerY = obj.y + obj.h / 2;
      const moved = transformPointAround(bounds.cx, bounds.cy, centerX, centerY, angle, 1);

      obj.x = snapValue(moved.x - obj.w / 2);
      obj.y = snapValue(moved.y - obj.h / 2);
      obj.rot = normalizeRotation(Number(obj.rot || obj.rotation || 0) + Number(deg || 0));
      obj.rotation = obj.rot;
    });
  }

  renderObjects();
  renderProperties();
  publishProject();
  status(objs.length > 1 ? `Selezione ruotata attorno al centro comune` : `Rotazione: ${objs[0].rot}°`);
}



function selectedObject() {
  return activeMap().objects.find(o => o.id === selectedId);
}


function scaleSelected(deltaCells) {
  const objs = selectedObjects();
  if (!objs.length) return;

  const gids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];

  // Caso principale: un gruppo già creato scala come un solo oggetto.
  if (gids.length === 1 && objs.every(o => o.groupId === gids[0])) {
    scaleGroupAsSingleObject(gids[0], deltaCells);
    return;
  }

  if (objs.length === 1) {
    const obj = objs[0];
    const currentW = cellsFromPx(obj.w);
    const currentH = cellsFromPx(obj.h);
    const minSize = 0.25;

    const newWCells = Math.max(minSize, roundToStep(currentW + deltaCells, 0.25));
    const newHCells = Math.max(minSize, roundToStep(currentH + deltaCells, 0.25));

    obj.w = pxFromCells(newWCells);
    obj.h = pxFromCells(newHCells);
    obj.cellsW = newWCells;
    obj.cellsH = newHCells;
  } else {
    const bounds = getSelectionBounds(objs);
    const factor = deltaCells > 0 ? 1.1 : 0.9;
    const quarter = grid() / 4;

    objs.forEach(obj => {
      const centerX = obj.x + obj.w / 2;
      const centerY = obj.y + obj.h / 2;
      const moved = transformPointAround(bounds.cx, bounds.cy, centerX, centerY, 0, factor);

      obj.w = Math.max(quarter, Math.round((obj.w * factor) / quarter) * quarter);
      obj.h = Math.max(quarter, Math.round((obj.h * factor) / quarter) * quarter);
      obj.x = snapValue(moved.x - obj.w / 2);
      obj.y = snapValue(moved.y - obj.h / 2);
      obj.cellsW = cellsFromPx(obj.w);
      obj.cellsH = cellsFromPx(obj.h);
    });
  }

  fitSelectedToGrid(false);
  renderObjects();
  renderProperties();
  publishProject();
  status(objs.length > 1 ? `Selezione scalata dal centro comune` : "Scala aggiornata");
}

function resetSelectedSize() {
  const objs = selectedObjects();
  if (!objs.length) return;

  objs.forEach(obj => {
    const a = assetById(obj.assetId);
    if (!a) return;
    obj.w = pxFromCells(a.cellsW);
    obj.h = pxFromCells(a.cellsH);
    obj.cellsW = a.cellsW;
    obj.cellsH = a.cellsH;
  });

  fitSelectedToGrid(false);
  renderObjects();
  renderProperties();
  publishProject();
  status(objs.length > 1 ? "Misure base ripristinate" : "Misura base ripristinata");
}

function fitSelectedToGrid(refresh = true) {
  const objs = selectedObjects();
  if (!objs.length) return;

  const gids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];

  if (gids.length === 1 && objs.every(o => o.groupId === gids[0])) {
    const group = activeMap().groups?.[gids[0]];
    if (group) {
      const quarter = grid() / 4;
      group.x = snapValue(group.x);
      group.y = snapValue(group.y);
      group.w = Math.max(quarter, Math.round(group.w / quarter) * quarter);
      group.h = Math.max(quarter, Math.round(group.h / quarter) * quarter);
    }
  } else {
    const quarter = grid() / 4;
    objs.forEach(obj => {
      obj.x = snapValue(obj.x);
      obj.y = snapValue(obj.y);
      obj.w = Math.max(quarter, Math.round(obj.w / quarter) * quarter);
      obj.h = Math.max(quarter, Math.round(obj.h / quarter) * quarter);
      obj.cellsW = cellsFromPx(obj.w);
      obj.cellsH = cellsFromPx(obj.h);
    });
  }

  if (refresh) {
    renderObjects();
    renderProperties();
    publishProject();
    status(objs.length > 1 ? "Gruppo agganciato alla griglia" : "Oggetto agganciato alla griglia");
  }
}

function roundToStep(value, step) {
  return Math.round(value / step) * step;
}

function nudgeSelected(dx, dy) {
  const objs = selectedObjects();
  if (!objs.length) return;
  const gids = [...new Set(objs.map(o => o.groupId).filter(Boolean))];

  if (gids.length === 1 && objs.every(o => o.groupId === gids[0])) {
    const group = activeMap().groups?.[gids[0]];
    if (group) {
      group.x = snapValue(group.x + dx);
      group.y = snapValue(group.y + dy);
    }
  } else {
    objs.forEach(obj => {
      obj.x = snapValue(obj.x + dx);
      obj.y = snapValue(obj.y + dy);
    });
  }

  renderObjects();
  renderProperties();
  publishProject();
}


function copySelected() {
  const objs = selectedObjects();
  if (!objs.length) return;

  const minX = Math.min(...objs.map(o => o.x));
  const minY = Math.min(...objs.map(o => o.y));

  clipboard = {
    type:"objects",
    groups: JSON.parse(JSON.stringify(activeMap().groups || {})),
    objects:objs.map(o => {
      const c = JSON.parse(JSON.stringify(o));
      c.offsetX = c.x - minX;
      c.offsetY = c.y - minY;
      return c;
    })
  };

  status(objs.length > 1 ? `${objs.length} oggetti copiati` : "Oggetto copiato");
}

function pasteClipboard() {
  if (!clipboard) return status("Nessun oggetto copiato");

  const map = activeMap();
  let newObjects = [];

  if (clipboard.type === "objects" && Array.isArray(clipboard.objects)) {
    const baseX = snapValue((map.objects.length ? Math.max(...map.objects.map(o => o.x)) : 0) + snapStep());
    const baseY = snapValue((map.objects.length ? Math.max(...map.objects.map(o => o.y)) : 0) + snapStep());
    const groupMap = new Map();

    newObjects = clipboard.objects.map(src => {
      const copy = JSON.parse(JSON.stringify(src));
      delete copy.offsetX;
      delete copy.offsetY;
      copy.id = uid();
      copy.name = (copy.name || "Oggetto") + " copia";
      copy.x = snapValue(baseX + (src.offsetX || 0));
      copy.y = snapValue(baseY + (src.offsetY || 0));
      copy.z = (copy.z || layerBaseZ(copy.layer)) + 1;

      if (src.groupId) {
        if (!groupMap.has(src.groupId)) groupMap.set(src.groupId, "grp_" + uid());
        copy.groupId = groupMap.get(src.groupId);
      }

      return copy;
    });

    // Ricrea anche i proxy dei gruppi copiati.
    activeMap().groups = activeMap().groups || {};
    groupMap.forEach((newGid, oldGid) => {
      const oldGroup = clipboard.groups?.[oldGid];
      if (oldGroup) {
        activeMap().groups[newGid] = {
          id:newGid,
          x:snapValue(baseX + (oldGroup.x - (clipboard.objects.length ? Math.min(...clipboard.objects.map(o => o.x - (o.offsetX || 0))) : 0))),
          y:snapValue(baseY + (oldGroup.y - (clipboard.objects.length ? Math.min(...clipboard.objects.map(o => o.y - (o.offsetY || 0))) : 0))),
          w:oldGroup.w,
          h:oldGroup.h,
          rot:oldGroup.rot || 0
        };
      }
    });
  } else {
    const copy = JSON.parse(JSON.stringify(clipboard));
    copy.id = uid();
    copy.name = copy.name + " copia";
    copy.x = snapValue(copy.x + snapStep());
    copy.y = snapValue(copy.y + snapStep());
    copy.z = (copy.z || layerBaseZ(copy.layer)) + 1;
    if (copy.groupId) copy.groupId = "grp_" + uid();
    newObjects = [copy];
  }

  map.objects.push(...newObjects);
  selectedIds = newObjects.map(o => o.id);
  selectedId = selectedIds[selectedIds.length - 1] || null;
  status(newObjects.length > 1 ? `${newObjects.length} oggetti incollati` : "Oggetto incollato");
  render();
}

function duplicateSelected() { 
  copySelected(); 
  pasteClipboard(); 
}

function deleteSelected() {
  const ids = new Set(getSelectionIds());
  if (!ids.size) return;
  const map = activeMap();
  map.objects = map.objects.filter(o => !ids.has(o.id));
  if (map.groups) {
    Object.keys(map.groups).forEach(gid => {
      if (!map.objects.some(o => o.groupId === gid)) delete map.groups[gid];
    });
  }
  clearSelection();
  status(ids.size > 1 ? `${ids.size} oggetti eliminati` : "Oggetto eliminato");
  render();
}

function changeZ(delta) {
  const objs = selectedObjects();
  if (!objs.length) return;
  objs.forEach(obj => obj.z = (obj.z || layerBaseZ(obj.layer)) + delta);
  renderObjects();
  publishProject();
}




function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function publishProject() {
  if (isPlayerWindow) return;
  try {
    const raw = JSON.stringify(project);
    if (raw === lastSyncedRaw) return;
    lastSyncedRaw = raw;
    localStorage.setItem(STORAGE_KEY, raw);
    if (syncChannel) syncChannel.postMessage({ type:"project", raw });
  } catch (err) {
    console.warn("Sync non riuscito", err);
  }
}

function loadProjectRaw(raw) {
  if (!raw) return false;
  try {
    project = JSON.parse(raw);
    normalizeProject();
    project.mode = isPlayerWindow ? "play" : (project.mode || "editor");
    buildLibrary();
    selectedId = null;
    syncTopControls();
    render();
    applyModeUI();
    return true;
  } catch (err) {
    console.warn("Caricamento progetto non riuscito", err);
    return false;
  }
}

function openPlayerWindow() {
  publishProject();
  const url = window.location.href.split("?")[0] + "?player=1";
  const w = window.open(url, "gildaPlayerScreen");
  if (!w) alert("Il browser ha bloccato la finestra giocatori. Consenti i popup per questa pagina.");
  else status("Schermo giocatori aperto");
}

function setPlayerZoom(value) {
  project.playerFollowEditor = false;
  project.playerZoom = Number(value);
  const map = activeMap();
  const size = playerViewportSizePx();
  map.viewportX = clamp(map.viewportX || 0, 0, Math.max(0, map.width - size.w));
  map.viewportY = clamp(map.viewportY || 0, 0, Math.max(0, map.height - size.h));
  updateViewportLayer();
  updateMapInfo();
  publishProject();
}

function startViewportDrag(e) {
  if (project.mode !== "editor" || isPlayerWindow) return;
  e.preventDefault();
  e.stopPropagation();

  project.playerFollowEditor = false;
  const map = activeMap();
  viewportDragState = {
    startX:e.clientX,
    startY:e.clientY,
    origX:map.viewportX || 0,
    origY:map.viewportY || 0
  };
  viewportLayer.classList.add("dragging");
}

function moveViewportDrag(e) {
  if (!viewportDragState) return;
  e.preventDefault();

  const map = activeMap();
  const s = zoomScale();
  const size = playerViewportSizePx();
  const dx = (e.clientX - viewportDragState.startX) / s;
  const dy = (e.clientY - viewportDragState.startY) / s;

  map.viewportX = clamp(snapValue(viewportDragState.origX + dx), 0, Math.max(0, map.width - size.w));
  map.viewportY = clamp(snapValue(viewportDragState.origY + dy), 0, Math.max(0, map.height - size.h));
  updateViewportLayer();
  updatePlayerViewLayer();
  publishProject();
}

function endViewportDrag() {
  if (!viewportDragState) return;
  viewportDragState = null;
  viewportLayer.classList.remove("dragging");
}


function setZoomPercent(newPercent, anchorClientX = null, anchorClientY = null) {
  const zoomInput = document.getElementById("zoom");
  const oldScale = zoomScale();

  const min = Number(zoomInput.min);
  const max = Number(zoomInput.max);
  const clamped = Math.max(min, Math.min(max, newPercent));

  let mapX = null;
  let mapY = null;
  let wrapRect = null;

  if (anchorClientX !== null && anchorClientY !== null) {
    wrapRect = canvasWrap.getBoundingClientRect();
    mapX = (canvasWrap.scrollLeft + (anchorClientX - wrapRect.left)) / oldScale;
    mapY = (canvasWrap.scrollTop + (anchorClientY - wrapRect.top)) / oldScale;
  }

  zoomInput.value = clamped;
  applyZoom();

  if (mapX !== null && mapY !== null) {
    const newScale = zoomScale();
    canvasWrap.scrollLeft = mapX * newScale - (anchorClientX - wrapRect.left);
    canvasWrap.scrollTop = mapY * newScale - (anchorClientY - wrapRect.top);
  }
  updatePlayerViewFromEditor(true);
}

function handleWheelZoom(e) {
  // Alt/Option + rotellina = scala oggetto selezionato
  if (e.altKey) {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    scaleSelected(direction * 0.25);
    return;
  }

  // Ctrl/Cmd + rotellina = zoom canvas
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();

  const current = Number(document.getElementById("zoom").value);
  const direction = e.deltaY > 0 ? -1 : 1;
  const step = current < 50 ? 5 : 10;
  setZoomPercent(current + direction * step, e.clientX, e.clientY);
}

function startPan(e) {
  if (!e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  panState = {
    startX: e.clientX,
    startY: e.clientY,
    scrollLeft: canvasWrap.scrollLeft,
    scrollTop: canvasWrap.scrollTop
  };
  canvasWrap.classList.add("panning");
}

function movePan(e) {
  if (!panState) return;
  e.preventDefault();
  canvasWrap.scrollLeft = panState.scrollLeft - (e.clientX - panState.startX);
  canvasWrap.scrollTop = panState.scrollTop - (e.clientY - panState.startY);
}

function endPan() {
  if (!panState) return;
  panState = null;
  canvasWrap.classList.remove("panning");
}


document.addEventListener("keydown", e => {
  if (e.key === "Escape" && smartToolMode) {
    e.preventDefault();
    setSmartWallTool(null);
    status("Smart Wall disattivato");
    return;
  }

  if (e.key === "Escape" && selectedAssetId) {
    e.preventDefault();
    clearAssetBrush();
    status("Pennello annullato");
    return;
  }

  if (e.key === "Escape" && project.mode === "play") {
    e.preventDefault();
    enterEditorMode();
    return;
  }

  const tag = document.activeElement?.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === "a") { e.preventDefault(); selectAllObjects(); }
  if (mod && e.key.toLowerCase() === "c") { e.preventDefault(); copySelected(); }
  if (mod && e.key.toLowerCase() === "v") { e.preventDefault(); pasteClipboard(); }
  if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
  if (e.key.toLowerCase() === "q") { e.preventDefault(); rotateSelected(-15); }
  if (e.key.toLowerCase() === "e") { e.preventDefault(); rotateSelected(15); }
  if (!mod && e.key.toLowerCase() === "g") { e.preventDefault(); groupSelected(); }
  if (!mod && e.key.toLowerCase() === "u") { e.preventDefault(); ungroupSelected(); }
  if (e.key === "+" || e.key === "=") { e.preventDefault(); scaleSelected(0.25); }
  if (e.key === "-" || e.key === "_") { e.preventDefault(); scaleSelected(-0.25); }

  const step = snapStep();
  if (e.key === "ArrowLeft") { e.preventDefault(); nudgeSelected(-step, 0); }
  if (e.key === "ArrowRight") { e.preventDefault(); nudgeSelected(step, 0); }
  if (e.key === "ArrowUp") { e.preventDefault(); nudgeSelected(0, -step); }
  if (e.key === "ArrowDown") { e.preventDefault(); nudgeSelected(0, step); }
});


// ===== 40_brush_assets.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 40_brush_assets.js
// Pennello asset, anteprima con punto di aggancio, piazzamento su griglia e import PNG custom.

function selectAssetBrush(assetId) {
  setSmartWallTool(null);
  selectedAssetId = assetId;
  const asset = assetById(assetId);
  selectedId = null;
  updateBrushStatus();
  buildLibrary();
  renderObjects();
  if (asset) status(`Pennello attivo: ${asset.name} — clicca su uno spazio vuoto per piazzarlo`);
}

function clearAssetBrush() {
  selectedAssetId = null;
  updateBrushStatus();
  buildLibrary();
  canvas.classList.remove("brushMode");
  cancelBrushDraw();
  hideBrushPreview();
}

function updateBrushStatus() {
  const box = document.getElementById("brushStatus");
  const asset = selectedAssetId ? assetById(selectedAssetId) : null;
  canvas.classList.toggle("brushMode", !!asset);

  if (!box) return;
  if (!asset) {
    box.classList.remove("active");
    box.textContent = "Pennello: nessun asset selezionato";
    return;
  }

  box.classList.add("active");
  const modeText = brushDrawMode(asset) === "line"
    ? "Click = segmento. Click tenuto + trascina = disegna muro."
    : brushDrawMode(asset) === "rect"
      ? "Click = 1 quadretto. Click tenuto + trascina = disegna area."
      : "Click su spazio vuoto per piazzare.";
  box.innerHTML = `<b>Pennello attivo:</b><br>${asset.name}<br>${asset.cellsW}×${asset.cellsH} quadretti<br><small>${modeText}<br>Punto rosso = aggancio alto/sinistra. Esc annulla.</small>`;
}

function canvasPointFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const s = zoomScale();
  const x = (e.clientX - rect.left) / s;
  const y = (e.clientY - rect.top) / s;
  return {
    x: Math.max(0, Math.min(activeMap().width, x)),
    y: Math.max(0, Math.min(activeMap().height, y))
  };
}


function placementPointFromCanvasPoint(point) {
  const step = snapStep();
  return {
    x: project.snap ? Math.floor(point.x / step) * step : Math.round(point.x),
    y: project.snap ? Math.floor(point.y / step) * step : Math.round(point.y)
  };
}


function brushDrawMode(asset) {
  if (!asset) return "stamp";
  if (asset.drawMode) return asset.drawMode;
  if (asset.cat === "Muri") return "line";
  if (asset.cat === "Base") return "rect";
  return "stamp";
}

function isDrawableBrush(asset) {
  return ["line", "rect"].includes(brushDrawMode(asset));
}

function drawSnapStep(asset) {
  if (brushDrawMode(asset) === "line") return grid() / 2;
  if (brushDrawMode(asset) === "rect") return grid();
  return snapStep();
}

function snapPointForAsset(point, asset) {
  const step = drawSnapStep(asset);
  return {
    x: project.snap ? Math.floor(point.x / step) * step : Math.round(point.x),
    y: project.snap ? Math.floor(point.y / step) * step : Math.round(point.y)
  };
}

function computeDrawBox(asset, start, current) {
  const mode = brushDrawMode(asset);
  const s = snapPointForAsset(start, asset);
  const c = snapPointForAsset(current, asset);

  if (mode === "line") {
    const thickness = pxFromCells(asset.drawThickness || asset.cellsH || 0.5);
    const baseLength = pxFromCells(asset.cellsW || 1);
    const dx = c.x - s.x;
    const dy = c.y - s.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);

    if (horizontal) {
      const x = dx < 0 ? c.x : s.x;
      const y = s.y;
      const w = Math.max(baseLength, Math.abs(dx) + baseLength);
      return { x, y, w, h:thickness, orientation:"horizontal" };
    } else {
      const x = s.x;
      const y = dy < 0 ? c.y : s.y;
      const h = Math.max(baseLength, Math.abs(dy) + baseLength);
      return { x, y, w:thickness, h, orientation:"vertical" };
    }
  }

  if (mode === "rect") {
    const cell = grid();
    const dx = c.x - s.x;
    const dy = c.y - s.y;
    const x = dx < 0 ? c.x : s.x;
    const y = dy < 0 ? c.y : s.y;
    const w = Math.max(cell, Math.abs(dx) + cell);
    const h = Math.max(cell, Math.abs(dy) + cell);
    return { x, y, w, h, orientation:"rect" };
  }

  const pos = placementPointFromCanvasPoint(start);
  return { x:pos.x, y:pos.y, w:pxFromCells(asset.cellsW), h:pxFromCells(asset.cellsH), orientation:"stamp" };
}

function showBrushPreviewBox(asset, box, drawing=false) {
  if (!brushPreview || !asset) return;
  brushPreviewImg.src = assetSrcForBox(asset, box.w, box.h);
  brushPreview.style.left = box.x + "px";
  brushPreview.style.top = box.y + "px";
  brushPreview.style.width = box.w + "px";
  brushPreview.style.height = box.h + "px";
  brushPreview.classList.toggle("drawing", !!drawing);
  brushPreview.classList.add("visible");
}

function makeObjectFromBox(asset, box, nameSuffix="") {
  const assignedLayer = assetDefaultLayer(asset);
  return {
    id:uid(),
    assetId:asset.id,
    x:Math.round(box.x),
    y:Math.round(box.y),
    w:Math.max(1, Math.round(box.w)),
    h:Math.max(1, Math.round(box.h)),
    cellsW:cellsFromPx(Math.max(1, Math.round(box.w))),
    cellsH:cellsFromPx(Math.max(1, Math.round(box.h))),
    rot:Number(box.rot || 0),
    rotation:Number(box.rot || 0),
    opacity:1,
    layer:assignedLayer,
    visibleMaster:true,
    visiblePlayer:true,
    name:asset.name + nameSuffix,
    z:layerBaseZ(assignedLayer)
  };
}

function addAssetBox(assetId, box) {
  const asset = assetById(assetId);
  if (!asset) return null;

  const mode = brushDrawMode(asset);
  const created = [];
  const map = activeMap();
  const cell = grid();
  const half = grid() / 2;

  if (mode === "rect") {
    // Il pavimento non viene più scalato: viene riempito con piastrelle 1×1.
    const cols = Math.max(1, Math.round(box.w / cell));
    const rows = Math.max(1, Math.round(box.h / cell));

    for (let yy = 0; yy < rows; yy++) {
      for (let xx = 0; xx < cols; xx++) {
        created.push(makeObjectFromBox(asset, {
          x:box.x + xx * cell,
          y:box.y + yy * cell,
          w:cell,
          h:cell
        }));
      }
    }
  } else if (mode === "line") {
    // Il muro non viene più scalato: viene riempito con moduli ripetuti.
    if (box.orientation === "vertical") {
      const rows = Math.max(1, Math.round(box.h / cell));
      for (let yy = 0; yy < rows; yy++) {
        const slotX = box.x;
        const slotY = box.y + yy * cell;
        created.push(makeObjectFromBox(asset, {
          x:slotX + (half - cell) / 2,
          y:slotY + (cell - half) / 2,
          w:cell,
          h:half,
          rot:90
        }));
      }
    } else {
      const cols = Math.max(1, Math.round(box.w / cell));
      for (let xx = 0; xx < cols; xx++) {
        created.push(makeObjectFromBox(asset, {
          x:box.x + xx * cell,
          y:box.y,
          w:cell,
          h:half
        }));
      }
    }
  } else {
    created.push(makeObjectFromBox(asset, box));
  }

  if (!created.length) return null;

  map.objects.push(...created);
  selectedIds = created.map(o => o.id);
  selectedId = selectedIds[selectedIds.length - 1];

  renderObjects();
  renderProperties();
  updatePlayerViewFromEditor(true);
  publishProject();

  status(created.length > 1
    ? `Disegnati ${created.length} moduli: ${asset.name}`
    : `Disegnato: ${asset.name}`);

  return created[created.length - 1];
}



function updateBrushPreview(e) {
  if (!brushPreview || isPlayerWindow || project.mode !== "editor" || !selectedAssetId) {
    hideBrushPreview();
    return;
  }

  const asset = assetById(selectedAssetId);
  if (!asset) {
    hideBrushPreview();
    return;
  }

  const p = canvasPointFromEvent(e);

  if (brushDrawState) {
    const box = computeDrawBox(asset, brushDrawState.start, p);
    showBrushPreviewBox(asset, box, true);
    return;
  }

  let box;
  if (isDrawableBrush(asset)) {
    const start = snapPointForAsset(p, asset);
    box = computeDrawBox(asset, start, start);
  } else {
    const pos = placementPointFromCanvasPoint(p);
    box = { x:pos.x, y:pos.y, w:pxFromCells(asset.cellsW), h:pxFromCells(asset.cellsH) };
  }

  showBrushPreviewBox(asset, box, false);
}

function hideBrushPreview() {
  if (brushPreview) {
    brushPreview.classList.remove("visible");
    brushPreview.classList.remove("drawing");
  }
}



function addAssetAtPoint(assetId, point) {
  const asset = assetById(assetId);
  if (!asset) return;

  const pos = placementPointFromCanvasPoint(point);

  const assignedLayer = assetDefaultLayer(asset);

  const obj = {
    id:uid(),
    assetId:asset.id,
    x:pos.x,
    y:pos.y,
    w:pxFromCells(asset.cellsW),
    h:pxFromCells(asset.cellsH),
    cellsW:asset.cellsW,
    cellsH:asset.cellsH,
    rot:0,
    rotation:0,
    opacity:1,
    layer:assignedLayer,
    visibleMaster:true,
    visiblePlayer:true,
    name:asset.name,
    z:layerBaseZ(assignedLayer)
  };

  activeMap().objects.push(obj);
  setSingleSelection(obj.id);
  renderObjects();
  renderProperties();
  updatePlayerViewFromEditor(true);
  publishProject();
  status(`Piazzato: ${asset.name} — aggancio in alto a sinistra`);
}

function handleCanvasPointerDown(e) {
  if (isPlayerWindow || project.mode !== "editor") return;

  if (e.target.closest && e.target.closest(".mapObject")) return;
  if (e.target.closest && e.target.closest(".groupProxy")) return;
  if (e.target.closest && e.target.closest("#viewportHandle")) return;

  if (smartToolMode) {
    handleSmartWallPointerDown(e);
    return;
  }

  if (selectedAssetId) {
    const asset = assetById(selectedAssetId);
    if (!asset) return;

    e.preventDefault();
    e.stopPropagation();

    const p = canvasPointFromEvent(e);
    const start = snapPointForAsset(p, asset);

    brushDrawState = {
      assetId:selectedAssetId,
      start,
      current:start,
      moved:false,
      pointerId:e.pointerId
    };

    if (canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
    }

    const box = isDrawableBrush(asset)
      ? computeDrawBox(asset, start, start)
      : { x:start.x, y:start.y, w:pxFromCells(asset.cellsW), h:pxFromCells(asset.cellsH) };
    showBrushPreviewBox(asset, box, true);
    return;
  }

  clearSelection();
  renderObjects();
  renderProperties();
}

function handleCanvasPointerMove(e) {
  if (smartDragState) {
    handleSmartWallPointerMove(e);
    return;
  }

  if (brushDrawState) {
    const asset = assetById(brushDrawState.assetId);
    if (!asset) return;

    const p = canvasPointFromEvent(e);
    const current = snapPointForAsset(p, asset);
    brushDrawState.current = current;

    if (Math.abs(current.x - brushDrawState.start.x) >= drawSnapStep(asset) ||
        Math.abs(current.y - brushDrawState.start.y) >= drawSnapStep(asset)) {
      brushDrawState.moved = true;
    }

    const box = isDrawableBrush(asset)
      ? computeDrawBox(asset, brushDrawState.start, current)
      : { x:brushDrawState.start.x, y:brushDrawState.start.y, w:pxFromCells(asset.cellsW), h:pxFromCells(asset.cellsH) };

    showBrushPreviewBox(asset, box, true);
    e.preventDefault();
    return;
  }

  updateBrushPreview(e);
}

function finishBrushDraw(e) {
  if (smartDragState) {
    finishSmartWallDraw(e);
    return;
  }

  if (!brushDrawState) return;

  const state = brushDrawState;
  brushDrawState = null;

  const asset = assetById(state.assetId);
  if (!asset) {
    hideBrushPreview();
    return;
  }

  const current = state.current || state.start;

  if (isDrawableBrush(asset)) {
    const box = computeDrawBox(asset, state.start, current);
    addAssetBox(state.assetId, box);
  } else {
    addAssetAtPoint(state.assetId, state.start);
  }

  hideBrushPreview();

  if (canvas.releasePointerCapture && state.pointerId !== undefined) {
    try { canvas.releasePointerCapture(state.pointerId); } catch(err) {}
  }

  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function cancelBrushDraw() {
  brushDrawState = null;
  hideBrushPreview();
}

function importPngAsset(file) {
  if (!file || file.type !== "image/png") {
    alert("Seleziona un file PNG.");
    return;
  }

  const defaultName = file.name.replace(/\.png$/i, "");
  const name = prompt("Nome asset:", defaultName) || defaultName;
  const w = Number(prompt("Larghezza iniziale in quadretti:", "2"));
  const h = Number(prompt("Altezza iniziale in quadretti:", "2"));

  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    alert("Dimensioni non valide.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    project.customAssets = project.customAssets || [];
  project.ui = project.ui || { leftCollapsed:false, rightCollapsed:false, assetCollapsed:{} };
  project.ui.assetCollapsed = project.ui.assetCollapsed || {};
    project.customAssets.push({
      id:"custom_" + uid(),
      name,
      cat:"Importati",
      src:reader.result,
      cellsW:w,
      cellsH:h,
      defaultLayer:"arredi",
      custom:true
    });
    selectedAssetId = project.customAssets[project.customAssets.length - 1].id;
    buildLibrary();
    updateBrushStatus();
    publishProject();
    status("Asset PNG importato e selezionato come pennello: " + name);
  };
  reader.readAsDataURL(file);
}


// ===== 50_storage_settings.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 50_storage_settings.js
// Salvataggio locale, caricamento, import/export JSON, impostazioni griglia, zoom, sincronizzazione controlli e scorciatoie.

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  status("Salvato nel browser");
}
function loadLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { alert("Nessun salvataggio locale trovato."); return; }
  project = JSON.parse(raw);
  normalizeProject();
  selectedId = null;
  buildLibrary();
  buildLayerControls();
  updateBrushStatus();
  syncTopControls();
  render();
  status("Caricato dal browser");
}
function exportJson() {
  const blob = new Blob([JSON.stringify(project, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = project.name.replaceAll(" ", "_") + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    project = JSON.parse(reader.result);
    normalizeProject();
    selectedId = null;
    buildLibrary();
    updateBrushStatus();
    syncTopControls();
    render();
    status("JSON importato");
  };
  reader.readAsText(file);
}

function setGridSize(value) {
  const map = activeMap();
  const old = grid();
  const neu = Number(value);
  const factor = neu / old;
  project.gridSize = neu;

  map.objects.forEach(o => {
    o.x = Math.round(o.x * factor);
    o.y = Math.round(o.y * factor);
    o.w = Math.round(o.w * factor);
    o.h = Math.round(o.h * factor);
  });

  map.viewportX = Math.round((map.viewportX || 0) * factor);
  map.viewportY = Math.round((map.viewportY || 0) * factor);
  map.width = Math.round((map.squaresW || map.width / old) * neu);
  map.height = Math.round((map.squaresH || map.height / old) * neu);

  render();
}

function zoomScale() { return Number(document.getElementById("zoom").value) / 100; }
function applyZoom() {
  if (project.mode === "play" || isPlayerWindow) {
    updateStageSize();
    updateGridLineWeight();
    updateViewportLayer();
    return;
  }

  const s = zoomScale();
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.transform = `scale(${s})`;
  updateStageSize();
  updateGridLineWeight();
  updateViewportLayer();
  document.getElementById("zoomText").textContent = Math.round(s*100) + "%";
  updatePlayerViewFromEditor(true);
}
function syncTopControls() {
  document.getElementById("mapPreset").value = project.mapPreset || "medium_dungeon";
  document.getElementById("mapSquaresW").value = activeMap().squaresW || Math.round(activeMap().width / grid());
  document.getElementById("mapSquaresH").value = activeMap().squaresH || Math.round(activeMap().height / grid());
  document.getElementById("gridSize").value = String(project.gridSize || 120);
  document.getElementById("btnSnap").classList.toggle("active", project.snap);
  document.getElementById("snapDivisor").value = String(project.snapDivisor || 1);
  const pz = document.getElementById("playerZoom");
  if (pz) pz.value = String(project.playerZoom || 100);
  const pzt = document.getElementById("playerZoomText");
  if (pzt) pzt.textContent = Math.round(project.playerZoom || 100) + "%";
  const followBtn = document.getElementById("btnFollowEditor");
  if (followBtn) { 
    followBtn.classList.toggle("active", project.playerFollowEditor !== false); 
    followBtn.textContent = project.playerFollowEditor !== false ? "Segui editor ON" : "Segui editor OFF"; 
  }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}


// ===== 60_smart_walls.js =====

// MVP 0.9+ Smart Brush Refactor.
// Base ibrida per pennelli smart cell-based: Dungeon Brush e Wall Cell Brush.
// Le celle sono dati leggeri; il rendering e' procedurale e deterministico.

const SMART_WALL_LAYER_ID = "smart_wall_architettura";
const SMART_DUNGEON_LAYER_ID = "smart_dungeon_architettura";

const SMART_BRUSH_DEFS = {
  dungeon:{
    id:SMART_DUNGEON_LAYER_ID,
    name:"Dungeon Brush",
    smartMode:"dungeon_cells",
    layer:"architettura",
    fillClass:"smartDungeonFloor",
    outlineClass:"smartDungeonOutline"
  },
  wall:{
    id:SMART_WALL_LAYER_ID,
    name:"Wall Cell Brush",
    smartMode:"solid_wall",
    layer:"architettura",
    fillClass:"smartWallFill",
    outlineClass:"smartWallOutline"
  }
};

const SMART_BRUSH_PRESETS = {
  inhabited:{ label:"Abitato", edgeRandomness:0.05, decay:0.12, dirt:0.18 },
  abandoned:{ label:"Abbandonato", edgeRandomness:0.16, decay:0.45, dirt:0.52 },
  ruin:{ label:"Rovina", edgeRandomness:0.24, decay:0.72, dirt:0.62 },
  rough:{ label:"Tunnel grezzo", edgeRandomness:0.20, decay:0.35, dirt:0.42 }
};

function ensureSmartLayers(map = activeMap()) {
  if (!map) return [];
  map.smartLayers = Array.isArray(map.smartLayers) ? map.smartLayers : [];
  if (!map.smartSeed) map.smartSeed = `map_${map.id || uid()}`;

  Object.keys(SMART_BRUSH_DEFS).forEach(kind => {
    const def = SMART_BRUSH_DEFS[kind];
    let layer = map.smartLayers.find(l => l.id === def.id);
    if (!layer) {
      layer = {
        id:def.id,
        name:def.name,
        type:"smart_tile",
        smartKind:kind,
        smartMode:def.smartMode,
        preset:"inhabited",
        visualStyle:"stone_battlemap_v1",
        layer:def.layer,
        visibleMaster:true,
        visiblePlayer:true,
        cells:[]
      };
      map.smartLayers.push(layer);
    }

    layer.type = "smart_tile";
    layer.smartKind = kind;
    layer.smartMode = def.smartMode;
    layer.layer = LAYERS.includes(layer.layer) ? layer.layer : def.layer;
    layer.preset = SMART_BRUSH_PRESETS[layer.preset] ? layer.preset : "inhabited";
    layer.visualStyle = layer.visualStyle || "stone_battlemap_v1";
    layer.cells = Array.isArray(layer.cells) ? layer.cells.filter(c => Number.isFinite(Number(c.x)) && Number.isFinite(Number(c.y))) : [];
    layer.paths = Array.isArray(layer.paths) ? layer.paths.filter(isValidSmartPath) : [];
    if (typeof layer.visibleMaster !== "boolean") layer.visibleMaster = true;
    if (typeof layer.visiblePlayer !== "boolean") layer.visiblePlayer = true;
  });

  return map.smartLayers;
}

function smartBrushLayer(kind = smartBrushKind, map = activeMap()) {
  ensureSmartLayers(map);
  const def = SMART_BRUSH_DEFS[kind] || SMART_BRUSH_DEFS.dungeon;
  return map.smartLayers.find(l => l.id === def.id);
}

function smartLayerVisible(layer) {
  if (!layer) return false;
  const state = layerState(layer.layer || "architettura");
  if (isPlayerWindow || project.mode === "play") {
    return layer.visiblePlayer !== false && state.visiblePlayer !== false;
  }
  return layer.visibleMaster !== false && state.visibleMaster !== false;
}

function smartCellKey(x, y) {
  return `${x},${y}`;
}

function smartCellFromEvent(e) {
  const p = canvasPointFromEvent(e);
  return {
    x:clamp(Math.floor(p.x / grid()), 0, Math.max(0, activeMap().squaresW - 1)),
    y:clamp(Math.floor(p.y / grid()), 0, Math.max(0, activeMap().squaresH - 1))
  };
}

function smartPathPointFromEvent(e) {
  const p = canvasPointFromEvent(e);
  const step = project.snap ? grid() / 2 : 1;
  return {
    x:project.snap ? Math.round(p.x / step) * step : Math.round(p.x),
    y:project.snap ? Math.round(p.y / step) * step : Math.round(p.y)
  };
}

function isValidSmartPath(path) {
  return path && Array.isArray(path.points) && path.points.length >= 2 &&
    path.points.every(p => Number.isFinite(Number(p.x)) && Number.isFinite(Number(p.y)));
}

function setSmartCell(kind, cell, filled) {
  const layer = smartBrushLayer(kind);
  const key = smartCellKey(cell.x, cell.y);
  const existing = new Set(layer.cells.map(c => smartCellKey(Number(c.x), Number(c.y))));

  if (filled) existing.add(key);
  else existing.delete(key);

  layer.preset = smartBrushPreset;
  layer.visualStyle = layer.visualStyle || "stone_battlemap_v1";
  layer.cells = [...existing].map(k => {
    const [x, y] = k.split(",").map(Number);
    return { x, y };
  }).sort((a, b) => a.y - b.y || a.x - b.x);
}

function paintSmartWallCellFromEvent(e) {
  const mode = smartToolMode;
  if (!mode) return;
  const cell = smartCellFromEvent(e);
  setSmartCell(smartBrushKind, cell, mode === "draw");
  renderSmartLayers();
  updatePlayerViewFromEditor(true);
  publishProject();
  updateSmartWallStatus();
}

function addSmartWallPath(start, end) {
  const layer = smartBrushLayer("wall");
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const minLength = grid() / 3;
  if (Math.hypot(dx, dy) < minLength) {
    setSmartCell("wall", {
      x:Math.floor(start.x / grid()),
      y:Math.floor(start.y / grid())
    }, true);
    return;
  }

  layer.preset = smartBrushPreset;
  layer.paths = layer.paths || [];
  layer.paths.push({
    id:uid(),
    type:"path",
    smartKind:"wall",
    preset:smartBrushPreset,
    visualStyle:"stone_battlemap_v1",
    width:0.55,
    points:[
      { x:Math.round(start.x), y:Math.round(start.y) },
      { x:Math.round(end.x), y:Math.round(end.y) }
    ]
  });
}

function distanceToSegment(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (!lenSq) return Math.hypot(point.x - a.x, point.y - a.y);
  const t = clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq, 0, 1);
  const x = a.x + t * dx;
  const y = a.y + t * dy;
  return Math.hypot(point.x - x, point.y - y);
}

function eraseSmartWallAtEvent(e) {
  const point = smartPathPointFromEvent(e);
  const cell = smartCellFromEvent(e);
  setSmartCell(smartBrushKind, cell, false);

  if (smartBrushKind === "wall") {
    const layer = smartBrushLayer("wall");
    const threshold = grid() * 0.75;
    layer.paths = (layer.paths || []).filter(path => {
      const pts = path.points || [];
      for (let i = 0; i < pts.length - 1; i++) {
        if (distanceToSegment(point, pts[i], pts[i + 1]) <= threshold) return false;
      }
      return true;
    });
  }

  renderSmartLayers();
  updatePlayerViewFromEditor(true);
  publishProject();
  updateSmartWallStatus();
}

function setSmartBrushKind(kind) {
  smartBrushKind = SMART_BRUSH_DEFS[kind] ? kind : "dungeon";
  const select = document.getElementById("smartBrushKind");
  if (select) select.value = smartBrushKind;
  updateSmartWallStatus();
}

function setSmartBrushPreset(preset) {
  smartBrushPreset = SMART_BRUSH_PRESETS[preset] ? preset : "inhabited";
  const select = document.getElementById("smartBrushPreset");
  if (select) select.value = smartBrushPreset;
  const layer = smartBrushLayer(smartBrushKind);
  if (layer) layer.preset = smartBrushPreset;
  renderSmartLayers();
  publishProject();
  updateSmartWallStatus();
}

function setSmartWallTool(mode) {
  smartToolMode = mode;
  smartDragState = null;
  if (mode) {
    selectedAssetId = null;
    brushDrawState = null;
    hideBrushPreview();
  }
  updateBrushStatus();
  buildLibrary();
  updateSmartWallStatus();
}

function updateSmartWallStatus() {
  const box = document.getElementById("smartWallStatus");
  const draw = document.getElementById("btnSmartWallDraw");
  const erase = document.getElementById("btnSmartWallErase");
  const off = document.getElementById("btnSmartWallOff");
  const kindSelect = document.getElementById("smartBrushKind");
  const presetSelect = document.getElementById("smartBrushPreset");
  const layer = smartBrushLayer(smartBrushKind);
  const count = layer ? layer.cells.length : 0;
  const def = SMART_BRUSH_DEFS[smartBrushKind] || SMART_BRUSH_DEFS.dungeon;
  const preset = SMART_BRUSH_PRESETS[smartBrushPreset] || SMART_BRUSH_PRESETS.inhabited;

  if (kindSelect) kindSelect.value = smartBrushKind;
  if (presetSelect) presetSelect.value = smartBrushPreset;
  if (draw) draw.classList.toggle("active", smartToolMode === "draw");
  if (erase) erase.classList.toggle("active", smartToolMode === "erase");
  if (off) off.classList.toggle("active", !smartToolMode);
  if (box) {
    const label = smartToolMode === "draw" ? "disegno" : smartToolMode === "erase" ? "cancellazione" : "spento";
    box.textContent = `${def.name}: ${label} · ${preset.label} · ${count} celle`;
  }
}

function handleSmartWallPointerDown(e) {
  e.preventDefault();
  e.stopPropagation();
  smartDragState = {
    pointerId:e.pointerId,
    kind:smartBrushKind,
    mode:smartToolMode,
    start:smartPathPointFromEvent(e),
    current:smartPathPointFromEvent(e)
  };
  if (canvas.setPointerCapture) {
    try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
  }

  if (smartBrushKind === "wall" && smartToolMode === "draw") {
    renderSmartLayers();
  } else if (smartToolMode === "erase") {
    eraseSmartWallAtEvent(e);
  } else {
    paintSmartWallCellFromEvent(e);
  }
}

function handleSmartWallPointerMove(e) {
  if (!smartDragState) return;
  e.preventDefault();
  smartDragState.current = smartPathPointFromEvent(e);

  if (smartDragState.kind === "wall" && smartDragState.mode === "draw") {
    renderSmartLayers();
  } else if (smartDragState.mode === "erase") {
    eraseSmartWallAtEvent(e);
  } else {
    paintSmartWallCellFromEvent(e);
  }
}

function finishSmartWallDraw(e) {
  const state = smartDragState;
  const pointerId = smartDragState && smartDragState.pointerId;
  smartDragState = null;

  if (state && state.kind === "wall" && state.mode === "draw") {
    addSmartWallPath(state.start, state.current || state.start);
    renderSmartLayers();
    updatePlayerViewFromEditor(true);
    publishProject();
    updateSmartWallStatus();
  }

  if (canvas.releasePointerCapture && pointerId !== undefined) {
    try { canvas.releasePointerCapture(pointerId); } catch(err) {}
  }
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function smartHash(value) {
  let h = 2166136261;
  const s = String(value);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function smartJitter(map, layer, cell, side, amount) {
  const preset = SMART_BRUSH_PRESETS[layer.preset] || SMART_BRUSH_PRESETS.inhabited;
  const randomness = Number(preset.edgeRandomness || 0) * amount;
  if (!randomness) return 0;
  const seed = `${map.smartSeed}|${layer.id}|${layer.preset}|${cell.x}|${cell.y}|${side}`;
  return (smartHash(seed) - 0.5) * randomness;
}

function smartLayerCells(layer) {
  return (layer.cells || []).map(c => ({ x:Number(c.x), y:Number(c.y) }));
}

function smartOccupiedSet(cells) {
  return new Set(cells.map(c => smartCellKey(c.x, c.y)));
}

function computeDungeonFloorGeometry(map, layer) {
  const g = grid();
  const cells = smartLayerCells(layer);
  const rects = [];
  const details = [];

  cells.forEach(c => {
    const x = c.x * g;
    const y = c.y * g;
    rects.push(`<rect class="smartDungeonFloorTile" x="${x}" y="${y}" width="${g}" height="${g}"></rect>`);

    const detail = smartHash(`${map.smartSeed}|${layer.id}|${layer.preset}|detail|${c.x}|${c.y}`);
    if (layer.smartKind === "dungeon" && detail > 0.68) {
      const cx = x + g * (0.25 + smartHash(`${c.x}:cx:${c.y}`) * 0.5);
      const cy = y + g * (0.25 + smartHash(`${c.x}:cy:${c.y}`) * 0.5);
      details.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${Math.max(2, g * 0.025).toFixed(1)}"></circle>`);
    }
  });

  return {
    rects:rects.join(""),
    details:details.join("")
  };
}

function computeBoundaryEdges(map, layer) {
  const g = grid();
  const cells = smartLayerCells(layer);
  const occupied = smartOccupiedSet(cells);
  const edges = [];

  cells.forEach(c => {
    const x = c.x * g;
    const y = c.y * g;
    const n = smartJitter(map, layer, c, "n", g);
    const e = smartJitter(map, layer, c, "e", g);
    const s = smartJitter(map, layer, c, "s", g);
    const w = smartJitter(map, layer, c, "w", g);
    if (!occupied.has(smartCellKey(c.x, c.y - 1))) edges.push({ side:"n", d:`M ${x} ${(y + n).toFixed(1)} H ${x + g}`, x, y, cell:c });
    if (!occupied.has(smartCellKey(c.x + 1, c.y))) edges.push({ side:"e", d:`M ${(x + g + e).toFixed(1)} ${y} V ${y + g}`, x, y, cell:c });
    if (!occupied.has(smartCellKey(c.x, c.y + 1))) edges.push({ side:"s", d:`M ${x + g} ${(y + g + s).toFixed(1)} H ${x}`, x, y, cell:c });
    if (!occupied.has(smartCellKey(c.x - 1, c.y))) edges.push({ side:"w", d:`M ${(x + w).toFixed(1)} ${y + g} V ${y}`, x, y, cell:c });
  });

  return edges;
}

function rectPolygon(x, y, w, h) {
  return [
    `${x.toFixed(1)},${y.toFixed(1)}`,
    `${(x + w).toFixed(1)},${y.toFixed(1)}`,
    `${(x + w).toFixed(1)},${(y + h).toFixed(1)}`,
    `${x.toFixed(1)},${(y + h).toFixed(1)}`
  ].join(" ");
}

function computeDungeonWallBand(map, layer) {
  const g = grid();
  const edges = computeBoundaryEdges(map, layer);
  const preset = SMART_BRUSH_PRESETS[layer.preset] || SMART_BRUSH_PRESETS.inhabited;
  const half = Math.max(10, g * (layer.preset === "rough" ? 0.34 : 0.30));
  const innerLip = Math.max(4, g * 0.07);
  const overlap = Math.max(3, g * 0.05);
  const polygons = [];
  const rubble = [];

  edges.forEach(edge => {
    const x = edge.x;
    const y = edge.y;
    const decay = Number(preset.decay || 0);
    const wobble = decay * g * 0.05;
    const j = (smartHash(`${map.smartSeed}|${layer.id}|band|${edge.cell.x}|${edge.cell.y}|${edge.side}`) - 0.5) * wobble;
    if (edge.side === "n") polygons.push(`<polygon points="${rectPolygon(x - overlap, y - half + j, g + overlap * 2, half + innerLip)}"></polygon>`);
    if (edge.side === "e") polygons.push(`<polygon points="${rectPolygon(x + g - innerLip, y - overlap, half + innerLip + j, g + overlap * 2)}"></polygon>`);
    if (edge.side === "s") polygons.push(`<polygon points="${rectPolygon(x - overlap, y + g - innerLip, g + overlap * 2, half + innerLip + j)}"></polygon>`);
    if (edge.side === "w") polygons.push(`<polygon points="${rectPolygon(x - half + j, y - overlap, half + innerLip, g + overlap * 2)}"></polygon>`);

    if (smartHash(`${map.smartSeed}|${layer.id}|rubble|${edge.cell.x}|${edge.cell.y}|${edge.side}`) < (0.18 + decay * 0.34)) {
      const rx = x + g * smartHash(`${edge.cell.x}|rx|${edge.side}`);
      const ry = y + g * smartHash(`${edge.cell.y}|ry|${edge.side}`);
      rubble.push(`<circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="${Math.max(2.4, g * 0.035).toFixed(1)}"></circle>`);
    }
  });

  return {
    polygons:polygons.join(""),
    rubble:rubble.join(""),
    outline:edges.map(edge => edge.d).join(" ")
  };
}

function computeWallCellGeometry(map, layer) {
  const g = grid();
  const cells = smartLayerCells(layer);
  const rects = [];
  const edges = computeBoundaryEdges(map, layer);

  cells.forEach(c => {
    const x = c.x * g;
    const y = c.y * g;
    rects.push(`<rect x="${x}" y="${y}" width="${g}" height="${g}"></rect>`);
  });

  return {
    rects:rects.join(""),
    outline:edges.map(edge => edge.d).join(" ")
  };
}

function smartPatternDefs(layer) {
  const safeId = String(layer.id).replace(/[^a-z0-9_-]/gi, "_");
  const floorId = `${safeId}_stone_floor_light`;
  const wallId = `${safeId}_wall_stone_mass`;
  const edgeId = `${safeId}_wall_edge_dark`;
  const rubbleId = `${safeId}_rubble_noise`;
  const shadowId = `${safeId}_shadow_soft`;
  const crackId = `${safeId}_crack_detail`;
  return {
    floorId,
    wallId,
    edgeId,
    rubbleId,
    shadowId,
    crackId,
    defs:`
      <defs>
        <pattern id="${floorId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/stone_floor_light.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${wallId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/wall_stone_mass.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${edgeId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/wall_edge_dark.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${rubbleId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/rubble_noise.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${shadowId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/shadow_soft.png" width="256" height="256"></image>
        </pattern>
        <pattern id="${crackId}" width="256" height="256" patternUnits="userSpaceOnUse">
          <image href="assets/smart/crack_detail.png" width="256" height="256"></image>
        </pattern>
        <filter id="${safeId}_soft_shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="4" dy="6" stdDeviation="3" flood-color="#000" flood-opacity=".35"></feDropShadow>
        </filter>
      </defs>
    `
  };
}

function computeWallPathPolygon(path, width) {
  const pts = path.points || [];
  if (pts.length < 2) return "";
  const a = pts[0];
  const b = pts[pts.length - 1];
  const dx = Number(b.x) - Number(a.x);
  const dy = Number(b.y) - Number(a.y);
  const len = Math.hypot(dx, dy);
  if (!len) return "";

  const nx = -dy / len;
  const ny = dx / len;
  const half = width / 2;
  return [
    `${(Number(a.x) + nx * half).toFixed(1)},${(Number(a.y) + ny * half).toFixed(1)}`,
    `${(Number(b.x) + nx * half).toFixed(1)},${(Number(b.y) + ny * half).toFixed(1)}`,
    `${(Number(b.x) - nx * half).toFixed(1)},${(Number(b.y) - ny * half).toFixed(1)}`,
    `${(Number(a.x) - nx * half).toFixed(1)},${(Number(a.y) - ny * half).toFixed(1)}`
  ].join(" ");
}

function renderSmartTextureLayer(cls, markup, fillId, extra = "") {
  if (!markup) return "";
  return `<g class="${cls}" fill="url(#${fillId})" ${extra}>${markup}</g>`;
}

function smartPathMarkup(map, layer, patterns) {
  const g = grid();
  const paths = [...(layer.paths || [])];

  if (smartDragState && smartDragState.kind === "wall" && smartDragState.mode === "draw" && layer.smartKind === "wall") {
    paths.push({
      id:"preview",
      preset:smartBrushPreset,
      width:0.55,
      points:[smartDragState.start, smartDragState.current || smartDragState.start],
      preview:true
    });
  }

  return paths.map(path => {
    const pts = path.points || [];
    if (pts.length < 2) return "";
    const width = Math.max(8, Number(path.width || 0.55) * g);
    const points = computeWallPathPolygon(path, width);
    if (!points) return "";
    const cls = path.preview ? "smartWallPath preview" : "smartWallPath";
    const seed = `${map.smartSeed}|${layer.id}|${path.id}|path`;
    const detailOpacity = 0.34 + smartHash(seed) * 0.24;
    return `
      <polygon class="smartWallPathShadow" points="${points}"></polygon>
      <polygon class="${cls}" points="${points}" fill="url(#${patterns.wallId})"></polygon>
      <polygon class="smartWallPathRubble" points="${points}" fill="url(#${patterns.rubbleId})" style="opacity:${detailOpacity.toFixed(2)}"></polygon>
      <polygon class="smartWallPathCracks" points="${points}" fill="url(#${patterns.crackId})"></polygon>
      <polygon class="smartWallPathInnerLine" points="${points}"></polygon>
    `;
  }).join("");
}

function renderSmartLayers() {
  if (!smartLayer) return;
  const map = activeMap();
  ensureSmartLayers(map);
  smartLayer.innerHTML = "";
  smartLayer.style.width = map.width + "px";
  smartLayer.style.height = map.height + "px";

  (map.smartLayers || []).forEach(layer => {
    const hasCells = !!(layer.cells && layer.cells.length);
    const hasPaths = !!(layer.paths && layer.paths.length);
    const hasPreview = !!(smartDragState && smartDragState.kind === "wall" && smartDragState.mode === "draw" && layer.smartKind === "wall");
    if (!smartLayerVisible(layer) || (!hasCells && !hasPaths && !hasPreview)) return;
    const def = SMART_BRUSH_DEFS[layer.smartKind] || SMART_BRUSH_DEFS.wall;
    const patterns = smartPatternDefs(layer);
    const floorGeo = layer.smartKind === "dungeon" ? computeDungeonFloorGeometry(map, layer) : { rects:"", details:"" };
    const wallBand = layer.smartKind === "dungeon" ? computeDungeonWallBand(map, layer) : { polygons:"", rubble:"", outline:"" };
    const wallGeo = layer.smartKind === "wall" ? computeWallCellGeometry(map, layer) : { rects:"", outline:"" };
    const pathMarkup = smartPathMarkup(map, layer, patterns);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `smartBrushSvg ${layer.smartKind === "dungeon" ? "smartDungeonSvg" : "smartWallSvg"}`);
    svg.setAttribute("viewBox", `0 0 ${map.width} ${map.height}`);
    svg.setAttribute("width", String(map.width));
    svg.setAttribute("height", String(map.height));
    svg.style.zIndex = String(20000 + layerBaseZ(layer.layer || "architettura") - 20);
    svg.innerHTML = `
      ${patterns.defs}
      ${layer.smartKind === "dungeon" ? `
        ${renderSmartTextureLayer(def.fillClass, floorGeo.rects, patterns.floorId)}
        <g class="smartBrushCracks" fill="url(#${patterns.crackId})">${floorGeo.rects}</g>
        <g class="smartBrushDetails">${floorGeo.details}</g>
        <g class="smartDungeonWallShadow">${wallBand.polygons}</g>
        ${renderSmartTextureLayer("smartDungeonWallBand", wallBand.polygons, patterns.wallId, `filter="url(#${String(layer.id).replace(/[^a-z0-9_-]/gi, "_")}_soft_shadow)"`)}
        <g class="smartDungeonWallRubble" fill="url(#${patterns.rubbleId})">${wallBand.polygons}</g>
        <g class="smartDungeonWallCracks" fill="url(#${patterns.crackId})">${wallBand.polygons}</g>
        <g class="smartDungeonRubbleBits">${wallBand.rubble}</g>
        <path class="${def.outlineClass}" d="${wallBand.outline}"></path>
      ` : `
        ${renderSmartTextureLayer(def.fillClass, wallGeo.rects, patterns.wallId)}
        <g class="smartWallCellRubble" fill="url(#${patterns.rubbleId})">${wallGeo.rects}</g>
        <g class="smartBrushCracks" fill="url(#${patterns.crackId})">${wallGeo.rects}</g>
        <path class="${def.outlineClass}" d="${wallGeo.outline}"></path>
      `}
      <g class="smartPathGroup">${pathMarkup}</g>
    `;
    smartLayer.appendChild(svg);
  });

  updateSmartWallStatus();
}


// ===== 90_main_init.js =====

// Gilda Map Builder MVP 0.4
// Blocco: 90_main_init.js
// Collegamento eventi DOM, sincronizzazione finestra giocatori e avvio applicazione.

document.getElementById("btnNewMap").onclick = () => {
  const name = prompt("Nome nuova mappa:", "Nuova mappa");
  if (!name) return;
  const preset = MAP_PRESETS[project.mapPreset || "medium_dungeon"];
  const m = {
    id:uid(),
    name,
    squaresW:preset.squaresW,
    squaresH:preset.squaresH,
    width:Math.round(preset.squaresW * grid()),
    height:Math.round(preset.squaresH * grid()),
    viewportX:0,
    viewportY:0,
    views:[],
    groups:{},
    smartLayers:[],
    objects:[]
  };
  project.maps.push(m);
  project.activeMapId = m.id;
  selectedId = null;
  render();
};
document.getElementById("btnSaveLocal").onclick = saveLocal;
document.getElementById("btnLoadLocal").onclick = loadLocal;
document.getElementById("btnExportJson").onclick = exportJson;
document.getElementById("inputImportJson").onchange = e => { const file = e.target.files[0]; if (file) importJson(file); };
document.getElementById("inputAssetPng").onchange = e => { const file = e.target.files[0]; if (file) importPngAsset(file); e.target.value = ""; };
document.getElementById("btnGrid").onclick = () => { project.showGrid = !project.showGrid; render(); };
document.getElementById("btnSnap").onclick = () => { project.snap = !project.snap; render(); };
document.getElementById("snapDivisor").onchange = e => { project.snapDivisor = Number(e.target.value); render(); };
document.getElementById("mapPreset").onchange = e => setMapPreset(e.target.value);
document.getElementById("gridSize").onchange = e => setGridSize(e.target.value);
document.getElementById("btnApplyMapSize").onclick = () => {
  project.mapPreset = "custom";
  applyMapSizeFromSquares(Number(document.getElementById("mapSquaresW").value), Number(document.getElementById("mapSquaresH").value));
};
document.getElementById("btnViewport").onclick = () => {
  project.showViewport = !project.showViewport;
  document.getElementById("btnViewport").classList.toggle("active", project.showViewport);
  document.getElementById("btnViewport").textContent = project.showViewport ? "Area TV ON" : "Area TV OFF";
  updateViewportLayer();
};
document.getElementById("btnFollowEditor").onclick = () => { project.playerFollowEditor = project.playerFollowEditor === false; syncTopControls(); updatePlayerViewFromEditor(true); updatePlayerViewLayer(); publishProject(); };
document.getElementById("btnSetViewportFromView").onclick = setViewportFromCurrentView;
document.getElementById("btnGoViewport").onclick = goToViewport;
document.getElementById("btnFitMap").onclick = fitWholeMap;
document.getElementById("btnSaveView").onclick = saveCurrentView;
document.getElementById("btnToggleLeft").onclick = toggleLeftColumn;
document.getElementById("btnToggleRight").onclick = toggleRightColumn;
document.getElementById("btnEditor").onclick = enterEditorMode;
document.getElementById("btnPlay").onclick = enterPlayMode;
document.getElementById("btnOpenPlayer").onclick = openPlayerWindow;
document.getElementById("btnOpenPlayerSide").onclick = openPlayerWindow;
document.getElementById("btnExitPlay").onclick = enterEditorMode;
document.getElementById("btnSmartWallDraw").onclick = () => setSmartWallTool("draw");
document.getElementById("btnSmartWallErase").onclick = () => setSmartWallTool("erase");
document.getElementById("btnSmartWallOff").onclick = () => setSmartWallTool(null);
document.getElementById("smartBrushKind").onchange = e => setSmartBrushKind(e.target.value);
document.getElementById("smartBrushPreset").onchange = e => setSmartBrushPreset(e.target.value);
document.getElementById("zoom").oninput = applyZoom;
document.getElementById("playerZoom").oninput = e => setPlayerZoom(e.target.value);


canvasWrap.addEventListener("wheel", handleWheelZoom, { passive:false });
canvasWrap.addEventListener("mousedown", startPan);
canvasWrap.addEventListener("scroll", () => { updatePlayerViewFromEditor(true); hideBrushPreview(); });
document.addEventListener("mousemove", movePan);
document.addEventListener("mousemove", moveViewportDrag);
document.addEventListener("mouseup", endPan);
document.addEventListener("mouseup", endViewportDrag);
document.addEventListener("mouseleave", endPan);
document.addEventListener("mouseleave", endViewportDrag);
viewportHandle.addEventListener("mousedown", startViewportDrag);




window.addEventListener("resize", () => { applyZoom(); updatePlayerViewFromEditor(true); });


if (syncChannel) {
  syncChannel.onmessage = ev => {
    if (!isPlayerWindow) return;
    if (ev.data?.type === "project") loadProjectRaw(ev.data.raw);
  };
}

window.addEventListener("storage", ev => {
  if (!isPlayerWindow) return;
  if (ev.key === STORAGE_KEY && ev.newValue) loadProjectRaw(ev.newValue);
});

if (isPlayerWindow) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { project = JSON.parse(raw); } catch (e) {}
  }
  project.mode = "play";
  setInterval(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && raw !== lastSyncedRaw) {
      lastSyncedRaw = raw;
      loadProjectRaw(raw);
    }
  }, 600);
}


buildLibrary();
buildLayerControls();
syncTopControls();
applyZoom();
render();
applyModeUI();
applyColumnUI();
updatePlayerViewFromEditor(true);


// ===== 04b brush/drop safety bindings =====
function handleCanvasDragOver(e) {
  e.preventDefault();
}

function handleCanvasDrop(e) {
  if (isPlayerWindow || project.mode !== "editor") return;
  e.preventDefault();
  const assetId = e.dataTransfer.getData("text/plain");
  if (!assetId) return;
  const p = canvasPointFromEvent(e);
  addAssetAtPoint(assetId, p);
}

canvas.addEventListener("pointerdown", handleCanvasPointerDown);
canvas.addEventListener("pointermove", handleCanvasPointerMove);
canvas.addEventListener("pointerleave", e => { if (!brushDrawState) hideBrushPreview(); });
canvas.addEventListener("pointerup", finishBrushDraw);
document.addEventListener("pointerup", finishBrushDraw);
canvas.addEventListener("dragover", handleCanvasDragOver);
canvas.addEventListener("drop", handleCanvasDrop);
