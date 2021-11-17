class Pixel {
  constructor(x, y, c, id) {
    this.x = x;
    this.y = -300;
    this.yvel = 0;
    this.basex = x;
    this.basey = y;
    this.c = c;
    this.id = id;
    this.falling = true;
  }
  move() {
    this.y += this.yvel;
    if (this.y < this.basey) {
      this.yvel += 0.5;
    } else {
      this.yvel = 0;
      let d = dist(this.x, this.y, mouseX, mouseY);
      //if (d < 150) {
        //this.x -= (mouseX - this.basex) / 36;
        //this.y -= (mouseY - this.basey) / 36;
        this.x -= random(10)
        this.y -= random(10)
      //} else {
        //this.x -= (this.x - this.basex) / 12;
        //this.y -= (this.y - this.basey) / 12;
        //this.falling = false;
      //}
    }
    //console.log(mouseX);
  }
  show() {
    push();
    fill(this.c);
    translate(this.x, this.y);
    if (form > 1) {
      rect(0, 0, interval);
    } else {
      circle(0, 0, interval);
    }

    pop();
  }
}
