import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
// import Stats from 'three/examples/jsm/libs/stats.module'

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000);
  camera.position.set(0,30,-55);

  const light1 = new THREE.DirectionalLight(0xffffff,1);
  scene.add(light1);

  // let grid = new THREE.GridHelper(100,20);
  // scene.add(grid);


  var sphere = new Array();

  const loader = new GLTFLoader();
  

  const controls = new OrbitControls(camera,renderer.domElement);
  controls.target.set(0,0,0);



  

// let createSphere = function(pos){
//   // pos -> 벡터값이 매개변수로 들어옴

//   let geometry = new THREE.SphereGeometry(4,30,30);
//   let material = new THREE.MeshPhongMaterial({color:0xffffff*Math.random(),shininess:100});
//   let ballon = new THREE.Mesh(geometry,material);
//   ballon.position.set(pos.x,pos.y,pos.z);
  
//   // console.log("pos : \n"+pos.x+"\n"+pos.y+"\n"+pos.z)
//   scene.add(ballon);

//   sphere.push(ballon);
//   console.log(sphere);


// }

  loader.load( 'model/scene.glb', function ( gltf ) {
    // console.log("A")
    // console.log(gltf.scene)
    // scene.add( gltf.scene );

    var createSphere = function(pos){
      // pos -> 벡터값이 매개변수로 들어옴
    
      // let geometry = new THREE.SphereGeometry(4,30,30);
      // let material = new THREE.MeshPhongMaterial({color:0xffffff*Math.random(),shininess:100});
      // let ballon = new THREE.Mesh(geometry,material);
      gltf.scene.position.set(pos.x,pos.y,pos.z);
      gltf.scene.scale.set(70,70,70);
      // console.log("pos : \n"+pos.x+"\n"+pos.y+"\n"+pos.z)
      let balloon = gltf.scene.clone();
      scene.add(balloon);
    
      sphere.push(balloon);
      console.log(sphere)
    
    }

    var onMouseClick = function(e){

      var vec = new THREE.Vector3(); // create once and reuse
      var pos = new THREE.Vector3(); // create once and reuse

      vec.set(
          ( e.clientX / window.innerWidth ) * 2 - 1,
          - ( e.clientY / window.innerHeight ) * 2 + 1,
          0.5 );
      
      vec.unproject( camera );

      vec.sub( camera.position ).normalize();

      var distance = - camera.position.z / vec.z;

      pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

    
  
      createSphere(pos);


  }
  window.addEventListener("click",onMouseClick,false);

}, undefined, function ( error ) {

  console.error( error );

} );

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

  class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, scene, camera, time) {
      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(scene.children);
      
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        this.pickedObject = intersectedObjects[0].object;
        // save its color
        this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
        // set its emissive color to flashing red/yellow
        this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
        
            // 마지막을 제외한 나머지 삭제
        if(this.pickedObject != sphere[sphere.length - 1])
          scene.remove(this.pickedObject);
        // console.log(this.pickedObject.position)
        // this.pickedObject.position.set(10,10,10);
      
      }
      
        // this.pickedObject.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
      
    }
  }

  const pickPosition = {x: 0, y: 0};
  const pickHelper = new PickHelper();
  clearPickPosition();

  function render(time) {
    time *= 0.001;  // convert to seconds;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    pickHelper.pick(pickPosition, scene, camera, time);

    renderer.render(scene, camera);

    if(sphere != null){
      sphere.forEach(function(value){
          value.position.y += 0.2;
      });
  }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
  }

  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }
  // window.addEventListener("click",onMouseClick,false);
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);

  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault(); 
    setPickPosition(event.touches[0]);
  }, {passive: false});

  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });

  window.addEventListener('touchend', clearPickPosition);
}

main();
