const body = document.querySelector("body");
let x_pos = 0;
let y_pos = 0;
// let speed = 10;
let degree = 0;
let img = new Image();
img.src = "../images/img_1.png";

img.onload = () => {
  console.log(img.width, img.height);
};

function rain() {
  const rainDrop = document.createElement("i");
  rainDrop.classList.add("rain_drop");
  rainDrop.style.top = -(Math.random() * 200) + "px";
  rainDrop.style.left = Math.random() * window.innerWidth + "px";
  rainDrop.style.animationDuration = Math.random() * 1 + "s";
  rainDrop.style.opacity = Math.random() + 0.4;
  rainDrop.style.transform = `rotate(${degree}deg)`;
  body.appendChild(rainDrop);

  setTimeout(() => {
    rainDrop.remove();
  }, 2000);
}

setInterval(rain, 5);

window.addEventListener("mousemove", (e) => {
  let dx = window.innerWidth / 2 - e.clientX;
  let dy = 0 - e.clientY;
  let radian = Math.atan2(dx, dy);
  let rot = radian * (180 / Math.PI);
  if (rot > 0) {
    degree = rot - 90;
  } else if (rot < 0) {
    degree = rot + 90;
  } else {
    degree = rot;
  }
});
