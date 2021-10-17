import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module.js";
//import * as THREE from "./three.module.js";
import { cloneUniforms } from "https://cdn.skypack.dev/three@0.133.1/src/renderers/shaders/UniformsUtils.js";
import { ImageUtils } from "https://cdn.skypack.dev/three@0.133.1/src/extras/ImageUtils.js";
var ShaderUtils = {
  lib: {
    fresnel: {
      uniforms: {
        mRefractionRatio: { type: "f", value: 1.02 },
        mFresnelBias: { type: "f", value: 0.1 },
        mFresnelPower: { type: "f", value: 2.0 },
        mFresnelScale: { type: "f", value: 1.0 },
        tCube: { type: "t", value: 1, texture: null },
      },

      fragment_shader: [
        "uniform samplerCube tCube;",
        "varying vec3 vReflect;",
        "varying vec3 vRefract[3];",
        "varying float vReflectionFactor;",
        "void main() {",
        "vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
        "vec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );",
        "refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
        "refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
        "refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",
        "refractedColor.a = 1.0;",
        "gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",
        "}",
      ].join("\n"),
      vertex_shader: [
        "uniform float mRefractionRatio;",
        "uniform float mFresnelBias;",
        "uniform float mFresnelScale;",
        "uniform float mFresnelPower;",
        "varying vec3 vReflect;",
        "varying vec3 vRefract[3];",
        "varying float vReflectionFactor;",
        "void main(void) {",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
        "vec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );",
        "vec3 I = mPosition.xyz - cameraPosition;",
        "vReflect = reflect( I, nWorld );",
        "vRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );",
        "vRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );",
        "vRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );",
        "vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );",
        "gl_Position = projectionMatrix * mvPosition;",
        "}",
      ].join("\n"),
    },
  },
};

let container, camera, scene, renderer;

const spheres = [];

let mouseX = 0,
  mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", onDocumentMouseMove);

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.z = -4000;

  // const textureCube = new THREE.CubeTextureLoader()
  //   .setPath("./image/")
  //   .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
  // textureCube.mapping = THREE.CubeRefractionMapping;
  // textureCube.mapping = THREE.UVMapping;

  var path = "./image/";
  var format = ".jpg";
  var urls = [
    path + "px" + format,
    path + "nx" + format,
    path + "py" + format,
    path + "ny" + format,
    path + "pz" + format,
    path + "nz" + format,
  ];

  var loadedtex = {};
  var textureloaded = 0;
  var to_load = [
    "image/px.jpg",
    "image/nx.jpg",
    "image/py.jpg",
    "image/ny.jpg",
    "image/pz.jpg",
    "image/nz.jpg",
  ];

  var textureCube = new THREE.TextureLoader();
  var load_textures = function () {
    if (textureloaded == to_load.length) {
      return;
    }
    var texture = to_load[textureloaded];
    textureCube.load(texture, function (tex) {
      loadedtex[texture] = tex;
      textureloaded += 1;
      load_textures();
    });
  };

  // const textureCube = new THREE.Texture({image = urls});

  console.log(textureCube);

  // var images = ImageUtils.getDataURL(urls);
  // var textureCube = new THREE.Texture(images);

  scene = new THREE.Scene();
  scene.background = textureCube;

  /////////////////////////////////////////////////////////////////////////////////////

  const geometry = new THREE.SphereGeometry(100, 32, 16);
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xffffff,
  //   envMap: textureCube,
  //   refractionRatio: 0.95,
  // });
  //var shader = ShaderUtils.lib["fresnel"];
  var shader = ShaderUtils.lib["fresnel"];
  var uniforms_clone = cloneUniforms(shader.uniforms);
  uniforms_clone["tCube"].texture = textureCube;
  console.log(shader);
  console.log(uniforms_clone.tCube.texture);
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms_clone,
    //uniforms: cloneUniforms(shader.uniforms),

    vertexShader: shader.vertex_shader,

    fragmentShader: shader.fragment_shader,
  });
  console.log(shader.vertex_shader);

  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 10000 - 5000;
    mesh.position.y = Math.random() * 10000 - 5000;
    mesh.position.z = Math.random() * 10000 - 5000;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
    scene.add(mesh);

    spheres.push(mesh);
  }

  //////////////////////////////////////////////////

  //
  //SceneUtils.addPanoramaCubeWebGL(sceneCube, 100000, textureCube);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  container.appendChild(renderer.domElement);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  const timer = 0.0001 * Date.now();

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  for (let i = 0, il = spheres.length; i < il; i++) {
    const sphere = spheres[i];

    sphere.position.x = 5000 * Math.cos(timer + i);
    sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
  }
  renderer.render(scene, camera);
}
