let id = 0;
let particles = [];

function Particle(x_pos, y_pos, col) {
  this.x_pos = x_pos;
  this.y_pos = y_pos;
  this.col = col;
  this.speed = 10;

  noStroke();

  this.display = () => {
    fill(this.col);
    ellipse(this.x_pos, this.y_pos, this.speed);
  };

  this.update = (speed) => {
    this.x_pos = mouseX;
    this.y_pos = mouseY;
    this.speed = speed;
  };

  this.trans = () => {
    translate(this.x_pos, this.y_pos);
  };
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(mouseDragged);
  background(220);
}

function CircleOne(x, y, col, id) {
  this.x = x;
  this.y = y;
  this.col = col;
  this.id = id;
  this.speed = 0;

  noStroke();

  this.display = function () {
    fill(this.col);
    if (this.speed>120){
      this.speed = 120
      ellipse(this.x, this.y, this.speed);
    }
    else{
      ellipse(this.x, this.y, this.speed+2);
    }
  };

  this.update = function () {
    px = pow(mouseX - pmouseX, 2);
    py = pow(mouseY - pmouseY, 2);
    this.speed = sqrt(px + py);
    this.x += (mouseX - this.x + this.speed) / 36;
    this.y += (mouseY - this.y + this.speed) / 36;
  };

  this.trans = function () {
    translate(this.x, this.y);
  };
}

function draw() {
  for (particle of particles) {
    particle.display();
    if (particle.id === id) {
      particle.update();
      // particle.trans();
    }
  }
}

function mousePressed() {
  ran_col = [
    color(179, 119, 0),
    color(204, 51, 0),
    color(0, 0, 0),
    color(255, 255, 255),
    color(255, 210, 77),
    color(0, 51, 0),
  ];
  // brown, red, black, white, yellow, green
  let random_index = parseInt(random(0, 6));
  particles.push(new CircleOne(mouseX, mouseY, ran_col[random_index], id));
}

function mouseDragged() {}

function mouseReleased() {
  id++;
}

function mouseClicked() {}
