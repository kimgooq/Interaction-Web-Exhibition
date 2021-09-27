var spread = 10

function setup() {
    createCanvas(600, 600);
    //background(255);
}

function draw() {
  fill(255-mouseX/4,180+mouseX/4,180+mouseX/2);
  stroke(255-mouseX/4,180+mouseX/4,180+mouseX/2);
  strokeWeight(5);
  if (mouseIsPressed) {
  line(mouseX , mouseY , pmouseX , pmouseY);
  }
    if (keyIsPressed) {
      if ((key == 'c') || (key == 'C')) {
        stroke(random(100,200), random(100,200), random(200,255));
        strokeWeight(random(3,15));
        fill(random(100,200), random(100,200), random(200,255));
        ellipseMode(CENTER);
        ellipse(random(mouseX-spread,mouseX+spread), random(mouseY+spread,mouseY-spread), random(5,20), random(5,20));
      } else if ((key == 'l') || (key == 'L')){
        stroke(random(100,200), random(100,200), random(200,255));
        fill(random(100,200), random(100,200), random(200,255));
        strokeWeight(2);
        line(random(0,600),0,random(0,600),600);
      }
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