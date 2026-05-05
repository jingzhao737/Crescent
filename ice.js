/* ═══════════════════════════════════════════
   3D ICE — 玻璃菲涅尔 + HDR 预缓存 + 粒子 + 几何体
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(async function() {
  const section = document.querySelector('.ice-section');
  const container = document.querySelector('.ice-container');
  const canvasEl = document.getElementById('iceCanvas');
  if (!section || !container || !canvasEl) return;

  if (!navigator.gpu) {
    const fallback = document.createElement('div');
    fallback.style.cssText = `
      position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      font-family:'JosefinSans',serif;color:rgba(255,255,255,.5);font-size:.85rem;
      letter-spacing:.04em;text-align:center;padding:40px;z-index:2;
    `;
    fallback.innerHTML = 'Your browser does not support WebGPU.<br>Please use <b>Chrome 113+</b> or <b>Edge 113+</b>.';
    section.appendChild(fallback);
    return;
  }

  const renderer = new THREE.WebGPURenderer({ antialias: true, alpha: false });
  await renderer.init();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.setSize(container.clientWidth, container.clientHeight, false);

  canvasEl.parentNode.replaceChild(renderer.domElement, canvasEl);
  renderer.domElement.id = 'iceCanvas';
  renderer.domElement.className = 'ice-canvas';
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 60);
  camera.position.set(0, -5, 8);
  camera.lookAt(0, 0, 0);

  // ═══ 粒子 ═══
  function addStars(count, rMin, rMax, color, size, opacity) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = rMin + Math.random() * (rMax - rMin);
      pos[i*3]   = Math.sin(phi) * Math.cos(theta) * r;
      pos[i*3+1] = Math.sin(phi) * Math.sin(theta) * r;
      pos[i*3+2] = Math.cos(phi) * r;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({
      color, size, transparent: true, opacity,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    scene.add(pts);
    return pts;
  }

  const nearStars = addStars(200, 7, 12, 0xcceeff, 0.04, 0.8);
  const brightStars = addStars(150, 15, 45, 0xffffff, 0.1, 1.0);
  const dimStars = addStars(500, 15, 45, 0x8899cc, 0.04, 0.6);
  const farStars = addStars(800, 30, 80, 0x6677aa, 0.05, 0.4);
  const deepStars = addStars(300, 50, 120, 0x556688, 0.06, 0.5);
  const deepStars2 = addStars(200, 80, 200, 0x445566, 0.07, 0.4);

  // ═══ 环绕自发光几何体 ═══
  const orbitBodies = [];
  const orbitColors = [0xffffff, 0xffccdd, 0xcceeff, 0xffeedd, 0xddddff, 0x88bbff];

  for (let i = 0; i < 14; i++) {
    const radius = 2.5 + Math.random() * 4.5;
    const height = (Math.random() - 0.5) * 5;
    const speed = 0.15 + Math.random() * 0.5;
    const phase = Math.random() * Math.PI * 2;
    const size = 0.04 + Math.random() * 0.14;
    const isCube = i < 7;
    const geo = isCube ? new THREE.BoxGeometry(size, size, size) : new THREE.SphereGeometry(size * 0.6, 16, 16);
    const color = orbitColors[Math.floor(Math.random() * orbitColors.length)];

    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.7 + Math.random() * 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    mesh.position.set(Math.cos(phase) * radius, height, Math.sin(phase) * radius);
    mesh.userData = { radius, height, speed, phase, rotSpeed: 0.5 + Math.random() * 2 };
    scene.add(mesh);
    orbitBodies.push(mesh);
  }

  // ═══ 模型 ═══
  const gltf = await new Promise((res, rej) => {
    new GLTFLoader().load('model/Model1.glb', res, undefined, rej);
  });

  const crystal = new THREE.Group();
  const box = new THREE.Box3();
  gltf.scene.traverse(c => { if (c.isMesh) box.expandByObject(c); });
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fitScale = maxDim > 0.001 ? 3.2 / maxDim : 1;
  const center = box.getCenter(new THREE.Vector3());

  gltf.scene.traverse(function(child) {
    if (!child.isMesh) return;
    crystal.add(new THREE.Mesh(child.geometry, new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0, roughness: 0.04, ior: 1.5,
      transmission: 0.96, thickness: 2.5,
      envMap: null, envMapIntensity: 1.0,
      specularIntensity: 0.8, specularColor: new THREE.Color(0xffffff),
      side: THREE.DoubleSide, transparent: true,
    })));
  });

  crystal.scale.setScalar(fitScale);
  crystal.position.set(-center.x * fitScale, -center.y * fitScale, -center.z * fitScale);
  scene.add(crystal);

  // ═══ HDR 预缓存 + 秒切 ═══
  const pmremGen = new THREE.PMREMGenerator(renderer);
  const hdrDefs = [
    { label: '足球场', path: 'images/exr/field_02k.exr', color: '#8dba6d' },
    { label: '柑橘路', path: 'images/exr/orchard_01k.exr', color: '#e8a44c' },
    { label: '阴天土', path: 'images/exr/overcast_02k.exr', color: '#8899bb' }
  ];

  // 预加载所有 EXR → 缓存 { tex, env }，失败则用纯色降级
  const hdrCache = [];
  await Promise.all(hdrDefs.map(async (def, idx) => {
    return new Promise((resolve) => {
      new EXRLoader().load(def.path, function(tex) {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        const env = pmremGen.fromEquirectangular(tex).texture;
        hdrCache[idx] = { tex, env };
        resolve();
      }, undefined, () => {
        // 加载失败 → 纯色降级
        const c = new THREE.Color(def.color).multiplyScalar(0.4);
        const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, '#' + c.getHexString());
        grad.addColorStop(0.5, '#' + c.multiplyScalar(1.3).getHexString());
        grad.addColorStop(1, '#' + c.multiplyScalar(0.7).getHexString());
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 256);
        const fallbackTex = new THREE.CanvasTexture(canvas);
        fallbackTex.mapping = THREE.EquirectangularReflectionMapping;
        fallbackTex.colorSpace = THREE.SRGBColorSpace;
        const env = pmremGen.fromEquirectangular(fallbackTex).texture;
        hdrCache[idx] = { tex: fallbackTex, env, isFallback: true };
        resolve();
      });
    });
  }));

  function applyHdr(idx) {
    const { tex, env } = hdrCache[idx];
    scene.background = tex;
    scene.backgroundIntensity = 0.3;
    scene.environment = env;
    scene.environmentIntensity = 0.45;
    scene.traverse(function(obj) {
      if (obj.isMesh && obj.material && obj.material.isMeshPhysicalMaterial) {
        obj.material.envMap = env;
        obj.material.needsUpdate = true;
      }
    });
  }
  let currentHdr = 0;
  applyHdr(0);

  // 绑定按钮
  const hdrBtns = document.querySelectorAll('.hdr-ring');
  hdrBtns[0]?.classList.add('active');
  hdrBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.hdr);
      if (idx === currentHdr) return;
      currentHdr = idx;
      hdrBtns.forEach((b,i) => b.classList.toggle('active', i === idx));
      applyHdr(idx);
    });
  });

  // ═══ OrbitControls ═══
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.06;
  controls.minDistance = 4; controls.maxDistance = 18;
  controls.maxPolarAngle = Math.PI * 0.72; controls.minPolarAngle = Math.PI * 0.25;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.3;
  controls.target.set(0, 0, 0);
  controls.enableZoom = true; controls.enablePan = false;
  controls.update();

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let visible = true;
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0.05 }).observe(container);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.1);
    controls.update();

    nearStars.rotation.y += dt * 0.04; nearStars.rotation.x += dt * 0.02;
    brightStars.rotation.y += dt * 0.015; brightStars.rotation.x += dt * 0.008;
    dimStars.rotation.y += dt * 0.012; dimStars.rotation.x += dt * 0.006;
    farStars.rotation.y += dt * 0.005;
    deepStars.rotation.y += dt * 0.003;
    deepStars2.rotation.y += dt * 0.002;

    for (let i = 0; i < orbitBodies.length; i++) {
      const b = orbitBodies[i];
      const d = b.userData;
      d.phase += d.speed * dt;
      b.position.x = Math.cos(d.phase) * d.radius;
      b.position.z = Math.sin(d.phase) * d.radius;
      b.rotation.x += d.rotSpeed * dt;
      b.rotation.y += d.rotSpeed * 0.7 * dt;
      b.rotation.z += d.rotSpeed * 0.5 * dt;
    }

    renderer.renderAsync(scene, camera);
  }
  requestAnimationFrame(animate);
})();
