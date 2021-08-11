
let pg;
let drips = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // pg = createGraphics(400, 250);
}

function draw() {

  let num = 30;
  fill("#FF7F27");
  stroke("#FF7F27");
  if (mouseIsPressed === true) {
    // line(mouseX, mouseY, pmouseX, pmouseY);

    drips.push(new Drip(mouseX, mouseY, 20));
    
    // console.log(num);

  }

  
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
