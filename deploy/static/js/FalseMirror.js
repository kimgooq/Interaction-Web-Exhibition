window.onload = function () {
  document.getElementById("bgm").play();
};

import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "./OrbitControls_custom.js";

let camera, scene, renderer, video;
var cameraTarget, quaternion_OG;
var mesh;
var mouse = false;
let spotLight;
var audio = document.getElementById("audio_play");

document.addEventListener("mouseup", () => {
  mouse = !mouse;
  audio.play();
});
document.addEventListener("mousedown", () => {
  mouse = !mouse;
});

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(60, 640, 480, 0.1, 100);
  camera.position.z = 15;
  cameraTarget = new THREE.Vector3(0, 0, 15);
  scene = new THREE.Scene();
  video = document.getElementById("video");
  const texture = new THREE.VideoTexture(video);
  const geometry = new THREE.SphereGeometry(24, 15, 16, 0.9, 1.3, 1, 1.2);
  geometry.scale(0.5, 0.5, 0.5);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.z = -5;
  //pupil
  const pupil_geometry = new THREE.SphereGeometry(1.2, 32, 16);
  const pupil_material = new THREE.MeshPhongMaterial({
    color: 0x000000,
    dithering: true,
  });
  const pupil_sphere = new THREE.Mesh(pupil_geometry, pupil_material);
  pupil_sphere.castShadow = true;
  scene.add(pupil_sphere);
  pupil_sphere.position.z = 5.5;
  //quaternion
  quaternion_OG = new THREE.Quaternion();
  quaternion_OG.copy(camera.quaternion);

  renderer = new THREE.WebGLRenderer({ antialias: true });

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(10, 30, 15);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.focus = 1;
  scene.add(spotLight);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;

  onWindowResize();
  //video check
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  if (mouse === false) {
    camera.position.lerp(cameraTarget, 0.035);
    camera.quaternion.slerp(quaternion_OG, 0.035);
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
