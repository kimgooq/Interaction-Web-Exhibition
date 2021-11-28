window.onload = function () {
  document.getElementById("bgm").play();
};

const arr_sound = [];
for (let i = 0; i < 10; i++) {
  const sound = new Audio();
  sound.src = "./shooting_sound.mp3";
  arr_sound.push(sound);
}
var sound_num = 0;

import * as THREE from "./three.module.js";
import { FontLoader } from "./FontLoader.js";
import { TextGeometry } from "./TextGeometry.js";

THREE.Cache.enabled = true;

let targetRotation = 0;
let pointerX = 0;
let pointerXOnPointerDown = 0;
let windowHalfX = window.innerWidth / 2;
var group, custom_material, url;

var material_index = 0;
var List = [];

var brickList = [];
var ball, ballBody;
// Graphics variables
let container;
let camera, scene, renderer;
let textureLoader;
const clock = new THREE.Clock();
const mouseCoords = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });

let textureLoader_gr = new THREE.TextureLoader().load("./image/ground.jpeg");
textureLoader_gr.wrapS = THREE.RepeatWrapping;
textureLoader_gr.wrapT = THREE.RepeatWrapping;
textureLoader_gr.repeat.set(4, 4);
var groundMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader_gr,
});

const text_loader = new FontLoader();
var textMesh, text_materials, text_geometry;

function Basic() {
  scene = new THREE.Scene();
  text_loader.load("DH.json", function (font) {
    text_geometry = new TextGeometry("Thank　You", {
      font: font,
      size: 7,
      height: 2,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelOffset: 0,
      bevelSegments: 1,
    });
    group = new THREE.Group();
    group.position.x = 75;
    scene.add(group);
    //text
    text_materials = [
      new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
    ];
    textMesh = new THREE.Mesh(text_geometry, text_materials);
    textMesh.position.x = -30;
    group.add(textMesh);
  });

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-10, 10, 5);
  light.castShadow = true;
  const d = 10;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 2;
  light.shadow.camera.far = 50;

  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;

  scene.add(light);
}

// Physics variables
const gravityConstant = -5.0;
let collisionConfiguration;
let dispatcher;
let broadphase;
let solver;
let softBodySolver;
let physicsWorld;
const rigidBodies = [];
const margin = 0.05;
let transformAux1;

const pos = new THREE.Vector3();
const quat = new THREE.Quaternion();

Ammo().then(function (AmmoLib) {
  Ammo = AmmoLib;
  init();
  animate();
});

function init() {
  initGraphics();
  initPhysics();

  //brick material load
  for (var tmp_num = 0; tmp_num < 52; tmp_num++) {
    url = "./image/" + tmp_num + ".png";
    custom_material = new THREE.MeshBasicMaterial({
      map: textureLoader.load(url),
    });
    List.push(custom_material);
  }
  createObjects();

  initInput();
}

function initGraphics() {
  Basic();

  container = document.getElementById("container");

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.2,
    2000
  );
  camera.position.set(14, 2.2, -0.5);
  camera.lookAt(18, 2.3, -0.5);

  const canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  textureLoader = new THREE.TextureLoader();

  window.addEventListener("resize", onWindowResize);
}

function initPhysics() {
  // Physics configuration
  collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
  dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  broadphase = new Ammo.btDbvtBroadphase();
  solver = new Ammo.btSequentialImpulseConstraintSolver();
  softBodySolver = new Ammo.btDefaultSoftBodySolver();
  physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    collisionConfiguration,
    softBodySolver
  );
  physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0));
  physicsWorld
    .getWorldInfo()
    .set_m_gravity(new Ammo.btVector3(0, gravityConstant, 0));
  transformAux1 = new Ammo.btTransform();
}

function createObjects() {
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  // Ground
  pos.set(0, -0.5, 0);
  quat.set(0, 0, 0, 1);
  const ground = createParalellepiped(40, 1, 40, 0, pos, quat, groundMaterial);
  ground.castShadow = true;
  ground.receiveShadow = true;

  // Wall
  const brickMass = 0.5;
  const brickLength = 1.2;
  const brickDepth = 0.6;
  const brickHeight = brickLength * 0.5;
  const numBricksLength = 6;
  const numBricksHeight = 8;
  const z0 = -numBricksLength * brickLength * 0.5;
  pos.set(19.5, brickHeight * 0.5, z0);
  quat.set(0, 0, 0, 1);

  for (let j = 0; j < numBricksHeight; j++) {
    const oddRow = j % 2 == 1;
    pos.z = z0;

    if (oddRow) {
      pos.z -= 0.25 * brickLength;
    }
    const nRow = oddRow ? numBricksLength + 1 : numBricksLength;
    for (let i = 0; i < nRow; i++) {
      let brickLengthCurrent = brickLength;
      let brickMassCurrent = brickMass;
      if (oddRow && (i == 0 || i == nRow - 1)) {
        brickLengthCurrent *= 0.5;
        brickMassCurrent *= 0.5;
      }
      const brick = createParalellepiped(
        brickDepth,
        brickHeight,
        brickLengthCurrent,
        brickMassCurrent,
        pos,
        quat,
        List[material_index]
      );
      brickList.push(brick.position);

      material_index++;
      brick.castShadow = true;
      brick.receiveShadow = true;
      if (oddRow && (i == 0 || i == nRow - 2)) {
        pos.z += 0.75 * brickLength;
      } else {
        pos.z += brickLength;
      }
    }
    pos.y += brickHeight;
  }
}

function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
  const threeObject = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1),
    material
  );
  const shape = new Ammo.btBoxShape(
    new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5)
  );
  shape.setMargin(margin);
  createRigidBody("wall", threeObject, shape, mass, pos, quat);
  return threeObject;
}

function createRigidBody(
  tag,
  object,
  physicsShape,
  mass,
  pos,
  quat,
  vel,
  angVel
) {
  if (pos) {
    object.position.copy(pos);
  } else {
    pos = object.position;
  }
  if (quat) {
    object.quaternion.copy(quat);
  } else {
    quat = object.quaternion;
  }
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const localInertia = new Ammo.btVector3(0, 0, 0);
  physicsShape.calculateLocalInertia(mass, localInertia);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    physicsShape,
    localInertia
  );
  const body = new Ammo.btRigidBody(rbInfo);
  body.threeObject = tag;

  body.setFriction(1.5); //0.5
  if (vel) {
    body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z));
  }

  if (angVel) {
    body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z));
  }

  object.userData.physicsBody = body;
  object.userData.collided = false;

  scene.add(object);

  if (mass > 0) {
    rigidBodies.push(object);

    // Disable deactivation
    body.setActivationState(4);
  }

  physicsWorld.addRigidBody(body);

  return body;
}

function initInput() {
  //shoot ball
  window.addEventListener("pointerdown", function (event) {
    arr_sound[sound_num].play();
    sound_num++;
    if (sound_num > 9) {
      sound_num = 0;
    }
    mouseCoords.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouseCoords, camera);
    const ballMass = 55;
    const ballRadius = 0.2;
    ball = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius, 14, 10),
      ballMaterial
    );
    ball.visible = false;
    const ballShape = new Ammo.btSphereShape(ballRadius);
    ballShape.setMargin(margin);
    pos.copy(raycaster.ray.direction);
    pos.add(raycaster.ray.origin);
    quat.set(0, 0, 0, 1);
    ballBody = createRigidBody("ball", ball, ballShape, ballMass, pos, quat);

    pos.copy(raycaster.ray.direction);
    pos.multiplyScalar(24);
    ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));
  });
  //text rotation
  document.addEventListener("pointermove", onPointerMove);
  function onPointerMove(event) {
    pointerXOnPointerDown = 0;
    pointerX = event.clientX - windowHalfX;
    targetRotation = pointerX * 0.02;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  const deltaTime = clock.getDelta();

  updatePhysics(deltaTime);

  group.rotation.y += (targetRotation - group.rotation.y) * 0.05; //0.05

  renderer.render(scene, camera);
}

function updatePhysics(deltaTime) {
  // Step world
  physicsWorld.stepSimulation(deltaTime, 10);

  // Update rigid bodies
  for (let i = 0, il = rigidBodies.length; i < il; i++) {
    const objThree = rigidBodies[i];
    const objPhys = objThree.userData.physicsBody;
    const ms = objPhys.getMotionState();
    if (ms) {
      ms.getWorldTransform(transformAux1);
      const p = transformAux1.getOrigin();
      const q = transformAux1.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  }
}
