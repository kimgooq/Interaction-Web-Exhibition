import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
        
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';



let scene,camera,renderer,light1,light2,rayCast,mouse,controls;

let sphere,cube;



let onMouseClick = function(e){

    

    let gap1 = e.clientX - e.offsetX

    let gap2 = e.clientY - e.offsetY

    mouse.x = ( (e.clientX - gap1)/(window.innerWidth) )*2 -1;

    mouse.y =  -( (e.clientY-gap2)/(window.innerHeight) )*2 +1;

    

    rayCast.setFromCamera(mouse,camera);
    console.log(mouse)

}



let createGeometry = function(){

     let geometry = new THREE.BoxGeometry(4,4,4);

     let material = new THREE.MeshLambertMaterial({color:0xabcdef});

     cube = new THREE.Mesh(geometry,material);

     cube.position.set(0,2,3);

     scene.add(cube);

   

     geometry = new THREE.SphereGeometry(4,30,30);

     material = new THREE.MeshLambertMaterial({color:0xabcdef});

     sphere = new THREE.Mesh(geometry,material);

     sphere.position.set(10,2,3);

     scene.add(sphere);    

}



let init = function(){

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,10000);

    camera.position.set(0,10,40);

    camera.lookAt(scene.position);

    

    // light1 = new THREE.DirectionalLight(0xffffff,1);

    // light2 = new THREE.DirectionalLight(0xffffff,1);

    // light2.position.set(0,10,2);

    // scene.add(light1);

    // scene.add(light2);

    
    light1 = new THREE.DirectionalLight(0xffffff,1);
    scene.add(light1);
    let grid = new THREE.GridHelper(100,20);
    scene.add(grid);
  


    createGeometry();

  

    rayCast = new THREE.Raycaster();

    mouse = new THREE.Vector2();

    mouse.x = mouse.y = -1;

 

    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth,window.innerHeight);



   document.getElementById('webgl-pick1').appendChild(renderer.domElement);

   renderer.domElement.addEventListener("click",onMouseClick,false);

   controls = new OrbitControls(camera,renderer.domElement);
   controls.target.set(0,0,0);

}



let mainLoop = function(){

     sphere.material.color.set(0x0450fb);

     cube.material.color.set(0xff4500);

     let intersects = rayCast.intersectObjects(scene.children);

     intersects.forEach(obj=>obj.object.material.color.set(0x00ff00));

     requestAnimationFrame(mainLoop);

     renderer.render(scene,camera);

}



init()

mainLoop();