const meta = { name: 'Rojak' };
// Web-scene units inside the bowl group (bowl floor near Y=-0.45). Part names start with the step index.
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],[0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],[PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]];
const ICO_F = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
const rng = s => () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
function crumbs(items) {
  const positions = [], indices = [];
  for (const [x, y, z, sx, sy, sz, seed] of items) {
    const r = rng(seed), base = positions.length / 3, rot = r() * 6.28, c = Math.cos(rot), s = Math.sin(rot);
    for (const [a, b, d] of ICO_V) { const k = (0.65 + r() * 0.6) / 1.9, px = a * k * sx, pz = d * k * sz; positions.push(x + px * c - pz * s, y + b * k * sy, z + px * s + pz * c); }
    for (const f of ICO_F) indices.push(base + f[0], base + f[1], base + f[2]);
  }
  return meshGeo({ positions, indices });
}
// Angular cut chunks: jittered boxes with hard faces, merged
const FACES = [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];
function chunks(items, grow = 1) {
  const positions = [], indices = [];
  for (const [x, y, z, sx, sy, sz, rx, ry, seed] of items) {
    const r = rng(seed), corners = [];
    for (let i = 0; i < 8; i++) {
      let px = (i & 1 ? 0.5 : -0.5) * sx * grow, py = (i & 2 ? 0.5 : -0.5) * sy * grow, pz = (i & 4 ? 0.5 : -0.5) * sz * grow;
      px *= 0.55 + r() * 0.9; py *= 0.55 + r() * 0.9; pz *= 0.55 + r() * 0.9; px += py * (r() - 0.5) * 0.8;
      const y1 = py * Math.cos(rx) - pz * Math.sin(rx), z1 = py * Math.sin(rx) + pz * Math.cos(rx);
      corners.push([x + px * Math.cos(ry) + z1 * Math.sin(ry), y + y1, z - px * Math.sin(ry) + z1 * Math.cos(ry)]);
    }
    for (const f of FACES) { const b = positions.length / 3; for (const k of f) positions.push(...corners[k]); indices.push(b, b + 2, b + 1, b, b + 3, b + 2); }
  }
  return meshGeo({ positions, indices });
}
function build() {
  const root = createRoot('Rojak');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  const r = rng(12), heap = d => 0.3 * (1 - (d / 1.35) ** 2) - 0.02;
  const place = () => { const a = r() * 6.28, d = 1.25 * Math.sqrt(r()); return [Math.cos(a) * d, heap(d) - r() * 0.22, Math.sin(a) * d]; };
  const groups = { pineapple: [], cucumber: [], jicama: [], youtiao: [], taupok: [] };
  let seed = 1;
  for (let i = 0; i < 16; i++) { const [x, y, z] = place(); groups.pineapple.push([x, y, z, 0.3, 0.16, 0.2, r() * 0.8, r() * 6, seed++]); }
  for (let i = 0; i < 11; i++) { const [x, y, z] = place(); groups.cucumber.push([x, y, z, 0.24, 0.15, 0.17, r() * 0.8, r() * 6, seed++]); }
  for (let i = 0; i < 10; i++) { const [x, y, z] = place(); groups.jicama.push([x, y, z, 0.22, 0.17, 0.2, r() * 0.8, r() * 6, seed++]); }
  for (let i = 0; i < 11; i++) { const [x, y, z] = place(); groups.taupok.push([x, y + 0.03, z, 0.24, 0.2, 0.22, r() * 0.6, r() * 6, seed++]); }
  createPart('s0 Pineapple', chunks(groups.pineapple), M(0xe8c046, 0.4), { parent: root });
  createPart('s0 Cucumber', chunks(groups.cucumber), M(0x6d9a45, 0.4), { parent: root });
  createPart('s0 Jicama', chunks(groups.jicama), M(0xefe7d2, 0.45), { parent: root });
  // Step 1: youtiao cut into puffy segments and tau pok cubes
  createPart('s1 Tau pok', chunks(groups.taupok), M(0xd19a4a, 0.6), { parent: root });
  const youtiao = [];
  for (let i = 0; i < 12; i++) { const [x, y, z] = place(), a = r() * 3.14, L = 0.36; youtiao.push([x, y + 0.04, z, a, L, seed++]); }
  for (const [k, [x, y, z, a, L, sd]] of youtiao.entries()) {
    const c = Math.cos(a) * L / 2, s = Math.sin(a) * L / 2, g = pipeAlongPath([[x - c, y, z - s], [x, y + 0.02, z], [x + c, y, z + s]], 0.085, { tubularSegments: 8, radialSegments: 10 });
    createPart('s1 Youtiao ' + (k + 1), g, M(0xc27a2c, 0.55), { parent: root });
  }
  // Step 2: glossy black prawn-paste dressing; jittered differently so some colour peeks through
  const coatItems = [...groups.pineapple, ...groups.cucumber, ...groups.jicama, ...groups.taupok].map(it => [...it.slice(0, 8), it[8] + 900]);
  createPart('s2 Prawn paste coat', chunks(coatItems, 1.1), M(0x3a2213, 0.22), { parent: root });
  createPart('s2 Prawn paste on youtiao', crumbs(youtiao.map(([x, y, z], i) => [x, y + 0.05, z, 0.3, 0.1, 0.18, 700 + i])), M(0x3a2213, 0.22), { parent: root });
  createPart('s2 Sauce pool', cylinderGeo(1.3, 1.22, 0.05, 48), M(0x2f1a0e, 0.2), { position: [0, -0.3, 0], parent: root });
  // Step 3: heavy layer of crushed peanuts and pink torch-ginger slivers
  const rp = rng(40), nuts = [], nutsDark = [], ginger = [];
  for (let i = 0; i < 420; i++) { const a = rp() * 6.28, d = 1.2 * Math.sqrt(rp()), s = 0.018 + rp() * 0.03, it = [Math.cos(a) * d, heap(d) + 0.1 + rp() * 0.06, Math.sin(a) * d, s, s * 0.7, s, 2000 + i]; (i % 4 ? nuts : nutsDark).push(it); }
  for (let i = 0; i < 26; i++) { const a = rp() * 6.28, d = 1.1 * Math.sqrt(rp()); ginger.push([Math.cos(a) * d, heap(d) + 0.14, Math.sin(a) * d, 0.12, 0.012, 0.018, 0, rp() * 6, 3000 + i]); }
  createPart('s3 Crushed peanuts', crumbs(nuts), M(0xc9a06a, 0.7), { parent: root });
  createPart('s3 Peanut skins', crumbs(nutsDark), M(0x9c6a3a, 0.7), { parent: root });
  createPart('s3 Torch ginger', chunks(ginger), M(0xe0607e, 0.4), { parent: root });
  return root;
}