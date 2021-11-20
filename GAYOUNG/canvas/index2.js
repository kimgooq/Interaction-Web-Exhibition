let img;
let particles = [];
let tick = 0;
let hr = 50;
let rs = 15;

function preload() {
  let passStr = "img_1.png";
  img = loadImage(passStr);
}

function Particle(x_pos, y_pos, col, size) {
  this.initial_x = x_pos;
  this.initial_y = y_pos;
  this.x_pos = this.initial_x;
  this.y_pos = this.initial_y;
  this.col = col;
  this.size = size;

  this.update = function () {
    let d = dist(this.x_pos, this.y_pos, mouseX, mouseY);
    if (d < hr / 2) {
      this.x_pos -= (mouseX - this.initial_x) / 6;
      this.y_pos -= (mouseY - this.initial_y) / 6;
    } else {
      // this.y_pos += 1;
      // if (this.y_pos >= cnv.height) {
      //   this.y_pos = 0;
      // }
      this.x_pos -= (this.x_pos - this.initial_x) / 24;
      this.y_pos -= (this.y_pos - this.initial_y) / 24;
    }
  };

  this.display = function () {
    fill(this.col);
    ellipse(this.x_pos, this.y_pos, this.size);
  };
}

function setup() {
  cnv = createCanvas((windowHeight / 233) * 300, windowHeight);
  img.resize((windowHeight / 233) * 300, windowHeight);
  for (let i = rs; i < img.width - rs; i += rs) {
    for (let j = rs; j < img.height - rs; j += rs) {
      let size = rs;
      let col = img.get(i, j);
      noStroke();
      particles.push(new Particle(i, j, col, size));
    }
  }
  dom_setup();
}

function draw() {
  background("black");
  fill("black");
  circle(mouseX, mouseY, hr);

  for (particle of particles) {
    if (
      particle.y_pos < mouseY ||
      particle.x_pos < mouseX - hr / 2 ||
      particle.x_pos > mouseX + hr / 2
    ) {
      particle.update();
      particle.display();
      // cut_image();
    }
  }
}

function mousePressed() {
  hr += rs;
}

const dom_setup = () => {
  const body = document.querySelector("body");
  body.style.display = "flex";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.minHeight = "100vh";
};

const cut_image = () => {
  image(
    img,
    mouseX - hr / 2,
    mouseY,
    hr,
    cnv.height - mouseY,
    mouseX - hr / 2,
    mouseY,
    hr,
    cnv.height - mouseY
  );
};
