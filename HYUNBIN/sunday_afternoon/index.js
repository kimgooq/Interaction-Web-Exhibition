let img;

function preload() {
  img = loadImage("../images/img_6.jpg");
}

function setup() {
  createCanvas(100, 100);
  frameRate(100);
  background(0);
  initImage();
}

function draw() {
  for (let i = 0; i < 50; i++) {
    let x = int(random(width));
    let y = int(random(height));
    let col = img.get(x, y);
    col = color(red(col), green(col), blue(col), 120);

    let size = map(brightness(col), 0, 255, width * 0.003, width * 0.005);
    fill(col);
    noStroke();
    ellipse(x, y, size, size);
  }
}

function initImage() {
  //rezsizeCanvas
  var wRatio = img.width / windowWidth;
  var hRatio = img.height / windowHeight;

  if (wRatio < hRatio) resizeCanvas(int(img.width / hRatio), int(windowHeight));
  else resizeCanvas(int(windowWidth), int(img.height / wRatio));

  img.resize(width, height);
}
