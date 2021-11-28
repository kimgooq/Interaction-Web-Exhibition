const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");
const background = new Image();
background.src = "mona-lisa.jpeg";
let state = false;

let colorStr = ["red", "yellow", "black", "blue", "green"];
let activeElement = "";
let pos = {
  drawable: false,
  X: -1,
  Y: -1,
};

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function () {
  canvas.width = $("#canvas-background").width();
  canvas.height = $("#canvas-background").height();

  // ctx.drawImage(background, 0, 0);
  document.querySelector("#museum_bgm").muted = false;

  $("#canvas").addClass("small");
  $("#canvas-background").addClass("small");
  $("#background").attr("height", window.innerWidth);
  $("#background").attr("width", window.innerHeight);

  $("#capture").attr("height", window.innerWidth);
  $("#capture").attr("width", window.innerHeight);

  canvas.addEventListener("mousedown", listener);
  canvas.addEventListener("mousemove", listener);
  canvas.addEventListener("mouseup", listener);
  canvas.addEventListener("mouseout", listener);
  canvas.addEventListener("mouseover", listener);

  $("#canvas-container").hover(
    function () {
      // over
      moveClose();
    },
    function () {
      // out
      moveFar();
    }
  );

  $("#eraser").click(() => {
    state = true;
  });

  $("input[name = red]").click(() => {
    console.log("click");
  });
  colorStr.forEach((value) => {
    colorPick(value);
  });

  $("#camera").click(() => {
    // 캡쳐 라이브러리를 통해서 canvas 오브젝트를 받고 이미지 파일로 리턴한다.
    $("#camera").hide();
    document.querySelector("#camera_effects").muted = false;
    document.querySelector("#camera_effects").load();
    document.querySelector("#camera_effects").play();

    html2canvas(document.querySelector("#capture")).then((canvas) => {
      saveAs(canvas.toDataURL("image/png"), "capture-test.png");
    });
    function saveAs(uri, filename) {
      // 캡쳐된 파일을 이미지 파일로 내보낸다.

      var link = document.createElement("a");
      if (typeof link.download === "string") {
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        $("#camera").show();
      } else {
        window.open(uri);
      }
    }
  });

  function colorPick(color) {
    $("#" + color + "Radio").click(() => {
      state = false;
      ctx.strokeStyle = $("." + color).css("background-color");
      console.log(ctx.strokeStyle);
      $("input[type=range]").background;
    });
  }

  function listener(event) {
    switch (event.type) {
      case "mousedown":
        initDraw(event);
        break;
      case "mousemove":
        if (pos.drawable) draw(event);
        break;
      case "mouseup":
        finishDraw();
        break;
      // case "mouseover":
      //   moveClose();
      //   break;
      // case "mouseout":
      //   moveFar();
      //   break;
    }
  }
};
function moveClose() {
  // console.log("hover");
  $("#canvas").removeClass("small");
  $("#canvas").addClass("large");

  $("#canvas-background").removeClass("small");
  $("#canvas-background").addClass("large");

  $("#background").removeClass("background");
  $("#background").addClass("background-large");

  $("#camera").fadeOut();
  $("#rangeBar").fadeIn();
  $("#colorpick").fadeIn();
}

function moveFar() {
  finishDraw();
  // console.log("mouseout");
  $("#canvas").removeClass("large");
  $("#canvas").addClass("small");

  $("#canvas-background").removeClass("large");
  $("#canvas-background").addClass("small");

  $("#background").removeClass("background-large");
  $("#background").addClass("background");

  $("#camera").fadeIn();
  $("#rangeBar").fadeOut();
  $("#colorpick").fadeOut();
}

function getMousePos(event) {
  var rect = canvas.getBoundingClientRect();
  // console.log(rect
  return {
    x: ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
}

function initDraw(event) {
  // console.log("draw");
  ctx.beginPath();
  pos.drawable = true;

  let coors = getMousePos(event);
  pos.X = coors.x;
  pos.Y = coors.y;
  ctx.moveTo(pos.X, pos.Y);
}

function draw(event) {
  let coors = getMousePos(event);
  console.log(state);
  if (state == true) {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.lineTo(coors.x, coors.y);
  pos.X = coors.X;
  pos.Y = coors.Y;
  ctx.stroke();
}

function finishDraw() {
  pos.drawable = false;
  pos.X = -1;
  pos.Y = -1;
}

function getPosition(event) {
  let x = event.pageX - canvas.offserLeft;
  let y = event.pageY - canvas.offsetRight;
  return { X: x, Y: y };
}

//***** *****/
$("input[type=range]").wrap("<div class='range'></div>");
var i = 1;

$(".range").each(function () {
  var n = this.getElementsByTagName("input")[0].value;
  var x =
    (n / 50) * (this.getElementsByTagName("input")[0].offsetWidth - 8) - 12;
  this.id = "range" + i;
  console.log(this.id);
  this.className = "range";

  this.innerHTML +=
    "<style>#" +
    this.id +
    ":hover input[type=range]:before{content:'" +
    n +
    "'!important;left: " +
    x +
    "px;} #" +
    this.id +
    ":hover input[type=range]:after{left: " +
    x +
    "px}</style>";
  i++;
});

$("input[type=range]").on("input", function () {
  var a = this.value;
  var p = (a / 50) * (this.offsetWidth - 8) - 12;
  console.log(a);
  ctx.lineWidth = a;

  this.parentNode.className = "range";

  this.parentNode.getElementsByTagName("style")[0].innerHTML +=
    "#" +
    this.parentNode.id +
    " input[type=range]::-webkit-slider-runnable-track {background:linear-gradient(to right, #803fb5 0%, #803fb5 " +
    a * 2 +
    "%, #ffffff " +
    a +
    "%)} #" +
    this.parentNode.id +
    ":hover input[type=range]:before{content:'" +
    a +
    "'!important;left: " +
    p +
    "px;} #" +
    this.parentNode.id +
    ":hover input[type=range]:after{left: " +
    p +
    "px}";
});
