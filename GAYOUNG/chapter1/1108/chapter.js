window.addEventListener("load", eventWindowLoaded, false);

var Debugger = function () {};
let count = 100;
let light = 0.35;

Debugger.log = function (message) {
  try {
    console.log(message);
  } catch (exception) {
    return;
  }
};

function eventWindowLoaded() {
  canvasApp();
}

function canvasApp() {
  Debugger.log("Drawing Canvas");

  var canvas = document.getElementById("canvasOne");
  var ctx = canvas.getContext("2d");

  var w = (canvas.width = window.innerWidth);
  var h = (canvas.height = window.innerHeight);

  function reOffset() {
    var BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
  }

  var offsetX, offsetY;
  reOffset();

  window.onscroll = function (e) {
    reOffset();
  };

  window.onresize = function (e) {
    reOffset();
  };

  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("touchmove", mouseMove, false);
  //클릭하면 점점 크기 커짐
  canvas.addEventListener(
    "click",
    () => {
      if (count == 0) count = 100;
      else count += 50;
      if (count >= 250) count = 0;
      console.log(count);
    },
    false
  );

  function draw(cx, cy, radius) {
    ctx.save();
    ctx.clearRect(0, 0, w, h);

    var radialGradient = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);

    radialGradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    radialGradient.addColorStop(0.35, "rgba(0, 0, 0, 1)");
    radialGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "destination-out";

    ctx.arc(cx, cy, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = radialGradient;
    ctx.fill();

    ctx.restore();
  }

  function mouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    draw(mouseX, mouseY, count);
  }
  draw(w / 2, h / 2, 100);
}
