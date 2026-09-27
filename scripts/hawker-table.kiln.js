const meta = { name: 'Singapore hawker table setting', role: 'prop' };
// Stylised: dish-scale props are ~2x real so they read beside the 0.19 m-radius dish.
const P = { topY: 0.9, topR: 0.6, topT: 0.035, band: 0.013, stoolR: 0.72, seatY: 0.52, seatR: 0.17 };
let seed = 97;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
function chips(count, rMin, rMax, y, maxR) {
  const positions = [], normals = [], indices = [];
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2, d = maxR * Math.sqrt(rnd()), cx = Math.cos(a) * d, cz = Math.sin(a) * d;
    const r = rMin + (rMax - rMin) * rnd(), sides = 5 + Math.floor(rnd() * 3), spin = rnd() * 6, base = positions.length / 3;
    positions.push(cx, y, cz); normals.push(0, 1, 0);
    for (let k = 0; k < sides; k++) {
      const t = spin + (k / sides) * Math.PI * 2, rr = r * (0.7 + 0.5 * rnd());
      positions.push(cx + Math.cos(t) * rr, y, cz + Math.sin(t) * rr); normals.push(0, 1, 0);
    }
    for (let k = 0; k < sides; k++) indices.push(base, base + 1 + ((k + 1) % sides), base + 1 + k);
  }
  return meshGeo({ positions, indices, normals });
}
async function build() {
  const root = createRoot('HawkerTable');
  const m = (c, o = {}) => gameMaterial(c, { flatShading: false, roughness: 0.55, ...o });
  const marble = m(0xece5d7, { roughness: 0.35 }), band = m(0x2f5d4f, { roughness: 0.45 });
  const steel = m(0x9aa0a4, { metalness: 0.7, roughness: 0.35 }), seatMat = m(0xcf6a2e, { roughness: 0.5 });
  const porcelain = m(0xf6f1e6, { roughness: 0.25 }), green = m(0x2f7a55, { roughness: 0.3 });
  // Top, edge band and apron
  const top = await revolveProfile([[0, 0], [P.topR, 0], [P.topR, P.topT], [0, P.topT]], { segments: 128, bevel: 0.006 });
  createPart('Table top', top, marble, { position: [0, P.topY - P.topT, 0], parent: root });
  const edge = await revolveProfile([[P.topR - 0.004, 0], [P.topR + P.band, 0], [P.topR + P.band, P.topT + 0.002], [P.topR - 0.004, P.topT + 0.002]], { segments: 128, bevel: 0.005 });
  createPart('Edge band', edge, band, { position: [0, P.topY - P.topT - 0.001, 0], parent: root });
  createPart('Terrazzo grey', chips(700, 0.0018, 0.005, P.topY + 0.0006, P.topR - 0.015), m(0xb3aea5, { roughness: 0.35 }), { parent: root });
  createPart('Terrazzo rust', chips(260, 0.0015, 0.004, P.topY + 0.0007, P.topR - 0.015), m(0xc99a7c, { roughness: 0.35 }), { parent: root });
  createPart('Terrazzo green', chips(200, 0.0015, 0.0035, P.topY + 0.0008, P.topR - 0.015), m(0x86a293, { roughness: 0.35 }), { parent: root });
  createPart('Apron', cylinderGeo(0.2, 0.2, 0.03, 48), steel, { position: [0, P.topY - P.topT - 0.015, 0], parent: root });
  // Pedestal and floor plate
  createPart('Pedestal', cylinderGeo(0.042, 0.048, P.topY - P.topT - 0.03, 32), steel, { position: [0, (P.topY - P.topT) / 2, 0], parent: root });
  createPart('Floor plate', cylinderGeo(0.15, 0.17, 0.02, 48), steel, { position: [0, 0.01, 0], parent: root });
  // Four stools fixed to the frame, the classic hawker-centre arrangement
  const seat = await revolveProfile([[0, 0], [P.seatR, 0], [P.seatR, 0.045], [0, 0.045]], { segments: 64, bevel: 0.016 });
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), R = P.stoolR;
    const path = [[0, 0.12, 0], [0.42, 0.12, 0], [0.62, 0.16, 0], [R, 0.28, 0], [R, P.seatY - 0.01, 0]].map(([x, y]) => [x * c, y, x * s]);
    createPart('Stool arm ' + (i + 1), pipeAlongPath(path, 0.02, { bendRadius: 0.08, tubularSegments: 48, radialSegments: 12 }), steel, { parent: root });
    createPart('Stool cap ' + (i + 1), cylinderGeo(0.055, 0.05, 0.02, 32), steel, { position: [R * c, P.seatY - 0.005, R * s], parent: root });
    createPart('Stool seat ' + (i + 1), seat, seatMat, { position: [R * c, P.seatY, R * s], parent: root });
  }
  const Y = P.topY;
  // Saucer helper
  const saucer = await revolveProfile([[0, 0], [0.03, 0], [0.05, 0.012], [0.047, 0.014], [0.028, 0.004], [0, 0.004]], { segments: 48 });
  // Chilli saucer
  createPart('Chilli saucer', saucer, porcelain, { position: [0.37, Y, 0.22], parent: root });
  createPart('Chilli sauce', cylinderGeo(0.036, 0.03, 0.006, 40), m(0xc23a1e, { roughness: 0.2 }), { position: [0.37, Y + 0.008, 0.22], parent: root });
  createPart('Chilli seeds', chips(26, 0.0015, 0.0025, Y + 0.0115, 0.028), m(0xf0c86a), { position: [0.37, 0, 0.22], parent: root });
  // Soya saucer with cut chilli
  createPart('Soya saucer', saucer, porcelain, { position: [0.24, Y, 0.37], parent: root });
  createPart('Soya sauce', cylinderGeo(0.036, 0.03, 0.006, 40), m(0x3b2317, { roughness: 0.12 }), { position: [0.24, Y + 0.008, 0.37], parent: root });
  for (let i = 0; i < 5; i++) {
    const a = i * 2.4, r = 0.01 + (i % 3) * 0.007;
    createPart('Cut chilli ' + (i + 1), torusGeo(0.0065, 0.0022, 8, 16), m(0xd2371f, { roughness: 0.3 }), { position: [0.24 + Math.cos(a) * r, Y + 0.0125, 0.37 + Math.sin(a) * r], rotation: [90, 0, 0], parent: root });
  }
  // Chopsticks resting on a porcelain rest, plus a Chinese soup spoon
  const stick = cylinderGeo(0.0035, 0.0065, 0.36, 12), bamboo = m(0xd9b77b, { roughness: 0.6 });
  createPart('Chopstick rest', await roundedBoxGeo(0.018, 0.012, 0.06, 0.005), porcelain, { position: [-0.40, Y + 0.006, -0.12], parent: root });
  for (const dx of [-0.012, 0.012]) createPart('Chopstick ' + (dx < 0 ? 'left' : 'right'), stick, bamboo, { position: [-0.40 + dx, Y + 0.012, 0.02], rotation: [-88, 0, dx * 60], parent: root });
  const bowlSpoon = await revolveProfile([[0, 0], [0.028, 0.002], [0.036, 0.016], [0.033, 0.017], [0.025, 0.006], [0, 0.004]], { segments: 40 });
  createPart('Soup spoon bowl', bowlSpoon, porcelain, { position: [-0.48, Y, 0.1], scale: [1, 1, 1.45], parent: root });
  createPart('Soup spoon handle', pipeAlongPath([[-0.48, Y + 0.012, 0.045], [-0.48, Y + 0.022, -0.02], [-0.48, Y + 0.04, -0.09]], 0.007, { tubularSegments: 16, radialSegments: 10 }), porcelain, { parent: root });
  // Tissue packet — the famous "chope"
  createPart('Tissue packet', await roundedBoxGeo(0.13, 0.026, 0.085, 0.01), m(0xf8f6f0, { roughness: 0.8 }), { position: [-0.22, Y + 0.013, 0.42], rotation: [0, 25, 0], parent: root });
  createPart('Tissue band', boxGeo(0.132, 0.005, 0.03), m(0x2b6cb0, { roughness: 0.6 }), { position: [-0.22, Y + 0.0265, 0.42], rotation: [0, 25, 0], parent: root });
  // Kopi in a green-rimmed kopitiam cup on its saucer
  const kx = -0.3, kz = -0.36;
  const bigSaucer = await revolveProfile([[0, 0], [0.05, 0], [0.085, 0.014], [0.082, 0.017], [0.048, 0.006], [0, 0.006]], { segments: 64 });
  createPart('Kopi saucer', bigSaucer, porcelain, { position: [kx, Y, kz], parent: root });
  const cup = await revolveProfile([[0, 0], [0.035, 0], [0.05, 0.02], [0.055, 0.085], [0.048, 0.087], [0.044, 0.02], [0, 0.012]], { segments: 64 });
  createPart('Kopi cup', cup, porcelain, { position: [kx, Y + 0.006, kz], parent: root });
  createPart('Kopi cup rim', torusGeo(0.0515, 0.003, 10, 64), green, { position: [kx, Y + 0.006 + 0.086, kz], rotation: [90, 0, 0], parent: root });
  createPart('Kopi', cylinderGeo(0.047, 0.047, 0.004, 48), m(0x7a4a26, { roughness: 0.15 }), { position: [kx, Y + 0.006 + 0.074, kz], parent: root });
  createPart('Kopi cup handle', torusGeo(0.022, 0.006, 10, 24, ), porcelain, { position: [kx + 0.062, Y + 0.052, kz], rotation: [0, 0, 0], parent: root });
  return root;
}