const meta = { name: 'Sambal stingray' };
// Web-scene units; grill-bar tops at Y=0.025. Part names start with the preparation step index.
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
// Closed slab between a top and bottom surface over u,v in [0,1]; walls get both windings.
function slab(top, bottom, nu, nv) {
  const positions = [], indices = [], row = nv + 1;
  for (const f of [top, bottom]) for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) positions.push(...f(i / nu, j / nv));
  const off = (nu + 1) * row;
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = i * row + j, b = a + 1, c = a + row, d = c + 1;
    indices.push(a, b, c, b, d, c, off + a, off + c, off + b, off + b, off + c, off + d);
  }
  const edge = [];
  for (let j = 0; j <= nv; j++) edge.push([0, j]);
  for (let i = 1; i <= nu; i++) edge.push([i, nv]);
  for (let j = nv - 1; j >= 0; j--) edge.push([nu, j]);
  for (let i = nu - 1; i > 0; i--) edge.push([i, 0]);
  const wb = positions.length / 3;
  for (const [i, j] of edge) { positions.push(...top(i / nu, j / nv)); positions.push(...bottom(i / nu, j / nv)); }
  for (let k = 0; k < edge.length; k++) {
    const a = wb + k * 2, b = wb + ((k + 1) % edge.length) * 2;
    indices.push(a, a + 1, b, b, a + 1, b + 1, a, b, a + 1, b, b + 1, a + 1);
  }
  return meshGeo({ positions, indices });
}
async function build() {
  const root = createRoot('SambalStingray');
  const M = (c, r = 0.5, o = {}) => gameMaterial(c, { flatShading: false, roughness: r, ...o });
  // Step 0: banana leaf with gently curled edges
  const leafMat = M(0x3f6b2a, 0.35); leafMat.side = THREE.DoubleSide;
  const leaf = parametricSurface((u, v) => {
    const x = -1.8 + u * 3.25, w = 1.66 * (0.8 + 0.2 * Math.sin(u * Math.PI));
    return [x, 0.035 + 0.012 * Math.sin(u * 11 + v * 2) + 0.07 * v ** 4 + 0.04 * (Math.abs(u - 0.5) * 2) ** 4, v * w];
  }, { u: [0, 1], v: [-1, 1], uSegments: 120, vSegments: 24 });
  createPart('s0 Banana leaf', leaf, leafMat, { parent: root });
  // Step 1: stingray wing — thick cut edge fanning out to a thin rim, cartilage ridges radiating
  const P = [-1.45, 0, 0], Y0 = 0.05;
  const wingAt = (u, v, lift) => {
    const th = (v - 0.5) * 1.5, rr = 0.35 + u * 1.95 * (1 - 0.12 * ((v - 0.5) * 2) ** 2) * (1 + 0.05 * Math.sin(th * 9) * u + 0.04 * fbm(th * 4, 0, u * 2) * u);
    const x = P[0] + Math.cos(th) * rr, z = Math.sin(th) * rr;
    const t = 0.2 * (1 - u) ** 0.9 + 0.025, ridge = 0.014 * Math.pow(Math.abs(Math.sin(th * 26)), 0.5) * smooth(0.04, 0.15, u);
    return [x, Y0 + lift * (t + ridge + 0.008 * fbm(x * 3, 0, z * 3)), z];
  };
  createPart('s1 Stingray wing', slab((u, v) => wingAt(u, v, 1), (u, v) => wingAt(u, v, 0), 36, 48), M(0xa86e3a, 0.45), { parent: root });
  // Step 2: thick sambal spread over the wing, tapering to a ragged edge
  const coatAt = (u, v, top) => {
    const uu = 0.02 + u * 0.93, vv = 0.03 + v * 0.94, p = wingAt(uu, vv, 1);
    const edge = Math.min(u, 1 - u, v, 1 - v) * 5, mask = smooth(0, 0.5 + 0.3 * fbm(uu * 7, 1, vv * 7), edge);
    return top ? [p[0], p[1] + (0.065 + 0.035 * fbm(p[0] * 6, 2, p[2] * 6) + 0.015 * fbm(p[0] * 18, 4, p[2] * 18)) * mask + 0.002, p[2]] : [p[0], p[1] - 0.004, p[2]];
  };
  createPart('s2 Sambal', slab((u, v) => coatAt(u, v, true), (u, v) => coatAt(u, v, false), 32, 40), M(0x5c2010, 0.28), { parent: root });
  const rs = rng(9), lumps = [];
  for (let i = 0; i < 230; i++) { const u = 0.06 + rs() * 0.86, v = 0.06 + rs() * 0.88, p = coatAt(u, v, true), s = 0.02 + rs() * 0.035; lumps.push([p[0], p[1] + 0.005, p[2], s, s * 0.5, s, 300 + i]); }
  createPart('s2 Sambal lumps', crumbs(lumps), M(0x3e140a, 0.3), { parent: root });
  // Step 3: chopped shallots and calamansi halves
  const rg = rng(21), shallots = [];
  for (let i = 0; i < 60; i++) { const u = 0.12 + rg() * 0.7, v = 0.12 + rg() * 0.76, p = coatAt(u, v, true), s = 0.025 + rg() * 0.02; shallots.push([p[0], p[1] + 0.01, p[2], s * 1.4, s * 0.3, s * 0.6, 500 + i]); }
  createPart('s3 Shallots', crumbs(shallots), M(0xd8bcc6, 0.3), { parent: root });
  const skin = M(0x4f8a2c, 0.4), flesh = M(0xf0a43a, 0.3);
  const half = await revolveProfile([[0, 0], [0.16, 0], [0.155, 0.05], [0.12, 0.11], [0.06, 0.145], [0, 0.155]], { segments: 32 });
  for (const [k, [x, z, ry]] of [[1.05, -1.25, 20], [1.28, -0.85, 70], [1.2, 1.22, -30]].entries()) {
    createPart('s3 Calamansi skin ' + (k + 1), half, skin, { position: [x, 0.19, z], rotation: [180, ry, 0], parent: root });
    createPart('s3 Calamansi flesh ' + (k + 1), cylinderGeo(0.15, 0.15, 0.012, 32), flesh, { position: [x, 0.19, z], parent: root });
  }
  return root;
}