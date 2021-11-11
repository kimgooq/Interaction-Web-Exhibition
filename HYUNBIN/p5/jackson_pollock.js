let id = 0;
let particles = [];

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  dom_setup();
  background(220);
}

function CircleOne(x, y, col, id) {
  this.x = x;
  this.y = y;
  this.col = col;
  this.id = id;
  this.speed = 0;

  // noStroke();

  this.display = function () {
    // stroke("red");
    // strokeWeight(4);
    fill(this.col);
    if (this.speed > 100) {
      // size ( speed )
      this.speed = this.speed / 10;
      ellipse(this.x, this.y, this.speed);
    } else {
      ellipse(this.x, this.y, this.speed);
    }
  };

  this.update = function () {
    px = pow(mouseX - pmouseX, 2);
    py = pow(mouseY - pmouseY, 2);
    this.speed = sqrt(px + py) + 10;
    this.x += (mouseX - this.x + this.speed) / 12;
    this.y += (mouseY - this.y + this.speed) / 12;

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

    new CircleTwo(mouseX, mouseY, ran_col[random_index]);
  };
}

function CircleTwo(x, y, col) {
  this.x = x;
  this.y = y;
  this.col = col;
  this.size = 60 / Math.round(Math.random() * 10);

  noStroke();
  fill(this.col);
  for (let i = 0; i < Math.round(Math.random() * 6); i++) {
    ellipse(
      this.x + Math.random() * 40,
      this.y + Math.random() * 40,
      this.size
    );
  }
}

function draw() {
  for (particle of particles) {
    particle.display();
    if (particle.id === id) {
      particle.update();
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

  if (mouseButton === LEFT) {
    particles.push(new CircleOne(mouseX, mouseY, colorPicker.color(), id));
  }
  /*
  else if (mouseButton === RIGHT) {
    new CircleTwo(mouseX, mouseY, ran_col[random_index]);
  }
  */
}

function mouseReleased() {
  id++;
}

const dom_setup = () => {
  document
    .querySelector("#defaultCanvas0")
    .addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

  const menu = document.createElement("div");
  menu.style.position = "fixed";
  menu.style.top = "0px";
  menu.style.left = `${windowWidth / 4}px`;
  menu.style.width = "50vw";
  menu.style.height = "80px";
  menu.style.padding = "10px";
  menu.style.backgroundColor = "white";
  menu.style.userSelect = "none";
  menu.innerHTML =
    "<h3>좌클릭 후 드래그 : 그리기 &nbsp</h3> <h3>우클릭 : 흩뿌리기</h3>";
  document.querySelector("body").appendChild(menu);
  colorPicker = createColorPicker("#ed225d");
  colorPicker.position(windowWidth / 2, 15);

  const btn = document.createElement("button");
  btn.innerHTML = "저장하기";
  btn.onclick = () => {
    saveCanvas("my_jackson_pollock", "jpg");
  };
  menu.appendChild(btn);
};
