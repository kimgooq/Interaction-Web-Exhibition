window.addEventListener( 'resize', onWindowResize );
var scene, camera, renderer;
var geometry, material, mesh, videoTexture, movieMaterial;
var video, video_canvas;

initWebcam();
init();
animate();

function initWebcam() {

	video = document.getElementById('video');
  canvas = document.getElementById('video_canvas');
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occured! " + err);
    });

}

function init() {
	//scene = new THREE.Scene();

	var loader = new THREE.ObjectLoader();

	loader.load("js/test.json", function(obj) {
		//scene = obj;
		//camera = obj.children[0];
		for (var i = 0; i < obj.children.length; i++) {
			console.log(obj.children[i])
			if (obj.children[i].type != 'PerspectiveCamera') {
				obj.children[i].rotation.z += Math.PI;

			}

			if (obj.children[i].name == 'Suzanne') {
					videoTexture = new THREE.Texture( canvas );
					videoTexture.minFilter = THREE.LinearFilter;
					videoTexture.magFilter = THREE.LinearFilter;

					movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
					obj.children[i].material = movieMaterial;
				}

		}
		scene = obj;
		camera = obj.children[0];
		//
		//camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

		//camera.position.z = 10;
		scene.add(camera);

		//geometry = new THREE.BoxGeometry( 20, 20, 20 );


		//
		//mesh = new THREE.Mesh( geometry, movieMaterial );
		//scene.add( mesh );
		}
	);

	//


	//camera.position.z = 1000;
	//


	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.domElement.style.cssFloat = "right";
	document.body.appendChild( renderer.domElement );

	}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

	requestAnimationFrame( animate );
	canvas_context = canvas.getContext('2d');
	canvas_context.drawImage(video, 0, 0, 320, 240);
	videoTexture.needsUpdate = true;
	renderer.render( scene, camera );

}