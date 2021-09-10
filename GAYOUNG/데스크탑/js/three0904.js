import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
        
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

// your actual app code

// Configure decoder and create loader.
const manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(manager);

let scene,sphere,camera,renderer,light1,rayCast,controls,clock,mouse;

let createSphere = function(pos){
    // pos -> 벡터값이 매개변수로 들어옴

    let geometry = new THREE.SphereGeometry(4,30,30);
    let material = new THREE.MeshPhongMaterial({color:0xffffff*Math.random(),shininess:100});
    sphere = new THREE.Mesh(geometry,material);
    sphere.position.set(pos.x,pos.y,pos.z);
    scene.add(sphere);

}

let init = function(){
    //Scence 만들기 -> scene, camera, renderer 3가지 필요

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000);
    camera.position.set(0,30,55);

    light1 = new THREE.DirectionalLight(0xffffff,1);
    scene.add(light1);
    let grid = new THREE.GridHelper(100,20);
    scene.add(grid);

    rayCast = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth*0.375,window.innerHeight*0.375);
    document.getElementById('webgl-pick').appendChild(renderer.domElement);

    // 사용자가 화면을 마우스로 클릭하면 마우스 클릭 이벤트 실행하고
    // sphere가 화면에 나타나야한다
    // 이를 위해서 사용자의 마우스 이벤트 좌표를 추출하고, 마우스 좌표값을 rayCast에 넣어서
    // raycaster.ray 기능을 활성화
    renderer.domElement.addEventListener("click",onMouseClick,false);

    controls = new OrbitControls(camera,renderer.domElement);
    controls.target.set(0,0,0);
    

}

let onMouseClick = function(e){
    // mouse의 x,y좌표값을 추출한 후, rayCast.setFromCamera(mouse,camera)기능을 활성화
 
    let gap1 = e.clientX - e.offsetX;
    let gap2 = e.clientY - e.offsetY;

    mouse.x = ((e.clientX - gap1) / (window.innerWidth*0.375)) *2 - 1;
    mouse.y = -((e.clientX - gap2) / (window.innerWidth*0.375)) *2 + 1;

    rayCast.setFromCamera(mouse, camera);
    // rayCast.ray.at(50) -> ray 메소드 : 카메라에서 ~50까지의 거리 범위 설정
    createSphere(rayCast.ray.at(50));
}

let mainLoop = function(){
    // controls.update(clock.getDelta());
    controls.update();
    requestAnimationFrame(mainLoop);
    renderer.render(scene,camera);
}

init();
mainLoop();