import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function RealTreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, innerWidth / innerHeight, .1, 100);
    camera.position.set(0, .2, 7.2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const treePivot = new THREE.Group();
    treePivot.position.set(0, -2.55, -1.7);
    scene.add(treePivot);
    let loadedTree = null;

    new GLTFLoader().load("/models/realistic-tree.glb", ({ scene: model }) => {
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.sub(center);
      model.position.y += size.y * .5;
      model.scale.setScalar(4.9 / size.y);
      model.traverse(child => {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
        const isLeaf = child.material?.name?.toLowerCase().includes("green");
        child.material = new THREE.MeshPhysicalMaterial({ color: isLeaf ? 0x365e26 : 0x5a3926, roughness: isLeaf ? .74 : .96, metalness: 0, clearcoat: isLeaf ? .12 : .02, side: THREE.DoubleSide, emissive: isLeaf ? 0x071807 : 0x100704, emissiveIntensity: .16 });
      });
      loadedTree = model;
      treePivot.add(model);
    });

    const vineGroup = new THREE.Group();
    treePivot.add(vineGroup);
    const vineMaterial = new THREE.MeshPhysicalMaterial({ color: 0x244d20, roughness: .77, clearcoat: .16 });
    const leafMaterial = new THREE.MeshPhysicalMaterial({ color: 0x477b35, roughness: .68, clearcoat: .2, side: THREE.DoubleSide });
    const vineGeometries = [];
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0); leafShape.bezierCurveTo(.16, .04, .18, .23, 0, .34); leafShape.bezierCurveTo(-.18, .23, -.16, .04, 0, 0);
    const leafGeometry = new THREE.ShapeGeometry(leafShape, 5);
    vineGeometries.push(leafGeometry);
    for (let vineIndex = 0; vineIndex < 3; vineIndex += 1) {
      const curvePoints = [];
      for (let step = 0; step <= 36; step += 1) {
        const y = step / 36 * 3.75 + .1;
        const angle = step * .43 + vineIndex * 2.1;
        const radius = .22 + y * .055;
        curvePoints.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
      }
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const geometry = new THREE.TubeGeometry(curve, 100, .026, 7, false);
      const vine = new THREE.Mesh(geometry, vineMaterial);
      vine.castShadow = true; vineGroup.add(vine); vineGeometries.push(geometry);
      for (let leafIndex = 3; leafIndex < 34; leafIndex += 4) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.copy(curve.getPoint(leafIndex / 36));
        leaf.rotation.set(0, leafIndex * .43 + vineIndex, vineIndex % 2 ? -.55 : .55);
        leaf.scale.setScalar(.58 + (leafIndex % 3) * .08);
        leaf.castShadow = true; vineGroup.add(leaf);
      }
    }

    const sparkCount = 260;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkSeeds = Array.from({ length: sparkCount }, (_, index) => ({ angle: index * 2.399, height: 2.25 + index % 8 * .28, radius: .45 + index % 6 * .12, speed: .45 + index % 5 * .08 }));
    const sparkGeometry = new THREE.BufferGeometry();
    sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkleCanvas = document.createElement("canvas");
    sparkleCanvas.width = 64; sparkleCanvas.height = 64;
    const ctx = sparkleCanvas.getContext("2d");
    const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 31);
    glow.addColorStop(0, "#fff"); glow.addColorStop(.12, "#fff"); glow.addColorStop(.34, "rgba(210,255,126,.85)"); glow.addColorStop(1, "rgba(150,255,80,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, 64, 64); ctx.fillStyle = "#fff"; ctx.fillRect(30, 3, 4, 58); ctx.fillRect(3, 30, 58, 4);
    const sparkleTexture = new THREE.CanvasTexture(sparkleCanvas);
    const sparkMaterial = new THREE.PointsMaterial({ color: 0xe3ff9a, size: .13, map: sparkleTexture, transparent: true, opacity: .95, blending: THREE.AdditiveBlending, depthWrite: false });
    const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
    treePivot.add(sparks);

    scene.add(new THREE.HemisphereLight(0xd8edff, 0x181108, 1.7));
    const sun = new THREE.DirectionalLight(0xfff0d2, 3.5);
    sun.position.set(4, 6, 5); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun);
    const rim = new THREE.PointLight(0x83d46b, 13, 16); rim.position.set(-4, 2, 3); scene.add(rim);

    let pointerX = 0, pointerY = 0, currentScroll = scrollY, pulse = 0, frame;
    const pointer = event => { pointerX = event.clientX / innerWidth - .5; pointerY = event.clientY / innerHeight - .5; };
    const scroll = () => { currentScroll = scrollY; };
    const resize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    const energy = () => { pulse = 1; };
    addEventListener("pointermove", pointer, { passive: true }); addEventListener("scroll", scroll, { passive: true }); addEventListener("resize", resize); addEventListener("portfolio-energy", energy);
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      const maxScroll = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      const progress = Math.min(currentScroll / maxScroll, 1);
      pulse *= .94;
      const targetRotation = progress * Math.PI * 2 + pointerX * .2;
      treePivot.rotation.y += (targetRotation - treePivot.rotation.y) * .035;
      treePivot.rotation.x += (-pointerY * .035 - treePivot.rotation.x) * .02;
      treePivot.position.y = -2.55 - progress * .15 + Math.sin(time * .5) * .025;
      vineGroup.rotation.y = Math.sin(time * .42) * .025;
      if (loadedTree) loadedTree.rotation.z = Math.sin(time * .35) * .003;
      for (let index = 0; index < sparkCount; index += 1) {
        const offset = index * 3;
        const threshold = index / sparkCount * .88;
        if (progress < threshold) { sparkPositions[offset + 1] = -20; continue; }
        const seed = sparkSeeds[index];
        const travel = ((progress - threshold) * 9 + time * .12 * seed.speed + index % 11 * .06) % 1;
        sparkPositions[offset] = Math.cos(seed.angle) * (seed.radius + travel * 1.15) + Math.sin(time * 5 + index) * .04;
        sparkPositions[offset + 1] = seed.height + travel * 1.75;
        sparkPositions[offset + 2] = Math.sin(seed.angle) * (seed.radius + travel * .75);
      }
      sparkGeometry.attributes.position.needsUpdate = true;
      sparkMaterial.size = .11 + progress * .08 + pulse * .11;
      sparkMaterial.opacity = .76 + Math.sin(time * 6) * .16;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", pointer); removeEventListener("scroll", scroll); removeEventListener("resize", resize); removeEventListener("portfolio-energy", energy);
      if (loadedTree) loadedTree.traverse(child => { if (child.isMesh) { child.geometry?.dispose(); child.material?.dispose(); } });
      vineGeometries.forEach(geometry => geometry.dispose()); vineMaterial.dispose(); leafMaterial.dispose(); sparkGeometry.dispose(); sparkMaterial.dispose(); sparkleTexture.dispose(); renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="webgl-scene" ref={mountRef} aria-hidden="true" />;
}

export default RealTreeScene;
