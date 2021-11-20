window.onload = function () {
  document.getElementById("bgm").play();
};

import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module.js";
//import * as THREE from "./three.module.js";
//import { cloneUniforms } from "https://cdn.skypack.dev/three@0.133.1/src/renderers/shaders/UniformsUtils.js";
//import { ImageUtils } from "https://cdn.skypack.dev/three@0.133.1/src/extras/ImageUtils.js";
let container, camera, scene, renderer;
let INTERSECTED;
var spheres = [];
var deltas = [];
var bubble_speed = 1;

let mouseX = 0,
  mouseY = 0;

var audio = document.getElementById("audio_play");

const mouse = new THREE.Vector2();
const rayCast = new THREE.Raycaster();

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

//document.addEventListener("mousemove", onDocumentMouseMove);
document.addEventListener("click", onMouseClick, false);
document.addEventListener("mousewheel", MouseWheel, false);

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.z = 3200;

  scene = new THREE.Scene();
  //scene.background = new THREE.TextureLoader().load("./image/nz.jpg");

  scene.background = new THREE.CubeTextureLoader()
    .setPath("./image/")
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

  const geometry = new THREE.SphereGeometry(100, 32, 16);

  const textureCube = new THREE.CubeTextureLoader()
    .setPath("./image/")
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

  var shader = {
    uniforms: {
      mRefractionRatio: { type: "f", value: 1.02 },
      mFresnelBias: { type: "f", value: 0.1 },
      mFresnelPower: { type: "f", value: 2.0 },
      mFresnelScale: { type: "f", value: 1.0 },
      tCube: { type: "t", value: null },
    },

    vertexShader: [
      "uniform float mRefractionRatio;",
      "uniform float mFresnelBias;",
      "uniform float mFresnelScale;",
      "uniform float mFresnelPower;",

      "varying vec3 vReflect;",
      "varying vec3 vRefract[3];",
      "varying float vReflectionFactor;",

      "void main() {",

      "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
      "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

      "vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

      "vec3 I = worldPosition.xyz - cameraPosition;",

      "vReflect = reflect( I, worldNormal );",
      "vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );",
      "vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );",
      "vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );",
      "vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );",

      "gl_Position = projectionMatrix * mvPosition;",

      "}",
    ].join("\n"),

    fragmentShader: [
      "uniform samplerCube tCube;",

      "varying vec3 vReflect;",
      "varying vec3 vRefract[3];",
      "varying float vReflectionFactor;",

      "void main() {",

      "vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
      "vec4 refractedColor = vec4( 1.0 );",

      "refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
      "refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
      "refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",

      "gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",

      "}",
    ].join("\n"),
  };

  var material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: THREE.UniformsUtils.clone(shader.uniforms),
  });

  material.uniforms["tCube"].value = textureCube;

  for (let i = 0; i < 180; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 10000 - 5000;
    mesh.position.y = Math.random() * 10000 - 5000;
    mesh.position.z = Math.random() * 10000 - 5000;
    mesh.scale.x =
      mesh.scale.y =
      mesh.scale.z =
        Math.random() * 2.5 + 0.5 * bubble_speed;
    scene.add(mesh);

    deltas[i] = Math.random() * 0.5 + 0.5;
    spheres.push(mesh);
  }

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  container.appendChild(renderer.domElement);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  rayCast.setFromCamera(mouse, camera);

  let intersects = rayCast.intersectObjects(scene.children);
  console.log(intersects[0]);
  if (intersects.length == 0) {
    return;
  }
  console.log(rayCast);

  if (INTERSECTED != intersects[0].object) {
    INTERSECTED = intersects[0].object;
    scene.remove(INTERSECTED);
    audio.play();
    //console.log(INTERSECTED);
  }
}
// function play_sound(event){
//   var audio = document.getElementById('audio_play');
// }

function MouseWheel(event) {
  console.log(event.wheelDelta);
  if (event.wheelDelta < 0) {
    if (bubble_speed > 0.13) {
      bubble_speed -= 0.09;
    }
  } else if (event.wheelDelta > 0) {
    bubble_speed += 0.09;
    //console.log("wheel up");
  }
}

//function onDocumentMouseMove(event) {
//  mouseX = (event.clientX - windowHalfX) * 10;
//  mouseY = (event.clientY - windowHalfY) * 10;
//}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  var timer = bubble_speed * 0.0001 * Date.now();

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  for (let i = 0, il = spheres.length; i < il; i++) {
    const sphere = spheres[i];
    var d = deltas[i];

    // sphere.position.x = 5000 * Math.cos(timer + i);
    // sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
    sphere.position.y += d * 4;
    sphere.position.x = 3500 * Math.cos(timer + i);
    sphere.position.z = 5000 * Math.sin(timer + i * 1.1);

    if (sphere.position.y > 2500) sphere.position.y -= 5000;
    if (sphere.position.x > 4000) sphere.position.x -= 6000;
    else if (sphere.position.x < -4000) sphere.position.x += 6000;
    if (sphere.position.z > 3000) sphere.position.z -= 6000;
  }

  renderer.render(scene, camera);
}
