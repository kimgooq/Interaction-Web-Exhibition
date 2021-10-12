// particles = new Array();
particles = [];
let alpha;
const width = 900;
const height = 300;

let img;

function setup() {
  createCanvas(width, height);
  // image(img, 0, 0, width, height);
  // size(900, 200);
  background(0);
  noStroke();
  setParticles();
  console.log(pixels);
}

function draw() {
  for (particle of particles) {
    // particle.test();
    particle.move();
  }

  background("black");
  fill("black");
  frameRate(20);
  alpha = map(mouseX, 0, width, 5, 35);
  fill(0, alpha);
  rect(0, 0, width, height);

  loadPixels();
  // particles.forEach((value) => {
  //   value.move();
  //   console.log(value);
  // });

  updatePixels();
}

function preload() {
  img = loadImage("image.jpg");
}

function Particle(xIn, yIn, cIn) {
  this.posX = xIn;
  this.posY = yIn;
  this.color = cIn;
  this.incr = 0;
}

Particle.prototype = Object.create(Particle.prototype);

Particle.prototype.move = function () {
  this.update();
  this.wrap();
  this.display();
};

Particle.prototype.update = function () {
  this.incr += 0.008;
  // console.log(this.posX);
  let theta = noise(this.posX * 0.006, this.posY * 0.004, this.incr) * TWO_PI;
  // ******
  // console.log(noise(this.posX * 0.006, this.posY * 0.004, this.incr));
  this.posX += 2 * cos(theta);
  this.posY += 2 * sin(theta);
};

Particle.prototype.wrap = function () {
  if (this.posX < 0) this.posX = width;
  if (this.posX > width) this.posX = 0;
  if (this.posY < 0) this.posY = height;
  if (this.posY > height) this.posY = 0;
};

Particle.prototype.display = function () {
  if (
    this.posX > 0 &&
    this.posX < width &&
    this.posY > 0 &&
    this.posY < height
  ) {
    let index = parseInt(this.posX) + parseInt(this.posY) * width;
    pixels[index] = this.color;
    // console.log(index);
    // console.log(pixels[index]);
    // console.log(pixels[parseInt(this.posX) + parseInt(this.posY)].color);
    // console.log(pixels[parseInt(this.posX) + parseInt(this.posY) * width]);

    // console.log(pixels);
  }
};

function setParticles() {
  //   particles = new Particle[6000]();
  for (let i = 0; i < 6000; i++) {
    let x = random(width);
    let y = random(height);
    let adj = map(y, 0, height, 255, 0);
    // console.log(color(40, adj, 255));

    let c = color(40, adj, 255);
    // console.log(c);
    let p = new Particle(x, y, c);

    particles.push(p);
  }
}

function mousePressed() {
  setParticles();
}

//############################################
// Particle.prototype.move = function () {
//   this.update();
//   this.wrap(this.posX);
//   this.display();
// };

// Particle.prototype.update = function () {
//   this.incr += 0.008;
//   let theta = noise(this.posX * 0.006, this.posY * 0.004, this.incr) * TWO_PI;
//   this.posX += 2 * cos(theta);
//   this.posY += 2 * sin(theta);
// };

// Particle.prototype.wrap = (posX) => {
//   console.log(posX);
//   if (this.posX < 0) this.posX = width;
//   if (this.posX > width) this.posX = 0;
//   if (this.posY < 0) this.posY = height;
//   if (this.posY > height) this.posY = 0;
// };

// Particle.prototype.display = () => {
//   if (
//     this.posX > 0 &&
//     this.posX < width &&
//     this.posY > 0 &&
//     this.posY < height
//   ) {
//     console.log("display");
//     pixels[this.posX + this.posY * width] = this.color;

//     console.log(pixels);
//   }
// };
