const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");

const background = new Image();
background.src = "mona-lisa.jpeg";

canvas.width = background.width;
canvas.height = background.height;
// canvas.width = "80%";

// canvas.width = "320px";
// canvas.height = "420px";

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function () {
  ctx.drawImage(background, 0, 0);

  //   $("#canvas").addClass("small");
  $("#background").attr("height", window.innerWidth);
  $("#background").attr("width", window.innerHeight);

  $("#canvas").hover(() => {
    console.log("hover");
    $("#canvas").removeClass("small");
    $("#canvas").addClass("large");
    $("#background").removeClass("background");
    $("#background").addClass("background-large");
  });
};

let painting = false;

function stopPainting() {
  painting = false;
  console.log();
}
