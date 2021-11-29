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

  this.display = function () {
    fill(this.col);
    if (this.speed > 70) {
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
    this.x = lerp(this.x, mouseX, 0.05);
    this.y = lerp(this.y, mouseY, 0.05);

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

    new CircleTwo(this.x, this.y, ran_col[random_index]);
  };
}

function CircleTwo(x, y, col) {
  this.x = x;
  this.y = y;
  this.col = col;
  this.size = 20 / Math.round(Math.random() * 10);

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
  if (mouseButton === LEFT) {
    particles.push(new CircleOne(mouseX, mouseY, colorPicker.color(), id));
  }
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
  menu.style.bottom = "0px";
  menu.style.left = `${windowWidth / 4}px`;
  menu.style.width = "50vw";
  menu.style.height = "80px";
  menu.style.borderTopLeftRadius = "30px";
  menu.style.borderTopRightRadius = "30px";
  menu.style.padding = "10px";
  menu.style.backgroundColor = "white";
  menu.style.userSelect = "none";
  menu.style.display = "flex";
  menu.style.justifyContent = "space-around";
  menu.style.alignItems = "center";
  menu.innerHTML = "<h3>좌클릭 드래그로 그리기 </h3>";
  document.querySelector("body").appendChild(menu);
  colorPicker = createColorPicker("#8a1601");
  menu.appendChild(document.querySelector("input"));

  const btn = document.createElement("button");
  btn.innerHTML = "저장하기";
  btn.style.padding = "5px";
  btn.onclick = () => {
    saveCanvas("my_jackson_pollock", "jpg");
  };
  menu.appendChild(btn);
};
