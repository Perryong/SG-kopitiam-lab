const meta = { name: 'Chilli crab' };
// Web-scene units inside the plate group (plate surface Y=-0.065). Part names start with the step index.
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
function blob(sx, sy, sz, amp, freq, seg = 40) {
  const g = copyGeometry(sphereGeo(1, seg, Math.round(seg * 0.7))), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + amp * fbm(x * freq, y * freq, z * freq); p.setXYZ(i, x * sx * k, Math.max(y, -0.35) * sy * k, z * sz * k); }
  g.computeVertexNormals();
  const n = g.attributes.normal;
  for (let i = 0; i < n.count; i++) if (Math.hypot(n.getX(i), n.getY(i), n.getZ(i)) < 1e-4) n.setXYZ(i, 0, 1, 0);
  return g;
}
async function build() {
  const root = createRoot('ChilliCrab');
  const M = (c, r = 0.5) => gameMaterial(c, { flatShading: false, roughness: r });
  const Y = -0.065, shell = M(0xc8401a, 0.3), tip = M(0x2a1a12, 0.25), flesh = M(0xf2e6d0, 0.5);
  // Step 0: mud crab, cracked and arranged — upturned carapace, big claws with black pincers, legs and body pieces
  createPart('s0 Carapace', blob(0.62, 0.3, 0.46, 0.06, 2.5), shell, { position: [0.05, Y + 0.34, -0.1], rotation: [0, 12, -8], parent: root });
  for (const [side, z] of [[-1, 0.62], [1, 0.62]]) {
    const cx = side * 0.72, sgn = side < 0 ? 'left' : 'right';
    createPart('s0 Claw ' + sgn, blob(0.2, 0.17, 0.36, 0.05, 3), shell, { position: [cx + side * 0.06, Y + 0.2, z + 0.05], rotation: [0, -side * 30, 0], parent: root });
    createPart('s0 Claw arm ' + sgn, pipeAlongPath([[side * 0.35, Y + 0.18, 0.2], [side * 0.55, Y + 0.2, 0.45], [cx, Y + 0.2, z]], 0.1, { tubularSegments: 12, radialSegments: 14 }), shell, { parent: root });
    for (const [k, d] of [[1, 0.05], [2, -0.05]]) {
      const bx = cx + side * 0.18, bz = z + 0.32;
      createPart('s0 Pincer ' + sgn + ' ' + k, pipeAlongPath([[bx, Y + 0.2 + d, bz], [bx + side * 0.12, Y + 0.2 + d * 1.4, bz + 0.18], [bx + side * 0.14, Y + 0.2 + d * 0.4, bz + 0.32]], 0.075 - k * 0.012, { tubularSegments: 12, radialSegments: 10 }), shell, { parent: root });
      createPart('s0 Pincer tip ' + sgn + ' ' + k, sphereGeo(0.06, 12, 8), tip, { position: [bx + side * 0.14, Y + 0.2 + d * 0.4, bz + 0.33], parent: root });
    }
    for (let l = 0; l < 4; l++) {
      const lz = -0.55 + l * 0.2, lx = side * 0.55, ex = side * (1.2 + l * 0.05), ez = lz - 0.35 + l * 0.08;
      createPart('s0 Leg ' + sgn + ' ' + (l + 1), pipeAlongPath([[lx, Y + 0.12, lz], [side * 0.95, Y + 0.2, lz - 0.1], [ex, Y + 0.06, ez]], 0.045 - l * 0.004, { tubularSegments: 14, radialSegments: 10, bendRadius: 0.05 }), shell, { parent: root });
    }
  }
  const pieces = [[-0.45, -0.75], [0.5, -0.8], [0.1, 0.35]];
  for (const [k, [x, z]] of pieces.entries()) {
    createPart('s0 Body shell ' + (k + 1), blob(0.26, 0.16, 0.2, 0.08, 4, 24), shell, { position: [x, Y + 0.13, z], rotation: [0, k * 50, 0], parent: root });
    createPart('s0 Body flesh ' + (k + 1), blob(0.2, 0.08, 0.15, 0.1, 5, 20), flesh, { position: [x + 0.05, Y + 0.25, z + 0.04], rotation: [0, k * 50, 0], parent: root });
  }
  // Step 1: thick sweet-spicy gravy with ribbons of beaten egg
  const gravy = M(0xd0521e, 0.25), rg = rng(3), globs = [];
  createPart('s1 Gravy pool', blob(1.75, 0.06, 1.6, 0.04, 3, 48), gravy, { position: [0, Y + 0.02, 0], parent: root });
  for (let i = 0; i < 70; i++) { const a = rg() * 6.28, d = 0.75 * Math.sqrt(rg()), x = Math.cos(a) * d * 0.9, z = Math.sin(a) * d * 0.7 - 0.1, s = 0.06 + rg() * 0.07; globs.push([x, Y + 0.3 + 0.28 * Math.max(0, 1 - d * d) * 0.6, z, s, s * 0.45, s, 20 + i]); }
  createPart('s1 Gravy on crab', crumbs(globs), gravy, { parent: root });
  const egg = M(0xf2d27a, 0.4), re = rng(9);
  for (let i = 0; i < 18; i++) {
    const a = re() * 6.28, d = 0.9 + re() * 0.7, x = Math.cos(a) * d, z = Math.sin(a) * d * 0.9, t = re() * 6;
    const pts = [0, 1, 2, 3, 4].map(k => [x + Math.cos(t + k * 0.8) * 0.06 * k, Y + 0.085 + Math.sin(k * 1.7) * 0.01, z + Math.sin(t + k * 0.8) * 0.06 * k]);
    createPart('s1 Egg ribbon ' + (i + 1), pipeAlongPath(pts, 0.022, { tubularSegments: 16, radialSegments: 6 }), egg, { parent: root });
  }
  // Step 2: coriander, spring onion and sliced red chilli as it braises
  const leafMat = M(0x3f8a2e, 0.4); leafMat.side = THREE.DoubleSide;
  const leaf = parametricSurface((u, v) => { const w = 0.07 * Math.sin(u * Math.PI) * (1 + 0.3 * Math.sin(v * 9 + u * 7)); return [u * 0.16 - 0.08, 0.02 * Math.sin(u * 3) + 0.02 * v * v, v * w]; }, { u: [0, 1], v: [-1, 1], uSegments: 8, vSegments: 8 });
  const rl = rng(31);
  for (let i = 0; i < 10; i++) { const a = rl() * 6.28, d = 0.35 * Math.sqrt(rl()); createPart('s2 Coriander ' + (i + 1), leaf, leafMat, { position: [0.05 + Math.cos(a) * d, Y + 0.62, -0.1 + Math.sin(a) * d * 0.8], rotation: [rl() * 30 - 15, rl() * 360, rl() * 30 - 15], parent: root }); }
  const onion = [], chilli = [];
  for (let i = 0; i < 30; i++) { const a = rl() * 6.28, d = 1.3 * Math.sqrt(rl()), s = 0.03 + rl() * 0.02; onion.push([Math.cos(a) * d, Y + 0.12 + (d < 0.6 ? 0.4 : 0), Math.sin(a) * d * 0.9, s, s * 0.5, s, 600 + i]); }
  for (let i = 0; i < 16; i++) { const a = rl() * 6.28, d = 1.2 * Math.sqrt(rl()), s = 0.04; chilli.push([Math.cos(a) * d, Y + 0.13 + (d < 0.6 ? 0.4 : 0), Math.sin(a) * d * 0.9, s, s * 0.35, s, 700 + i]); }
  createPart('s2 Spring onion', crumbs(onion), M(0x5a9a3a, 0.4), { parent: root });
  createPart('s2 Red chilli', crumbs(chilli), M(0xc4221a, 0.3), { parent: root });
  // Step 3: golden fried mantou for mopping up the gravy
  const bun = M(0xd9a24a, 0.45), crumb = M(0xf4e6c4, 0.6);
  const mantou = [[-1.55, -0.75, 20], [-1.35, -1.2, -10], [-0.9, -1.55, 40], [-1.75, -0.25, 70]];
  for (const [k, [x, z, a]] of mantou.entries()) createPart('s3 Mantou ' + (k + 1), await roundedBoxGeo(0.5, 0.28, 0.32, 0.12), bun, { position: [x, Y + 0.16, z], rotation: [0, a, 0], parent: root });
  createPart('s3 Mantou crumb', await roundedBoxGeo(0.02, 0.2, 0.25, 0.008), crumb, { position: [-1.36 + 0.24, Y + 0.16, -1.2 + 0.05], rotation: [0, -10, 0], parent: root });
  return root;
}