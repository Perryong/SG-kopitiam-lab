const meta = { name: 'Ice kacang' };
// Web-scene units inside the bowl group (bowl floor near Y=-0.45, rim at Y=0.17). Part names start with the step index.
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
const FACES = [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];
function chunks(items) {
  const positions = [], indices = [];
  for (const [x, y, z, sx, sy, sz, ry, seed] of items) {
    const r = rng(seed), corners = [];
    for (let i = 0; i < 8; i++) { const px = (i & 1 ? 0.5 : -0.5) * sx * (0.8 + r() * 0.4), py = (i & 2 ? 0.5 : -0.5) * sy * (0.8 + r() * 0.4), pz = (i & 4 ? 0.5 : -0.5) * sz * (0.8 + r() * 0.4); corners.push([x + px * Math.cos(ry) + pz * Math.sin(ry), y + py, z - px * Math.sin(ry) + pz * Math.cos(ry)]); }
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
const R = 1.3, H = (x, z) => { const d = Math.hypot(x, z); return -0.1 + 1.45 * Math.pow(Math.max(0, 1 - (d / R) ** 2), 0.75) + 0.05 * fbm(x * 3, 0, z * 3); };
// Polar patch draped over the ice mound; thickness tapers to a ragged edge
function patch(a0, a1, d0, d1, th, seed) {
  const at = (u, v, top) => {
    const a = a0 + v * (a1 - a0), d = (d0 + u * (d1 - d0)) * R, x = Math.cos(a) * d, z = Math.sin(a) * d;
    const edge = Math.min(u, 1 - u, v, 1 - v) * 3, mask = smooth(0, 0.5 + 0.3 * fbm(x * 4 + seed, 1, z * 4), edge);
    return [x, H(x, z) + (top ? 0.004 + th * mask : -0.006), z];
  };
  return slab((u, v) => at(u, v, true), (u, v) => at(u, v, false), 22, 26);
}
function build() {
  const root = createRoot('IceKacang');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  // Step 0: red beans, attap chee, grass jelly and colourful jelly cubes at the bottom of the bowl
  const r = rng(3), beans = [], attap = [], grass = [], red = [], green = [];
  const place = () => { const a = r() * 6.28, d = 1.15 * Math.sqrt(r()); return [Math.cos(a) * d, -0.36 + r() * 0.26, Math.sin(a) * d]; };
  for (let i = 0; i < 70; i++) { const [x, y, z] = place(); beans.push([x, y, z, 0.08, 0.06, 0.06, 10 + i]); }
  for (let i = 0; i < 12; i++) { const [x, y, z] = place(); attap.push([x, y, z, 0.16, 0.08, 0.1, 100 + i]); }
  for (let i = 0; i < 10; i++) { const [x, y, z] = place(); grass.push([x, y, z, 0.16, 0.16, 0.16, r() * 3, 200 + i]); }
  for (let i = 0; i < 8; i++) { const [x, y, z] = place(); red.push([x, y, z, 0.14, 0.14, 0.14, r() * 3, 300 + i]); }
  for (let i = 0; i < 8; i++) { const [x, y, z] = place(); green.push([x, y, z, 0.14, 0.14, 0.14, r() * 3, 400 + i]); }
  createPart('s0 Red beans', crumbs(beans), M(0x6a1f1f, 0.35), { parent: root });
  createPart('s0 Attap chee', crumbs(attap), M(0xeee6d0, 0.15), { parent: root });
  createPart('s0 Grass jelly', chunks(grass), M(0x2b221c, 0.12), { parent: root });
  createPart('s0 Red jelly', chunks(red), M(0xd23a4a, 0.15), { parent: root });
  createPart('s0 Green jelly', chunks(green), M(0x4fae4a, 0.15), { parent: root });
  // Step 1: a mountain of shaved ice with fluffy granules
  createPart('s1 Shaved ice', slab((u, v) => { const a = v * 6.2832, d = u * R, x = Math.cos(a) * d, z = Math.sin(a) * d; return [x, H(x, z), z]; }, (u, v) => { const a = v * 6.2832, d = u * R; return [Math.cos(a) * d, -0.12, Math.sin(a) * d]; }, 30, 64), M(0xeef1f3, 0.55), { parent: root });
  const ri = rng(7), flakes = [];
  for (let i = 0; i < 700; i++) { const a = ri() * 6.28, d = R * Math.sqrt(ri()) * 0.98, x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.014 + ri() * 0.02; flakes.push([x, H(x, z) + s * 0.2, z, s, s * 0.8, s, 500 + i]); }
  createPart('s1 Ice flakes', crumbs(flakes), M(0xf7f9fa, 0.45), { parent: root });
  // Step 2: rose, pandan and gula melaka syrups soaking down the sides, evaporated milk on top
  createPart('s2 Rose syrup', patch(-0.5, 1.5, 0.2, 0.93, 0.025, 1), M(0xd0304a, 0.35), { parent: root });
  createPart('s2 Pandan syrup', patch(2.4, 3.5, 0.3, 0.9, 0.025, 2), M(0x62ae44, 0.35), { parent: root });
  createPart('s2 Gula melaka', patch(4.4, 5.2, 0.05, 0.85, 0.03, 3), M(0x6b3a18, 0.2), { parent: root });
  createPart('s2 Evaporated milk', patch(0, 6.2832, 0.0, 0.32, 0.02, 4), M(0xf3ead2, 0.25), { parent: root });
  // Step 3: sweet corn kernels crowning the top, with a few more beans
  const rc = rng(11), corn = [], topBeans = [];
  for (let i = 0; i < 50; i++) { const a = rc() * 6.28, d = 0.55 * Math.sqrt(rc()), x = Math.cos(a) * d, z = Math.sin(a) * d; corn.push([x, H(x, z) + 0.06, z, 0.07, 0.06, 0.06, rc() * 3, 700 + i]); }
  for (let i = 0; i < 12; i++) { const a = rc() * 6.28, d = 0.7 * Math.sqrt(rc()), x = Math.cos(a) * d, z = Math.sin(a) * d; topBeans.push([x, H(x, z) + 0.06, z, 0.08, 0.06, 0.06, 800 + i]); }
  createPart('s3 Sweet corn', chunks(corn), M(0xf0c43a, 0.35), { parent: root });
  createPart('s3 Red beans', crumbs(topBeans), M(0x6a1f1f, 0.35), { parent: root });
  return root;
}