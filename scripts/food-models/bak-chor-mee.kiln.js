const meta = { name: 'Bak chor mee toppings' };
// Web-scene units inside the bowl group; toppings rest on the noodle heap. Part names start with the step index.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]];
const ICO_F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const rng = s => () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
const nz = (x, y, z) => Math.sin(x * 1.9 + Math.sin(z * 1.3) * 1.7) * Math.sin(y * 2.3 + x * 0.7) * Math.sin(z * 2.1 + y * 1.1);
const surf = (x, z) => 0.17 * Math.max(0, 1 - (Math.hypot(x, z) / 1.4) ** 2) + 0.02;
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
  return meshGeo({ positions, indices });
}
// A thin oval slice draped over the noodle heap, curling up at its ends
function drape(cx, cz, len, wid, th, rot, lift = 0.01, curl = 0.06) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const at = (u, v, t) => {
    const lx = (u - 0.5) * len, lz = (v - 0.5) * wid * Math.sqrt(Math.max(0.04, 1 - (2 * u - 1) ** 2));
    const x = cx + lx * c - lz * s, z = cz + lx * s + lz * c;
    return [x, surf(x, z) + lift + curl * (2 * u - 1) ** 2 + t * th * (0.6 + 0.4 * Math.sin(u * Math.PI)), z];
  };
  return slab((u, v) => at(u, v, 1), (u, v) => at(u, v, 0), 14, 6);
}
async function build() {
  const root = createRoot('BakChorMee');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  // Step 1: minced pork, sliced pork, liver, meatballs, braised shiitake and a lettuce leaf
  const r = rng(3), mince = [], minceDark = [];
  for (let i = 0; i < 190; i++) { const a = r() * 6.28, d = 0.7 * Math.sqrt(r()), x = Math.cos(a) * d - 0.1, z = Math.sin(a) * d + 0.05, s = 0.04 + r() * 0.04; (i % 3 ? mince : minceDark).push([x, surf(x, z) + 0.02 + r() * 0.07, z, s, s * 0.75, s, 10 + i]); }
  createPart('s1 Minced pork', crumbs(mince), M(0xab8c70, 0.6), { parent: root });
  createPart('s1 Minced pork browned', crumbs(minceDark), M(0x8a6a50, 0.6), { parent: root });
  const pork = M(0xdcc0a8, 0.5), liver = M(0x5a2a20, 0.25);
  for (const [k, [x, z, a]] of [[0.85, -0.45, 0.4], [0.95, 0.05, 1.3], [0.72, 0.5, 2.1], [0.4, -0.85, -0.3]].entries()) createPart('s1 Sliced pork ' + (k + 1), drape(x, z, 0.55, 0.32, 0.035, a), pork, { parent: root });
  for (const [k, [x, z, a]] of [[-0.35, -0.8, 0.9], [-0.8, -0.45, 1.8], [-0.2, 0.85, -0.6]].entries()) createPart('s1 Liver ' + (k + 1), drape(x, z, 0.5, 0.3, 0.05, a, 0.015, 0.04), liver, { parent: root });
  const ball = copyGeometry(sphereGeo(0.14, 24, 16)), bp = ball.attributes.position;
  for (let i = 0; i < bp.count; i++) { const x = bp.getX(i), y = bp.getY(i), z = bp.getZ(i), k = 1 + 0.05 * nz(x * 30, y * 30, z * 30); bp.setXYZ(i, x * k, y * k, z * k); }
  ball.computeVertexNormals();
  const bn = ball.attributes.normal;
  for (let i = 0; i < bn.count; i++) if (Math.hypot(bn.getX(i), bn.getY(i), bn.getZ(i)) < 1e-4) { const l = Math.hypot(bp.getX(i), bp.getY(i), bp.getZ(i)); bn.setXYZ(i, bp.getX(i) / l, bp.getY(i) / l, bp.getZ(i) / l); }
  for (const [k, [x, z]] of [[-0.95, 0.3], [-0.75, 0.75], [0.35, 0.95]].entries()) createPart('s1 Meatball ' + (k + 1), ball, M(0xc9a57f, 0.55), { position: [x, surf(x, z) + 0.11, z], parent: root });
  const cap = await revolveProfile([[0, 0], [0.2, 0], [0.21, 0.03], [0.18, 0.08], [0.1, 0.12], [0, 0.13]], { segments: 32, bevel: 0.01 });
  for (const [k, [x, z, t]] of [[0.15, -0.35, 12], [-0.45, 0.25, -18], [0.3, 0.4, 8]].entries()) createPart('s1 Braised shiitake ' + (k + 1), cap, M(0x3a2414, 0.2), { position: [x, surf(x, z) + 0.06, z], rotation: [t, k * 40, t * 0.5], parent: root });
  const leafMat = M(0x7fae3e, 0.45); leafMat.side = THREE.DoubleSide;
  createPart('s1 Lettuce', parametricSurface((u, v) => { const x = -1.2 + u * 0.55, z = -0.2 + v * 0.7; return [x, surf(x, z) + 0.02 + 0.05 * Math.sin(v * 14) * u + 0.1 * u * u, z]; }, { u: [0, 1], v: [0, 1], uSegments: 10, vSegments: 28 }), leafMat, { parent: root });
  // Step 2: chilli and black-vinegar sauce glistening over the noodles
  const sauce = M(0x6a2211, 0.12), rs = rng(8);
  for (let i = 0; i < 12; i++) { const a = rs() * 6.28, d = 0.35 + rs() * 0.8; createPart('s2 Chilli sauce ' + (i + 1), drape(Math.cos(a) * d, Math.sin(a) * d, 0.18 + rs() * 0.16, 0.1 + rs() * 0.08, 0.008, rs() * 6, 0.0, 0.0), sauce, { parent: root }); }
  const flakes = [];
  for (let i = 0; i < 90; i++) { const a = rs() * 6.28, d = 1.2 * Math.sqrt(rs()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.015 + rs() * 0.015; flakes.push([x, surf(x, z) + 0.03, z, s, s * 0.4, s, 400 + i]); }
  createPart('s2 Chilli flakes', crumbs(flakes), M(0xb0301a, 0.4), { parent: root });
  // Step 3: spring onion, lard crisps and fried shallots
  const rg = rng(15), onion = [], onionPale = [], lard = [], shallot = [];
  for (let i = 0; i < 70; i++) { const a = rg() * 6.28, d = 1.1 * Math.sqrt(rg()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.03 + rg() * 0.02; (i % 3 ? onion : onionPale).push([x, surf(x, z) + 0.13 + rg() * 0.04, z, s, s * 0.5, s, 600 + i]); }
  for (let i = 0; i < 30; i++) { const a = rg() * 6.28, d = 1.0 * Math.sqrt(rg()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.05 + rg() * 0.03; lard.push([x, surf(x, z) + 0.13, z, s, s * 0.7, s, 800 + i]); }
  for (let i = 0; i < 40; i++) { const a = rg() * 6.28, d = 1.0 * Math.sqrt(rg()), x = Math.cos(a) * d, z = Math.sin(a) * d, s = 0.025 + rg() * 0.02; shallot.push([x, surf(x, z) + 0.13, z, s, s * 0.35, s * 0.7, 900 + i]); }
  createPart('s3 Spring onion', crumbs(onion), M(0x4f9a36, 0.4), { parent: root });
  createPart('s3 Spring onion white', crumbs(onionPale), M(0xc6e09a, 0.4), { parent: root });
  createPart('s3 Lard crisps', crumbs(lard), M(0xd9a54a, 0.45), { parent: root });
  createPart('s3 Fried shallots', crumbs(shallot), M(0x8a4a1e, 0.5), { parent: root });
  return root;
}