/** Shared lighting and framing for the desktop model and mobile renders. */
export const ribbonConfig = {
  model: "/models/services-ribbon.glb",
  panelWidth: 1,
  centerY: -9 / 32,
  material: {
    color: 0xed581c,
    metalness: 0.78,
    roughness: 0.2,
    clearcoat: 0.3,
    clearcoatRoughness: 0.12,
  },
  exposure: 1.08,
  roomShade: 0.35,
} as const;
