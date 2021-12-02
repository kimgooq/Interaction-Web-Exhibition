var mouseWheelEvt = function (event) {
  if (document.getElementById("piece").doScroll)
    document
      .getElementById("piece")
      .doScroll(event.wheelDelta > 0 ? "left" : "right");
  else if ((event.wheelDelta || event.detail) > 0)
    document.getElementById("piece").scrollLeft -= 200;
  else document.getElementById("piece").scrollLeft += 200;

  return false;
};

$(document).ready(function () {
  document
    .getElementById("piece")
    .addEventListener("mousewheel", mouseWheelEvt);
});

window.onload = function () {
  var strCook = document.cookie;
  if (strCook.indexOf("!~") != 0) {
    var intS = strCook.indexOf("!~");
    var intE = strCook.indexOf("~!");
    var strPos = strCook.substring(intS + 2, intE);
    document.getElementById("piece").scrollLeft = strPos;
  }
};

function SetDivPosition() {
  var intY = document.getElementById("piece").scrollLeft;
  document.title = intY;
  document.cookie = "xPos=!~" + intY + "~!";
}

var rect = $("#index_container")[0].getBoundingClientRect();
var mouse = { x: 0, y: 0, moved: false };
console.log(rect);
console.log($("body")[0].getBoundingClientRect());
$("body").mousemove(function (e) {
  mouse.moved = true;
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Ticker event will be called on every frame

TweenLite.ticker.addEventListener("tick", function () {
  if (mouse.moved) {
    parallaxIt("#piece", -100);
    parallaxIt("#background", -30);
  }
  mouse.moved = false;
});

function parallaxIt(target, movement) {
  TweenMax.to(target, 0.5, {
    x: ((mouse.x - rect.width / 2) / rect.width) * movement,
    y: ((mouse.y - rect.height / 2) / rect.height) * movement,
  });
}
