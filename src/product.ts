import * as T from "three";
// Original, procedural nominative packaging study. No photographs or official artwork.
export function makeLabel() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const c = canvas.getContext("2d")!;
  const metal = c.createLinearGradient(0, 0, 2048, 0);
  metal.addColorStop(0, "#bac5d1");
  metal.addColorStop(0.2, "#e2e6ea");
  metal.addColorStop(0.5, "#f4f4f1");
  metal.addColorStop(0.8, "#b5c0d1");
  metal.addColorStop(1, "#dbe0e7");
  c.fillStyle = metal;
  c.fillRect(0, 0, 2048, 1024);
  c.fillStyle = "#123797";
  c.fillRect(0, 0, 580, 1024);
  c.fillRect(1045, 0, 1003, 1024);
  c.fillStyle = "#c82132";
  c.textAlign = "center";
  c.font = "bold 150px Arial";
  c.strokeStyle = "#edf0ed";
  c.lineWidth = 5;
  c.save();
  c.translate(1045, 345);
  c.scale(1, 0.63);
  c.strokeText("Red Bull", 0, 0);
  c.fillText("Red Bull", 0, 0);
  c.restore();
  c.font = "bold 52px Arial";
  c.save();
  c.translate(1045, 755);
  c.scale(1, 0.63);
  c.fillText("ENERGY DRINK", 0, 0);
  c.restore();
  c.fillStyle = "#ebbd28";
  c.beginPath();
  c.ellipse(1045, 535, 113, 71, 0, 0, Math.PI * 2);
  c.fill();
  // Two independently drawn angular bull motifs identify the educational subject.
  for (const side of [-1, 1]) {
    c.save();
    c.translate(1045 + side * 4, 530);
    c.scale(-side, 0.63);
    c.fillStyle = "#ce2031";
    c.beginPath();
    c.moveTo(5, 25);
    c.lineTo(38, -4);
    c.lineTo(116, -12);
    c.lineTo(143, -40);
    c.lineTo(164, -24);
    c.lineTo(177, -59);
    c.lineTo(176, -12);
    c.lineTo(160, 7);
    c.lineTo(139, 15);
    c.lineTo(120, 37);
    c.lineTo(114, 79);
    c.lineTo(96, 79);
    c.lineTo(95, 38);
    c.lineTo(53, 42);
    c.lineTo(33, 76);
    c.lineTo(14, 76);
    c.lineTo(23, 33);
    c.closePath();
    c.fill();
    c.strokeStyle = "#ce2031";
    c.lineWidth = 8;
    c.beginPath();
    c.moveTo(34, 4);
    c.quadraticCurveTo(3, -27, -5, -20);
    c.stroke();
    c.restore();
  }
  c.fillStyle = "#d8e1f5";
  c.font = "27px Arial";
  c.fillText("250 ml", 1045, 947);
  c.font = "18px Arial";
  c.fillText("ILLUSTRATIVE PACKAGING STUDY", 1045, 992);
  const tex = new T.CanvasTexture(canvas);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
export function makeCan(
  texture: T.Texture,
  branded = true,
  open = false,
  condensation = false,
) {
  const g = new T.Group();
  const silver = new T.MeshStandardMaterial({
    color: "#c8d2df",
    metalness: 0.95,
    roughness: 0.2,
  });
  const body = new T.MeshStandardMaterial({
    color: branded ? "#ffffff" : "#ccd5dc",
    map: branded ? texture : null,
    metalness: branded ? 0.62 : 0.95,
    roughness: 0.25,
  });
  const profile = [
    [0.32, 0],
    [0.36, 0.035],
    [0.395, 0.13],
    [0.405, 0.2],
    [0.405, 1.78],
    [0.395, 1.85],
    [0.353, 1.96],
    [0.349, 2.02],
  ].map(([x, y]) => new T.Vector2(x, y));
  const geometry = new T.LatheGeometry(profile, 64);
  const uv = geometry.getAttribute("uv"),
    positions = geometry.getAttribute("position");
  for (let i = 0; i < uv.count; i++) uv.setY(i, positions.getY(i) / 2.02);
  uv.needsUpdate = true;
  const mesh = new T.Mesh(geometry, body);
  mesh.castShadow = true;
  g.add(mesh);
  for (const y of [0.055, 2.025]) {
    const rim = new T.Mesh(
      new T.TorusGeometry(y > 1 ? 0.355 : 0.35, 0.023, 10, 64),
      silver,
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = y;
    g.add(rim);
  }
  if (!open) {
    const lid = new T.Mesh(
      new T.CylinderGeometry(0.344, 0.344, 0.018, 64),
      silver,
    );
    lid.position.y = 2.017;
    g.add(lid);
    const score = new T.Mesh(new T.TorusGeometry(0.29, 0.004, 6, 48), silver);
    score.rotation.x = Math.PI / 2;
    score.position.y = 2.03;
    g.add(score);
    const tab = new T.Mesh(new T.TorusGeometry(0.065, 0.023, 8, 24), silver);
    tab.rotation.x = Math.PI / 2;
    tab.scale.set(1, 1.55, 1);
    tab.position.set(0, 2.045, 0.05);
    g.add(tab);
    const rivet = new T.Mesh(new T.SphereGeometry(0.026, 12, 8), silver);
    rivet.position.set(0, 2.04, 0);
    g.add(rivet);
  } else {
    const interior = new T.Mesh(
      new T.CylinderGeometry(0.34, 0.34, 0.025, 48),
      new T.MeshStandardMaterial({
        color: "#172b33",
        metalness: 0.55,
        roughness: 0.3,
      }),
    );
    // An open can has a real bottom, not a dark disk sealing its mouth.
    interior.position.y = 0.065;
    g.add(interior);
  }
  if (condensation) {
    const dew = new T.MeshPhysicalMaterial({
      color: "#d9eef5",
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.6,
      clearcoat: 1,
    });
    const geometry = new T.SphereGeometry(0.012, 8, 6);
    for (let i = 0; i < 18; i++) {
      const phi = Math.PI + Math.sin(i * 7.1) * 0.85;
      const bead = new T.Mesh(geometry, dew);
      bead.position.set(
        Math.sin(phi) * 0.411,
        0.25 + ((i * 0.089) % 1.48),
        Math.cos(phi) * 0.411,
      );
      bead.scale.setScalar(0.65 + (i % 3) * 0.3);
      g.add(bead);
    }
  }
  g.rotation.y = Math.PI;
  return g;
}
export function makeCarton() {
  const root = new T.Group();
  const tan = new T.MeshStandardMaterial({ color: "#b5a17f", roughness: 0.8 });
  const blue = new T.MeshStandardMaterial({ color: "#163570", roughness: 0.5 });
  const print = new T.MeshStandardMaterial({
    color: "#b22c36",
    roughness: 0.6,
  });
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    m = tan,
  ) {
    const o = new T.Mesh(new T.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z);
    o.castShadow = true;
    root.add(o);
    return o;
  }
  box(2.8, 0.08, 1.8, 0, 0.04, 0);
  box(2.8, 1.3, 0.065, 0, 0.68, -0.9);
  box(2.8, 1.3, 0.065, 0, 0.68, 0.9);
  box(0.065, 1.3, 1.8, -1.4, 0.68, 0);
  box(0.065, 1.3, 1.8, 1.4, 0.68, 0);
  box(2.79, 0.42, 0.008, 0, 0.45, 0.938, blue);
  box(1.22, 0.15, 0.012, -0.05, 0.86, 0.94, print);
  const printCanvas = document.createElement("canvas");
  printCanvas.width = 1024;
  printCanvas.height = 512;
  const ink = printCanvas.getContext("2d")!;
  ink.fillStyle = "#bba787";
  ink.fillRect(0, 0, 1024, 512);
  ink.fillStyle = "#183574";
  ink.fillRect(0, 330, 1024, 182);
  ink.textAlign = "center";
  ink.fillStyle = "#b52a34";
  ink.font = "bold 130px Arial";
  ink.fillText("Red Bull", 512, 210);
  ink.font = "36px Arial";
  ink.fillText("ENERGY DRINK", 512, 278);
  ink.fillStyle = "#e1e7ed";
  ink.font = "38px Arial";
  ink.fillText("ORIGINAL · 250 ml", 512, 440);
  const printTexture = new T.CanvasTexture(printCanvas);
  printTexture.colorSpace = T.SRGBColorSpace;
  const front = new T.Mesh(
    new T.PlaneGeometry(2.6, 1.15),
    new T.MeshStandardMaterial({ map: printTexture, roughness: 0.8 }),
  );
  front.position.set(0, 0.68, 0.95);
  root.add(front);
  const flaps: T.Group[] = [];
  for (const side of [-1, 1]) {
    const hinge = new T.Group();
    hinge.position.set(0, 1.33, side * 0.9);
    const flap = new T.Mesh(new T.BoxGeometry(2.8, 0.035, 0.92), tan);
    flap.position.z = -side * 0.46;
    hinge.add(flap);
    root.add(hinge);
    flaps.push(hinge);
  }
  for (const side of [-1, 1]) {
    const hinge = new T.Group();
    hinge.position.set(side * 1.4, 1.31, 0);
    const flap = new T.Mesh(new T.BoxGeometry(0.7, 0.03, 1.74), tan);
    flap.position.x = -side * 0.35;
    hinge.add(flap);
    root.add(hinge);
    flaps.push(hinge);
  }
  return {
    root,
    flaps,
    open: (p: number) => {
      flaps[0].rotation.x = p * 1.95;
      flaps[1].rotation.x = -p * 1.95;
      flaps[2].rotation.z = -p * 1.85;
      flaps[3].rotation.z = p * 1.85;
    },
  };
}
