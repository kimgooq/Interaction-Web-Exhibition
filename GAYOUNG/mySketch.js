let drips = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {

  stroke(255);
  if (mouseIsPressed === true) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

  if(mouseIsPressed){
    drips[drips.length-1].grow();
  }
  for (let i = 0; i<drips.length; i++) {
    drips[i].move();
    drips[i].show();
    if(drips[i].y>height) {
      drips.splice(i,1);
    }
  }
  fill(255);
}

function mousePressed() {
  drips.push(new Drip(mouseX, mouseY, 20));
}


class Drip {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = color(random(255), random(255), random(255), 10);
    }
    move(){
      this.y+=1;
      if(this.size>15) this.size*=.97;
    }
    grow(){
     this.size+=2; 
     this.y-=0.8;
     this.color = color(random(255), random(255), random(255), 10);
    }
    show(){
      noStroke();
      fill(this.color);
      ellipse(this.x, this.y, this.size, this.size);
    }
  }


