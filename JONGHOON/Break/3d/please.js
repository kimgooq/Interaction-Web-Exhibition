import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import Stats from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

var custom_material;
var list = 0;
var url;
// Graphics variables
let container, stats;
let camera, controls, scene, renderer;
let textureLoader;
const clock = new THREE.Clock();
const mouseCoords = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });

// Physics variables
const gravityConstant = -6.0;
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

  createObjects();

  initInput();
}

function initGraphics() {
  container = document.getElementById("container");

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.2,
    2000
  );

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  camera.position.set(14, 2, 0);
  camera.lookAt(18, 2.1, 0);
  // camera.rotation.set(new THREE.Euler(-0.7, -1.5, -0.47));
  // console.log(camera.rotation);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.target.set(-1, -1, -1);
  // controls.update();

  textureLoader = new THREE.TextureLoader();

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

  textureLoader = new THREE.TextureLoader();
  url = "./wall_" + list + ".jpg";
  custom_material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(url),
  });

  stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0px";
  container.appendChild(stats.domElement);

  //

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
  const ground = createParalellepiped(
    40,
    1,
    40,
    0,
    pos,
    quat,
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
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
  // pos.set(0, brickHeight * 0.5, z0);
  pos.set(19, brickHeight * 0.5, z0);
  quat.set(0, 0, 0, 1);
  const cm0 = new THREE.MeshBasicMaterial({
    map: textureLoader.load("./image/wall_0.jpg"),
  });
  const cm1 = new THREE.MeshBasicMaterial({
    map: textureLoader.load("./image/wall_1.jpg"),
  });
  var number = 0;
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

        console.log(list);
        list++;
      }
      if (number % 2 == 0) {
        custom_material = cm0;
      } else {
        custom_material = cm1;
      }
      number = number + 1;
      //수정필요 : material
      const brick = createParalellepiped(
        brickDepth,
        brickHeight,
        brickLengthCurrent,
        brickMassCurrent,
        pos,
        quat,
        custom_material
      );
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

  createRigidBody(threeObject, shape, mass, pos, quat);

  return threeObject;
}

function createRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {
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

  body.setFriction(0.5);

  if (vel) {
    body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z));
  }

  if (angVel) {
    body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z));
  }

  object.userData.physicsBody = body;
  object.userData.collided = false;

  //수정
  // object.material = custom_material;
  scene.add(object);

  if (mass > 0) {
    rigidBodies.push(object);

    // Disable deactivation
    body.setActivationState(4);
  }

  physicsWorld.addRigidBody(body);

  return body;
}

function createRandomColor() {
  return Math.floor(Math.random() * (1 << 24));
}

function createMaterial() {
  return new THREE.MeshPhongMaterial({ color: createRandomColor() });
}

function initInput() {
  window.addEventListener("keydown", function (event) {
    console.log(camera.position);
    console.log(camera.rotation);
  });

  window.addEventListener("pointerdown", function (event) {
    mouseCoords.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouseCoords, camera);

    // Creates a ball and throws it
    // const ballMass = 35;
    const ballMass = 55;
    const ballRadius = 0.4;

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius, 14, 10),
      ballMaterial
    );
    // ball.castShadow = true;
    // ball.receiveShadow = true;
    ball.visible = false;
    const ballShape = new Ammo.btSphereShape(ballRadius);
    ballShape.setMargin(margin);
    pos.copy(raycaster.ray.direction);
    pos.add(raycaster.ray.origin);
    quat.set(0, 0, 0, 1);
    const ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat);

    pos.copy(raycaster.ray.direction);
    // pos.multiplyScalar(24);
    pos.multiplyScalar(24);
    ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  const deltaTime = clock.getDelta();

  updatePhysics(deltaTime);

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
