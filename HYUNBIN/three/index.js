// import * as THREE from "https://cdn.skypack.dev/three@0.130.1";

const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera_parameters = [120, 2, 0.1, 5];
const camera = new THREE.PerspectiveCamera(...camera_parameters);
camera.position.z = 5;
// camera.position.x = 0;
// camera.position.y = -5;

const scene = new THREE.Scene();

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

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

// function render(time) {
//   time *= 0.001;

//   box.rotation.x = time;
//   box.rotation.y = time;
//   renderer.render(scene, camera);

//   requestAnimationFrame(render);
// }

let framesPerSecond = 60;

let animate = function () {
  setTimeout(function () {
    requestAnimationFrame(animate);
  }, 1000 / framesPerSecond);

  renderer.render(scene, camera);
};

animate();

const color = 0xffffff;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-5, -5, 10);
scene.add(light);

renderer.render(scene, camera);
// requestAnimationFrame(render);
