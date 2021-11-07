let img;
let value = 0.003;
let t = 0;

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

    // 0.001
    let size = map(
      brightness(col),
      0,
      255,
      width * (value - 0.001),
      width * value
    );

    /*
    const xAngle = map(mouseX, 0, width, -4 * PI, 4 * PI, true);
    const yAngle = map(mouseY, 0, height, -4 * PI, 4 * PI, true);

    const angle = xAngle * (x / width) + yAngle * (y / height);

    const myX = x + 20 * cos(2 * PI * t + angle);
    const myY = y + 20 * sin(2 * PI * t + angle);
    */

    fill(col);
    noStroke();

    if (mouseIsPressed) {
      rect(x, y, size, size);
    } else {
      ellipse(x, y, size, size);
    }
  }
  // t = t + 0.01;
}

function initImage() {
  //rezsizeCanvas
  var wRatio = img.width / windowWidth;
  var hRatio = img.height / windowHeight;

  if (wRatio < hRatio) resizeCanvas(int(img.width / hRatio), int(windowHeight));
  else resizeCanvas(int(windowWidth), int(img.height / wRatio));

  img.resize(width, height);
}

function mouseClicked() {
  value < 0.01 ? (value += 0.003) : (value = value);
}
