var img;
var drips = [];
var interval;
let counter = 0;
let form = 0;

function preload() {
  img = loadImage("Starry_Night.jpg");
}

function setup() {
  img.resize(windowHeight, 0);
  createCanvas(img.height, img.width);
  interval = img.height / 5; // 그림을 N x N칸으로 나눌 것인지
  angleMode(DEGREES);
  form = random(1); // shape (원:1, 사각형:2~)
  noStroke();
  for (let y = interval / 2; y <= img.height; y += interval) {
    for (let x = interval / 2; x <= img.width; x += interval) {
      let c = img.get(x, y);
      c[3] = 200;
      let id = c[0] + c[1] + c[2];
      console.log(id);
      if (id > 0) {
        drips.push(new Pixel(x, y, c, id));
        //fill(c, 128);
        //ellipse(x, y, 7);
      }
    }
  }
}

function draw() {
  counter += 1;
  background(0);
  for (let d of drips) {
    if (d.id < counter) {
      d.move();

      if (d.y > 0) {
        d.show();
      }
    }
  }
}

//function keyPressed() {
//  save("pix.jpg");
//}
