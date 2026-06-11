export type Id = string;

export interface Project {
  id: Id;
  name: string;
  maps: DungeonMap[];
  activeMapId: Id;
}

export interface DungeonMap {
  id: Id;
  name: string;
  width: number;
  height: number;
  gridSize: number;
  elements: Element[];
  layers: Layer[];
  treeNodes: TreeNode[];
}

export type ElementType =
  | "sketchStroke"
  | "room"
  | "corridor"
  | "door"
  | "stair"
  | "pin"
  | "token"
  | "tile";

export type Geometry =
  | RectGeometry
  | CircleGeometry
  | PolygonGeometry
  | PolylineGeometry
  | PointGeometry;

export interface RectGeometry {
  kind: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleGeometry {
  kind: "circle";
  cx: number;
  cy: number;
  radius: number;
}

export interface PolygonGeometry {
  kind: "polygon";
  points: Point[];
}

export interface PolylineGeometry {
  kind: "polyline";
  points: Point[];
  width?: number;
  closed?: boolean;
}

export interface PointGeometry {
  kind: "point";
  x: number;
  y: number;
}

export interface Point {
  x: number;
  y: number;
}

export function createRectGeometry(
  x: number,
  y: number,
  width: number,
  height: number
): RectGeometry {
  return { kind: "rect", x, y, width, height };
}

export function createCircleGeometry(
  cx: number,
  cy: number,
  radius: number
): CircleGeometry {
  return { kind: "circle", cx, cy, radius };
}

export function createPolygonGeometry(points: Point[]): PolygonGeometry {
  return { kind: "polygon", points };
}

export function createPolylineGeometry(
  points: Point[],
  width?: number,
  closed?: boolean
): PolylineGeometry {
  return {
    kind: "polyline",
    points,
    ...(width === undefined ? {} : { width }),
    ...(closed === undefined ? {} : { closed })
  };
}

export function createPointGeometry(x: number, y: number): PointGeometry {
  return { kind: "point", x, y };
}

export type ElementStyle = Record<string, string | number | boolean | null>;

interface BaseElement {
  id: Id;
  type: ElementType;
  name: string;
  geometry: Geometry;
  rotation: number;
  visibleToPlayers: boolean;
  notesMaster: string;
  notesPlayer: string;
  linkedMapId: Id | null;
  style: ElementStyle;
  layerId: Id;
}

export interface RoomElement extends BaseElement {
  type: "room";
  geometry: RectGeometry | CircleGeometry | PolygonGeometry;
}

export interface SketchStrokeElement extends BaseElement {
  type: "sketchStroke";
  geometry: PolylineGeometry;
}

export interface CorridorElement extends BaseElement {
  type: "corridor";
  geometry: RectGeometry | PolygonGeometry | PolylineGeometry;
}

export interface DoorElement extends BaseElement {
  type: "door";
  geometry: RectGeometry | PolylineGeometry | PointGeometry;
}

export interface StairElement extends BaseElement {
  type: "stair";
  geometry: RectGeometry | PolygonGeometry | PointGeometry;
}

export interface PinElement extends BaseElement {
  type: "pin";
  geometry: PointGeometry;
}

export interface TokenElement extends BaseElement {
  type: "token";
  geometry: PointGeometry | CircleGeometry;
}

export interface TileElement extends BaseElement {
  type: "tile";
  geometry: RectGeometry | PolygonGeometry;
}

export type Element =
  | SketchStrokeElement
  | RoomElement
  | CorridorElement
  | DoorElement
  | StairElement
  | PinElement
  | TokenElement
  | TileElement;

export type LayerType =
  | "background"
  | "sketch"
  | "architecture"
  | "objects"
  | "tokens"
  | "notes";

export interface Layer {
  id: Id;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
}

export type TreeNodeType = "folder" | "map" | "element";

export interface TreeNode {
  id: Id;
  name: string;
  type: TreeNodeType;
  parentId: Id | null;
  elementId: Id | null;
  mapId: Id | null;
}

export function createDefaultProject(): Project {
  const architectureLayer: Layer = {
    id: "layer-architecture",
    name: "Architettura",
    type: "architecture",
    visible: true,
    locked: false
  };
  const sketchLayer: Layer = {
    id: "layer-sketch",
    name: "Sketch Layer",
    type: "sketch",
    visible: true,
    locked: false
  };
  const notesLayer: Layer = {
    id: "layer-notes",
    name: "Note e pin",
    type: "notes",
    visible: true,
    locked: false
  };
  const tokensLayer: Layer = {
    id: "layer-tokens",
    name: "Token",
    type: "tokens",
    visible: true,
    locked: false
  };

  const elements: Element[] = [
    {
      id: "room-rect-entrance",
      type: "room",
      name: "Sala rettangolare",
      geometry: createRectGeometry(200, 200, 500, 320),
      rotation: 0,
      visibleToPlayers: true,
      notesMaster: "Ingresso principale del dungeon.",
      notesPlayer: "",
      linkedMapId: null,
      style: { fill: "#d8d0bd", stroke: "#3f3a31", strokeWidth: 4 },
      layerId: architectureLayer.id
    },
    {
      id: "room-circle-shrine",
      type: "room",
      name: "Sala circolare",
      geometry: createCircleGeometry(1050, 360, 180),
      rotation: 0,
      visibleToPlayers: true,
      notesMaster: "Santuario con soffitto a cupola.",
      notesPlayer: "",
      linkedMapId: null,
      style: { fill: "#c9d5cf", stroke: "#35433d", strokeWidth: 4 },
      layerId: architectureLayer.id
    },
    {
      id: "room-hex-library",
      type: "room",
      name: "Sala esagonale",
      geometry: createPolygonGeometry([
          { x: 1560, y: 220 },
          { x: 1780, y: 220 },
          { x: 1900, y: 410 },
          { x: 1780, y: 600 },
          { x: 1560, y: 600 },
          { x: 1440, y: 410 }
        ]),
      rotation: 0,
      visibleToPlayers: true,
      notesMaster: "Biblioteca esagonale.",
      notesPlayer: "",
      linkedMapId: null,
      style: { fill: "#d6c7db", stroke: "#44364a", strokeWidth: 4 },
      layerId: architectureLayer.id
    },
    {
      id: "pin-secret-door",
      type: "pin",
      name: "Porta segreta",
      geometry: createPointGeometry(710, 320),
      rotation: 0,
      visibleToPlayers: false,
      notesMaster: "CD 15 per notare il meccanismo.",
      notesPlayer: "",
      linkedMapId: null,
      style: { color: "#b33939", icon: "pin" },
      layerId: notesLayer.id
    },
    {
      id: "token-scout",
      type: "token",
      name: "Esploratore",
      geometry: createPointGeometry(1060, 360),
      rotation: 0,
      visibleToPlayers: true,
      notesMaster: "Creatura di guardia.",
      notesPlayer: "",
      linkedMapId: null,
      style: { color: "#4f7f52", size: 1 },
      layerId: tokensLayer.id
    }
  ];

  const map: DungeonMap = {
    id: "map-demo-dungeon",
    name: "Dungeon demo",
    width: 2400,
    height: 1600,
    gridSize: 100,
    elements,
    layers: [architectureLayer, sketchLayer, notesLayer, tokensLayer],
    treeNodes: [
      {
        id: "tree-map-demo-dungeon",
        name: "Dungeon demo",
        type: "map",
        parentId: null,
        elementId: null,
        mapId: "map-demo-dungeon"
      },
      ...elements.map((element): TreeNode => ({
        id: `tree-${element.id}`,
        name: element.name,
        type: "element",
        parentId: "tree-map-demo-dungeon",
        elementId: element.id,
        mapId: "map-demo-dungeon"
      }))
    ]
  };

  return {
    id: "project-default",
    name: "Sketch to Dungeon - Progetto demo",
    maps: [map],
    activeMapId: map.id
  };
}

export const demoProject = createDefaultProject();
