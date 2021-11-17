let sampleImage;
let eyes = [];
let camera;
let sizeSlider;
let cameraProportion;
let capture;

function preload() {
  sampleImage = loadImage("the_false_mirror_fixed.jpeg");
}

function setup() {
  //sampleImage.resize(0, windowHeight); //windowWidth,0);
  //createCanvas(img.height, img.width);
  //image(sampleImage, 0, 0);
  //createImage(sampleImage.width, sampleImage.height);
  
  //createCanvas(windowWidth, windowHeight);
  //capture = createCapture(VIDEO);
  //capture.size(680, 480);
  //
  // sizeSlider = createSlider(5, 50, 15);
  // sizeSlider.position(10, 10);
  // sizeSlider.style("width", "80px");
  // sizeSlider.input(createEyeGrid);
  setupForCamera();

  createEyeGrid();
}

function createEyeGrid() {
  eyes = [];
  //let eyeSize = sizeSlider.value();
  let eyeSize = 10;
  let eyeOrigin = round(eyeSize / 2);
  for (let x = eyeOrigin; x < width; x += eyeSize) {
    for (let y = eyeOrigin; y < height; y += eyeSize) {
      eyes.push(new Eye(x, y, eyeSize));
    }
  }
}

//handles proportions to setup the camera and prevent distortion
function setupForCamera() {
  let camWidth = 200;
  let camHeight = 150;
  //
  sampleImage.resize(0, windowHeight);
  //
  cameraProportion = camWidth / camHeight;
  camera = createCapture(VIDEO);
  if (windowHeight < windowWidth) {
    camera.size(round(windowHeight * cameraProportion), windowHeight);
    createCanvas(round(windowHeight * cameraProportion), windowHeight);
  } else {
    camera.size(windowWidth, round(windowHeight * (1 / cameraProportion)));
    createCanvas(windowWidth, round(windowHeight * (1 / cameraProportion)));
  }
  camera.hide();
}

function draw() {
  background(0);
  eyeMirror();
}

function eyeMirror() {
  camera.loadPixels();
  for (let eye of eyes) {
    let redIndex = (eye.y * width + eye.x) * 4;
    let r = camera.pixels[redIndex];
    let g = camera.pixels[redIndex + 1];
    let b = camera.pixels[redIndex + 2];
    let shade = (r + g + b) / 765;
    eye.setColor(shade);
  }
}
