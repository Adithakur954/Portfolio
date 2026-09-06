import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// A procedural network world with scroll-driven camera travel and raycast interactions.
export default function Workbench({
  phase,
  progressRef,
  paused,
  equipment,
  onInspect,
  onReady
}) {
  const mountRef = useRef(null);
  const state = useRef({
    phase,
    paused,
    equipment,
    onInspect,
    onReady
  });
  useEffect(() => {
    Object.assign(state.current, {
      phase,
      paused,
      equipment,
      onInspect,
      onReady
    });
    state.current.render?.();
  }, [phase, paused, equipment, onInspect, onReady]);
  useEffect(() => {
    const mount = mountRef.current;
    const current = state.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        powerPreference: 'low-power'
      });
    } catch {
      current.onReady(false);
      return undefined;
    }
    const gl = renderer.getContext();
    const rendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const softwareRendering = rendererInfo && /swiftshader|llvmpipe|software/i.test(gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL));
    renderer.setPixelRatio(softwareRendering ? .85 : Math.min(devicePixelRatio, innerWidth < 700 ? 1 : 1.35));
    renderer.shadowMap.enabled = !softwareRendering;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#05070c');
    scene.fog = new THREE.FogExp2('#05070c', .026);
    const camera = new THREE.PerspectiveCamera(48, 1, .1, 130);
    const workspace = new THREE.Group();
    scene.add(workspace);
    const resources = new Set();
    const material = (color, extra = {}) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: .48,
        metalness: .25,
        ...extra
      });
      resources.add(mat);
      return mat;
    };
    const dark = material('#101725', {
      metalness: .65,
      roughness: .32
    });
    const metal = material('#40506b', {
      metalness: .8,
      roughness: .27
    });
    const black = material('#080e12');
    const teal = material('#79c9ff', {
      emissive: '#368aff',
      emissiveIntensity: 3
    });
    const amber = material('#ffa78e', {
      emissive: '#ff6348',
      emissiveIntensity: 2.6
    });
    const mesh = (geometry, mat, position, parent = workspace) => {
      resources.add(geometry);
      const object = new THREE.Mesh(geometry, mat);
      object.position.set(...position);
      object.castShadow = true;
      object.receiveShadow = true;
      parent.add(object);
      return object;
    };
    const box = (size, mat, pos, parent) => mesh(new THREE.BoxGeometry(...size), mat, pos, parent);
    const cylinder = (r1, r2, h, mat, pos, parent) => mesh(new THREE.CylinderGeometry(r1, r2, h, 32), mat, pos, parent);
    const group = (id, pos) => {
      const g = new THREE.Group();
      g.userData.id = id;
      g.position.set(...pos);
      workspace.add(g);
      return g;
    };
    const woodCanvas = document.createElement('canvas');
    woodCanvas.width = 512;
    woodCanvas.height = 128;
    const wood = woodCanvas.getContext('2d');
    wood.fillStyle = '#18212e';
    wood.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 160; i++) {
      wood.strokeStyle = `rgba(110,153,192,${.05 + i % 5 * .02})`;
      wood.beginPath();
      wood.moveTo(0, i);
      wood.bezierCurveTo(140, i - 4, 300, i + 5, 512, i);
      wood.stroke();
    }
    const woodTexture = new THREE.CanvasTexture(woodCanvas);
    resources.add(woodTexture);
    const desktop = material('#657a91', {
      map: woodTexture,
      roughness: .34,
      metalness: .6
    });
    box([6.2, .2, 3.5], desktop, [0, -.5, 0]);
    box([6.18, .045, 3.48], black, [0, -.63, 0]);
    for (const x of [-2.55, 2.55]) {
      box([.13, 1.55, .13], metal, [x, -1.35, -1.1]);
      box([.13, 1.55, .13], metal, [x, -1.35, 1.1]);
      box([.15, .1, 2.4], metal, [x, -2.08, 0]);
    }
    box([3.4, .025, 1.4], material('#12282b', {
      roughness: .95
    }), [-.35, -.38, .65]);
    const monitor = group('monitor', [-.5, -.4, -.65]);
    box([.8, .07, .52], metal, [0, .035, 0], monitor);
    box([.14, .7, .14], metal, [0, .38, -.1], monitor);
    box([3.05, 1.88, .16], dark, [0, 1.48, 0], monitor);
    box([2.86, 1.67, .025], black, [0, 1.49, .095], monitor);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 600;
    const ctx = screenCanvas.getContext('2d');
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    resources.add(screenTexture);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture
    });
    resources.add(screenMat);
    mesh(new THREE.PlaneGeometry(2.81, 1.62), screenMat, [0, 1.49, .114], monitor);
    box([.08, .017, .01], teal, [1.33, .59, .09], monitor);
    const keyboard = group('keyboard', [-.6, -.34, .78]);
    box([2.1, .09, .73], dark, [0, 0, 0], keyboard);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 13; col++) {
      box([.13, .055, .12], (col + row) % 9 === 0 ? teal : metal, [col * .153 - .92, .07, row * .155 - .23], keyboard);
    }
    box([.65, .05, .1], metal, [0, .075, .31], keyboard);
    const mouse = mesh(new THREE.SphereGeometry(.2, 24, 16), dark, [1.05, -.28, .8], keyboard.parent);
    mouse.scale.set(.7, .42, 1.1);
    mouse.userData.id = 'keyboard';
    const server = group('server', [2.05, -.4, -.63]);
    const trays = [];
    for (let i = 0; i < 3; i++) {
      const tray = new THREE.Group();
      tray.position.y = .17 + i * .36;
      server.add(tray);
      trays.push(tray);
      box([.87, .31, 1.03], dark, [0, 0, 0], tray);
      for (let j = 0; j < 6; j++) box([.39, .018, .012], metal, [-.12, -.1 + j * .038, .522], tray);
      cylinder(.024, .024, .025, teal, [.3, .07, .52], tray).rotation.x = Math.PI / 2;
    }
    const globe = group('globe', [1.95, 1.15, -.65]);
    const globeMat = material('#59c5b9', {
      wireframe: true,
      emissive: '#1b847c',
      emissiveIntensity: .65
    });
    mesh(new THREE.SphereGeometry(.47, 20, 12), globeMat, [0, 0, 0], globe);
    const ring = mesh(new THREE.TorusGeometry(.62, .014, 8, 64), amber, [0, 0, 0], globe);
    ring.rotation.x = 1.13;
    for (let i = 0; i < 7; i++) {
      const a = i * 2.399;
      mesh(new THREE.SphereGeometry(.035, 8, 8), teal, [Math.cos(a) * .49, Math.sin(a * 2) * .2, Math.sin(a) * .43], globe);
    }
    const lamp = group('lamp', [-2.48, -.4, -.83]);
    cylinder(.29, .33, .09, dark, [0, .045, 0], lamp);
    cylinder(.035, .035, 2.38, metal, [0, 1.23, 0], lamp);
    const shade = cylinder(.18, .43, .28, dark, [.27, 2.39, 0], lamp);
    shade.rotation.z = -.3;
    cylinder(.38, .38, .015, amber, [.3, 2.26, 0], lamp);
    const lampLight = new THREE.PointLight('#ffc58d', 12, 7, 2);
    lampLight.position.set(-2.1, 1.62, -.7);
    workspace.add(lampLight);
    const mug = group('mug', [-2.25, -.38, .8]);
    cylinder(.18, .16, .37, material('#d1d3c7', {
      roughness: .3
    }), [0, .18, 0], mug);
    cylinder(.151, .151, .008, material('#26140d'), [0, .37, 0], mug);
    mesh(new THREE.TorusGeometry(.14, .04, 10, 24), material('#d1d3c7'), [.2, .2, 0], mug);
    const floor = mesh(new THREE.PlaneGeometry(200, 200), material('#070c16', {
      roughness: .25,
      metalness: .65
    }), [0, -2.15, 0]);
    floor.rotation.x = -Math.PI / 2;
    const grid = new THREE.GridHelper(100, 100, '#18273a', '#111e30');
    grid.position.y = -2.14;
    scene.add(grid);
    resources.add(grid.geometry);
    resources.add(grid.material);
    scene.add(new THREE.HemisphereLight('#99c0ff', '#070b18', 1.8));
    const key = new THREE.DirectionalLight('#abc9ff', 2.6);
    key.position.set(2, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.normalBias = .025;
    scene.add(key);
    const rim = new THREE.PointLight('#9163ff', 45, 20);
    rim.position.set(3, 2, -2);
    scene.add(rim);

    // Physical cables and emissive optical filaments weave between the machines.
    const network = new THREE.Group();
    workspace.add(network);
    const cableMaterial = material('#17273e', {
      metalness: .8,
      roughness: .3
    });
    const cables = [];
    const tube = (points, radius, mat, parent = network) => {
      const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
      const object = mesh(new THREE.TubeGeometry(curve, 100, radius, 7, false), mat, [0, 0, 0], parent);
      object.castShadow = false;
      object.userData.id = 'cable';
      return curve;
    };
    for (let i = 0; i < 12; i++) {
      const offset = (i - 5.5) * .11;
      const route = [[-16, -1.5 + offset, 10], [-10, -.8 + offset, 6], [-6, 3.4 + offset, -1], [-1, 5.2 + offset, -5], [5, 3.4 + offset, -4], [8, .2 + offset, 1], [5, -1.7 + offset, 5], [0, -1.8 + offset, 7], [-5, -.5 + offset, 3], [-7, 2.4 + offset, -6], [-2, 4 + offset, -12], [8, .2 + offset, -20]];
      if (i % 3 === 0) tube(route.map(([x, y, z]) => [x, y - .22, z - .22]), .065, cableMaterial);
      const curve = tube(route, i % 3 === 0 ? .024 : .014, i % 4 === 0 ? amber : teal);
      cables.push(curve);
    }
    for (let i = 0; i < 5; i++) {
      tube([[2 + i * .13, -.7, -1], [3 + i * .13, -1.9, -2], [5 + i * .13, -1.9, -5], [6, -1.6, -9 - i * .2]], .055, cableMaterial);
    }
    // Tall server racks anchor the scene at different depths.
    const rackGeometry = new THREE.BoxGeometry(1, 1, 1);
    resources.add(rackGeometry);
    const rackParts = [];
    const rackLeds = [];
    const rackPart = (position, scale) => rackParts.push({
      position,
      scale
    });
    const rackPositions = [[6, -7], [9, -10], [12, -13], [-6, -9], [-9, -12], [-12, -15], [5, -17], [1, -20], [-3, -19]];
    rackPositions.forEach(([x, z], index) => {
      const h = 4.5 + index % 3 * .65;
      rackPart([x, h / 2 - 2.1, z], [1.6, h, 1.4]);
      for (const side of [-1, 1]) {
        const frame = box([.045, h, .07], metal, [x + side * .77, h / 2 - 2.1, z + .77], network);
        frame.userData.id = 'server';
      }
      const cap = box([1.58, .06, .07], metal, [x, h - 2.1, z + .77], network);
      cap.userData.id = 'server';
      for (let slot = 0; slot < 10; slot++) {
        rackPart([x, -1.7 + slot * .43, z + .75], [1.4, .32, .12]);
        for (let led = 0; led < 3; led++) rackLeds.push([x + .36 + led * .12, -1.6 + slot * .43, z + .83]);
      }
      tube([[x, -1.9, z], [x - 1, -1.95, z + 2], [1, -1.95, -3]], .045, index % 2 ? teal : cableMaterial);
    });
    const racks = new THREE.InstancedMesh(rackGeometry, dark, rackParts.length);
    const matrix = new THREE.Object3D();
    rackParts.forEach((part, i) => {
      matrix.position.set(...part.position);
      matrix.scale.set(...part.scale);
      matrix.updateMatrix();
      racks.setMatrixAt(i, matrix.matrix);
    });
    racks.castShadow = true;
    racks.receiveShadow = true;
    racks.userData.id = 'server';
    network.add(racks);
    const ledGeometry = new THREE.BoxGeometry(.045, .025, .016);
    resources.add(ledGeometry);
    const leds = new THREE.InstancedMesh(ledGeometry, teal, rackLeds.length);
    matrix.scale.set(1, 1, 1);
    rackLeds.forEach((position, i) => {
      matrix.position.set(...position);
      matrix.updateMatrix();
      leds.setMatrixAt(i, matrix.matrix);
    });
    leds.userData.id = 'server';
    network.add(leds);
    // A glass-sided PC with spinning cooling fans and internal hardware.
    const pc = group('server', [4, -.4, 1.1]);
    box([1.2, 2.5, 1.7], dark, [0, 1.25, 0], pc);
    box([1.21, 2.25, 1.46], material('#536f91', {
      transparent: true,
      opacity: .16,
      metalness: .9
    }), [.02, 1.28, .05], pc);
    const fans = [];
    for (let i = 0; i < 3; i++) {
      const fan = new THREE.Group();
      fan.position.set(0, .47 + i * .76, .875);
      pc.add(fan);
      fans.push(fan);
      mesh(new THREE.TorusGeometry(.29, .027, 8, 36), i % 2 ? amber : teal, [0, 0, 0], fan);
      cylinder(.08, .08, .035, metal, [0, 0, 0], fan).rotation.x = Math.PI / 2;
      for (let blade = 0; blade < 5; blade++) {
        const b = box([.12, .23, .025], metal, [Math.sin(blade * 1.256) * .14, Math.cos(blade * 1.256) * .14, 0], fan);
        b.rotation.z = -blade * 1.256 + .4;
      }
    }
    box([.07, 1.8, .07], amber, [.62, 1.3, .65], pc);
    // Circuit traces and processors turn the floor into a giant motherboard.
    const copper = material('#a65a3f', {
      emissive: '#5a2316',
      emissiveIntensity: .4,
      metalness: .8
    });
    for (let i = 0; i < 24; i++) {
      const x = (i % 12 - 6) * 1.45,
        z = -Math.floor(i / 12) * 12;
      const path = [[x, -2.12, 8], [x, -2.12, 3], [x + .8, -2.12, 2], [x + .8, -2.12, -6 + z]];
      tube(path, .012, i % 4 === 0 ? teal : copper);
    }
    for (let i = 0; i < 7; i++) {
      const chip = group('server', [-6 + i * 2.4, -1.95, -5 - i % 2 * 4]);
      box([.9, .23, .9], black, [0, 0, 0], chip);
      box([.68, .02, .68], metal, [0, .13, 0], chip);
      for (let pin = 0; pin < 6; pin++) for (const side of [-1, 1]) box([.16, .04, .045], copper, [side * .51, 0, pin * .12 - .3], chip);
    }
    // Packets move along real curve geometry; one instanced draw call for all of them.
    const packetGeometry = new THREE.SphereGeometry(.029, 8, 6);
    resources.add(packetGeometry);
    const packetMaterial = new THREE.MeshBasicMaterial({
      color: '#c6eaff',
      toneMapped: false
    });
    resources.add(packetMaterial);
    const packets = new THREE.InstancedMesh(packetGeometry, packetMaterial, cables.length * 8);
    packets.userData.decoration = true;
    network.add(packets);
    const dustGeometry = new THREE.BufferGeometry();
    resources.add(dustGeometry);
    const dustPositions = new Float32Array(650 * 3);
    for (let i = 0; i < 650; i++) dustPositions.set([Math.sin(i * 127.1) * 24, Math.cos(i * 63.7) * 10 + 5, Math.sin(i * 311.7) * 27 - 8], i * 3);
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: '#78a4de',
      size: .025,
      transparent: true,
      opacity: .65,
      depthWrite: false
    });
    resources.add(dustMaterial);
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    dust.userData.decoration = true;
    network.add(dust);
    const blueLight = new THREE.PointLight('#237bff', 65, 28);
    blueLight.position.set(2, 4, -3);
    scene.add(blueLight);
    const warmLight = new THREE.PointLight('#ff6249', 65, 24);
    warmLight.position.set(-7, 3, 2);
    scene.add(warmLight);
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloom = new UnrealBloomPass(new THREE.Vector2(800, 600), .65, .55, 1.1);
    composer.addPass(bloom);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    let networkTime = 0,
      pulse = 0,
      lastPulse = 0;
    const updateNetwork = delta => {
      networkTime += delta;
      if (lastPulse !== current.equipment.cable) {
        lastPulse = current.equipment.cable;
        pulse = 1;
      }
      pulse = Math.max(0, pulse - delta * .55);
      teal.emissiveIntensity = 3 + pulse * 5;
      packetMaterial.color.set(current.equipment.lamp % 2 ? '#ffc5ad' : '#c6eaff');
      let index = 0;
      cables.forEach((curve, cableIndex) => {
        for (let j = 0; j < 8; j++) {
          const position = curve.getPointAt((networkTime * (.025 + pulse * .045) + j / 8 + cableIndex * .013) % 1);
          matrix.position.copy(position);
          matrix.scale.setScalar(1 + pulse * 2);
          matrix.updateMatrix();
          packets.setMatrixAt(index++, matrix.matrix);
        }
      });
      packets.instanceMatrix.needsUpdate = true;
      fans.forEach((fan, i) => {
        fan.rotation.z = networkTime * (2 + i * .3);
      });
      dust.rotation.y = networkTime * .006;
      blueLight.intensity = 65 + pulse * 60;
      warmLight.intensity = current.equipment.lamp % 2 ? 130 : 65;
    };
    let frame = 0,
      disposed = false,
      visible = true,
      time = 0,
      previous = 0,
      lastScreen = '';
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const trailTarget = new THREE.Vector3();
    const trailPoints = Array.from({
      length: 36
    }, () => new THREE.Vector3());
    const trailPositions = new Float32Array(36 * 3);
    const trailColors = new Float32Array(36 * 3);
    for (let i = 0; i < 36; i++) {
      const color = new THREE.Color('#7aafff').multiplyScalar(1 - i / 36);
      trailColors.set([color.r, color.g, color.b], i * 3);
    }
    const trailGeometry = new THREE.BufferGeometry();
    resources.add(trailGeometry);
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3).setUsage(THREE.DynamicDrawUsage));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: .7,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    resources.add(trailMaterial);
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    trail.frustumCulled = false;
    trail.visible = false;
    scene.add(trail);
    let trailActive = false,
      trailAge = 10;
    raycaster.params.Points.threshold = .02;
    const poses = [[12, 7.5, 16], [3, 3.6, 10], [-7, 5.2, 6], [-12, 8, 15], [-8, 11, 23]];
    const targets = [[-3.1, .9, -1], [0, .5, -5], [1, 1, -2], [0, .5, -2], [0, 0, -3]];
    const cameraTarget = new THREE.Vector3(...targets[0]);
    camera.position.set(...poses[0]);
    const drawScreen = view => {
      ctx.fillStyle = '#09171d';
      ctx.fillRect(0, 0, 1024, 600);
      ctx.fillStyle = '#142b32';
      ctx.fillRect(0, 0, 1024, 57);
      ctx.font = '20px monospace';
      ctx.fillStyle = '#74d8c8';
      ctx.fillText('ADITYA / WORKSPACE', 32, 36);
      ctx.fillStyle = '#82979e';
      ctx.fillText(['01 — HELLO WORLD', '02 — BUILD SYSTEMS', '03 — CONNECT THE DOTS', '04 — SHIP IT'][view], 615, 36);
      if (view === 2) {
        ctx.strokeStyle = '#24464b';
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 60, 70);
          ctx.lineTo(i * 60 - 150, 600);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i * 40 + 80);
          ctx.lineTo(1024, i * 40 + 80);
          ctx.stroke();
        }
        const points = [[170, 220], [380, 150], [490, 350], [710, 210], [830, 420], [240, 460]];
        ctx.strokeStyle = '#66e6ce';
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.stroke();
        points.forEach(([x, y]) => {
          ctx.fillStyle = '#66e6ce22';
          ctx.beginPath();
          ctx.arc(x, y, 43, 0, 7);
          ctx.fill();
          ctx.fillStyle = '#91ffe0';
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, 7);
          ctx.fill();
        });
        ctx.fillStyle = '#afc6ca';
        ctx.fillText('GEOSPATIAL SIGNAL MAP / INTERACTION DEMO', 32, 565);
      } else {
        const lines = view === 0 ? ['const developer = {', '  name: "Aditya Singh",', '  role: "Full Stack Developer",', '  location: "Ghaziabad, India",', '  focus: ["web", "data", "maps"]', '};', '', '// Scroll to step inside my work.'] : view === 1 ? ['interface → API → database', '', 'React.js      [ UI READY ]', 'Node/Express  [ API READY ]', 'MongoDB / SQL [ DATA READY ]', '', '// Built to work together.', 'return meaningfulExperiences;'] : ['> git commit -m "make it real"', '', '✓ Responsive interface', '✓ Connected API services', '✓ Efficient data retrieval', '✓ Production-ready features', '', 'NEXT: explore the project archive ↗'];
        ctx.font = '27px monospace';
        lines.forEach((line, i) => {
          ctx.fillStyle = line.startsWith('//') ? '#6c8993' : i % 2 ? '#d7e9ed' : '#75e0c9';
          ctx.fillText(line, 48, 126 + i * 53);
        });
      }
      screenTexture.needsUpdate = true;
    };
    const canAnimate = () => !current.paused && visible && !document.hidden;
    const update = delta => {
      time += delta;
      const view = current.equipment.monitorPhase === current.phase ? (current.phase + current.equipment.monitor) % 4 : current.phase;
      if (lastScreen !== view) {
        drawScreen(view);
        lastScreen = view;
      }
      const position = current.paused ? current.phase : progressRef.current;
      const start = Math.min(3, Math.floor(position));
      const blend = position - start;
      const pose = new THREE.Vector3(...poses[start]).lerp(new THREE.Vector3(...poses[start + 1]), blend);
      const target = new THREE.Vector3(...targets[start]).lerp(new THREE.Vector3(...targets[start + 1]), blend);
      if (camera.aspect < 1) {
        pose.multiplyScalar(1.3);
        target.x += 2.6;
        target.y += 1.2;
      }
      if (!current.paused) {
        pose.x += pointer.x * .85;
        pose.y += pointer.y * .5;
      }
      const cameraEase = current.paused ? 1 : 1 - Math.exp(-Math.max(delta, .016) * 6);
      camera.position.lerp(pose, cameraEase);
      cameraTarget.lerp(target, cameraEase);
      camera.lookAt(cameraTarget);
      globe.rotation.y = time * .16 + current.equipment.globe * .9;
      globe.position.y = 1.15 + (current.paused ? 0 : Math.sin(time * 1.2) * .045);
      trays.forEach((tray, i) => {
        const target = .17 + i * (current.equipment.server % 2 ? .63 : .36);
        tray.position.y += (target - tray.position.y) * (current.paused ? 1 : .12);
      });
      globe.position.y += current.equipment.server % 2 ? .7 : 0;
      lampLight.color.set(current.equipment.lamp % 2 ? '#a2dcff' : '#ffc58d');
      lampLight.intensity = current.equipment.lamp % 2 ? 18 : 12;
      keyboard.position.y = -.34 + (current.paused ? 0 : Math.max(0, Math.sin(time * 6)) * .01 * (current.equipment.keyboard % 2));
      if (trailActive && !current.paused) {
        trailAge += delta;
        trailPoints[0].lerp(trailTarget, .5);
        for (let i = 1; i < trailPoints.length; i++) trailPoints[i].lerp(trailPoints[i - 1], .32);
        trailPoints.forEach((point, i) => point.toArray(trailPositions, i * 3));
        trailGeometry.attributes.position.needsUpdate = true;
        trailMaterial.opacity = Math.max(0, .7 - trailAge * .45);
      }
      trail.visible = trailActive && !current.paused;
      updateNetwork(delta);
      if (camera.aspect > 1.1 && !softwareRendering) composer.render();else renderer.render(scene, camera);
    };
    const animate = timestamp => {
      frame = 0;
      if (disposed) return;
      update(previous && canAnimate() ? Math.min((timestamp - previous) / 1000, .2) : 0);
      previous = timestamp;
      if (canAnimate()) frame = requestAnimationFrame(animate);
    };
    const render = () => {
      if (disposed) return;
      if (!canAnimate()) {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        update(0);
      } else if (!frame) frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      const {
        width,
        height
      } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const hit = event => {
      const rect = mount.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      for (const result of raycaster.intersectObjects(workspace.children, true)) {
        if (result.object.userData.decoration) continue;
        let object = result.object;
        while (object && !object.userData.id) object = object.parent;
        if (object?.userData.id) return object.userData.id;
        // The nearest opaque surface occludes anything behind it.
        return null;
      }
      return null;
    };
    const move = event => {
      mount.style.cursor = hit(event) ? 'pointer' : 'default';
      if (event.pointerType === 'mouse' && !current.paused && raycaster.ray.intersectPlane(pointerPlane, trailTarget)) {
        if (!trailActive) trailPoints.forEach(point => point.copy(trailTarget));
        trailActive = true;
        trailAge = 0;
      }
    };
    const click = event => {
      const id = hit(event);
      if (id) current.onInspect(id);
    };
    const leave = () => pointer.set(0, 0);
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      render();
    });
    visibility.observe(mount);
    current.render = render;
    mount.addEventListener('pointermove', move);
    mount.addEventListener('click', click);
    mount.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', render);
    resize();
    current.onReady(true);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      delete current.render;
      observer.disconnect();
      visibility.disconnect();
      mount.removeEventListener('pointermove', move);
      mount.removeEventListener('click', click);
      mount.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', render);
      resources.forEach(resource => resource.dispose());
      key.shadow.dispose();
      composer.dispose();
      bloom.dispose();
      renderPass.dispose();
      outputPass.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [progressRef]);
  return <div className="workbench-canvas" ref={mountRef} aria-hidden="true" />;
}
Workbench.propTypes = {
  progressRef: PropTypes.object.isRequired,
  phase: PropTypes.number.isRequired,
  paused: PropTypes.bool.isRequired,
  equipment: PropTypes.object.isRequired,
  onInspect: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired
};
