let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(680, 480); // width , height
  // capture.hide();
}

function draw() {
  image(capture, 50, 100, 680, 480); // 시작 좌표 & 해상도
  // fill("black");
  // circle(mouseX, mouseY, 50);
}
