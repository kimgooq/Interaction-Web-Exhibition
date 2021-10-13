let simpleShader;

let img;

function preload() {
  // Load the shader
  simpleShader = loadShader("assets/basic.vert", "assets/basic.frag");

  // Load the image
  img = loadImage("cow.jpg");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(img.width, img.height, WEBGL);

  // Resize our image
  img.resize(width, height);
}

function draw() {
  // shader() sets the active shader with our shader
  shader(simpleShader);

  // Send the image to the shader
  simpleShader.setUniform("uTexture", img);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

// *** WebCam Shader *** //
/*
// 이 변수는 셰이더 객체를 담습니다.
let theShader;
// 이 변수는 웹캠 비디오를 담습니다.
let cam;

function preload() {
  // 셰이더 불러오기
  theShader = loadShader("assets/webcam.vert", "assets/webcam.frag");
}

function setup() {
  // 셰이더 작동을 위해 WEBGL 모드가 필요합니다.
  createCanvas(710, 400, WEBGL);
  noStroke();

  cam = createCapture(VIDEO);
  cam.size(710, 400);

  cam.hide();
}

function draw() {
  // shader()는 활성화 셰이더를 theShader로 설정합니다.
  shader(theShader);

  // cam을 텍스처로 보내기
  theShader.setUniform("tex0", cam);

  // rect()함수로 화면에 기하 추가하기
  rect(0, 0, width, height);
}
*/
