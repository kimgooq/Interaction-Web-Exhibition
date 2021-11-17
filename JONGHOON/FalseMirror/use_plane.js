import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
//import { OrbitControls } from "./OrbitControls.js";

let camera, scene, renderer, video;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(60, 640, 480, 0.1, 100);
  camera.position.z = 15;

  scene = new THREE.Scene();

  video = document.getElementById("video");

  const texture = new THREE.VideoTexture(video);

  //const geometry = new THREE.PlaneGeometry(16 / 10, 9 / 10, 16, 16);
  const geometry = new THREE.PlaneGeometry(32, 16, 32, 32);
  const positions = geometry.attributes.position;

  // const axisPosition = new THREE.Vector3(-2, 0, 2);
  const axis = new THREE.Vector3(0, 1, 0);
  const axisPosition = new THREE.Vector3(12, 0, -12);
  const vTemp = new THREE.Vector3(0, 0, 0);
  // const axis = new THREE.Vector3(1, 0, 0);
  // const axisPosition = new THREE.Vector3(12, 0, -12);
  // const vTemp = new THREE.Vector3(0, 0, 0);

  let lengthOfArc;
  let angleOfArc;

  for (let i = 0; i < positions.count; i++) {
    vTemp.fromBufferAttribute(positions, i);
    lengthOfArc = vTemp.x - axisPosition.x;
    angleOfArc = lengthOfArc / axisPosition.z;
    vTemp
      .setX(0)
      .setZ(-axisPosition.z)
      .applyAxisAngle(axis, -angleOfArc)
      .add(axisPosition);
    positions.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
  }
  // for (let i = 0; i < positions.count; i++) {
  //   vTemp.fromBufferAttribute(positions, i);
  //   lengthOfArc = vTemp.z - axisPosition.z;
  //   angleOfArc = lengthOfArc / axisPosition.x;
  //   vTemp
  //     .setZ(0)
  //     .setX(-axisPosition.x)
  //     .applyAxisAngle(axis, -angleOfArc)
  //     .add(axisPosition);
  //   positions.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
  // }
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
  renderer.setSize(640, 480);
  document.body.appendChild(renderer.domElement);

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

function onWindowResize() {
  camera.aspect = 640 / 480;
  camera.updateProjectionMatrix();

  //renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setSize(640, 480);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
