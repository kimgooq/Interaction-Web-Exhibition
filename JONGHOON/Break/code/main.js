function Chip(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.cracks = [];
  this.cracksLength;
  this.interCracks = [];
  this.interCracksLength = Math.floor(Math.random() * 100) + 50;
  this.maxCrackGap = 45;
}

Chip.prototype.init = function () {
  var dir = 0,
    i = 0;
  while (dir < 360) {
    // Define direction angle for each crack
    if (i == 0) dir = Math.floor(Math.random() * this.maxCrackGap);
    else dir += Math.floor(Math.random() * this.maxCrackGap);

    // Create crack
    this.cracks[i] = new Crack(this.id, i, dir);
    if (i > 0)
      pieces[i - 1] = new Piece(
        this.id,
        i - 1,
        this.cracks[i - 1].dir,
        this.cracks[i].dir
      );
    i++;
  }
  // Last piece
  pieces[i - 1] = new Piece(
    this.id,
    i - 1,
    this.cracks[i - 1].dir,
    this.cracks[0].dir
  );
  this.cracksLength = i - 1;
  for (var u = 0; u < this.interCracksLength; u++) {
    var randomCrackId_1 = Math.floor(Math.random() * (this.cracksLength - 1));
    var randomCrackId_2 = randomCrackId_1 + 1;
    this.interCracks[u] = new InterCrack(
      this.id,
      u,
      randomCrackId_1,
      randomCrackId_2
    );
  }
};

Chip.prototype.die = function () {
  chips[this.id] = null;
  delete chips[this.id];
};

/*
	Each chip has cracks
*/

function Crack(parentChip, id, dir) {
  this.parentChip = parentChip;
  this.id = id;
  this.dir = dir;
  this.distanceFromCenter = Math.floor(Math.random() * 10);
  this.x = chips[this.parentChip].x;
  this.y = chips[this.parentChip].y;

  // this.length = DIAG
  this.length = DIAG * 8;
  this.segments = Math.floor(Math.random() * 2);

  // this.endX = this.x + Math.cos(degToRad(this.dir)) * this.length;
  // this.endY = this.y + Math.sin(degToRad(this.dir)) * this.length;

  this.endX = this.x + (Math.cos(degToRad(this.dir)) * this.length) / 4;
  this.endY = this.y + (Math.sin(degToRad(this.dir)) * this.length) / 4;

  this.draw();
}

Crack.prototype.draw = function () {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.endX, this.endY);
  ctx.strokeStyle = "red";
  var line_width = Math.random();
  if (line_width < 0.3) ctx.lineWidth = 1;
  if (line_width >= 0.3 && line_width <= 0.8) ctx.lineWidth = 2;
  if (line_width > 0.8) ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
};

/*
	InterCracks are smaller cracks that are perpendicular to regular cracks
*/

function InterCrack(parentChipId, id, parentCrack_1, parentCrack_2) {
  this.parentChipId = parentChipId;
  this.id = id;
  this.parentCrack_1 = parentCrack_1;
  this.parentCrack_2 = parentCrack_2;

  this.distanceFromCenter =
    Math.floor(Math.random() * Math.max(WIDTH, HEIGHT)) + 10;
  var parentChip = chips[this.parentChipId];
  var parentCrack_1 = parentChip.cracks[parentCrack_1];
  var parentCrack_2 = parentChip.cracks[parentCrack_2];
  this.x =
    parentChip.x +
    Math.cos(degToRad(parentCrack_1.dir)) * this.distanceFromCenter;
  this.y =
    parentChip.y +
    Math.sin(degToRad(parentCrack_1.dir)) * this.distanceFromCenter;

  // this.endX =
  //   parentChip.x +
  //   Math.cos(degToRad(parentCrack_2.dir)) * this.distanceFromCenter;
  // this.endY =
  //   parentChip.y +
  //   Math.sin(degToRad(parentCrack_2.dir)) * this.distanceFromCenter;

  this.endX =
    parentChip.x +
    Math.cos(degToRad(parentCrack_2.dir / 2)) * this.distanceFromCenter;
  this.endY =
    parentChip.y +
    Math.sin(degToRad(parentCrack_2.dir / 2)) * this.distanceFromCenter;

  this.draw();
}

InterCrack.prototype.draw = function () {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.endX, this.endY);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();
};

/* 
	Pieces are used to make the animated circular transition 
*/

function Piece(chipId, id, dir1, dir2) {
  this.chipId = chipId;
  this.id = id;
  this.dir1 = dir1;
  this.dir2 = dir2;
  this.a = 0;
  this.dist = DIAG;
  this.aSpeed = 0.004;
  this.points = {
    x1: chips[chipId].x,
    y1: chips[chipId].y,
    //수정
    // x2: chips[chipId].x + Math.cos(degToRad(this.dir1)) * this.dist,
    // y2: chips[chipId].y + Math.sin(degToRad(this.dir1)) * this.dist,
    // x3: chips[chipId].x + Math.cos(degToRad(this.dir2)) * this.dist,
    // y3: chips[chipId].y + Math.sin(degToRad(this.dir2)) * this.dist,
    x2: chips[chipId].x + (Math.cos(degToRad(this.dir1)) * this.dist) / 5,
    y2: chips[chipId].y + (Math.sin(degToRad(this.dir1)) * this.dist) / 5,
    x3: chips[chipId].x + (Math.cos(degToRad(this.dir2)) * this.dist) / 5,
    y3: chips[chipId].y + (Math.sin(degToRad(this.dir2)) * this.dist) / 5,
  };
}

Piece.prototype.update = function () {
  this.a += this.aSpeed;
  this.draw();
};

Piece.prototype.draw = function () {
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(255,255,255," + this.a + ")";
  ctx.beginPath();
  ctx.moveTo(this.points.x1, this.points.y1);
  ctx.lineTo(this.points.x2, this.points.y2);
  ctx.lineTo(this.points.x3, this.points.y3);
  ctx.closePath();
  ctx.fill();
};

Piece.prototype.die = function () {
  pieces[this.id] = null;
  delete pieces[this.id];
};

var canvas = document.getElementById("canvas");
(ctx = canvas.getContext("2d")), (WIDTH = 0), (HEIGHT = 0), (DIAG = 0);

var init = true,
  sky1_src = "http://img.fliptab.io/space_galaxy/1920x1200/125822212.jpg",
  sky2_src = "http://wallpapercave.com/wp/hPB6mKS.jpg",
  chips = [],
  pieces = [],
  intervals = [],
  animationOn = true,
  phase = 1,
  listening = true;

setCanvasSize();

function setCanvasSize() {
  (WIDTH = document.documentElement.clientWidth),
    (HEIGHT = document.documentElement.clientHeight);
  DIAG = Math.sqrt(Math.pow(WIDTH, 2) + Math.pow(HEIGHT, 2));
  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);
}

var sky2 = new Image();
sky2.src = sky2_src;
sky2.onload = function () {
  drawCoverImage(ctx, this, WIDTH, HEIGHT);
  if (init) {
    init = false;
    setTimeout(function () {
      document.getElementById("canvas").style.backgroundImage =
        "url(" + sky1_src + ")";
    }, 500);
  }

  ctx.globalCompositeOperation = "destination-out";

  document.addEventListener("click", function (e) {
    document.getElementById("note").style.display = "none";
    if (!listening) return;

    var chipId = 0;
    chips[chipId] = new Chip(chipId, e.clientX, e.clientY);
    chips[chipId].init();
    //listening = false;

    //setTimeout(function () {
    //animate(0);
    //}, 1000);
  });
};

function reset() {
  listening = true;
  animationOn = true;

  // Reset pieces
  for (var i in pieces) {
    pieces[i].die();
  }
  pieces = [];

  // Reset chip
  chips[0].die();
  chips = [];

  // Reset animation intervals
  for (var i in intervals) {
    clearInterval(intervals[i]);
  }
  intervals = [];

  // Image swap
  if (phase == 1) {
    sky2.src = sky1_src;
    setTimeout(function () {
      document.getElementById("canvas").style.backgroundImage =
        "url(" + sky2_src + ")";
    }, 500);
    phase = 2;
  } else {
    sky2.src = sky2_src;
    setTimeout(function () {
      document.getElementById("canvas").style.backgroundImage =
        "url(" + sky1_src + ")";
    }, 500);
    phase = 1;
  }
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function drawCoverImage(ctx, img, w, h) {
  ctx.globalCompositeOperation = "source-over";
  var image_w = img.width,
    image_h = img.height,
    scene_w = w,
    scene_h = h;
  if (scene_w / scene_h <= image_w / image_h) {
    var drawn_w = image_w * (scene_h / image_h),
      x_offset = ((drawn_w - scene_w) / 2) * -1;
    ctx.drawImage(img, x_offset, 0, drawn_w, scene_h);
  } else {
    var drawn_h = image_h * (scene_w / image_w),
      y_offset = ((drawn_h - scene_h) / 2) * -1;
    ctx.drawImage(img, 0, y_offset, scene_w, drawn_h);
  }
}

// I found it more comfortable to work without the requestAnimationFrame API in this particular case
function animate(pieceId) {
  var stop = false;
  intervals[pieceId] = setInterval(function () {
    if (pieceId >= pieces.length) {
      animationOn = false;
      clearInterval(intervals[pieceId]);
      return;
    }
    if (typeof pieces[pieceId] != "undefined") pieces[pieceId].update();
  }, 17);
  setTimeout(function () {
    if (animationOn) animate(pieceId + 1);
    else setTimeout(reset, 800);
  }, 50);
}
