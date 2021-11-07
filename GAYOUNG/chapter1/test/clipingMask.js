// Grab the Canvas and Drawing Context
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

// Create an image element
var img = document.createElement("IMG");

// When the image is loaded, draw it
img.onload = function () {
  // Save the state, so we can undo the clipping
  ctx.save();

  // Create a shape, of some sort
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(100, 30);
  ctx.lineTo(180, 10);
  ctx.lineTo(200, 60);
  ctx.arcTo(180, 70, 120, 0, 10);
  ctx.lineTo(200, 180);
  ctx.lineTo(100, 150);
  ctx.lineTo(70, 180);
  ctx.lineTo(20, 130);
  ctx.lineTo(50, 70);
  ctx.closePath();
  // Clip to the current path
  ctx.clip();

  ctx.drawImage(img, 0, 0);

  // Undo the clipping
  ctx.restore();
};

// Specify the src to load the image
img.src = "cow.jpg";
