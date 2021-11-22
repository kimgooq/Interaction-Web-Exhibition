var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var back_img = new Image();

var RandomInt, RandomSize;

var img = new Image();
var url, back_url;
back_url = 2;
var wid, hei;

var num_break = 0;

document.getElementById("canvas").addEventListener("click", onclick);

// back_img.src = "http://img.fliptab.io/space_galaxy/1920x1200/125822212.jpg";
back_img.src = "./image/wall_1.jpg";

back_img.addEventListener("load", () => {
  canvas.width = back_img.width;
  canvas.height = back_img.height;
  context.drawImage(back_img, 0, 0, canvas.width, canvas.height);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function onclick(event) {
  RandomInt = getRandomInt(1, 4);
  url = "./image/crack_" + RandomInt + ".png";
  img.src = url;
  console.log(url);
  RandomSize = getRandomInt(6, 13) * 20;
  wid = RandomSize;
  hei = wid;
  context.drawImage(img, event.x - wid / 2, event.y - hei / 2, wid, hei);

  num_break += 1;

  if (num_break > 10) {
    num_break = 0;
    if (back_url > 5) {
      back_url = 1;
    }

    back_img.src = "./image/wall_" + back_url + ".jpg";
    back_url += 1;
    back_img.addEventListener("load", () => {
      canvas.width = back_img.width;
      canvas.height = back_img.height;
      context.drawImage(back_img, 0, 0, canvas.width, canvas.height);
    });
  }
}
