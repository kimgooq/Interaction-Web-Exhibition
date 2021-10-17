import * as THREE_2 from "https://cdn.skypack.dev/three@0.133.1/build/three.module.js";
if (!THREE.Supports.webgl) THREE.Supports.addGetWebGLMessage();

//var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var statsEnabled = true;

var container, stats;

var camera, scene, webglRenderer;
var cameraCube, sceneCube;

var mesh, zmesh, lightMesh, geometry;

var meshes = [];
var deltas = [];

var directionalLight, pointLight;

var mouseX = 0;
var mouseY = 0;

var SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
setInterval(loop, 1000 / 60);

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  // camera = new THREE.Camera(
  //   60,
  //   window.innerWidth / window.innerHeight,
  //   1,
  //   100000
  // );
  camera = new THREE_2.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.z = 3200;

  cameraCube = new THREE.Camera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );

  scene = new THREE.Scene();
  sceneCube = new THREE.Scene();

  //var geometry = new THREE.Sphere(100, 32, 16);
  var geometry = new Sphere(100, 32, 16);

  var path = "./image/";
  var format = ".jpg";
  var urls = [
    path + "px" + format,
    path + "nx" + format,
    path + "py" + format,
    path + "ny" + format,
    path + "pz" + format,
    path + "nz" + format,
  ];

  //var images = THREE.ImageUtils.loadArray(urls);
  var images = ImageUtils.loadArray(urls);
  var textureCube = new THREE.Texture(images);

  var shader = ShaderUtils.lib["fresnel"];
  var uniforms = Uniforms.clone(shader.uniforms);

  uniforms["tCube"].texture = textureCube;

  var parameters = {
    fragment_shader: shader.fragment_shader,
    vertex_shader: shader.vertex_shader,
    uniforms: uniforms,
  };
  var material = new THREE.MeshShaderMaterial(parameters);

  for (var i = 0; i < 200; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 10000 - 5000;
    mesh.position.y = Math.random() * 10000 - 5000;
    mesh.position.z = Math.random() * 10000 - 5000;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2.5 + 0.5;
    scene.addObject(mesh);

    meshes[i] = mesh;
    deltas[i] = Math.random() * 0.5 + 0.5;
  }

  SceneUtils.addPanoramaCubeWebGL(sceneCube, 100000, textureCube);

  webglRenderer = new THREE.WebGLRenderer();
  //webglRenderer = new THREE_2.WebGLRenderer();
  webglRenderer.setSize(window.innerWidth, window.innerHeight);
  webglRenderer.autoClear = false;
  container.appendChild(webglRenderer.domElement);

  if (statsEnabled) {
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
  }

  //document.addEventListener("mousemove", onDocumentMouseMove, false);
  //document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("click", onDocumentMouseClick, false);
  window.addEventListener("resize", onWindowResize, false);
}

function onDocumentMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE_2.Raycaster();

  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length == 0) {
    return;
  }

  let hit = intersects[0].object;

  meshes.forEach((obj, index) => {
    if (hit == obj.object) {
      meshes.splice(index, 1);

      scene.remove(obj.object);
    }
  });

  console.log(mouseX);
  console.log(mouseY);
}

function onWindowResize(event) {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  //camera.updateProjectionMatrix();

  windowHalfX = SCREEN_WIDTH / 2;
  windowHalfY = SCREEN_HEIGHT / 2;
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

function onTouchMove(event) {
  event.preventDefault();

  var touches = event.touches;
  var touch = touches[0];

  mouseX = (touch.clientX - windowHalfX) * 10;
  mouseY = (touch.clientY - windowHalfY) * 10;
}

function loop() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  cameraCube.target.position.x = -camera.position.x;
  cameraCube.target.position.y = -camera.position.y;
  cameraCube.target.position.z = -camera.position.z;

  var timer = 0.0001 * Date.now();

  for (var i = 0, il = meshes.length; i < il; i++) {
    var m = meshes[i];
    var d = deltas[i];

    m.position.y += d * 5;
    //m.position.x += d * Math.random(-10, 10);
    //m.position.z = -1000;
    m.position.x = 5000 * Math.cos(timer + i);
    m.position.z = 5000 * Math.sin(timer + i * 1.1);

    if (m.position.y > 2500) m.position.y -= 5000;
    if (m.position.x > 4000) m.position.x -= 6000;
    else if (m.position.x < -4000) m.position.x += 6000;
    if (m.position.z > 3000) m.position.z -= 6000;
  }
  ////////////////////

  ///////////////////////

  webglRenderer.clear();
  webglRenderer.render(sceneCube, cameraCube);
  webglRenderer.render(scene, camera);

  if (statsEnabled) stats.update();
}

function log(text) {
  var e = document.getElementById("log");
  e.innerHTML = text + "<br/>" + e.innerHTML;
}
