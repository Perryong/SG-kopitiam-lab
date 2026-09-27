const meta = { name: 'Ayam goreng berempah' };
// Web-scene units, plate surface at Y=0. Part names start with the preparation step index.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]];
const ICO_F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const rng = s => () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
const nz = (x, y, z) => Math.sin(x * 1.9 + Math.sin(z * 1.3) * 1.7) * Math.sin(y * 2.3 + x * 0.7) * Math.sin(z * 2.1 + y * 1.1);
const fbm = (x, y, z) => nz(x, y, z) * 0.6 + nz(x * 2.3 + 5, y * 2.3, z * 2.3) * 0.3 + nz(x * 5.1, y * 5.1 + 3, z * 5.1) * 0.15;
function crumbs(items) {
  // items: [x,y,z,sx,sy,sz,seed]; jittered icosahedra merged into one mesh
  const positions = [], indices = [];
  for (const [x, y, z, sx, sy, sz, seed] of items) {
    const r = rng(seed), base = positions.length / 3, rot = r() * 6.28, c = Math.cos(rot), s = Math.sin(rot);
    for (const [a, b, d] of ICO_V) {
      const k = (0.65 + r() * 0.6) / 1.9, px = a * k * sx, pz = d * k * sz;
      positions.push(x + px * c - pz * s, y + b * k * sy, z + px * s + pz * c);
    }
    for (const f of ICO_F) indices.push(base + f[0], base + f[1], base + f[2]);
  }
  return meshGeo({ positions, indices });
}
function fixNormals(g) { g.computeVertexNormals(); const n = g.attributes.normal, p = g.attributes.position; for (let i = 0; i < n.count; i++) if (Math.hypot(n.getX(i), n.getY(i), n.getZ(i)) < 1e-4) { const l = Math.hypot(p.getX(i), p.getY(i), p.getZ(i)) || 1; n.setXYZ(i, p.getX(i) / l, p.getY(i) / l, p.getZ(i) / l); } return g; }
function blob(sx, sy, sz, amp, freq, seg = 48) {
  const g = copyGeometry(sphereGeo(1, seg, Math.round(seg * 0.7))), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + amp * fbm(x * freq, y * freq, z * freq); p.setXYZ(i, x * sx * k, y * sy * k, z * sz * k); }
  return fixNormals(g);
}
function build() {
  const root = createRoot('FriedChicken');
  const M = (c, r = 0.5, o = {}) => gameMaterial(c, { flatShading: false, roughness: r, ...o });
  const crust = M(0x8b3f1a, 0.4);
  // Thigh: craggy, flattened mass resting on the plate
  const T = [0.95, 0.2, -0.1];
  const thighGeo = blob(0.52, 0.27, 0.44, 0.14, 3.2);
  createPart('s0 Thigh crust', thighGeo, crust, { position: [T[0], T[1], T[2]], rotation: [0, 25, 4], parent: root });
  // Drumstick: tapering tube along a gentle curve, meaty end tucked into the thigh
  const A = [0.88, 0.2, -0.38], B = [0.72, 0.19, -0.86], D = [0.56, 0.1, -1.24];
  const bez = (u, i) => (1 - u) ** 2 * A[i] + 2 * (1 - u) * u * B[i] + u * u * D[i];
  const dbez = (u, i) => 2 * (1 - u) * (B[i] - A[i]) + 2 * u * (D[i] - B[i]);
  const drum = parametricSurface((u, v) => {
    const c = [bez(u, 0), bez(u, 1), bez(u, 2)], t = [dbez(u, 0), dbez(u, 1), dbez(u, 2)], tl = Math.hypot(...t);
    const T3 = t.map(q => q / tl), side = [T3[2], 0, -T3[0]], sl = Math.hypot(...side), S = side.map(q => q / sl);
    const U = [S[1] * T3[2] - S[2] * T3[1], S[2] * T3[0] - S[0] * T3[2], S[0] * T3[1] - S[1] * T3[0]];
    const r = (0.07 + 0.2 * (1 - u) ** 1.15) * (1 + 0.11 * fbm(u * 9, Math.cos(v) * 2, Math.sin(v) * 2));
    const cv = Math.cos(v), sv = Math.sin(v);
    return [0, 1, 2].map(i => c[i] + S[i] * cv * r + U[i] * sv * r * 0.85);
  }, { u: [0, 1], v: [0, Math.PI * 2], uSegments: 48, vSegments: 28, periodicV: true });
  createPart('s0 Drumstick crust', drum, crust, { parent: root });
  // Exposed knuckle of bone at the ankle
  const bone = M(0xe0cfaa, 0.55);
  createPart('s0 Bone shaft', pipeAlongPath([[0.58, 0.11, -1.2], [0.53, 0.11, -1.33]], 0.045, { tubularSegments: 6, radialSegments: 14 }), bone, { parent: root });
  createPart('s0 Bone knuckle', blob(0.075, 0.06, 0.08, 0.12, 4, 24), bone, { position: [0.52, 0.11, -1.37], parent: root });
  // Berempah crumbs: fried spice floss heaped on top and spilled on the plate
  const r = rng(5), dark = [], mid = [], gold = [];
  for (let i = 0; i < 330; i++) {
    let x, y, z, s = 0.02 + r() * 0.045;
    if (i < 200) { const a = r() * 6.28, d = Math.sqrt(r()) * 0.9; x = T[0] + Math.cos(a) * d * 0.5; z = T[2] + Math.sin(a) * d * 0.42; y = T[1] + 0.27 * Math.sqrt(Math.max(0, 1 - d * d)) + 0.02 + r() * 0.05; }
    else if (i < 270) { const u = r() * 0.85; x = bez(u, 0) + (r() - 0.5) * 0.12; z = bez(u, 2) + (r() - 0.5) * 0.12; y = bez(u, 1) + (0.07 + 0.2 * (1 - u) ** 1.15) * 0.8 + r() * 0.03; }
    else { const a = r() * 6.28, d = 0.45 + r() * 0.4; x = T[0] + Math.cos(a) * d; z = T[2] + Math.sin(a) * d * 0.9 - 0.2; y = s * 0.2; s *= 0.5; }
    const item = [x, y, z, s * (1 + r()), s * 0.55, s * (0.8 + r() * 0.6), 100 + i];
    (i % 3 === 0 ? dark : i % 3 === 1 ? mid : gold).push(item);
  }
  createPart('s0 Crumbs dark', crumbs(dark), M(0x4f2410, 0.7), { parent: root });
  createPart('s0 Crumbs spiced', crumbs(mid), M(0x8a4a1c, 0.65), { parent: root });
  createPart('s0 Crumbs golden', crumbs(gold), M(0xb9772e, 0.6), { parent: root });
  // Fried shallot / lemongrass shreds
  const shred = M(0x6b3515, 0.55), rs = rng(77);
  for (let i = 0; i < 9; i++) {
    const a = rs() * 6.28, d = rs() * 0.35, x = T[0] + Math.cos(a) * d, z = T[2] + Math.sin(a) * d, y = T[1] + 0.3 + rs() * 0.03;
    const pts = [0, 1, 2, 3].map(k => [x + Math.cos(a + k * 0.9) * 0.05 * k, y + Math.sin(k * 1.3) * 0.015, z + Math.sin(a + k * 0.9) * 0.05 * k]);
    createPart('s0 Shallot shred ' + (i + 1), pipeAlongPath(pts, 0.009, { tubularSegments: 12, radialSegments: 5 }), shred, { parent: root });
  }
  // Fried curry leaves, curled and nearly black
  const leafMat = M(0x2b3417, 0.45); leafMat.side = THREE.DoubleSide;
  const leaf = parametricSurface((u, v) => { const w = 0.045 * Math.sin(u * Math.PI); return [u * 0.2 - 0.1, 0.03 * Math.sin(u * 3) + 0.04 * v * v, v * w]; }, { u: [0, 1], v: [-1, 1], uSegments: 12, vSegments: 4 });
  const rl = rng(31);
  for (let i = 0; i < 6; i++) { const a = rl() * 6.28, d = 0.15 + rl() * 0.35; createPart('s0 Curry leaf ' + (i + 1), leaf, leafMat, { position: [T[0] + Math.cos(a) * d * 0.5, T[1] + 0.28 + rl() * 0.04, T[2] + Math.sin(a) * d * 0.4], rotation: [rl() * 30 - 15, rl() * 360, rl() * 30 - 15], parent: root }); }
  return root;
}