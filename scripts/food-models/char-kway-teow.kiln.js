const meta = { name: 'Char kway teow toppings' };
// Web-scene units inside the wok group; toppings rest on the kway teow heap. Part names start with the step index.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]];
const ICO_F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const rng = s => () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
const surf = (x, z) => 0.15 * Math.max(0, 1 - (Math.hypot(x, z) / 1.4) ** 2) + 0.03;
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
  const at = (u, v, t) => { const lx = (u - 0.5) * len, lz = (v - 0.5) * wid * Math.sqrt(Math.max(0.04, 1 - (2 * u - 1) ** 2)), x = cx + lx * c - lz * s, z = cz + lx * s + lz * c; return [x, surf(x, z) + 0.004 + t * th * Math.sin(u * Math.PI), z]; };
  return slab((u, v) => at(u, v, 1), (u, v) => at(u, v, 0), 10, 6);
}
function build() {
  const root = createRoot('CharKwayTeow');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  // Step 1: scrambled egg curds and slices of lap cheong (Chinese sausage)
  const r = rng(5), egg = [], eggBrown = [];
  for (let i = 0; i < 45; i++) { const a = r() * 6.28, d = 1.15 * Math.sqrt(r()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.07 + r() * 0.07; (i % 4 ? egg : eggBrown).push([x, surf(x, z) + 0.03, z, s * 1.3, s * 0.45, s, 10 + i]); }
  createPart('s1 Egg curds', crumbs(egg), M(0xf0c24a, 0.45), { parent: root });
  createPart('s1 Egg browned', crumbs(eggBrown), M(0xc98a2e, 0.5), { parent: root });
  const sausage = M(0x7a2a1e, 0.25);
  for (let i = 0; i < 12; i++) { const a = i * 2.39996 + 0.3, d = 1.05 * Math.sqrt((i + 0.5) / 12), x = Math.cos(a) * d, z = Math.sin(a) * d; createPart('s1 Lap cheong ' + (i + 1), cylinderGeo(0.13, 0.13, 0.035, 20), sausage, { position: [x, surf(x, z) + 0.05, z], rotation: [r() * 40 - 20, 0, r() * 40 - 20], scale: [1.25, 1, 0.85], parent: root }); }
  // Step 2: tossed with dark soy and sweet sauce, wok-hei char, bean sprouts and chives
  const glaze = M(0x3a1f10, 0.1), rg = rng(9);
  for (let i = 0; i < 10; i++) { const a = rg() * 6.28, d = 0.3 + rg() * 0.85; createPart('s2 Dark sauce glaze ' + (i + 1), drape(Math.cos(a) * d, Math.sin(a) * d, 0.3 + rg() * 0.2, 0.14 + rg() * 0.1, 0.012, rg() * 6), glaze, { parent: root }); }
  const char = [];
  for (let i = 0; i < 70; i++) { const a = rg() * 6.28, d = 1.25 * Math.sqrt(rg()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.02 + rg() * 0.03; char.push([x, surf(x, z) + 0.02, z, s * 1.4, s * 0.4, s, 200 + i]); }
  createPart('s2 Wok hei char', crumbs(char), M(0x1f140c, 0.4), { parent: root });
  // Step 3: bean sprouts and chives tossed through at the end
  const sprout = M(0xefe8d0, 0.35), chive = M(0x3f7f2e, 0.4);
  for (let i = 0; i < 18; i++) { const a = rg() * 6.28, d = 1.1 * Math.sqrt(rg()), x = Math.cos(a) * d, z = Math.sin(a) * d, h = rg() * 6.28, y = surf(x, z) + 0.06; createPart('s3 Bean sprout ' + (i + 1), pipeAlongPath([[x, y, z], [x + Math.cos(h) * 0.12, y + 0.02, z + Math.sin(h) * 0.12], [x + Math.cos(h + 0.5) * 0.24, y - 0.01, z + Math.sin(h + 0.5) * 0.24]], 0.014, { tubularSegments: 10, radialSegments: 6 }), sprout, { parent: root }); }
  for (let i = 0; i < 14; i++) { const a = rg() * 6.28, d = 1.1 * Math.sqrt(rg()), x = Math.cos(a) * d, z = Math.sin(a) * d, h = rg() * 6.28, y = surf(x, z) + 0.07; createPart('s3 Chives ' + (i + 1), pipeAlongPath([[x, y, z], [x + Math.cos(h) * 0.18, y + 0.02, z + Math.sin(h) * 0.18], [x + Math.cos(h - 0.3) * 0.34, y, z + Math.sin(h - 0.3) * 0.34]], 0.011, { tubularSegments: 10, radialSegments: 5 }), chive, { parent: root }); }
  return root;
}