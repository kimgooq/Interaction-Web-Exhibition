import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";

import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
// import Stats from 'three/examples/jsm/libs/stats.module'

function main() {
  var pickedObject;
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  const scene = new THREE.Scene();
  // 하늘색 배경
  // scene.background = new THREE.Color("#C8EBFA");

  const backgroundLoader = new THREE.TextureLoader();
  const texture = backgroundLoader.load("model/sunflowers.jpg", () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(3, -13, 14);

  const light1 = new THREE.DirectionalLight(0xffffff, 5);
  scene.add(light1);
  light1.position.set(0, 0, 500);

  const light2 = new THREE.DirectionalLight(0xffffff, 5);
  scene.add(light2);
  light2.position.set(-50, 100, 0);

  const light3 = new THREE.DirectionalLight(0xffffff, 5);
  scene.add(light3);
  light3.position.set(50, 100, 0);

  const light4 = new THREE.DirectionalLight(0xffffff, 5);
  scene.add(light4);
  light4.position.set(0, 0, -500);

  // DirectionalLightHelper
  // const helper1 = new THREE.DirectionalLightHelper(light1);
  // scene.add(helper1);

  // const helper2 = new THREE.DirectionalLightHelper(light2);
  // scene.add(helper2);

  // const helper3 = new THREE.DirectionalLightHelper(light3);
  // scene.add(helper3);

  // const helper4 = new THREE.DirectionalLightHelper(light4);
  // scene.add(helper4);

  // let grid = new THREE.GridHelper(100,20);
  // scene.add(grid);

  var sphere = new Array();
  const loader = new GLTFLoader();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enabled = false;

  loader.load("model/blue.glb", function (gltf) {
    gltf.scene.position.set(0, 0, 0);
    let balloon = gltf.scene.clone();
    scene.add(balloon);
    sphere.push(balloon);
  });

  var count = 0;
  let color = ["blue", "magenta", "yellow", "orange", "red"];

  // 물리엔진
  // Ammo().then(start);
  // function start() {
  //   //code goes here
  // }

  var createSphere = function (pos, color) {
    // pos -> 벡터값이 매개변수로 들어옴

    loader.load(
      "model/" + color + ".glb",
      function (gltf) {
        gltf.scene.position.set(pos.x, pos.y, pos.z);
        // gltf.scene.scale.set(70,70,70);
        // console.log("pos : \n"+pos.x+"\n"+pos.y+"\n"+pos.z)
        let balloon = gltf.scene.clone();
        scene.add(balloon);

        sphere.push(balloon);
        // console.log(sphere[sphere.length-1].children[0].children)
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  };

  var onMouseClick = function (e) {
    console.log(count);
    count++;
    if (count == 5) count = 0;
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    vec.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
      0.5
    );

    vec.unproject(camera);
    vec.sub(camera.position).normalize();

    var distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));

    createSphere(pos, color[count]);

    // sphere[-1].scale.set(70, 70, 70);
    console.log(sphere[sphere.length - 1].scale);
  };

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  const pickPosition = { x: 0, y: 0 };
  clearPickPosition();

  var step = 0;
  //animation
  animation();
  function animation(time) {
    time *= 0.001; // convert to seconds;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (sphere != null) {
      sphere.forEach(function (value) {
        value.position.y += 0.1;
        value.rotation.x += 0.02;
        value.rotation.z += 0.02;
      });
    }
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
  }

  function animationTest() {
    pickedObject.rotation.x += 0.02;
    pickedObject.rotation.y += 0.02;
    pickedObject.rotation.z += 0.02;
    pickedObject.position.y += 0.1;
  }

  function animationTest2() {
    if (sphere != null) {
      // 하늘위로 날라가는 애니메이션
      sphere.forEach(function (value) {
        // value.position.y += 0.1;
        value.rotation.x -= 0.02;
        value.rotation.y += 0.02;
      });
    }
  }

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function setPickPosition(e) {
    let raycaster = new THREE.Raycaster();
    const pos = getCanvasRelativePosition(e);

    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1; // note we flip Y

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera(pickPosition, camera);

    //3. compute intersections (note the 2nd parameter)
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      pickedObject = intersects[0].object;

      sphere.forEach(function (value, index) {
        if (pickedObject.uuid == value.children[0].children[0].uuid) {
          // value

          console.log(intersects[0].object.uuid);
          requestAnimationFrame(animationTest);
          // setTimeout(function() { console.log("test"); },1000);
          // requestAnimationFrame(animationTest2);
        }
        // scene.remove(value);
      });
    }
  }

  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  // window.addEventListener("click", onMouseClick, false);
  window.addEventListener("mousedown", onMouseClick);
  window.addEventListener("mouseup", () => {
    // controls.enabled = true;
    console.log("mouseup");
  });
  window.addEventListener("mousemove", setPickPosition);
  window.addEventListener("mouseout", clearPickPosition);
  window.addEventListener("mouseleave", clearPickPosition);

  window.addEventListener(
    "touchstart",
    (event) => {
      // prevent the window from scrolling
      event.preventDefault();
      setPickPosition(event.touches[0]);
    },
    { passive: false }
  );

  window.addEventListener("touchmove", (event) => {
    setPickPosition(event.touches[0]);
  });

  window.addEventListener("touchend", clearPickPosition);
}

main();
