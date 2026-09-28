const meta = { name: 'Orh luak' };
// Web-scene units inside the pan group (pan floor near Y=-0.15). Part names start with the step index.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]];
const ICO_F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const rng = s => () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
const nz = (x, y, z) => Math.sin(x * 1.9 + Math.sin(z * 1.3) * 1.7) * Math.sin(y * 2.3 + x * 0.7) * Math.sin(z * 2.1 + y * 1.1);
const fbm = (x, y, z) => nz(x, y, z) * 0.6 + nz(x * 2.3 + 5, y * 2.3, z * 2.3) * 0.3 + nz(x * 5.1, y * 5.1 + 3, z * 5.1) * 0.15;
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function crumbs(items) {
  const positions = [], indices = [];
  for (const [x, y, z, sx, sy, sz, seed] of items) {
    const r = rng(seed), base = positions.length / 3, rot = r() * 6.28, c = Math.cos(rot), s = Math.sin(rot);
    for (const [a, b, d] of ICO_V) { const k = (0.65 + r() * 0.6) / 1.9, px = a * k * sx, pz = d * k * sz; positions.push(x + px * c - pz * s, y + b * k * sy, z + px * s + pz * c); }
    for (const f of ICO_F) indices.push(base + f[0], base + f[1], base + f[2]);
  }
  return meshGeo({ positions, indices });
}
function slab(top, bottom, nu, nv) {
  const positions = [], indices = [], row = nv + 1;
  for (const f of [top, bottom]) for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) positions.push(...f(i / nu, j / nv));
  const off = (nu + 1) * row;
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * row + j, b = a + 1, c = a + row, d = c + 1; indices.push(a, b, c, b, d, c, off + a, off + c, off + b, off + b, off + c, off + d); }
  const edge = [];
  for (let j = 0; j <= nv; j++) edge.push([0, j]);
  for (let i = 1; i <= nu; i++) edge.push([i, nv]);
  for (let j = nv - 1; j >= 0; j--) edge.push([nu, j]);
  for (let i = nu - 1; i > 0; i--) edge.push([i, 0]);
  const wb = positions.length / 3;
  for (const [i, j] of edge) { positions.push(...top(i / nu, j / nv)); positions.push(...bottom(i / nu, j / nv)); }
  for (let k = 0; k < edge.length; k++) { const a = wb + k * 2, b = wb + ((k + 1) % edge.length) * 2; indices.push(a, a + 1, b, b, a + 1, b + 1, a, b, a + 1, b, b + 1, a + 1); }
  const g = meshGeo({ positions, indices }), n = g.attributes.normal;
  for (let i = 0; i < n.count; i++) if (Math.hypot(n.getX(i), n.getY(i), n.getZ(i)) < 1e-4) n.setXYZ(i, 0, 1, 0);
  return g;
}
// Irregular disc: polar grid with a ragged, noisy rim
function disc(R, yTop, yBot, seed, nu = 28, nv = 72) {
  const at = (u, v, top) => { const a = v * Math.PI * 2, rim = R * (1 + 0.12 * fbm(Math.cos(a) * 2 + seed, 0, Math.sin(a) * 2)), d = u * rim, x = Math.cos(a) * d, z = Math.sin(a) * d; return [x, top ? yTop(x, z, u) : yBot(x, z, u), z]; };
  return slab((u, v) => at(u, v, true), (u, v) => at(u, v, false), nu, nv);
}
function build() {
  const root = createRoot('OrhLuak');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  // Step 0: starchy egg batter spread across the pan, lumpy and translucent in places
  const top = (x, z, u) => -0.1 + 0.05 * fbm(x * 3, 1, z * 3) + 0.03 * (1 - u * u) - 0.04 * u ** 6;
  createPart('s0 Batter', disc(1.18, top, (x, z, u) => -0.145, 3), M(0xe6d39a, 0.35), { parent: root });
  // Step 1: plump oysters, cream bodies with dark frilled mantles
  const r = rng(11), bodies = [], frills = [];
  for (let i = 0; i < 7; i++) {
    const a = i * 2.39996 + r() * 0.4, d = 0.85 * Math.sqrt((i + 0.5) / 7), x = Math.cos(a) * d, z = Math.sin(a) * d, y = top(x, z, d / 1.18) + 0.04;
    bodies.push([x, y + 0.03, z, 0.21, 0.12, 0.14, 40 + i]);
    frills.push([x + 0.015, y + 0.005, z + 0.01, 0.25, 0.06, 0.17, 80 + i]);
  }
  createPart('s1 Oyster', crumbs(bodies), M(0xd6c9a8, 0.2), { parent: root });
  createPart('s1 Oyster mantle', crumbs(frills), M(0x6f6a5c, 0.3), { parent: root });
  // Step 2: turned and crisped — golden egg lace, browned edges and scrambled egg clumps
  const rc = rng(23), lace = [], brown = [], egg = [];
  for (let i = 0; i < 260; i++) {
    const a = rc() * 6.28, d = 1.2 * Math.sqrt(rc()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.04 + rc() * 0.07;
    const item = [x, top(x, z, Math.min(1, d / 1.18)) + 0.01, z, s * 1.2, s * 0.25, s * 0.85, 200 + i];
    (d > 0.85 || i % 3 === 0 ? brown : i % 3 === 1 ? lace : egg).push(item);
  }
  createPart('s2 Crispy lace', crumbs(lace), M(0xe2b54c, 0.45), { parent: root });
  createPart('s2 Browned edge', crumbs(brown), M(0x7e4a1c, 0.5), { parent: root });
  createPart('s2 Egg clumps', crumbs(egg.map(([x, y, z, sx, sy, sz, s]) => [x, y + 0.02, z, sx * 0.8, sy * 2, sz * 0.8, s])), M(0xf0c24a, 0.45), { parent: root });
  // Step 3: coriander sprigs and chopped spring onion
  const leafMat = M(0x3f8a2e, 0.4); leafMat.side = THREE.DoubleSide;
  const leaf = parametricSurface((u, v) => { const w = 0.07 * Math.sin(u * Math.PI) * (1 + 0.3 * Math.sin(v * 9 + u * 7)); return [u * 0.16 - 0.08, 0.02 * Math.sin(u * 3) + 0.02 * v * v, v * w]; }, { u: [0, 1], v: [-1, 1], uSegments: 8, vSegments: 8 });
  const rl = rng(31);
  for (let i = 0; i < 14; i++) { const a = rl() * 6.28, d = 0.45 * Math.sqrt(rl()), x = Math.cos(a) * d + 0.1, z = Math.sin(a) * d; createPart('s3 Coriander ' + (i + 1), leaf, leafMat, { position: [x, top(x, z, d / 1.18) + 0.1, z], rotation: [rl() * 30 - 15, rl() * 360, rl() * 30 - 15], parent: root }); }
  const onion = [];
  for (let i = 0; i < 40; i++) { const a = rl() * 6.28, d = 0.9 * Math.sqrt(rl()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.03 + rl() * 0.02; onion.push([x, top(x, z, d / 1.18) + 0.08, z, s, s * 0.5, s, 600 + i]); }
  createPart('s3 Spring onion', crumbs(onion), M(0x5a9a3a, 0.4), { parent: root });
  return root;
}