import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
// import Stats from 'three/examples/jsm/libs/stats.module'

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#C8EBFA");

  const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000);
  camera.position.set(10,10,10);


  const light1 = new THREE.DirectionalLight(0xffffff,5);
  scene.add(light1);
  light1.position.set(0, 0, 500);

  const light2 = new THREE.DirectionalLight(0xffffff,5);
  scene.add(light2);
  light2.position.set(-50, 100, 0);

  const light3 = new THREE.DirectionalLight(0xffffff,5);
  scene.add(light3);
  light3.position.set(50, 100, 0);

  const light4 = new THREE.DirectionalLight(0xffffff,5);
  scene.add(light4);
  light4.position.set(0, 0, -500);
  
  const helper1 = new THREE.DirectionalLightHelper(light1);
  scene.add(helper1);
  
  const helper2 = new THREE.DirectionalLightHelper(light2);
  scene.add(helper2);

  const helper3 = new THREE.DirectionalLightHelper(light3);
  scene.add(helper3);

  const helper4 = new THREE.DirectionalLightHelper(light4);
  scene.add(helper4);

  // let grid = new THREE.GridHelper(100,20);
  // scene.add(grid);


  var sphere = new Array();

  const loader = new GLTFLoader();
  

  const controls = new OrbitControls(camera,renderer.domElement);
  controls.target.set(0,0,0);


loader.load( 'model/red.glb', function ( gltf ) {


  gltf.scene.position.set(0,0,0);
  let balloon = gltf.scene.clone();
  scene.add(balloon);

  sphere.push(balloon);
  

});

  var count = 0;
  
  let color = ["red","orange","yellow","blue","silver"];

  // modelLoad(color[count]);

  // 물리엔진
  Ammo().then( start )
            
  function start(){

      //code goes here

  }

  var createSphere = function(pos,color){
    // pos -> 벡터값이 매개변수로 들어옴
  
    // let geometry = new THREE.SphereGeometry(4,30,30);
    // let material = new THREE.MeshPhongMaterial({color:0xffffff*Math.random(),shininess:100});
    // let ballon = new THREE.Mesh(geometry,material);

    loader.load( 'model/'+color+'.glb', function ( gltf ) {
       
        
    
      gltf.scene.position.set(pos.x,pos.y,pos.z);
      // gltf.scene.scale.set(70,70,70);
      // console.log("pos : \n"+pos.x+"\n"+pos.y+"\n"+pos.z)
      let balloon = gltf.scene.clone();
      scene.add(balloon);
    
      sphere.push(balloon);
      // console.log(sphere[sphere.length-1].children[0].children)
  
    }, undefined, function ( error ) {
  
      console.error( error );
  
    } );
    
  
  }

  var onMouseClick = function(e){
    console.log(count);
    count++;
    if(count == 5){
      count = 0;
    }

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

    createSphere(pos,color[count]);

  }
  window.addEventListener("click",onMouseClick,false);

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
      

      // console.log(intersectedObjects)
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
          value.position.y += 0.1;
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

  function setPickPosition(e) {
    let raycaster = new THREE.Raycaster();

    const pos = getCanvasRelativePosition(e);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    // let mouse;
    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    // mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    // mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera( pickPosition, camera );    

    //3. compute intersections (note the 2nd parameter)
    var intersects = raycaster.intersectObjects( scene.children, true );
    if(intersects.length > 0){

      let pickedObject = intersects[0].object;

      sphere.forEach(function(value,index){
        if(pickedObject.uuid == value.children[0].children[0].uuid){
          // value
        }
          // scene.remove(value);
      });
      
      

      // scene.remove(pickedObject);
      console.log(intersects[0].object.uuid)
      // if(pickedObject != sphere[sphere.length - 1])
      //   console.log( intersects);   
          // scene.remove(this.pickedObject);
    }
 


    for ( var i = 0; i < intersects.length; i++ ) {
       
        /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
        */
    }
// Step 2: Detect normal objects
    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    pickPosition.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    pickPosition.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera( pickPosition, camera );    

    //3. compute intersections (no 2nd parameter true anymore)
    var intersects = raycaster.intersectObjects( scene.children );

    for ( var i = 0; i < intersects.length; i++ ) {
        console.log( intersects[ i ] ); 
        /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
        */
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
