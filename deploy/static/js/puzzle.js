window.onload = init;
var grids = new Array();
var pieces = new Array();
var mousePiece = null;

var keyPiece = null;
var keyIndex = null;
var selectMode = true;

var diffX = null;
var diffY = null;

var maxZ = 1;
var hoverGrid = null;

function init() {
  var allElem = document.getElementsByTagName("*");
  for (var i = 0; i < allElem.length; i++) {
    if (allElem[i].className == "piece") pieces.push(allElem[i]);
    if (allElem[i].className == "grid") grids.push(allElem[i]);
  }
  var randomIntegers = randomArray(pieces.length);
  for (i = 0; i < pieces.length; i++) {
    pieces[i].style.backgroundImage =
      "url(image/piece" + (randomIntegers[i] + 1) + ".png)";
  }

  let piece_top = getStyle(pieces[0], "top");
  let piece_left = getStyle(pieces[0], "left");
  let grid_top = getStyle(grids[0], "top");
  let grid_left = getStyle(grids[0], "left");

  piece_top = parseInt(piece_top.slice(0, piece_top.length - 2));
  piece_left = parseInt(piece_left.slice(0, piece_left.length - 2));
  grid_top = parseInt(grid_top.slice(0, grid_top.length - 2));
  grid_left = parseInt(grid_left.slice(0, grid_left.length - 2));

  var k = 0;
  for (i = 0; i < 8; i++) {
    for (var j = 0; j < 4; j++) {
      pieces[k].style.top = piece_top + 100 * i + "px";
      pieces[k].style.left = piece_left + 100 * j + "px";
      grids[k].style.top = grid_top + 100 * i + "px";
      grids[k].style.left = grid_left + 100 * j + "px";
      addEvent(pieces[k], "mousedown", mouseGrab, false);
      pieces[k].style.cursor = "pointer";
      k++;
    }
  }

  document.onkeydown = keyGrab;
  keyPiece = pieces[0];
  keyIndex = 0;
  document.getElementById("jumble").onclick = jumbleIt;
  document.getElementById("solve").onclick = solveIt;
}

function getStyle(object, styleName) {
  if (window.getComputedStyle) {
    return document.defaultView
      .getComputedStyle(object, null)
      .getPropertyValue(styleName);
  } else if (object.currentStyle) {
    return object.currentStyle[styleName];
  }
}

function keyGrab(e) {
  var evt = e || window.event;
  if (evt.keyCode == 32) {
    toggleMode();
    return false;
  }
}

function dropValid(object) {
  for (var i = 0; i < pieces.length; i++) {
    if (withinIt(object, pieces[i])) return false;
  }
  return true;
}

function alignPiece(object) {
  for (var i = 0; i < grids.length; i++) {
    if (withinIt(object, grids[i])) {
      object.style.left = grids[i].style.left;
      object.style.top = grids[i].style.top;
      break;
    }
  }
}

function highlightGrid(object) {
  if (hoverGrid) hoverGrid.style.backgroundColor = "";
  //console.log(hoverGrid);
  for (var i = 0; i < grids.length; i++) {
    if (withinIt(object, grids[i])) {
      hoverGrid = grids[i];
      hoverGrid.style.backgroundColor = "rgb(75, 88, 98)";
      break;
    }
  }
}

function mouseGrab(e) {
  var evt = e || window.event;
  mousePiece = evt.target || evt.srcElement;

  maxZ++;
  mousePiece.style.zIndex = maxZ;

  mousePiece.style.cursor = "move";

  var mouseX = evt.clientX;
  var mouseY = evt.clientY;

  diffX = parseInt(mousePiece.style.left) - mouseX;
  diffY = parseInt(mousePiece.style.top) - mouseY;

  addEvent(document, "mousemove", mouseMove, false);
  addEvent(document, "mouseup", mouseDrop, false);
}

function mouseMove(e) {
  var evt = e || window.event;

  var mouseX = evt.clientX;
  var mouseY = evt.clientY;

  mousePiece.style.left = mouseX + diffX + "px";
  mousePiece.style.top = mouseY + diffY + "px";
  highlightGrid(mousePiece);
}

function mouseDrop(e) {
  if (dropValid(mousePiece)) {
    alignPiece(mousePiece);

    removeEvent(document, "mousemove", mouseMove, false);
    removeEvent(document, "mouseup", mouseDrop, false);
    mousePiece.style.cursor = "pointer";
  }
}

function getStyle(object, styleName) {
  if (window.getComputedStyle) {
    return document.defaultView
      .getComputedStyle(object, null)
      .getPropertyValue(styleName);
  } else if (object.currentStyle) {
    return object.currentStyle[styleName];
  }
}

function withinIt(object1, object2) {
  var within = false;
  var x1 = parseInt(object1.style.left);
  var y1 = parseInt(object1.style.top);
  var left = parseInt(object2.style.left);
  var top = parseInt(object2.style.top);
  var bottom = top + 100;
  var right = left + 100;
  if (x1 > left && x1 < right && y1 > top && y1 < bottom) {
    within = true;
  }
  return within;
}

function randomArray(size) {
  var ra = new Array(size);
  for (var i = 0; i < ra.length; i++) ra[i] = i;
  ra.sort(randOrder);
  return ra;
}

function randOrder() {
  return 0.5 - Math.random();
}

function addEvent(object, evName, fnName, cap) {
  if (object.attachEvent) object.attachEvent("on" + evName, fnName);
  else if (object.addEventListener)
    object.addEventListener(evName, fnName, cap);
}

function removeEvent(object, evName, fnName, cap) {
  if (object.detachEvent) object.detachEvent("on" + evName, fnName);
  else if (object.removeEventListener)
    object.removeEventListener(evName, fnName, cap);
}

function jumbleIt() {
  window.location.reload();
}

function solveIt() {
  for (var i = 0; i < grids.length; i++) {
    pieces[i].style.backgroundImage = "";
    grids[i].style.backgroundImage = "url(image/piece" + (i + 1) + ".png)";
  }
}

function iscomplete() {
  for (var i = 0; i < 32; i++) {
    if (grids[i].left == pieces[i].left && grids[i].top == pieces[i].top) {
    } else {
      return false;
    }
  }
  return true;
}

window.addEventListener("load", () => {
  var bgm = document.getElementById("musicplayer");
  bgm.play();
  bgm.loop = true;
  bgm.volume = "0.35";
});
