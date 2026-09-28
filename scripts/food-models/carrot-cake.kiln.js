const meta = { name: 'Carrot cake (chai tow kway)' };
// Web-scene units inside the pan group (pan floor near Y=-0.15). Part names start with the step index.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]];
const ICO_F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const rng = s => () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
const nz = (x, y, z) => Math.sin(x * 1.9 + Math.sin(z * 1.3) * 1.7) * Math.sin(y * 2.3 + x * 0.7) * Math.sin(z * 2.1 + y * 1.1);
const fbm = (x, y, z) => nz(x, y, z) * 0.6 + nz(x * 2.3 + 5, y * 2.3, z * 2.3) * 0.3 + nz(x * 5.1, y * 5.1 + 3, z * 5.1) * 0.15;
function crumbs(items) {
  const positions = [], indices = [];
  for (const [x, y, z, sx, sy, sz, seed] of items) {
    const r = rng(seed), base = positions.length / 3, rot = r() * 6.28, c = Math.cos(rot), s = Math.sin(rot);
    for (const [a, b, d] of ICO_V) { const k = (0.65 + r() * 0.6) / 1.9, px = a * k * sx, pz = d * k * sz; positions.push(x + px * c - pz * s, y + b * k * sy, z + px * s + pz * c); }
    for (const f of ICO_F) indices.push(base + f[0], base + f[1], base + f[2]);
  }
  return meshGeo({ positions, indices });
}
const FACES = [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];
function chunks(items) {
  const positions = [], indices = [];
  for (const [x, y, z, sx, sy, sz, ry, seed] of items) {
    const r = rng(seed), corners = [];
    for (let i = 0; i < 8; i++) { const px = (i & 1 ? 0.5 : -0.5) * sx * (0.8 + r() * 0.35), py = (i & 2 ? 0.5 : -0.5) * sy * (0.8 + r() * 0.35), pz = (i & 4 ? 0.5 : -0.5) * sz * (0.8 + r() * 0.35); corners.push([x + px * Math.cos(ry) + pz * Math.sin(ry), y + py, z - px * Math.sin(ry) + pz * Math.cos(ry)]); }
    for (const f of FACES) { const b = positions.length / 3; for (const k of f) positions.push(...corners[k]); indices.push(b, b + 2, b + 1, b, b + 3, b + 2); }
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
function build() {
  const root = createRoot('CarrotCake');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  // Step 0: steamed radish cake cut into soft cubes and spread in the pan
  const r = rng(3), cubes = [];
  for (let i = 0; i < 46; i++) { const a = i * 2.39996 + r() * 0.3, d = 1.12 * Math.sqrt((i + 0.5) / 46), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.19 + r() * 0.05; cubes.push([x, -0.07 + r() * 0.05, z, s, s * 0.8, s, r() * 3, 10 + i]); }
  createPart('s0 Radish cake', chunks(cubes), M(0xebe3cd, 0.55), { parent: root });
  // Step 1: beaten egg poured in, setting into a lacy layer that binds the cubes
  const eggTop = (x, z, u) => -0.06 + 0.035 * fbm(x * 4, 1, z * 4) - 0.03 * u ** 6;
  const at = (u, v, top) => { const a = v * 6.2832, rim = 1.2 * (1 + 0.08 * fbm(Math.cos(a) * 2, 0, Math.sin(a) * 2)), d = u * rim, x = Math.cos(a) * d, z = Math.sin(a) * d; return [x, top ? eggTop(x, z, u) : -0.14, z]; };
  createPart('s1 Egg layer', slab((u, v) => at(u, v, true), (u, v) => at(u, v, false), 24, 64), M(0xefc24c, 0.4), { parent: root });
  const egg = [];
  for (let i = 0; i < 45; i++) { const a = r() * 6.28, d = 1.1 * Math.sqrt(r()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.06 + r() * 0.06; egg.push([x, eggTop(x, z, d / 1.2) + 0.05, z, s * 1.3, s * 0.5, s, 100 + i]); }
  createPart('s1 Egg curds', crumbs(egg), M(0xf3cd5c, 0.45), { parent: root });
  // Step 2: turned and pressed until golden, with crisp browned patches and chai poh
  const crust = [], chaipoh = [];
  for (const [x, y, z, s, , , , seed] of cubes) { const q = rng(seed * 3); if (q() < 0.55) crust.push([x + (q() - 0.5) * 0.08, y + s * 0.42, z + (q() - 0.5) * 0.08, s * 0.62, 0.03, s * 0.55, seed * 3]); }
  for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = 1.15 * Math.sqrt(r()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.025 + r() * 0.02; chaipoh.push([x, 0.02 + r() * 0.03, z, s * 1.2, s * 0.5, s, 300 + i]); }
  createPart('s2 Golden crust', crumbs(crust), M(0xc98a3a, 0.45), { parent: root });
  createPart('s2 Chai poh', crumbs(chaipoh), M(0x6a4020, 0.4), { parent: root });
  // Step 3: chopped spring onion scattered over the top
  const onion = [], onionPale = [];
  for (let i = 0; i < 60; i++) { const a = r() * 6.28, d = 1.1 * Math.sqrt(r()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.03 + r() * 0.02; (i % 3 ? onion : onionPale).push([x, 0.07 + r() * 0.03, z, s, s * 0.5, s, 500 + i]); }
  createPart('s3 Spring onion', crumbs(onion), M(0x4f9a36, 0.4), { parent: root });
  createPart('s3 Spring onion white', crumbs(onionPale), M(0xc6e09a, 0.4), { parent: root });
  return root;
}