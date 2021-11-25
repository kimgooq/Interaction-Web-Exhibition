let cnv;
let ctx;
let img = new Image();
img.src = "../images/img_1.png";

let arr_rain = [];
let arr_drop = [];
let drop_time = 0;
let drop_delay = 25;
let speed = 1;
let wind = 4;
let time = 0;

img.addEventListener("load", () => {
  let i_width = (window.innerHeight * window.innerWidth) / img.height;
  let i_height = window.innerHeight;
  img.width = i_width;
  img.height = i_height;
  let back_img = document.querySelector("#back_img");
  back_img.setAttribute("src", img.src);
  back_img.style.width = `${img.width}px`;
  back_img.style.height = `${img.height}px`;

  cnv = document.querySelector("#cnv");
  cnv.width = img.width;
  cnv.height = img.height;
  ctx = cnv.getContext("2d");
  ctx.drawImage(img, 0, 0, cnv.width, cnv.height);

  startRain();
});

const startRain = () => {
  time += 1;
  drop_time += time * speed;
  while (drop_time > drop_delay) {
    drop_time -= drop_delay;
    if (arr_rain.length < 700) {
      let rain = new Rain();
      let wind_expand = Math.abs((window.innerHeight / rain.speed) * wind);
      let initial_x_pos = Math.random() * (window.innerWidth + wind_expand);
      if (wind > 0) initial_x_pos -= wind_expand;
      rain.x = initial_x_pos;
      rain.fall();
      arr_rain.push(rain);
    }
  }

  for (let i = arr_rain.length - 1; i >= 0; i--) {
    let r = arr_rain[i];
    r.y += r.speed * r.z;
    r.x += r.z * wind;

    if (r.y > cnv.height) {
      r.disappear();
    }

    if (
      r.y > cnv.height + r.height * r.z ||
      (wind < 0 && r.x < wind) ||
      (wind > 0 && r.x > cnv.width + wind)
    ) {
      arr_rain.splice(i, 1);
    }
  }

  for (let i = arr_drop.length - 1; i >= 0; i--) {
    let d = arr_drop[i];
    d.x += d.x_speed * 3;
    d.y += d.y_speed * 3;
    d.y_speed += 0.3 * 3;
    d.x_speed += (wind / 25) * 3;
    if (d.x_speed < -d.max_speed) {
      d.x_speed = -d.max_speed;
    } else if (d.x_speed > d.max_speed) {
      d.x_speed = d.max_speed;
    }

    if (d.y > cnv.height + d.r) {
      arr_drop.splice(i, 1);
    }
  }

  draw_cnv();
  requestAnimationFrame(startRain);
};

function Rain() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.speed = 25;
  this.width = 2;
  this.height = 40;
  this.isGround = false;

  this.fall = () => {
    this.y = Math.random() * -100;
    this.z = Math.random() * 0.5 + 0.5;
    this.isGround = false;
  };

  this.disappear = () => {
    if (!this.isGround) {
      this.isGround = !this.isGround;
      for (let i = 0; i < 2; i++) {
        let drop = new Drop();
        arr_drop.push(drop);
        drop.fall(this.x);
      }
    }
  };
}

function Drop() {
  this.x = 0;
  this.y = 0;
  this.r = Math.round(Math.random() * 3 + 1);
  this.x_speed = 0;
  this.y_speed = 0;
  this.max_speed = 5;
  this.cnv_drop = document.createElement("canvas");
  this.ctx_drop = this.cnv_drop.getContext("2d");

  this.cnv_drop.width = this.r * 2;
  this.cnv_drop.height = this.cnv_drop.width;

  let circle_color = this.ctx_drop.createRadialGradient(
    this.r,
    this.r,
    1,
    this.r,
    this.r,
    this.r
  );
  circle_color.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  circle_color.addColorStop(1, "rgba(255, 255, 255, 0)");
  this.ctx_drop.fillStyle = circle_color;
  this.ctx_drop.fillRect(0, 0, this.cnv_drop.width, this.cnv_drop.height);

  this.fall = (x) => {
    this.x = x;
    this.y = window.innerHeight;
    let angle = Math.random() * Math.PI - Math.PI * 0.5;
    let fall_speed = Math.random() * this.max_speed;
    this.x_speed = Math.sin(angle) * fall_speed;
    this.y_speed = -Math.cos(angle) * fall_speed;
  };
}

const draw_cnv = () => {
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  ctx.beginPath();
  for (let i = arr_rain.length - 1; i >= 0; i--) {
    let r = arr_rain[i];
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x - wind * r.z * 1.5, r.y - r.height * r.z);
  }
  ctx.lineWidth = Rain.width;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.stroke();

  for (let i = arr_drop.length - 1; i >= 0; i--) {
    let d = arr_drop[i];
    let x_pos = d.x - d.r;
    let y_pos = d.y - d.r;
    ctx.drawImage(d.cnv_drop, x_pos, y_pos);
  }
};

document.querySelector("body").addEventListener("mousemove", (e) => {
  let calc_y = 1 - e.clientY / window.innerHeight;
  drop_delay = Math.pow(calc_y, 2) * 100 + 2;
  wind = (e.clientX / window.innerWidth - 0.5) * 50;
});

window.onload = function () {
  document.getElementById("bgm").muted = false;
  // document.getElementById("bgm").play();
};
