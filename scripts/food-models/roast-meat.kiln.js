const meta = { name: 'Roast duck and char siu' };
// Web-scene units inside the plate group (plate surface Y=-0.065; rice mound at x=-0.55). Part names start with the step index.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]];
const ICO_F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const rng = s => () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
const nz = (x, y, z) => Math.sin(x * 1.9 + Math.sin(z * 1.3) * 1.7) * Math.sin(y * 2.3 + x * 0.7) * Math.sin(z * 2.1 + y * 1.1);
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
// A rounded rectangular slice in a local frame, tilted to shingle; h(u,v) gives layer heights
function slice(cx, cy, cz, rot, tilt, len, wid, lo, hi, inset = 0) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const at = (u, v, f) => {
    const lx = (u - 0.5) * (len - inset * 2), lz = (v - 0.5) * (wid - inset * 2) * (1 - 0.25 * (2 * u - 1) ** 4);
    const y = cy + f(u, v) + lx * tilt;
    return [cx + lx * c - lz * s, y, cz + lx * s + lz * c];
  };
  return slab((u, v) => at(u, v, hi), (u, v) => at(u, v, lo), 10, 6);
}
async function build() {
  const root = createRoot('RoastMeat');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  const Y = -0.065;
  // Step 1: chopped roast duck — pale meat, a band of fat and lacquered mahogany skin, bone showing at the cut
  const meat = M(0xb88a6a, 0.55), fat = M(0xecd4a8, 0.4), skin = M(0x5e1e0c, 0.15), bone = M(0xeee2c8, 0.5);
  const duck = [[0.55, -0.95, 0.5], [0.72, -0.7, 0.45], [0.88, -0.45, 0.4], [1.02, -0.2, 0.35], [1.14, 0.05, 0.3], [1.24, 0.3, 0.25], [1.3, 0.55, 0.2]];
  for (const [k, [x, z, a]] of duck.entries()) {
    const y = Y + 0.02 + k * 0.005, dome = (u, v) => 0.04 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
    createPart('s1 Duck meat ' + (k + 1), slice(x, y, z, a, -0.04, 0.6, 0.3, () => 0, (u, v) => 0.09 + dome(u, v) * 0.5), meat, { parent: root });
    createPart('s1 Duck fat ' + (k + 1), slice(x, y, z, a, -0.04, 0.6, 0.3, (u, v) => 0.09 + dome(u, v) * 0.5, (u, v) => 0.115 + dome(u, v) * 0.7), fat, { parent: root });
    createPart('s1 Duck skin ' + (k + 1), slice(x, y, z, a, -0.04, 0.62, 0.31, (u, v) => 0.115 + dome(u, v) * 0.7, (u, v) => 0.15 + dome(u, v) + 0.006 * nz(u * 20, k, v * 20)), skin, { parent: root });
    if (k % 2 === 0) createPart('s1 Duck bone ' + (k + 1), cylinderGeo(0.025, 0.03, 0.12, 10), bone, { position: [x + Math.cos(a) * 0.3, y + 0.06, z + Math.sin(a) * 0.3], rotation: [0, -a * 57.3, 90], parent: root });
  }
  // Step 2: char siu slices — pink centres inside a lacquered red rim, charred at the edges and glazed
  const rim = M(0xa3261a, 0.2), pink = M(0xcf7a62, 0.45);
  const siu = [[-0.15, 1.2, -0.25], [0.18, 1.12, -0.35], [0.5, 1.02, -0.45], [0.8, 0.9, -0.55], [1.08, 0.75, -0.65]];
  const rc = rng(5), charBits = [];
  for (const [k, [x, z, a]] of siu.entries()) {
    const y = Y + 0.02 + k * 0.01, h = (u, v) => 0.1 + 0.015 * Math.sin(u * Math.PI);
    createPart('s2 Char siu rim ' + (k + 1), slice(x, y, z, a, 0.15, 0.5, 0.34, () => 0, h), rim, { parent: root });
    createPart('s2 Char siu meat ' + (k + 1), slice(x, y, z, a, 0.15, 0.5, 0.34, (u, v) => h(u, v) - 0.01, (u, v) => h(u, v) + 0.004, 0.045), pink, { parent: root });
    for (let i = 0; i < 10; i++) { const t = rc() - 0.5, side = rc() < 0.5 ? -1 : 1, lx = t * 0.45, lz = side * 0.15; charBits.push([x + lx * Math.cos(a) - lz * Math.sin(a), y + 0.1 + lx * 0.15, z + lx * Math.sin(a) + lz * Math.cos(a), 0.06, 0.02, 0.04, 70 + k * 10 + i]); }
  }
  createPart('s2 Char siu char', crumbs(charBits), M(0x3a120a, 0.3), { parent: root });
  const glaze = M(0x4a160c, 0.12);
  createPart('s2 Sweet glaze 1', cylinderGeo(0.34, 0.34, 0.012, 32), glaze, { position: [0.42, Y + 0.008, 0.72], scale: [1.6, 1, 0.9], parent: root });
  // Step 3: cucumber slices — dark skin rim, pale flesh and a seeded centre
  const cskin = M(0x3f7a35, 0.35), flesh = M(0xcfe0a0, 0.3), seeds = M(0xe9efc8, 0.3);
  for (let k = 0; k < 6; k++) {
    const x = -1.7 + k * 0.07, z = -0.35 + k * 0.26, y = Y + 0.025 + k * 0.012, tilt = [0, 0, 10];
    createPart('s3 Cucumber skin ' + (k + 1), cylinderGeo(0.2, 0.2, 0.04, 28), cskin, { position: [x, y, z], rotation: tilt, parent: root });
    createPart('s3 Cucumber flesh ' + (k + 1), cylinderGeo(0.185, 0.185, 0.042, 28), flesh, { position: [x, y, z], rotation: tilt, parent: root });
    createPart('s3 Cucumber seeds ' + (k + 1), cylinderGeo(0.08, 0.08, 0.044, 16), seeds, { position: [x, y, z], rotation: tilt, parent: root });
  }
  return root;
}