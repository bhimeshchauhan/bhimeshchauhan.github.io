import React, { useEffect, useRef, useState } from "react";

// Places from the blog and experience data: Vancouver, Toronto, Boston, Mexico City, Lima, Barcelona, Mumbai, Tokyo.
const PLACES = [
  [49.28, -123.12], [43.65, -79.38], [42.36, -71.06], [19.43, -99.13],
  [-12.05, -77.04], [41.39, 2.17], [19.08, 72.88], [35.68, 139.69],
];

// Draggable 3D globe. Falls back to a note when WebGL is unavailable.
const Globe = () => {
  const mount = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (disposed || !mount.current) return;
      const el = mount.current;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch (e) {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 0.1, 100);
      camera.position.set(0, 0.5, 6.8);

      const group = new THREE.Group();
      scene.add(group);
      const R = 1.6;
      group.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.995, 48, 32), new THREE.MeshBasicMaterial({ color: 0x0b0d16 })));
      const ringMat = new THREE.LineBasicMaterial({ color: 0x7c8cff, transparent: true, opacity: 0.32 });
      const ring = (pts) => group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
      for (let lat = -60; lat <= 60; lat += 30) {
        const r = R * Math.cos((lat * Math.PI) / 180), y = R * Math.sin((lat * Math.PI) / 180);
        ring(Array.from({ length: 96 }, (_, i) => new THREE.Vector3(r * Math.cos((i / 96) * Math.PI * 2), y, r * Math.sin((i / 96) * Math.PI * 2))));
      }
      for (let lon = 0; lon < 180; lon += 30) {
        const a0 = (lon * Math.PI) / 180;
        ring(Array.from({ length: 96 }, (_, i) => { const t = (i / 96) * Math.PI * 2; return new THREE.Vector3(R * Math.cos(t) * Math.cos(a0), R * Math.sin(t), R * Math.cos(t) * Math.sin(a0)); }));
      }
      const toVec = (lat, lon, r) => {
        const phi = ((90 - lat) * Math.PI) / 180, th = ((lon + 180) * Math.PI) / 180;
        return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
      };
      const dots = [];
      PLACES.forEach(([lat, lon]) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffb454 }));
        m.position.copy(toVec(lat, lon, R * 1.01));
        group.add(m);
        dots.push(m);
      });
      // Arcs between consecutive places
      for (let i = 0; i < PLACES.length - 1; i++) {
        const a = toVec(...PLACES[i], R), b = toVec(...PLACES[i + 1], R);
        const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.35);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), new THREE.LineBasicMaterial({ color: 0xffb454, transparent: true, opacity: 0.45 })));
      }
      group.rotation.x = 0.35;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      controls.autoRotateSpeed = 1.1;

      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener("resize", onResize);
      let raf, t = 0;
      const loop = () => {
        t += 0.03;
        dots.forEach((d, i) => d.scale.setScalar(1 + 0.35 * Math.sin(t + i)));
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      loop();
      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
    })();
    return () => { disposed = true; cleanup(); };
  }, []);

  if (failed) return <p style={{ color: "#a3a8b8", textAlign: "center", padding: "2rem" }}>The 3D globe needs WebGL.</p>;
  return <div ref={mount} style={{ width: "100%", height: "100%", cursor: "grab" }} aria-label="3D globe with places I have worked and traveled. Drag to rotate." role="img" />;
};

export default Globe;
