let cnv;
let ctx;
let img = new Image();
img.src = "../images/img_1.png";

let arr_rain = [];
let arr_drop = [];
let drop_time = 0;
let drop_delay = 1000;
let speed = 1;
let wind = 4;
let color = "lightskyblue";
// let color = `rgba(112, 243, 246, 1)`;
let time = 0;

img.addEventListener("load", () => {
  cnv = document.querySelector("#cnv");
  cnv.width = img.width;
  cnv.height = img.height;
  ctx = cnv.getContext("2d");
  // ctx.drawImage(img, 0, 0, cnv.width, cnv.height);
  // cnv.addEventListener("mousemove", (e) => {
  //   console.log("Adda");
  //   drop_delay = Math.pow(1 - e.clientY, 3) * 100 + 2;
  //   wind = (e.clientX - 0.5) * 50;
  // });

  // setInterval(() => {
  startRain();
  // }, 10);
});

const startRain = () => {
  time += 1;
  drop_time += time * speed;
  // console.log(drop_time);
  while (drop_time > drop_delay) {
    drop_time -= drop_delay;
    // time = 0;
    // let initial_x_pos = Math.random() * wind;
    let initial_x_pos = Math.random() * window.innerWidth;
    let rain = new Rain();
    // if ( wind > 0 ) initial_x_pos -= wind
    rain.x = initial_x_pos;
    rain.fall();
    arr_rain.push(rain);
  }

  for (let i = arr_rain.length - 1; i >= 0; i--) {
    let r = arr_rain[i];
    r.y += r.speed * r.z;
    r.x += r.z * wind;

    if (r.y > cnv.height) {
      r.disappear();
      // console.log(r.x);
    }

    if (
      r.y > cnv.height + r.height * r.z ||
      (wind < 0 && r.x < wind) ||
      (wind > 0 && r.x > cnv.width + wind)
    ) {
      arr_rain.splice(i, 1);
      // let rain_again =
      // reuse_rain.push(rain_again);
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
      // let drop_again =
      // arr_drop.push(drop_again);
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
    // console.log(this.x);
    if (!this.isGround) {
      this.isGround = !this.isGround;
      for (let i = 0; i < 16; i++) {
        let drop = new Drop();
        arr_drop.push(drop);
        drop.fall(this.x);
        // console.log(arr_drop.length, drop.x, drop.y);
        // drop 시작
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
  circle_color.addColorStop(0, "rgba(112, 243, 246, 1)");
  circle_color.addColorStop(1, "rgba(112, 243, 246, 0)");
  this.ctx_drop.fillStyle = circle_color;
  this.ctx_drop.fillRect(0, 0, this.cnv_drop.width, this.cnv_drop.height);

  this.fall = (x) => {
    this.x = x;
    // console.log(x);
    this.y = window.innerHeight;
    // console.log(arr_drop.length, this.x, this.y);
    let angle = Math.random() * Math.PI - Math.PI * 0.5;
    let speed = Math.random() * this.max_speed;
    this.x_speed = Math.sin(angle) * speed;
    this.y_speed = -Math.cos(angle) * speed;
  };
}

const draw_cnv = () => {
  // console.log("Aaa");
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  ctx.beginPath();
  for (let i = arr_rain.length - 1; i >= 0; i--) {
    let r = arr_rain[i];
    // let x_pos = r.x;
    // let y_pos = r.y;
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x - wind * r.z * 1.5, r.y - r.height * r.z);
  }
  ctx.lineWidth = Rain.width;
  ctx.strokeStyle = color;
  ctx.stroke();

  for (let i = arr_drop.length - 1; i >= 0; i--) {
    let d = arr_drop[i];
    // let x_pos = d.x - d.r;
    // let y_pos = d.y - d.r;
    // console.log(d.x, d.y);
    ctx.drawImage(d.cnv_drop, d.x, d.y);
  }
};
