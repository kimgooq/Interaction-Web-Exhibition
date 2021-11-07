import * as THREE from "./three.module.js";
import { TrackballControls } from "./TrackballControls.js";
import { CSS3DRenderer, CSS3DObject } from "./CSS3DRenderer.js";
// import { OrbitControls } from './resources/threejs/r132/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById("c");

const camera_parameters = [60, window.innerWidth / window.innerHeight, 1, 1000];
const camera = new THREE.PerspectiveCamera(...camera_parameters);
camera.position.set(400, 200, 0);

const scene = new THREE.Scene();

const renderer = new CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;

function Element(id, x, y, z, ry) {
  const div = document.createElement("div");
  div.style.width = "480px";
  div.style.height = "360px";
  div.style.backgroundColor = "#000";

  const iframe = document.createElement("iframe");
  iframe.style.width = "480px";
  iframe.style.height = "360px";
  iframe.style.border = "0px";
  iframe.src = [
    "https://www.youtube.com/embed/",
    id,
    "?autoplay=1&mute=1&controls=0&loop=1&rel=0",
  ].join("");
  div.appendChild(iframe);

  const object = new CSS3DObject(div);
  object.position.set(x, y, z);
  object.rotation.y = ry;

  return object;
}

function MY_VIDEO(size, x, y, z, ry, id, classIndex) {
  // const iframe = document.createElement("iframe");
  const iframe = document.createElement("div");
  iframe.classList.add(`level_${classIndex}`);
  iframe.classList.add(size);
  iframe.style.border = "0px";
  iframe.style.backgroundColor = "gold";
  // iframe.src = [
  //   "https://www.youtube.com/embed/",
  //   id,
  //   "?autoplay=1mute=1&controls=0&loop=1&rel=0",
  // ].join("");
  const object = new CSS3DObject(iframe);
  object.position.set(x, y, z);
  object.rotation.y = ry;
  return object;
}

function MY_RECT(size, x, y, z, ry) {
  const div = document.createElement("div");
  div.className = size;

  const object = new CSS3DObject(div);
  object.position.set(x, y, z);
  object.rotation.y = ry;
  return object;
}

function MY_TOP(size, x, y, z, ry) {
  // need dynamic value
  const div = document.createElement("div");
  div.style.width = "240px";
  div.style.height = "240px";
  div.style.backgroundColor = "lightblue";
  div.style.border = "1px solid black;";

  const object = new CSS3DObject(div);
  object.position.set(x, y + 90, z - 120);
  object.rotation.x = (Math.PI * 3) / 2;
  object.rotation.y = ry;
  return object;
}

function MY_TV(size, x, y, z, rad, dist, dir, classIndex) {
  const group = new THREE.Group();
  group.add(new MY_VIDEO(size, 0, 0, z, 0, "SJOz3qjfQXU", classIndex));
  group.add(new MY_TOP(size, 0, 0, z, 0));
  group.add(new MY_RECT(size, z, 0, 0, Math.PI / 2));
  group.add(new MY_RECT(size, 0, 0, -z, Math.PI));
  group.add(new MY_RECT(size, -z, 0, 0, -Math.PI / 2));
  group.position.set(Math.sin(rad) * dist, y, Math.cos(rad) * dist);
  if (dir === "h") {
    group.rotation.x = (Math.PI * 3) / 2; // heading upside
    group.rotation.z = rad; // heading upside
  } else if (dir === "v") {
    group.rotation.y = rad; // heading outside
  }
  scene.add(group);
}

// first
for (let i = 0; i < 360; i += 10) {
  let rad = (i * Math.PI) / 180;
  for (let j = 0; j < 4; j++) {
    const zeroTV = new MY_TV("x-small", 0, 0, 120, rad, 2100 + j * 300, "h", 1);
    scene.add(zeroTV);
  }
}

// second
for (let i = 0; i < 360; i += 15) {
  let rad = (i * Math.PI) / 180;
  for (let j = 0; j < 3; j++) {
    const zeroTV = new MY_TV(
      "x-small",
      0,
      240 + j * 240,
      120,
      rad,
      1800,
      "v",
      2
    );
    scene.add(zeroTV);
  }
  const firstTV = new MY_TV("x-small", 0, 960, 120, rad, 1800, "h", 3);
  scene.add(firstTV);
}

// third
for (let i = 0; i < 360; i += 15) {
  let rad = (i * Math.PI) / 180;
  for (let j = 0; j < 3; j++) {
    const zeroTV = new MY_TV(
      "x-small",
      0,
      1200 + j * 240,
      120,
      rad,
      1500,
      "v",
      4
    );
    scene.add(zeroTV);
  }
  const firstTV = new MY_TV("x-small", 0, 1920, 120, rad, 1500, "h", 5);
  scene.add(firstTV);
}

// forth
for (let i = 0; i < 360; i += 15) {
  let rad = (i * Math.PI) / 180;
  for (let j = 0; j < 3; j++) {
    const zeroTV = new MY_TV(
      "x-small",
      0,
      2160 + j * 240,
      120,
      rad,
      1200,
      "v",
      6
    );
    scene.add(zeroTV);
  }
  const firstTV = new MY_TV("x-small", 0, 2880, 120, rad, 1200, "h", 7);
  scene.add(firstTV);
}

// fifth
for (let i = 0; i < 360; i += 30) {
  let rad = (i * Math.PI) / 180;
  for (let j = 0; j < 9; j++) {
    const zeroTV = new MY_TV(
      "x-small",
      0,
      3120 + j * 240,
      120,
      rad,
      800,
      "v",
      8
    );
    scene.add(zeroTV);
  }
}

// sixth
for (let i = 0; i < 360; i += 90) {
  let rad = (i * Math.PI) / 180;
  for (let j = 0; j < 9; j++) {
    const zeroTV = new MY_TV(
      "x-small",
      0,
      5280 + j * 240,
      120,
      rad,
      400,
      "v",
      9
    );
    scene.add(zeroTV);
  }
}

// TEST SIZES
/*
const secondTV = new MY_TV("medium", 0, 0, 240, "rx", "ry");
scene.add(secondTV);

const thirdTV = new MY_TV("large", 0, 0, 320, "rx", "ry");
scene.add(thirdTV);

const forthTV = new MY_TV("x-large", 0, 0, 360, "rx", "ry");
scene.add(forthTV);
*/

// VIDEO TEST
/*
const group = new THREE.Group();
group.add(new Element("SJOz3qjfQXU", 0, 0, 240, 0));
group.add(new Element("Y2-xZ-1HE-Q", 240, 0, 0, Math.PI / 2));
group.add(new Element("IrydklNpcFI", 0, 0, -240, Math.PI));
group.add(new Element("9ubytEsCaS0", -240, 0, 0, -Math.PI / 2));
scene.add(group);
*/

/*
let controls = new THREE.OrbitControls(camera, renderer.domElement);
// inertia
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;
*/

/*
function MY_TV() {
  this.box_WHD = [0.5, 0.5, 0.5];
  this.box_geometry = new THREE.BoxGeometry(...this.box_WHD);
  this.box_material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
  this.box = new THREE.Mesh(this.box_geometry, this.box_material);
  this.box.position.set(0, 0, 0);

  this.plane_WHD = [0.3, 0.3, 1];
  this.plane_geometry = new THREE.PlaneGeometry(...this.plane_WHD);
  this.plane_material = new THREE.MeshPhongMaterial({ color: 0xcc7711 });
  this.plane = new THREE.Mesh(this.plane_geometry, this.plane_material);
  this.plane.position.set(0, 0, 0.3);
  this.box.add(this.plane);

  this.set = (x, y, z) => {
    this.box.position.set(x, y, z);
  };

  this.rotation = (x, y, z) => {
    this.box.rotation.x = x;
    this.box.rotation.y = y;
    this.box.rotation.z = z;
  };

  this.addTV = () => {
    scene.add(this.box);
  };
}

const addTV_asCircle = () => {
  for (let i = 0; i < 360; i += 15) {
    let TV1 = new MY_TV();
    let TV2 = new MY_TV();
    let TV3 = new MY_TV();
    let size1 = 4.0;
    let size2 = 3.0;
    let size3 = 2.0;
    let rad = (i * Math.PI) / 180;
    TV1.set(Math.cos(rad) * size1, Math.sin(rad) * size1, 0);
    TV2.set(Math.cos(rad) * size2, Math.sin(rad) * size2, 0.5);
    TV3.set(Math.cos(rad) * size3, Math.sin(rad) * size3, 1);
    // box.rotation.x = i;
    // box.rotation.y = Math.PI / 2;
    TV1.rotation(0, 0, rad);
    TV2.rotation(0, 0, rad);
    TV3.rotation(0, 0, rad);
    TV1.addTV();
    TV2.addTV();
    TV3.addTV();
  }
};

addTV_asCircle();
*/

const animate = function () {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
};

// const color = 0xffffff;
// const intensity = 1;
// const light = new THREE.DirectionalLight(color, intensity);
// light.position.set(5, 8, 10);
// scene.add(light);

animate();
