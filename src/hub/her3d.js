// Ash as a little 3D bust you can turn around and play with. Plain Three.js, loaded only in the browser.
// She looks at your cursor, blinks, falls asleep when ignored, and reacts to being poked, tickled, pulled and pushed.
// createHer(el, options) returns { dispose, setOutfit, setAutoSpin, say } (or null when WebGL is unavailable).

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

class Spring {
  constructor(k = 120, c = 9, x = 0) { this.k = k; this.c = c; this.x = x; this.v = 0; this.t = x; }
  kick(v) { this.v += v; }
  step(dt) { this.v += (-this.k * (this.x - this.t) - this.c * this.v) * dt; this.x += this.v * dt; return this.x; }
}

export async function createHer(el, { compact = false, onSay = () => {}, onHeart = () => {}, reduceMotion = false } = {}) {
  const THREE = await import("three");
  const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none;outline:none";
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(compact ? 30 : 32, 1, 0.1, 50);
  const camHome = compact ? new THREE.Vector3(0, 0.5, 8.6) : new THREE.Vector3(0, 0.25, 8.2);
  camera.position.copy(camHome);

  // ---- lights
  scene.add(new THREE.HemisphereLight(0xdbe6ff, 0x4a2c48, 1.05));
  const key = new THREE.DirectionalLight(0xfff0dc, 2.4); key.position.set(3, 4, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x78a8ff, 1.6); rim.position.set(-5, 2, -4); scene.add(rim);
  const warm = new THREE.PointLight(0xffc27a, 12, 12); warm.position.set(-3, -1, 4); scene.add(warm);

  const mat = (color, rough = 0.6, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.02, ...extra });
  const skinMat = mat(0xe9b48d, 0.55, { emissive: 0x3a1a10, emissiveIntensity: 0.05 });
  const skinDark = mat(0xd89a74, 0.6);
  const hairMat = mat(0x1a1840, 0.38, { metalness: 0.15 });
  const sweaterMat = mat(0xb02c98, 0.85);
  const sweaterLight = mat(0xc84bb0, 0.85);
  const blackMat = mat(0x0a0814, 0.35);
  const goldMat = mat(0xe8c26b, 0.3, { metalness: 0.7 });
  const pearlMat = mat(0xf4f0e8, 0.18, { metalness: 0.1 });
  const tailMat = mat(0xd9a82e, 0.6);
  const lipMat = mat(0xc4466a, 0.4);
  const toothMat = mat(0xfbf4ec, 0.3);
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xff7b9c, transparent: true, opacity: 0.18, depthWrite: false });

  const root = new THREE.Group(); scene.add(root);
  const bodyG = new THREE.Group(); root.add(bodyG);
  const head = new THREE.Group(); head.position.set(0, 0.2, 0); root.add(head);
  const tag = (obj, part) => { obj.userData.part = part; return obj; };
  const SX = 0.92, SY = 1.08, SZ = 0.97;
  const taper = (y) => (y < 0 ? 1 - 0.3 * Math.pow(Math.min(1, -y / SY), 1.4) : 1); // the jaw narrows toward the chin
  const surfZ = (x, y) => { const t = taper(y); return SZ * t * Math.sqrt(Math.max(0, 1 - (x / (SX * t)) ** 2 - (y / SY) ** 2)); };
  const normalAt = (x, y) => { const t = taper(y); const z = surfZ(x, y); return new THREE.Vector3(x / (SX * SX * t * t), y / (SY * SY), z / (SZ * SZ * t * t)).normalize(); };
  const stick = (mesh, x, y, off = 0.01) => {
    const n = normalAt(x, y); const z = surfZ(x, y);
    mesh.position.set(x + n.x * off, y + n.y * off, z + n.z * off);
    mesh.lookAt(mesh.position.clone().add(n));
    return mesh;
  };
  const between = (a, b, r, m) => {
    const d = b.clone().sub(a); const g = new THREE.CylinderGeometry(r, r, d.length(), 8);
    const mesh = new THREE.Mesh(g, m); mesh.position.copy(a.clone().add(b).multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return mesh;
  };

  // ---- skull, chin, ears
  const skullGeo = new THREE.SphereGeometry(1, 72, 56);
  { const pa = skullGeo.attributes.position; for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); if (y < 0) { const t = 1 - 0.3 * Math.pow(Math.min(1, -y), 1.4); pa.setX(i, pa.getX(i) * t); pa.setZ(i, pa.getZ(i) * t); } } skullGeo.computeVertexNormals(); }
  const skull = tag(new THREE.Mesh(skullGeo, skinMat), "head"); skull.scale.set(SX, SY, SZ); head.add(skull);
  const ears = [-1, 1].map((s) => { const e = tag(new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), skinDark), "ear"); e.position.set(s * 0.93, -0.04, -0.02); e.scale.set(0.38, 1, 0.75); head.add(e); return e; });
  const stud = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), goldMat); stud.position.set(-0.95, -0.28, 0.04); head.add(stud);
  const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), pearlMat); pearl.position.set(-0.95, -0.4, 0.05); pearl.scale.setScalar(0.001); head.add(pearl);
  const hook = between(new THREE.Vector3(-0.95, -0.27, 0.05), new THREE.Vector3(-0.95, -0.37, 0.05), 0.012, goldMat); head.add(hook); hook.visible = false;

  // ---- hair: cap + back shell + bun (the front stays open for her face)
  const hairBack = tag(new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 48, Math.PI / 2 + 0.9, Math.PI * 2 - 1.8, 0, 2.05), hairMat), "hair"); hairBack.scale.set(0.97, 1.12, 1.03); head.add(hairBack);
  hairMat.side = THREE.DoubleSide;
  const fringe = tag(new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 32, 0, Math.PI * 2, 0, 0.82), hairMat), "hair"); fringe.scale.set(0.97, 1.12, 1.03); head.add(fringe);
  const bunG = new THREE.Group(); bunG.position.set(0, 1.26, -0.22); head.add(bunG);
  const bun = tag(new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), hairMat), "bun"); bunG.add(bun);
  const bunBand = tag(new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.045, 10, 32), mat(0xe8c26b, 0.4, { metalness: 0.4 })), "bun"); bunBand.rotation.x = Math.PI / 2; bunBand.position.y = -0.22; bunG.add(bunBand);
  const tail = tag(new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 1.3, 8, 16), tailMat), "hair"); tail.position.set(0.74, 0.1, -0.62); tail.rotation.set(0.1, 0, -0.18); tail.visible = false; head.add(tail);

  // ---- eyes, brows, nose, cheeks, mouth
  const eyes = [-1, 1].map((s) => {
    const g = new THREE.Group(); const x = s * 0.36, y = 0.07;
    const white = tag(new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16), mat(0xfbf3ea, 0.25)), "eye"); white.scale.set(1.05, 1.0, 0.5);
    const iris = new THREE.Group(); const ir = new THREE.Mesh(new THREE.SphereGeometry(0.088, 24, 16), mat(0x4a2a1a, 0.3)); ir.scale.set(1, 1, 0.45);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 12), mat(0x080505, 0.2)); pu.scale.set(1, 1, 0.5); pu.position.z = 0.03;
    const hi = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); hi.position.set(0.03, 0.035, 0.06);
    iris.add(ir, pu, hi); iris.position.z = 0.045; g.add(white, iris);
    stick(g, x, y, -0.0); head.add(g); return { g, iris, white, s };
  });
  const brows = [-1, 1].map((s) => {
    const b = tag(new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.22, 4, 8), mat(0x14102a, 0.5)), "head");
    head.add(b); return { b, s };
  });
  const nose = tag(new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), mat(0xdc9c76, 0.55)), "nose");
  stick(nose, 0, -0.14, 0.05); nose.scale.set(1, 0.9, 0.85); head.add(nose);
  const noseBase = nose.scale.clone();
  const cheeks = [-1, 1].map((s) => { const c = new THREE.Mesh(new THREE.CircleGeometry(0.17, 24), blushMat); stick(c, s * 0.52, -0.24, 0.012); head.add(c); return c; });

  // mouth: a tube that hugs the face, teeth, and an opening
  const mouthG = new THREE.Group(); head.add(mouthG);
  const pts = []; for (let i = 0; i <= 18; i++) { const t = i / 18, x = (t - 0.5) * 0.6, y = -0.5 + 0.13 * (x / 0.3) ** 2 - 0.05; pts.push(new THREE.Vector3(x, y, surfZ(x, y) + 0.012)); }
  const smile = tag(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.03, 8), lipMat), "mouth"); mouthG.add(smile);
  const teeth = tag(new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 12), toothMat), "mouth"); teeth.scale.set(1.1, 0.16, 0.12); teeth.position.set(0, -0.545, surfZ(0, -0.545) + 0.005); mouthG.add(teeth);
  const openM = tag(new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), mat(0x7d1f3a, 0.5)), "mouth"); openM.scale.set(0.9, 0.01, 0.12); openM.position.set(0, -0.58, surfZ(0, -0.58) + 0.0); mouthG.add(openM);

  // ---- glasses
  const glassesG = new THREE.Group(); head.add(glassesG);
  const rings = [-1, 1].map((s) => {
    const r = tag(new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.034, 14, 48), blackMat), "glasses"); r.scale.y = 0.86;
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.25, 32), new THREE.MeshPhysicalMaterial({ color: 0xaad0ff, transparent: true, opacity: 0.1, roughness: 0.05, depthWrite: false })); lens.scale.y = 0.86; lens.position.z = 0;
    const g = new THREE.Group(); g.add(r, lens);
    const x = s * 0.4, y = 0.09; const n = normalAt(x, y); const z = surfZ(x, y);
    g.position.set(x + n.x * 0.13, y + n.y * 0.13, z + n.z * 0.13); g.lookAt(g.position.clone().add(n)); glassesG.add(g);
    return { g, s };
  });
  const bridge = tag(between(new THREE.Vector3(-0.15, 0.13, surfZ(0, 0.13) + 0.15), new THREE.Vector3(0.15, 0.13, surfZ(0, 0.13) + 0.15), 0.03, blackMat), "glasses"); glassesG.add(bridge);
  [-1, 1].forEach((s) => { const a = new THREE.Vector3(s * 0.66, 0.1, surfZ(0.66, 0.1) + 0.04); const b = new THREE.Vector3(s * 0.93, 0.06, -0.05); glassesG.add(tag(between(a, b, 0.024, blackMat), "glasses")); });

  // ---- neck, collar, shoulders, arms
  const neck = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.38, 0.9, 24), skinDark), "body"); neck.position.set(0, -1.1, -0.02); bodyG.add(neck);
  const collar = tag(new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.17, 18, 36), sweaterLight), "body"); collar.rotation.x = Math.PI / 2; collar.position.set(0, -1.18, 0.02); collar.scale.set(1, 1.05, 0.9); bodyG.add(collar);
  const shoulders = tag(new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 32), sweaterMat), "body"); shoulders.scale.set(1.12, 0.56, 0.72); shoulders.position.set(0, -2.15, -0.05); bodyG.add(shoulders);
  const arms = [-1, 1].map((s) => {
    const g = new THREE.Group(); g.position.set(s * 1.55, -1.95, 0);
    const upper = tag(new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 1.15, 8, 16), sweaterMat), "body"); upper.position.y = -0.62;
    const hand = tag(new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), skinMat), "body"); hand.position.y = -1.42; g.add(upper, hand); g.rotation.z = s * 0.12; bodyG.add(g); return { g, s };
  });

  // ---- outfits: starry (default) and Vermeer's pearl-earring girl
  const outfits = {
    starry: { hair: 0x1a1840, sweater: 0xb02c98, collar: 0xc84bb0, bunScale: 1, pearl: 0, stud: 1, tail: false },
    pearl: { hair: 0x2b5aa8, sweater: 0xa8742e, collar: 0xf0eadb, bunScale: 1.18, pearl: 1, stud: 0, tail: true }
  };
  let outfit = "starry"; const tgt = { hair: new THREE.Color(), sweater: new THREE.Color(), collar: new THREE.Color() };
  const setOutfit = (name) => { outfit = outfits[name] ? name : "starry"; const o = outfits[outfit]; tgt.hair.set(o.hair); tgt.sweater.set(o.sweater); tgt.collar.set(o.collar); tail.visible = o.tail; hook.visible = o.pearl > 0; stud.visible = !o.pearl; };
  setOutfit("starry");
  let pearlS = 0.001, bunS = 1;

  // ---- state, springs, mood
  const S = { px: new Spring(140, 9), py: new Spring(140, 9), pz: new Spring(160, 10), rx: new Spring(110, 8), ry: new Spring(110, 8), rz: new Spring(110, 7), sq: new Spring(170, 8), body: new Spring(130, 8), nose: new Spring(260, 10), bun: new Spring(90, 5), glassRz: new Spring(70, 6), glassY: new Spring(90, 7), mouthX: new Spring(180, 9, 1), brow: new Spring(120, 10), wave: new Spring(60, 5), reach: new Spring(40, 8) };
  const mood = { blush: 0, open: 0, cross: 0, closed: 0, sleepy: 0, giggle: 0, grumpy: 0, pull: 0, startle: 0 };
  let blinkT = rand(2, 4), blinkV = 0, lastAct = performance.now(), pokes = [], hoverMoves = [], waveT = 0, hasGreeted = false;
  const pointer = { x: 0, y: 0, nx: 0, ny: 0, inside: false, onModel: false };
  const raycaster = new THREE.Raycaster(); const ndc = new THREE.Vector2();
  let sayCooldown = 0;
  const say = (text, force) => { const n = performance.now(); if (!force && n < sayCooldown) return; sayCooldown = n + 700; onSay(text); };
  const heart = (n = 3, at) => { const p = (at || head.position).clone().project(camera); const r = renderer.domElement.getBoundingClientRect(); onHeart(((p.x + 1) / 2) * r.width, ((1 - p.y) / 2) * r.height, n); };

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false; controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minDistance = 4.5; controls.maxDistance = 12; controls.target.set(0, compact ? -0.3 : -0.35, 0);
  controls.minPolarAngle = 0.5; controls.maxPolarAngle = 2.4;
  controls.autoRotate = !reduceMotion && !compact; controls.autoRotateSpeed = 1.1;
  controls.enableZoom = !compact;
  controls.update();

  // ---- interaction
  const toNdc = (e) => { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); return r; };
  const hitTest = (e) => {
    toNdc(e); raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObject(root, true);
    for (const h of hits) { let o = h.object; while (o && !o.userData.part) o = o.parent; if (o && o.userData.part) return { part: o.userData.part, hit: h, obj: o }; }
    return null;
  };
  const poseLocal = (h) => head.worldToLocal(h.point.clone());
  const wake = () => { if (mood.sleepy > 0.3) { mood.startle = 1; say("oh! hi!", true); } lastAct = performance.now(); };
  const tooMuch = () => { const n = performance.now(); pokes = pokes.filter((t) => n - t < 4500); pokes.push(n); return pokes.length; };

  function react(r, kind = "poke") {
    wake(); const { part, hit } = r; const lp = poseLocal(hit); const n = tooMuch();
    const away = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 0, 1);
    S.pz.kick(-2.2); S.px.kick(-away.x * 1.4); S.py.kick(-away.y * 1.4); S.ry.kick(-away.x * 1.6); S.rx.kick(away.y * 1.4);
    if (n >= 6) { mood.grumpy = 1; mood.giggle = 0; say(pick(["okay okay, that is ENOUGH", "I am telling on you", "hey!! stop it"]), true); setTimeout(() => { mood.grumpy = 0; say("...fine, I forgive you", true); heart(4); }, 3200); return; }
    const isHead = part === "head";
    let kindPart = part;
    if (isHead) { if (Math.abs(lp.x) > 0.36 && lp.y < 0.1 && lp.y > -0.7) kindPart = "cheek"; else if (lp.y > 0.5) kindPart = "forehead"; else if (lp.y < -0.34 && Math.abs(lp.x) < 0.34) kindPart = "mouth"; }
    switch (kindPart) {
      case "nose": S.nose.kick(-9); mood.cross = 1; mood.blush = Math.min(1, mood.blush + 0.4); say(pick(["boop!", "boop boop", "my nose!"])); heart(2, hit.point); break;
      case "cheek": S.sq.kick(-3); mood.giggle = 1.4; mood.blush = Math.min(1, mood.blush + 0.5); say(pick(["hehe, stop!", "my cheeks!", "squish squish"])); heart(3, hit.point); break;
      case "mouth": S.mouthX.kick(-9); mood.open = 0.8; mood.blush += 0.3; say("mmph!"); break;
      case "forehead": mood.closed = 1; S.rx.kick(-2); say(pick(["ow, bonk", "hey, my forehead"])); break;
      case "glasses": S.glassRz.kick(rand(-14, 14)); S.glassY.kick(-3); say("my glasses!"); mood.closed = 0.5; setTimeout(() => { S.glassRz.t = 0; S.glassY.t = 0; }, 900); break;
      case "ear": mood.giggle = 1.4; S.rz.kick(rand(-5, 5)); mood.blush += 0.3; say("that tickles!!"); heart(2, hit.point); break;
      case "hair": S.rz.kick(rand(-3, 3)); say("careful, the hair!"); S.bun.kick(rand(-14, 14)); break;
      case "bun": S.bun.kick(rand(-28, 28)); S.rz.kick(rand(-2, 2)); say(pick(["not the bun!", "boing"])); break;
      case "eye": mood.closed = 1; S.rx.kick(-2); say("hey, not the eyes!"); break;
      default: S.body.kick(-6); waveT = 2.2; say(pick(["oh, hi!", "hello you"])); heart(2, hit.point);
    }
  }

  let drag = null;
  const onDown = (e) => {
    const r = hitTest(e); lastAct = performance.now(); wake();
    if (r) { controls.enabled = false; drag = { x: e.clientX, y: e.clientY, r, moved: false, t: performance.now(), cx: e.clientX, cy: e.clientY, part: r.part };
      try { renderer.domElement.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } } else { controls.enabled = !compact; }
    controls.autoRotate = false;
  };
  const onMove = (e) => {
    const rect = renderer.domElement.getBoundingClientRect(); pointer.x = e.clientX; pointer.y = e.clientY; pointer.inside = true;
    lastAct = performance.now();
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 7) { drag.moved = true; mood.pull = 1; say("wheee!", true); }
      if (drag.moved) { const k = compact ? 0.008 : 0.006; S.px.t = clamp(dx * k, -1.3, 1.3); S.py.t = clamp(-dy * k, -1.1, 1.1); S.rz.t = clamp(-dx * 0.003, -0.5, 0.5); S.sq.t = clamp(Math.hypot(dx, dy) * 0.0016, 0, 0.25); S.rx.t = clamp(dy * 0.002, -0.4, 0.4); }
      return;
    }
    const r = hitTest(e); pointer.onModel = !!r; renderer.domElement.style.cursor = r ? "pointer" : "grab";
    // tickling: lots of back-and-forth movement over her
    if (r) { const n = performance.now(); hoverMoves.push([n, Math.hypot(e.movementX || 0, e.movementY || 0)]); hoverMoves = hoverMoves.filter((m) => n - m[0] < 1100); const sum = hoverMoves.reduce((a, m) => a + m[1], 0); if (sum > 700 && mood.giggle < 0.3) { mood.giggle = 1.6; mood.blush = Math.min(1, mood.blush + 0.4); say(pick(["tickle tickle!", "hahaha stop!", "that tickles!"])); heart(2, r.hit.point); hoverMoves = []; } }
    const ndcx = ((e.clientX - rect.left) / rect.width) * 2 - 1, ndcy = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointer.nx = ndcx; pointer.ny = ndcy;
  };
  const onUp = () => {
    if (drag) {
      if (!drag.moved) { if (performance.now() - drag.t > 650 && drag.part === "head") { mood.giggle = 1; S.sq.kick(4); say("my cheeks are stretchy!"); } else react(drag.r); }
      else { S.px.t = 0; S.py.t = 0; S.rz.t = 0; S.sq.t = 0; S.rx.t = 0; S.sq.kick(-4); S.pz.kick(5); mood.pull = 0; say(pick(["boing!", "again again!"]), true); heart(3); }
      drag = null; controls.enabled = !compact;
    }
  };
  const onGlobalMove = (e) => {
    lastAct = performance.now(); const r = renderer.domElement.getBoundingClientRect();
    pointer.nx = clamp(((e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 260)) * 1.6, -2, 2); pointer.ny = clamp(-((e.clientY - (r.top + r.height * 0.4)) / Math.max(r.height, 260)) * 1.6, -2, 2);
    pointer.inside = true; pointer.gx = e.clientX; pointer.gy = e.clientY;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2; pointer.dist = Math.hypot(e.clientX - cx, e.clientY - cy) / Math.max(r.width, 200);
    if (mood.sleepy > 0.3) wake();
    if (!hasGreeted && pointer.dist < 0.9) { hasGreeted = true; waveT = 2.4; say("hi there!", true); }
  };
  const dom = renderer.domElement;
  dom.addEventListener("pointerdown", onDown, true); dom.addEventListener("pointermove", onMove); dom.addEventListener("pointerup", onUp); dom.addEventListener("pointercancel", onUp);
  dom.addEventListener("pointerleave", () => { pointer.onModel = false; dom.style.cursor = "grab"; });
  window.addEventListener("pointermove", onGlobalMove, { passive: true });
  const onDbl = () => { setOutfit(outfit === "starry" ? "pearl" : "starry"); say(outfit === "pearl" ? "ooh, a pearl!" : "back to the stars", true); heart(5); };
  dom.addEventListener("dblclick", onDbl);

  // ---- sizing, visibility
  const resize = () => { const w = el.clientWidth || 300, h = el.clientHeight || 340; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null; if (ro) ro.observe(el); resize();
  let visible = true; const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((en) => { visible = en[0].isIntersecting; }) : null; if (io) io.observe(el);

  // ---- loop
  const clock = new THREE.Clock(); let raf = 0, time = 0, running = true; const v3 = new THREE.Vector3();
  const loop = () => {
    raf = requestAnimationFrame(loop); if (!visible || document.hidden) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.05); time += dt; const now = performance.now();
    // idle: sleep
    const idle = (now - lastAct) / 1000; mood.sleepy += ((idle > 14 ? 1 : 0) - mood.sleepy) * Math.min(1, dt * 1.2);
    if (idle > 14 && Math.random() < dt * 0.25) onSay(pick(["zzz...", "zzz", "mmm... zzz"]));
    // blink
    blinkT -= dt; if (blinkT <= 0) { blinkV = 1; blinkT = rand(2.4, 5); }
    const blink = blinkV > 0 ? Math.sin((1 - blinkV) * Math.PI) : 0; if (blinkV > 0) blinkV = Math.max(0, blinkV - dt * 7);
    mood.giggle = Math.max(0, mood.giggle - dt * 0.8); mood.cross = Math.max(0, mood.cross - dt * 1.1); mood.closed = Math.max(0, mood.closed - dt * 1.6);
    mood.blush = Math.max(0, mood.blush - dt * 0.12); mood.open = Math.max(0, mood.open - dt * 1.6); mood.startle = Math.max(0, mood.startle - dt * 1.4);
    // look at the cursor (screen space, softened)
    const lookX = clamp(pointer.nx, -1.2, 1.2) * (1 - mood.sleepy), lookY = clamp(pointer.ny, -1, 1) * (1 - mood.sleepy);
    const giggleShake = Math.sin(time * 38) * mood.giggle * 0.05;
    S.ry.t = (drag && drag.moved ? S.ry.t : lookX * 0.45) + giggleShake; S.rx.t = drag && drag.moved ? S.rx.t : -lookY * 0.22 + mood.sleepy * 0.3 + mood.grumpy * 0.1;
    S.rz.t = drag && drag.moved ? S.rz.t : -0.17 + mood.sleepy * -0.06 + Math.sin(time * 0.9) * 0.015;
    Object.values(S).forEach((s) => s.step(dt));
    // head transform
    const bob = Math.sin(time * 1.6) * 0.02 * (1 - mood.sleepy);
    head.position.set(S.px.x, 0.2 + S.py.x + bob - mood.sleepy * 0.05, S.pz.x);
    head.rotation.set(S.rx.x, S.ry.x, S.rz.x);
    head.scale.set(1 + S.sq.x - mood.giggle * 0.01, 1 - S.sq.x * 0.6 + Math.sin(time * 40) * mood.giggle * 0.01, 1);
    bunG.rotation.z = S.bun.x * 0.05; bunG.rotation.x = S.bun.x * 0.02;
    const o = outfits[outfit]; bunS += (o.bunScale - bunS) * Math.min(1, dt * 4); bunG.scale.setScalar(bunS);
    pearlS += (o.pearl * 1 - pearlS + 0.001) * Math.min(1, dt * 5); pearl.scale.setScalar(Math.max(0.001, pearlS)); stud.scale.setScalar(o.stud ? 1 : 0.001);
    hairMat.color.lerp(tgt.hair, Math.min(1, dt * 4)); sweaterMat.color.lerp(tgt.sweater, Math.min(1, dt * 4)); sweaterLight.color.lerp(tgt.collar, Math.min(1, dt * 4));
    // body
    root.rotation.y = 0; bodyG.position.y = S.body.x * 0.1; bodyG.scale.set(1, 1 + S.body.x * 0.03, 1);
    // eyes
    const eyeClose = clamp(Math.max(blink, mood.closed, mood.sleepy * 0.85) , 0, 1);
    eyes.forEach((e) => {
      e.g.scale.set(1 + mood.startle * 0.12, Math.max(0.07, 1 - eyeClose * 0.93 + mood.startle * 0.15), 1);
      const lx = clamp(lookX, -1, 1) * 0.055 * (1 - mood.cross) - e.s * mood.cross * 0.04, ly = clamp(lookY, -1, 1) * 0.04 * (1 - mood.cross);
      e.iris.position.x = lx; e.iris.position.y = ly;
    });
    // brows
    brows.forEach((b) => { const raise = 0.38 + mood.startle * 0.09 - mood.grumpy * 0.07 - mood.sleepy * 0.03 + Math.max(0, mood.giggle) * 0.03; const x = b.s * 0.4; const tilt = (b.s > 0 ? 1 : -1) * (0.12 + mood.grumpy * 0.45 - mood.startle * 0.1); stick(b.b, x, raise, 0.015); b.b.rotateZ(Math.PI / 2 + tilt); });
    // mouth
    const smileW = 1 + mood.giggle * 0.1 + (pointer.onModel ? 0.05 : 0) - mood.grumpy * 0.25 + (S.mouthX.x - 1); mouthG.scale.set(clamp(smileW, 0.5, 1.4), 1 - mood.grumpy * 0.9, 1);
    mouthG.rotation.z = mood.grumpy ? Math.PI * 0.0 : 0; smile.position.y = mood.grumpy ? -0.12 : 0; smile.rotation.x = 0;
    const open = clamp(mood.open + mood.giggle * 0.35 + mood.startle * 0.4 + (mood.pull ? 0.5 : 0) + Math.abs(Math.sin(time * 10)) * mood.giggle * 0.2, 0, 1);
    openM.scale.y = 0.01 + open * 0.17; openM.position.y = -0.58 - open * 0.03; teeth.scale.y = 0.16 * (1 - open * 0.6);
    // cheeks blush
    blushMat.opacity = 0.18 + clamp(mood.blush, 0, 1) * 0.5;
    // nose
    nose.scale.set(noseBase.x * (1 + S.nose.x * 0.35), noseBase.y * (1 + S.nose.x * 0.35), noseBase.z * (1 + S.nose.x * 0.35));
    // glasses
    glassesG.rotation.z = S.glassRz.x * 0.04; glassesG.position.y = S.glassY.x * 0.03;
    // arms: wave on hello, reach toward the cursor when close
    waveT = Math.max(0, waveT - dt); const reaching = !waveT && pointer.dist != null && pointer.dist < 1.1 && pointer.dist > 0.45 && !compact;
    arms.forEach((a) => {
      let z = a.s * 0.12, x = 0;
      if (a.s === 1 && waveT > 0) { z = 2.5 + Math.sin(time * 11) * 0.28; }
      else if (a.s === 1 && reaching) { z = 1.05 + clamp(pointer.ny, -1, 1) * 0.5; x = 0; }
      a.g.rotation.z += (z - a.g.rotation.z) * Math.min(1, dt * 7); a.g.rotation.x += (x - a.g.rotation.x) * Math.min(1, dt * 5);
    });
    controls.update(); renderer.render(scene, camera);
  };
  loop();

  return {
    setOutfit: (n) => { setOutfit(n); },
    getOutfit: () => outfit,
    setAutoSpin: (on) => { controls.autoRotate = !!on && !reduceMotion; },
    say: (t) => say(t, true),
    wave: () => { waveT = 2.4; },
    reactAt: (x, y) => { const r = hitTest({ clientX: x, clientY: y }); if (r) react(r); },
    dispose: () => {
      running = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); if (io) io.disconnect();
      window.removeEventListener("pointermove", onGlobalMove); controls.dispose();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose()); } });
      renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}
