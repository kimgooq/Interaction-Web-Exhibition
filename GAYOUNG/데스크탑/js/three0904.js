let scene,sphere, camera,renderer,light1,rayCast,mouse;
// var controls = initTrackballControls(camera, renderer);
var clock = new THREE.Clock();
let createSphere = function(pos){

     let geometry = new THREE.SphereGeometry(4,30,30);

     let material = new THREE.MeshPhongMaterial({color:0xffffff*Math.random(),shininess:100});

     sphere = new THREE.Mesh(geometry,material);

     sphere.position.set(pos.x,pos.y,pos.z);

     scene.add(sphere);

} 



let onMouseClick = function(e){

   let gap1 = e.clientX - e.offsetX;

   let gap2 = e.clientY - e.offsetY;

   mouse.x = ((e.clientX - gap1) / (window.innerWidth*0.375))*2 -1;

   mouse.y = -((e.clientY - gap2) / (window.innerHeight*0.375))*2 +1;

   rayCast.setFromCamera(mouse,camera);

   createSphere(rayCast.ray.at(50))

   

}

let init = function(){

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

    renderer.domElement.addEventListener('click',onMouseClick,false);

    // controls = initTrackballControls(camera,renderer);

    // clock = new THREE.Clock()        

}



let mainLoop = function(){

//    controls.update(clock.getDelta());

   requestAnimationFrame(mainLoop);

   renderer.render(scene,camera);

}



init()

mainLoop(); 