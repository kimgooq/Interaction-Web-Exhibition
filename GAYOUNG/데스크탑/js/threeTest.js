// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const canvas = document.querySelector("#canvas")
// const renderer = new THREE.WebGLRenderer({canvas});
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// const animate = function () {
// requestAnimationFrame( animate );

// cube.rotation.x += 0.01;
// cube.rotation.y += 0.01;

// renderer.render( scene, camera );
// };

// animate();

// 파킹관련 클래스
class PickHelper{
    constructor(){
        this.raycaster = new THREE.raycaster();
        this.pickObject = null;
        this.pickedObjectSavedColor = 0;
    }

    pick(normalizedPosition, scene, camera, time){
        // 이미 다른 물체를 피킹했다면 색을 복원하기
        if(this.pickObject){
            this.pickObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
        }

        // 절두체 안에 광선을 쏜다
        this.raycaster.setFromCamera(normalizedPosition,camera);
        // 광선과 교차하는 물체들을 배열로 만든다
        const intertsectedObjects = this.raycaster.intertsectedObjects(scene,children);

        if(intertsectedObjects.length){
            
        }


    }
}

function main(){

    const aspect = 2;   //캔버스 기본값
    const near = 0.1;
    const far = 200;
    const fov = 60;

    const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    // 카메라를 별도 Object 3D의 자식으로 추가해 카메라가 셀카봉처럼 장면 주위를 돌 수 있도록 한다.
    const cameraPole = new THREE.Object3D();
    scene.add(cameraPole);
    cameraPole.add(camera); // 카메라를 봉(pole)에 추가하고 render 함수 안에서 카메라 봉을 돌린다 
    camera.add(light);  // 카메라에 조명도 추가하여 조명이 카메라와 같이 움직이도록 한다
    // 이러면 봉을 회전시켜 카메라가 장면 주위를 돌도록 할 수 있습니다.


    /***** 무작위의 위치, 방향, 크기를 가진 100개의 정육면체 생성 *****/
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth,boxHeight,boxDepth);
    
    // 랜덤 함수
    function rand(min,max){
        if(max == undefined){
            max = min;
            min = 0;
        }
        return min + (max - min) * Math.random();
    }
    // 랜덤으로 컬러를 return하는 함수
    function randomColor(){
        return "hsl(${ rand(360) | 0 },${ rand(50,100) | 0 }%, 50%)";
    }

    const numObjects = 100; // 정육면체 개수
    for(let i =0; i < numObjects; i++){     // 100개의 정육면체 생성

        // random컬러의 material
        const material = new THREE.MeshPhongMaterial({
           color : randomColor(). 
        });

        const cube = new THREE.Mesh(geometry.material);
        scene.add(cube);    //scene에 cube 추가

        // 랜덤으로 위치. 방향.크기를 성정
        cube.position.set(rand(-20,20),rand(-20,20),rand(-20,20));
        cube.rotation.set(rand(Math.PI),rand(Math.PI),0);
        cube.scale.set(rand(3,6),rand(3,6),rand(3,6));
    }


    function render(time){
        time *= 0.001   // 초로 변환

        cameraPole.rotation.y = time = .1;  // render 함수 안에서 카메라 봉을 돌린다 

    }

}