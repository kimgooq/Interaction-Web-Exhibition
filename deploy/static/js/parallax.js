var rect = $("#container")[0].getBoundingClientRect();
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
    parallaxIt(".slide", -100);
    parallaxIt("img", +50);
  }
  mouse.moved = false;
});

function parallaxIt(target, movement) {
  TweenMax.to(target, 0.5, {
    x: ((mouse.x - rect.width / 2) / rect.width) * movement,
    y: ((mouse.y - rect.height / 2) / rect.height) * movement,
  });
}
