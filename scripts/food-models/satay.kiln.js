const meta = { name: 'Satay' };
// Web-scene units inside the grill group (grill-bar tops at Y=0.025). Part names start with the step index.
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
const FACES = [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]];
function chunks(items) {
  const positions = [], indices = [];
  for (const [x, y, z, sx, sy, sz, ry, seed] of items) {
    const r = rng(seed), corners = [];
    for (let i = 0; i < 8; i++) {
      const px = (i & 1 ? 0.5 : -0.5) * sx * (0.75 + r() * 0.5), py = (i & 2 ? 0.5 : -0.5) * sy * (0.75 + r() * 0.5), pz = (i & 4 ? 0.5 : -0.5) * sz * (0.75 + r() * 0.5);
      corners.push([x + px * Math.cos(ry) + pz * Math.sin(ry), y + py, z - px * Math.sin(ry) + pz * Math.cos(ry)]);
    }
    for (const f of FACES) { const b = positions.length / 3; for (const k of f) positions.push(...corners[k]); indices.push(b, b + 2, b + 1, b, b + 3, b + 2); }
  }
  return meshGeo({ positions, indices });
}
async function build() {
  const root = createRoot('Satay');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  // Step 0: turmeric-marinated meat threaded on bamboo skewers
  const r = rng(4), meat = [], sticks = M(0xd8b87a, 0.6), Yc = 0.12;
  for (let k = 0; k < 8; k++) {
    const z = -1.45 + k * 0.26, wob = (r() - 0.5) * 0.06;
    createPart('s0 Bamboo skewer ' + (k + 1), cylinderGeo(0.016, 0.02, 2.7, 8), sticks, { position: [-0.2, Yc, z + wob], rotation: [0, 0, 90], parent: root });
    for (let j = 0; j < 5; j++) meat.push([-0.85 + j * 0.28 + (r() - 0.5) * 0.04, Yc + (r() - 0.5) * 0.02, z + wob, 0.21, 0.15, 0.16, 10 + k * 5 + j]);
  }
  createPart('s0 Satay meat', crumbs(meat), M(0xb8782a, 0.45), { parent: root });
  // Step 1: charred, caramelised edges from turning over the coals
  const char = [];
  for (const [x, y, z, , , , s] of meat) for (let i = 0; i < 3; i++) { const q = rng(s * 7 + i); char.push([x + (q() - 0.5) * 0.12, y + 0.05 + q() * 0.015, z + (q() - 0.5) * 0.08, 0.07, 0.025, 0.05, s * 7 + i]); }
  createPart('s1 Char marks', crumbs(char), M(0x3b1a0a, 0.35), { parent: root });
  createPart('s1 Glaze', crumbs(meat.map(([x, y, z, sx, sy, sz, s]) => [x, y + 0.02, z, sx * 0.85, sy * 0.95, sz * 0.85, s + 500])), M(0x8e4a18, 0.2), { parent: root });
  // Step 2: a bowl of chunky peanut sauce with chilli oil
  const bowl = await revolveProfile([[0, 0], [0.26, 0], [0.4, 0.14], [0.42, 0.2], [0.39, 0.2], [0.36, 0.14], [0.24, 0.035], [0, 0.035]], { segments: 48 });
  createPart('s2 Sauce bowl', bowl, M(0xf4efe4, 0.25), { position: [1.5, 0.025, 0.8], parent: root });
  createPart('s2 Peanut sauce', cylinderGeo(0.37, 0.3, 0.12, 40), M(0xb5652a, 0.3), { position: [1.5, 0.13, 0.8], parent: root });
  const rp = rng(9), bits = [], oil = [];
  for (let i = 0; i < 40; i++) { const a = rp() * 6.28, d = 0.32 * Math.sqrt(rp()), s = 0.02 + rp() * 0.025; bits.push([1.5 + Math.cos(a) * d, 0.195, 0.8 + Math.sin(a) * d, s, s * 0.6, s, 700 + i]); }
  for (let i = 0; i < 12; i++) { const a = rp() * 6.28, d = 0.3 * Math.sqrt(rp()), s = 0.04 + rp() * 0.04; oil.push([1.5 + Math.cos(a) * d, 0.19, 0.8 + Math.sin(a) * d, s, 0.008, s, 800 + i]); }
  createPart('s2 Peanut bits', crumbs(bits), M(0x8a4f1f, 0.5), { parent: root });
  createPart('s2 Chilli oil', crumbs(oil), M(0xb3301a, 0.1), { parent: root });
  // Step 3: cucumber chunks, red onion wedges and ketupat rice cakes in woven leaves
  const rs = rng(15), cuc = [], onion = [];
  for (let i = 0; i < 7; i++) cuc.push([-1.45 + i * 0.2 + rs() * 0.05, 0.1, 0.75 + rs() * 0.3, 0.2, 0.15, 0.18, rs() * 3, 900 + i]);
  for (let i = 0; i < 6; i++) onion.push([-1.3 + i * 0.22, 0.09, 1.2 + rs() * 0.15, 0.18, 0.12, 0.1, rs() * 3, 950 + i]);
  createPart('s3 Cucumber', chunks(cuc), M(0x8fb85a, 0.35), { parent: root });
  createPart('s3 Red onion', chunks(onion), M(0xb8577a, 0.3), { parent: root });
  const ketupat = M(0xb9c46a, 0.55), rice = M(0xf1ecd9, 0.6);
  createPart('s3 Ketupat 1', await roundedBoxGeo(0.36, 0.3, 0.36, 0.04), ketupat, { position: [0.15, 0.175, 1.25], rotation: [0, 20, 0], parent: root });
  createPart('s3 Ketupat 2', await roundedBoxGeo(0.36, 0.3, 0.36, 0.04), ketupat, { position: [0.5, 0.175, 1.0], rotation: [0, -15, 0], parent: root });
  createPart('s3 Ketupat rice', await roundedBoxGeo(0.28, 0.24, 0.28, 0.03), rice, { position: [0.62, 0.145, 1.42], rotation: [0, 35, 0], parent: root });
  return root;
}