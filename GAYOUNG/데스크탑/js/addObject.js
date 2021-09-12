import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
        
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

// your actual app code

// Configure decoder and create loader.
const manager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(manager);

var scene,camera,renderer,light1,rayCast,controls,clock,mouse,canvas;
var sphere = new Array();


class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, scene, camera, time) {
      // 이미 다른 물체를 피킹했다면 색을 복원합니다
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }
   
      // 절두체 안에 광선을 쏩니다
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // 광선과 교차하는 물체들을 배열로 만듭니다
      const intersectedObjects = this.raycaster.intersectObjects(scene.children);
      if (intersectedObjects.length) {
        // 첫 번째 물체가 제일 가까우므로 해당 물체를 고릅니다
        this.pickedObject = intersectedObjects[0].object;
        // 기존 색을 저장해둡니다
        this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
        // emissive 색을 빨강/노랑으로 빛나게 만듭니다
        this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
      }
    }
  }

  const pickPosition = { x: 0, y: 0 };
  clearPickPosition();

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }
   
  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    pickPosition.y = - ( e.clientY / window.innerHeight ) * 2 + 1;  // Y 축을 뒤집었음
  }
   
  function clearPickPosition() {
    /**
     * 마우스의 경우는 항상 위치가 있어 그다지 큰
     * 상관이 없지만, 터치 같은 경우 사용자가 손가락을
     * 떼면 피킹을 멈춰야 합니다. 지금은 일단 어떤 것도
     * 선택할 수 없는 값으로 지정해두었습니다
     **/
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }




let createSphere = function(pos){
    // pos -> 벡터값이 매개변수로 들어옴

    let geometry = new THREE.SphereGeometry(4,30,30);
    let material = new THREE.MeshPhongMaterial({color:0xffffff*Math.random(),shininess:100});
    let ballon = new THREE.Mesh(geometry,material);
    ballon.position.set(pos.x,pos.y,pos.z);
    
    // console.log("pos : \n"+pos.x+"\n"+pos.y+"\n"+pos.z)
    scene.add(ballon);

    sphere.push(ballon);
    console.log(sphere);


}

let init = function(){
    //Scence 만들기 -> scene, camera, renderer 3가지 필요

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000);
    camera.position.set(0,30,55);

    light1 = new THREE.DirectionalLight(0xffffff,1);
    scene.add(light1);
    // let grid = new THREE.GridHelper(100,20);
    // scene.add(grid);

    rayCast = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;

    canvas = document.querySelector('#webgl-pick');
    renderer = new THREE.WebGLRenderer({canvas});
    // renderer.setSize(window.innerWidth*0.375,window.innerHeight*0.375);
    // document.getElementById('webgl-pick').appendChild(renderer.domElement);

    // 사용자가 화면을 마우스로 클릭하면 마우스 클릭 이벤트 실행하고
    // sphere가 화면에 나타나야한다
    // 이를 위해서 사용자의 마우스 이벤트 좌표를 추출하고, 마우스 좌표값을 rayCast에 넣어서
    // raycaster.ray 기능을 활성화
    renderer.domElement.addEventListener("click",onMouseClick,false);
    renderer.domElement.addEventListener("mousemove",onMouseMove,false);

    controls = new OrbitControls(camera,renderer.domElement);
    controls.target.set(0,0,0);
    

}

let onMouseMove = function(e){

    // var vec = new THREE.Vector3(); // create once and reuse
    // var pos = new THREE.Vector3(); // create once and reuse

    // vec.set(
    //     ( e.clientX / window.innerWidth ) * 2 - 1,
    //     - ( e.clientY / window.innerHeight ) * 2 + 1,
    //     0.5 );
    
    // vec.unproject( camera );

    // vec.sub( camera.position ).normalize();

    // var distance = - camera.position.z / vec.z;

    // pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

    // rayCast.setFromCamera(mouse, camera);


    // let intersects = rayCast.intersectObjects(scene.children);
    // intersects.forEach(obj=>obj.object.material.color.set(0x00ff00));
    // console.log(intersects)
    console.log(e.touches[0])
    setPickPosition(e.touches[0]);
}

let onMouseClick = function(e){
    // mouse의 x,y좌표값을 추출한 후, rayCast.setFromCamera(mouse,camera)기능을 활성화
 
    // let gap1 = e.clientX - e.offsetX;
    // let gap2 = e.clientY - e.offsetY;

    // mouse.x = (e.clientX / window.innerWidth) *2 - 1;
    // mouse.y = -(e.clientX / window.innerWidth) *2 + 1;

    // rayCast.setFromCamera(mouse, camera);
    // // rayCast.ray.at(50) -> ray 메소드 : 카메라에서 ~50까지의 거리 범위 설정
    // console.log("mouse.x : "+mouse.x+"\n mouse.y : "+mouse.y+"\n");
    // console.log(rayCast.ray.at(100));

    // createSphere(rayCast.ray.at(100));


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

    rayCast.setFromCamera(mouse,camera);
 
    createSphere(pos);

    // let intersects = rayCast.intersectObjects(scene.children);
    // console.log(intersects)
    // if(intersects.length == 0){  
    //     createSphere(pos);
    //     return; }
    // else{
    //     let hit = intersects[0].object

    //     sphere.forEach( (obj,index)=>{
    
    //              if(hit == obj.object){
    
    //                     balloons.splice(index,1);
    
    //                     scene.remove(obj.object)
    
    //              }
    
    //   })
    // }
    
   

    

    

}



let mainLoop = function(){
    // controls.update(clock.getDelta());
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

    controls.update();
    if(sphere != null){
        sphere.forEach(function(value){
            value.position.y += 0.2;
        });
    }
    
    requestAnimationFrame(mainLoop);
    renderer.render(scene,camera);

    

}
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


init();
mainLoop();