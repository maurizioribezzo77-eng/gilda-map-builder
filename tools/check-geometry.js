const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const geometrySource = fs.readFileSync(path.join(root, "js", "05_geometry.js"), "utf8");
const sandbox = {};

vm.createContext(sandbox);
vm.runInContext(geometrySource, sandbox);

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

const rect = sandbox.createRectGeometry(10, 20, 256, 512);
assert.deepStrictEqual(plain(rect), { kind: "rect", x: 10, y: 20, width: 256, height: 512 });
assert.deepStrictEqual(plain(sandbox.getGeometryBounds(rect)), { x: 10, y: 20, width: 256, height: 512 });
assert.deepStrictEqual(plain(sandbox.getGeometryCenter(rect)), { x: 138, y: 276 });
assert.strictEqual(sandbox.pointInGeometry({ x: 20, y: 30 }, rect), true);
assert.strictEqual(sandbox.pointInGeometry({ x: 300, y: 30 }, rect), false);

const circle = sandbox.createCircleGeometry(100, 120, 40);
assert.deepStrictEqual(plain(circle), { kind: "circle", cx: 100, cy: 120, radius: 40 });
assert.deepStrictEqual(plain(sandbox.getGeometryBounds(circle)), { x: 60, y: 80, width: 80, height: 80 });
assert.strictEqual(sandbox.pointInGeometry({ x: 130, y: 120 }, circle), true);
assert.strictEqual(sandbox.pointInGeometry({ x: 141, y: 120 }, circle), false);

const pentagon = sandbox.createPentagonGeometry(0, 0, 10);
assert.strictEqual(pentagon.kind, "polygon");
assert.strictEqual(pentagon.points.length, 5);

const hexagon = sandbox.createHexagonGeometry(0, 0, 10);
assert.strictEqual(hexagon.kind, "polygon");
assert.strictEqual(hexagon.points.length, 6);

const polygon = {
  kind: "polygon",
  points: [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 }
  ]
};
assert.deepStrictEqual(plain(sandbox.getGeometryBounds(polygon)), { x: 0, y: 0, width: 10, height: 10 });
assert.strictEqual(sandbox.pointInGeometry({ x: 5, y: 5 }, polygon), true);
assert.strictEqual(sandbox.pointInGeometry({ x: 15, y: 5 }, polygon), false);

const snapped = sandbox.snapGeometryToGrid(sandbox.createCircleGeometry(130, 130, 50), 256);
assert.deepStrictEqual(plain(snapped), { kind: "circle", cx: 256, cy: 256, radius: 50 });

const moved = sandbox.moveGeometry(rect, 5, -10);
assert.deepStrictEqual(plain(moved), { kind: "rect", x: 15, y: 10, width: 256, height: 512 });

const rotated = sandbox.rotateGeometry(sandbox.createRectGeometry(0, 0, 10, 20), 90, { x: 0, y: 0 });
assert.strictEqual(rotated.kind, "polygon");
assert.strictEqual(rotated.points.length, 4);
assert(Math.abs(rotated.points[1].x - 0) < 1e-9);
assert(Math.abs(rotated.points[1].y - 10) < 1e-9);

assert.strictEqual(
  sandbox.geometryIntersectsGeometry(
    sandbox.createRectGeometry(0, 0, 10, 10),
    sandbox.createRectGeometry(5, 5, 10, 10)
  ),
  true
);
assert.strictEqual(
  sandbox.geometryIntersectsGeometry(
    sandbox.createRectGeometry(0, 0, 10, 10),
    sandbox.createRectGeometry(20, 20, 10, 10)
  ),
  false
);

console.log("Geometry checks OK.");
