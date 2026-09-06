import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export default function InteractiveBackground({ theme, paused }) {
  const mountRef = useRef(null);
  const sceneState = useRef({ theme, paused });

  useEffect(() => {
    sceneState.current.theme = theme;
    sceneState.current.paused = paused;
    sceneState.current.render?.();
  }, [theme, paused]);

  useEffect(() => {
    const mount = mountRef.current;
    const state = sceneState.current;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return undefined;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 12);
    const world = new THREE.Group();
    scene.add(world);
    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const pointerWorld = new THREE.Vector3(30, 30, 0);
    const ripple = { x: 30, y: 30, age: 10 };
    const geometries = [];
    const materials = [];
    const forms = [];
    let frame = 0;
    let lastTime = 0;
    let time = 0;
    let scroll = window.scrollY;
    let progress = 0;
    let disposed = false;

    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xc87650,
      transparent: true,
      opacity: 0.23,
      depthWrite: false,
    });
    const sageMaterial = new THREE.LineBasicMaterial({
      color: 0x8a9872,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    materials.push(wireMaterial, sageMaterial);

    // Sculptural loops sit in the margins, framing the content as the page moves.
    const addForm = (geometry, material, position, scale, speed) => {
      const edges = new THREE.WireframeGeometry(geometry);
      const form = new THREE.LineSegments(edges, material);
      form.position.set(...position);
      form.scale.setScalar(scale);
      world.add(form);
      geometries.push(geometry, edges);
      forms.push({ mesh: form, base: new THREE.Vector3(...position), speed });
    };
    addForm(
      new THREE.TorusKnotGeometry(1, 0.23, 110, 7, 2, 3),
      wireMaterial,
      [4.6, 0.45, -2],
      1.9,
      0.12,
    );
    addForm(
      new THREE.IcosahedronGeometry(0.65, 0),
      sageMaterial,
      [-5.5, -2.2, 0],
      1.2,
      -0.17,
    );
    addForm(
      new THREE.TorusGeometry(0.5, 0.11, 6, 40),
      wireMaterial,
      [-4.8, 2.9, -1],
      0.8,
      0.2,
    );
    addForm(
      new THREE.OctahedronGeometry(0.45, 0),
      sageMaterial,
      [5.1, -2.8, 1],
      0.9,
      -0.22,
    );

    // A layered ribbon field gives the background continuous, gentle movement.
    const strandCount = 16;
    const pointsPerStrand = 85;
    const ribbonPositions = new Float32Array(
      strandCount * (pointsPerStrand - 1) * 6,
    );
    const ribbonGeometry = new THREE.BufferGeometry();
    ribbonGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(ribbonPositions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    const ribbonMaterial = new THREE.LineBasicMaterial({
      color: 0x9aab86,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });
    const ribbons = new THREE.LineSegments(ribbonGeometry, ribbonMaterial);
    ribbons.frustumCulled = false;
    world.add(ribbons);
    geometries.push(ribbonGeometry);
    materials.push(ribbonMaterial);

    const particleCount = 75;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSeeds = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.sin(i * 127.1) * 8,
      y: Math.cos(i * 311.7) * 5,
      z: Math.sin(i * 43.3) * 2 - 2,
      speed: 0.2 + (i % 7) * 0.08,
    }));
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xbf7050,
      size: 0.028,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.frustumCulled = false;
    world.add(particles);
    geometries.push(particleGeometry);
    materials.push(particleMaterial);

    const update = (delta) => {
      time += delta;
      ripple.age += delta;
      const dark = state.theme === "dark";
      wireMaterial.color.set(dark ? 0xf6a07e : 0xc87650);
      const readingFade = 1 - Math.min(scroll / innerHeight, 1) * 0.65;
      wireMaterial.opacity = (dark ? 0.22 : 0.23) * readingFade;
      sageMaterial.opacity = 0.25 * readingFade;
      sageMaterial.color.set(dark ? 0xadc394 : 0x8a9872);
      ribbonMaterial.color.set(dark ? 0x8b9f79 : 0x9aab86);
      ribbonMaterial.opacity = dark ? 0.12 : 0.15;
      particleMaterial.color.set(dark ? 0xe3b899 : 0xbf7050);
      smoothPointer.lerp(pointer, 0.045);
      world.rotation.y = smoothPointer.x * 0.055;
      world.rotation.x = -smoothPointer.y * 0.035;
      forms.forEach(({ mesh, base, speed }, i) => {
        mesh.rotation.x = time * speed * 0.7 + progress * 1.8;
        mesh.rotation.y = time * speed + smoothPointer.x * 0.3;
        mesh.rotation.z = Math.sin(time * 0.17 + i) * 0.3 + progress * 0.6;
        mesh.position.y =
          base.y +
          Math.sin(time * 0.35 + i * 2) * 0.22 +
          Math.sin(progress * Math.PI * 2 + i) * 0.5;
        mesh.position.x = base.x + smoothPointer.x * (i % 2 ? 0.15 : -0.15);
      });
      let offset = 0;
      for (let strand = 0; strand < strandCount; strand++) {
        for (let segment = 0; segment < pointsPerStrand - 1; segment++) {
          for (let end = 0; end < 2; end++) {
            const x = ((segment + end) / (pointsPerStrand - 1)) * 21 - 10.5;
            let y =
              -2.5 +
              strand * 0.095 +
              Math.sin(x * 0.38 + time * 0.16 + strand * 0.065) * 0.75 +
              Math.sin(x * 0.17 - time * 0.1) * 0.45;
            const distance = Math.hypot(x - pointerWorld.x, y - pointerWorld.y);
            y += Math.exp(-distance * distance * 0.45) * 0.45;
            if (ripple.age < 4) {
              const rippleDistance = Math.hypot(x - ripple.x, y - ripple.y);
              y +=
                Math.sin(rippleDistance * 3 - ripple.age * 4) *
                Math.exp(-Math.abs(rippleDistance - ripple.age * 2)) *
                (1 - ripple.age / 4) *
                0.22;
            }
            ribbonPositions[offset++] = x;
            ribbonPositions[offset++] = y + Math.sin(progress * 5) * 0.3;
            ribbonPositions[offset++] =
              -3 + Math.sin(x * 0.25 + time * 0.1) * 0.4;
          }
        }
      }
      ribbonGeometry.attributes.position.needsUpdate = true;
      particleSeeds.forEach((seed, i) => {
        let x = seed.x + Math.sin(time * seed.speed * 0.2 + i) * 0.25;
        let y = seed.y + Math.cos(time * seed.speed * 0.25 + i) * 0.2;
        const dx = x - pointerWorld.x;
        const dy = y - pointerWorld.y;
        const force = Math.exp(-(dx * dx + dy * dy) * 0.8) * 0.4;
        x += dx * force;
        y += dy * force;
        particlePositions.set([x, y, seed.z], i * 3);
      });
      particleGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const canAnimate = () =>
      !state.paused && !reducedMotion.matches && !document.hidden;
    const animate = (timestamp) => {
      frame = 0;
      if (disposed) return;
      const delta = lastTime
        ? Math.min((timestamp - lastTime) / 1000, 0.05)
        : 0;
      lastTime = timestamp;
      update(canAnimate() ? delta : 0);
      if (canAnimate()) frame = requestAnimationFrame(animate);
    };
    const render = () => {
      if (disposed) return;
      if (!canAnimate()) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        update(0);
      } else if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(animate);
      }
    };
    const resize = () => {
      const width = document.documentElement.clientWidth;
      const height = innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Narrow screens keep the larger sculpture at the edge of the portrait.
      forms[0].base.x = width < 600 ? 2.1 : width < 1000 ? 3.2 : 4.6;
      forms[0].mesh.position.x = forms[0].base.x;
      forms[0].mesh.scale.setScalar(width < 600 ? 1.1 : 1.9);
      render();
    };
    const onPointer = (event) => {
      if (!canAnimate()) return;
      pointer.set(
        (event.clientX / innerWidth) * 2 - 1,
        -(event.clientY / innerHeight) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(pointerPlane, pointerWorld);
    };
    const onClick = (event) => {
      if (!canAnimate() || event.target.closest("button, a, summary, dialog"))
        return;
      onPointer(event);
      ripple.x = pointerWorld.x;
      ripple.y = pointerWorld.y;
      ripple.age = 0;
    };
    const onScroll = () => {
      scroll = window.scrollY;
      if (canAnimate())
        progress =
          scroll /
          Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    };
    state.render = render;
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", onPointer, { passive: true });
    addEventListener("pointerdown", onClick, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", render);
    reducedMotion.addEventListener("change", render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      delete state.render;
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onPointer);
      removeEventListener("pointerdown", onClick);
      removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", render);
      reducedMotion.removeEventListener("change", render);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="interactive-background" ref={mountRef} aria-hidden="true" />
  );
}
InteractiveBackground.propTypes = {
  theme: PropTypes.string.isRequired,
  paused: PropTypes.bool.isRequired,
};
