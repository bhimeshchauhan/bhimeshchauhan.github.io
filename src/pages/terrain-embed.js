import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

// Procedural terrain: fractal value noise -> height-mapped mesh, lit and coloured by elevation.
// Drag to orbit, scroll to zoom. Loaded in an iframe from the Projects page.
const TerrainEmbed = () => {
  const mount = useRef(null);

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
        renderer = new THREE.WebGLRenderer({ antialias: true });
      } catch (e) {
        el.innerHTML = '<p style="color:#a3a8b8;font:16px sans-serif;padding:2rem;text-align:center">This demo needs WebGL, which is not available in this browser.</p>';
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0d0f11);
      scene.fog = new THREE.Fog(0x0d0f11, 40, 110);
      const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 300);
      camera.position.set(0, 30, 62);

      // Deterministic hash-based value noise with smooth interpolation, summed over octaves.
      const hash = (x, y) => {
        const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
        return s - Math.floor(s);
      };
      const smooth = (t) => t * t * (3 - 2 * t);
      const vnoise = (x, y) => {
        const xi = Math.floor(x), yi = Math.floor(y);
        const xf = smooth(x - xi), yf = smooth(y - yi);
        const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
        return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
      };
      const fbm = (x, y) => {
        let amp = 1, freq = 1, sum = 0, norm = 0;
        for (let o = 0; o < 5; o++) {
          sum += vnoise(x * freq, y * freq) * amp;
          norm += amp;
          amp *= 0.5;
          freq *= 2;
        }
        return sum / norm;
      };

      const SIZE = 80, SEG = 160, HEIGHT = 16;
      const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      const low = new THREE.Color(0x3b4bd8), mid = new THREE.Color(0x7c3aed), high = new THREE.Color(0xffb454), tmp = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const h = Math.pow(fbm(pos.getX(i) * 0.05 + 7, pos.getZ(i) * 0.05 + 3), 1.6);
        pos.setY(i, h * HEIGHT * 1.5);
        const t = Math.min(1, h * 2.2);
        if (t < 0.5) tmp.copy(low).lerp(mid, t * 2);
        else tmp.copy(mid).lerp(high, (t - 0.5) * 2);
        colors.set([tmp.r, tmp.g, tmp.b], i * 3);
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true }));
      scene.add(mesh);
      const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 }));
      scene.add(wire);
      scene.add(new THREE.HemisphereLight(0x9fb4ff, 0x1a1030, 0.9));
      const sun = new THREE.DirectionalLight(0xffd9a0, 1.6);
      sun.position.set(30, 40, 20);
      scene.add(sun);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      controls.autoRotateSpeed = 0.6;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.target.set(0, 4, 0);

      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener("resize", onResize);

      let raf;
      const loop = () => {
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        controls.dispose();
        geo.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, follow" />
        <title>Procedural Terrain demo</title>
        <style>{`html,body{margin:0;background:#0d0f11;overflow:hidden}`}</style>
      </Helmet>
      <div ref={mount} style={{ width: "100vw", height: "100vh" }} aria-label="Interactive procedural terrain. Drag to orbit." />
    </>
  );
};

export default TerrainEmbed;
