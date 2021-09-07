let img;
let pg;
function preload() {
  img = loadImage('img.jpg');
}
function setup() {
    createCanvas(800, 800, WEBGL);
    //pg = createGraphics(100, 100);
  }
  
function draw() {
    background(205, 102, 94);
    orbitControl();
    //notexture();
    //fill(black);
    sphere(50);
    //texture(img);
    sphere(150, 24);
    
    //ellipse(56, 46,150, 150);
}