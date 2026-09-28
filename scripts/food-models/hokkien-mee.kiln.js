const meta = { name: 'Hokkien mee toss' };
// Web-scene units inside the wok group; coats the mixed yellow noodle and bee hoon heap. Part names start with the step index.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]];
const ICO_F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const rng = s => () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
const surf = (x, z) => 0.19 * Math.max(0, 1 - (Math.hypot(x, z) / 1.4) ** 2) + 0.03;
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
function drape(cx, cz, len, wid, th, rot) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const at = (u, v, t) => { const lx = (u - 0.5) * len, lz = (v - 0.5) * wid * Math.sqrt(Math.max(0.04, 1 - (2 * u - 1) ** 2)), x = cx + lx * c - lz * s, z = cz + lx * s + lz * c; return [x, surf(x, z) + 0.006 + t * th * Math.sin(u * Math.PI), z]; };
  return slab((u, v) => at(u, v, 1), (u, v) => at(u, v, 0), 10, 6);
}
function build() {
  const root = createRoot('HokkienMeeToss');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  // Step 2: noodles braised in prawn stock until glossy and coated
  const stock = M(0xb8864a, 0.06), glaze = M(0xc9974f, 0.06), r = rng(4);
  createPart('s2 Prawn stock', cylinderGeo(1.34, 1.2, 0.03, 48), stock, { position: [0, -0.1, 0], parent: root });
  for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = 0.2 + r() * 1.05; createPart('s2 Stock glaze ' + (i + 1), drape(Math.cos(a) * d, Math.sin(a) * d, 0.3 + r() * 0.25, 0.15 + r() * 0.12, 0.01, r() * 6), glaze, { parent: root }); }
  const egg = [], garlic = [], char = [];
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = 1.15 * Math.sqrt(r()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.05 + r() * 0.06; egg.push([x, surf(x, z) + 0.03, z, s * 1.3, s * 0.45, s, 10 + i]); }
  for (let i = 0; i < 55; i++) { const a = r() * 6.28, d = 1.2 * Math.sqrt(r()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.018 + r() * 0.018; garlic.push([x, surf(x, z) + 0.03, z, s, s * 0.6, s, 100 + i]); }
  for (let i = 0; i < 25; i++) { const a = r() * 6.28, d = 1.2 * Math.sqrt(r()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.02 + r() * 0.02; char.push([x, surf(x, z) + 0.02, z, s * 1.4, s * 0.4, s, 200 + i]); }
  createPart('s2 Egg bits', crumbs(egg), M(0xf0c65a, 0.4), { parent: root });
  createPart('s2 Fried garlic', crumbs(garlic), M(0xd9b060, 0.45), { parent: root });
  createPart('s2 Wok char', crumbs(char), M(0x3a2414, 0.4), { parent: root });
  return root;
}