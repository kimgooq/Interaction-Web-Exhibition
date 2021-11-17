//PImage b;
//int c,j=199,i;

let img;
let c,
  j = 199;
let i;

function preload() {
  img = loadImage("Starry_Night.jpg");
}

function setup() {
  img.resize(windowHeight, 0);
  createCanvas(img.height, img.width);
  //size(584,584);
  img = loadImage("Starry_Night.jpg");
  noStroke();
}

function draw() {
  for (i = 0; ++i < mouseX; ) {
    c += mouseY;
    c %= width * width;
    fill(img.pixels[c],128);
    rect(c % width, c / width, 9, 9);
  }
  blend(1, 1, width - 1, width - 1, 0, 0, width, width, 1);
}
