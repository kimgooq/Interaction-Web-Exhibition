let img;
let particles = [];
let continuous = 0;

function preload() {
  let passStr = "Starry_Night.jpg";
  img = loadImage(passStr);
}

function Particle(x_pos, y_pos, col, size) {
  this.initial_x = x_pos;
  this.initial_y = y_pos;
  this.x_pos = this.initial_x;
  this.y_pos = this.initial_y;
  this.col = col;
  this.size = size;

  this.update_default = function () {
    this.x_pos = random(x_pos - 1, x_pos + 1);
    this.y_pos = random(y_pos - 1, y_pos + 1);
  };
  //update_default에 의해 update()가 작동X
  //오히려좋아
  this.update = function () {
    let d = dist(this.x_pos, this.y_pos, mouseX, mouseY);
    if (d < 100) {
      this.x_pos -= (mouseX - this.initial_x) / 12;
      this.y_pos -= (mouseY - this.initial_y) / 12;
    } else {
      this.x_pos -= (this.x_pos - this.initial_x) / 12;
      this.y_pos -= (this.y_pos - this.initial_y) / 12;
    }
  };

  this.display = function () {
    fill(this.col);
    ellipse(this.x_pos, this.y_pos, this.size);
  };

  this.check = function () {
    console.log(continuous);
  };

  this.trans = function () {
    translate(this.x_pos, this.y_pos);
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  // image(img, 0, 0);
  for (let i = 0; i < img.width; i += 15) {
    for (let j = 0; j < img.height; j += 15) {
      let size = 12;
      let col = img.get(i, j);
      noStroke();
      particles.push(new Particle(i, j, col, size));
    }
  }
}

function draw() {
  background("black");
  //fill("black");
  //circle(mouseX, mouseY, 200);
  for (particle of particles) {
    particle.update_default();
    particle.update();
    particle.display();
  }
}
