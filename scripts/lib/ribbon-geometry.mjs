import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

// Four loops follow the supplied wide design: down, up, down, down.
// Depth at the crossings keeps the front and back of the ribbon distinct.
const pathPoints = [
  [-0.18, 0.19, 0],
  [0.08, 0.14, 0],
  [0.35, 0.115, 0],
  [0.58, 0.16, 0.015],
  [0.64, 0.32, 0.035],
  [0.54, 0.46, 0.035],
  [0.35, 0.475, 0.015],
  [0.2, 0.38, -0.015],
  [0.2, 0.23, -0.035],
  [0.36, 0.115, -0.025],
  [0.63, 0.105, 0],
  [0.94, 0.15, 0],
  [1.25, 0.215, 0],
  [1.5, 0.22, 0],
  [1.66, 0.09, 0.025],
  [1.61, -0.12, 0.04],
  [1.43, -0.16, 0.02],
  [1.33, -0.025, -0.02],
  [1.4, 0.17, -0.035],
  [1.61, 0.29, -0.015],
  [1.9, 0.3, 0],
  [2.18, 0.275, 0],
  [2.42, 0.32, 0],
  [2.63, 0.46, 0.025],
  [2.66, 0.65, 0.04],
  [2.51, 0.74, 0.02],
  [2.36, 0.64, -0.02],
  [2.38, 0.47, -0.04],
  [2.57, 0.32, -0.02],
  [2.87, 0.21, 0],
  [3.17, 0.115, 0],
  [3.43, 0.12, 0],
  [3.62, 0.205, 0.02],
  [3.66, 0.355, 0.04],
  [3.55, 0.46, 0.025],
  [3.35, 0.47, 0],
  [3.2, 0.36, -0.025],
  [3.23, 0.2, -0.04],
  [3.43, 0.11, -0.02],
  [3.7, 0.115, 0],
  [4.18, 0.19, 0],
];

export function createRibbonGeometry() {
  const path = new THREE.CatmullRomCurve3(
    pathPoints.map(([x, y, z]) => new THREE.Vector3(x, -y, z)),
    false,
    "centripetal",
  );
  // A curved cross-section catches broad reflections instead of a flat face.
  const profile = new THREE.Shape();
  profile.absellipse(0, 0, 0.028, 0.054, 0, Math.PI * 2, false, 0);
  const original = new THREE.ExtrudeGeometry(profile, {
    steps: 1000,
    curveSegments: 16,
    bevelEnabled: false,
    extrudePath: path,
  });
  original.deleteAttribute("normal");
  original.deleteAttribute("uv");
  const geometry = mergeVertices(original, 1e-5);
  original.dispose();
  geometry.computeVertexNormals();
  return geometry;
}
