import * as THREE from "//unpkg.com/three@0.120.0/build/three.module.js";
import { OrbitControls } from "//unpkg.com/three@0.120.0/examples/jsm/controls/OrbitControls.js";

// 3D Scene 기본 설정 및 Orbit Control
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  perserveDrawingBuffer: true,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);

// 관성
camera.up.set(0, 1, 0); // orbit axis
controls.enableDamping = true; // set inertia true for smooth animation
controls.dampingFactor = 0.1;
controls.target.set(0, 0, 0);
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2;
controls.rotateSpeed = 4;

window.addEventListener("resize", () => {
  const { clientWidth, clientHeight } = renderer.domElement;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
});
document.body.prepend(renderer.domElement);
window.dispatchEvent(new Event("resize"));
renderer.setAnimationLoop((t) => {
  renderer.render(scene, camera);
  controls.update();
});

// ----
// Main
// ----

const img_width = 10, // 전체 표현 너비
  img_height = 10, // 전체 표현 높이
  SW = img_width * 20,
  SH = img_height * 20;
const IMG_URLS = ["../image/test1.jpeg", "../image/test2.jpg"]; // 이미지 파일

camera.position.set(0, 0, 8);

// 두 개의 spotLight 를 추가
for (const { color, intensity, x, y, z } of [
  { color: "white", intensity: 1, x: -img_width, y: 0, z: 0 }, // 우상단용
  { color: "white", intensity: 1, x: img_width, y: 0, z: 0 }, // 좌하단용
  // { color: "white", intensity: 1, x: 0, y: -img_height, z: 0 }, // 우상단용
  // { color: "white", intensity: 1, x: 0, y: img_height, z: 0 }, // 좌하단용
]) {
  const spotLight = new THREE.SpotLight(
    color,
    intensity,
    img_width,
    Math.PI / 2,
    0,
    0
  );
  spotLight.position.set(x, y, z);
  scene.add(spotLight);
}

const vs = [];
for (let i = 0, I = SH; i < I; ++i) {
  vs[i] = [];
  const nY = i / (I - 1);
  for (let j = 0, J = SW; j < J; ++j) {
    const nX = j / (J - 1);
    vs[i][j] = {
      uv: [nX, nY], //
      xyz: [
        (nX - 0.5) * img_width, // x 좌표
        (nY - 0.5) * img_height, // y 좌표
        ((i + 1) % 2) * (j % 2) * 0.5 - 0.25, // 두께
      ],
    };
  }
}

//// Make Geometry - 2 Sets

const geoms = [];
for (let k = 0; k <= 1; ++k) {
  const geom = new THREE.BufferGeometry();
  const N = ((SW - k) >> 1) * (SH - 1);
  const pos = new Float32Array(N * 3 * 6); // six (x,y,z)
  const uv = new Float32Array(N * 2 * 6); // six (u,v)
  let n = 0;
  console.log(vs);
  for (let i = 0, I = SH - 1; i < I; ++i) {
    for (let j = k, J = SW - 1; j < J; j += 2) {
      let v = vs[i][j];
      pos.set(v.xyz, n * 3);
      uv.set(v.uv, n * 2);
      // uv.set(v.uv[0], v.uv[1] + 1, n * 2);
      ++n;
      v = vs[i][j + 1];
      pos.set(v.xyz, n * 3);
      uv.set(v.uv, n * 2);
      ++n;
      v = vs[i + 1][j];
      pos.set(v.xyz, n * 3);
      uv.set(v.uv, n * 2);
      ++n;
      v = vs[i][j + 1];
      pos.set(v.xyz, n * 3);
      uv.set(v.uv, n * 2);
      ++n;
      v = vs[i + 1][j + 1];
      pos.set(v.xyz, n * 3);
      uv.set(v.uv, n * 2);
      ++n;
      v = vs[i + 1][j];
      pos.set(v.xyz, n * 3);
      uv.set(v.uv, n * 2);
      ++n;
    }
  }
  geom.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geom.computeVertexNormals();
  geoms.push(geom);
}

//// Make Meshes

const g = new THREE.Group();
for (const [i, geom] of geoms.entries()) {
  const map = new THREE.TextureLoader().load(IMG_URLS[i]);
  const mat = new THREE.MeshLambertMaterial({ map, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geoms[i], mat);
  g.add(mesh);
}
scene.add(g);

//// Animate

const k = Math.PI / 5;
// gsap
//   .timeline({ defaults: { duration: 0.35 }, repeat: 1, yoyo: true })
//   .to(g.rotation, { x: -k / 2, y: k })
//   .to(g.rotation, { x: -k / 2, y: -k })
//   .to(g.rotation, { x: 0, y: 0 });
