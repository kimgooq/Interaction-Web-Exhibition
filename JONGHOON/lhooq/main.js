//var spread = 10
function cursor_change() {
  document.body.style.cursor= "url(pen.cur), auto";
}
function cursor_default(){
  document.body.style.cursor="default";
}

function setup() {
    createCanvas(600, 600);
    //background(50);
}

// function draw() {
//   fill(255-mouseX/4,180+mouseX/4,180+mouseX/2);
//   stroke(255-mouseX/4,180+mouseX/4,180+mouseX/2);
//   strokeWeight(5);
//   if (mouseIsPressed) {
//   line(mouseX , mouseY , pmouseX , pmouseY);
//   }
//     if (keyIsPressed) {
//       if ((key == 'c') || (key == 'C')) {
//         stroke(random(100,200), random(100,200), random(200,255));
//         strokeWeight(random(3,15));
//         fill(random(100,200), random(100,200), random(200,255));
//         ellipseMode(CENTER);
//         ellipse(random(mouseX-spread,mouseX+spread), random(mouseY+spread,mouseY-spread), random(5,20), random(5,20));
//       } else if ((key == 'l') || (key == 'L')){
//         stroke(random(100,200), random(100,200), random(200,255));
//         fill(random(100,200), random(100,200), random(200,255));
//         strokeWeight(2);
//         line(random(0,600),0,random(0,600),600);
//       }
//     }

// }
function draw() {
  //let fountain_pen_color = color(85, 70, 70);
  let thick=0;
  //fill(fountain_pen_color);
  //stroke(fountain_pen_color);
  if (mouseIsPressed) {
    let fountain_pen_color = color(thick);
    stroke(fountain_pen_color);
    if (mouseY > pmouseY) {
      strokeWeight(3);
    } else if (mouseY == pmouseY) {
      strokeWeight(2);
    } else {
      strokeWeight(1);
    }
    let d = dist(pmouseX, pmouseY, mouseX, mouseY)
    thick= thick+d*d;
    console.log(thick);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function keyPressed () {
    if ((key == 'e') || (key == 'E')) {
      clear();
      //background(0)
  } else if ((key == 'r')||(key == 'R')) {
    background(random(100,200), random(100,200), random(200,255))
  }
}