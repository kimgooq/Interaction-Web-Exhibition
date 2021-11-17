import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from "./OrbitControls.js";

let camera, scene, renderer, video;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(60, 640, 480, 0.1, 100);
  camera.position.z = 15;

  scene = new THREE.Scene();

  video = document.getElementById("video");

  const texture = new THREE.VideoTexture(video);

  const geometry = new THREE.SphereGeometry(24, 15, 16, 0.9, 1.3, 1.05, 1.1);
  //가장최근 (24, 15, 16, 1.21, 0.7, 1.3, 0.6)
  //const geometry = new THREE.SphereGeometry(18, 15, 16, 1, 0.8, 1, 0.7);
  //첫번째와 뒤에서 3 , 1
  //9, 15, 16, 0.5, 2.1, 1, 1.3
  //(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
  //4번째부터 0.1, 0.42, 0.2, 0.26
  geometry.scale(0.5, 0.5, 0.5);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.z = -5;
  console.log(mesh.position.z);
  //////////////////////////////////////////////////////////////////
  const pupil_geometry = new THREE.SphereGeometry(0.5, 32, 16);
  const pupil_material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const pupil_sphere = new THREE.Mesh(pupil_geometry, pupil_material);
  scene.add(pupil_sphere);
  pupil_sphere.position.z = 2;
  //////////////////////////////////////////////////////////////////

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setSize(640, 480);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  console.log(window.innerWidth);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;

  onWindowResize();

  //

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
      video: { width: 1280, height: 720, facingMode: "user" },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        // apply the stream to the video element used in the texture

        video.srcObject = stream;
        video.play();
      })
      .catch(function (error) {
        console.error("Unable to access the camera/webcam.", error);
      });
  } else {
    console.error("MediaDevices interface not available.");
  }
}

// function onWindowResize() {
//   camera.aspect = 640 / 480;
//   camera.updateProjectionMatrix();

//   //renderer.setSize( window.innerWidth, window.innerHeight );
//   renderer.setSize(640, 480);
// }
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
