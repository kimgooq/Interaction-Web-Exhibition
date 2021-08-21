let colors = [];
let brush = { x:0, y:0, px:0, py:0 }
let seed;

function setup() {
	createCanvas(windowWidth, windowHeight);
	noStroke();
	seed = random(1000);
	
    colors = [
	color(112,112,74), //green
	color(245,198,110), //yellow
	color(242,229,194), //cream
	color(115,106,97), //light grey
	color(215,90,34), //orange
	color(235,61,0)  ] // red-orange
	
    let base = floor(random(colors.length));
	background(colors[base]);
	colors.splice(base,1);
}

function draw() {

	brush.x+=(mouseX-brush.x)/12;
	brush.y+=(mouseY-brush.y)/12;
	
    if(frameCount>40){
		drizzle();
	}
	
    brush.px=brush.x;
 	brush.py=brush.y;
}

function mouseMoved(){
	
    if(frameCount%7==0){
	
        splatter(mouseX, mouseY);
		splatter(width-mouseX, height-mouseY);
		stipple(mouseX, mouseY, 0);
		stipple(width-mouseX, height-mouseY, 255);
	}
}

function drizzle(){
	let s = 1+30/dist(brush.px, brush.py, brush.x, brush.y);
	s=min(15,s);
	strokeWeight(s);
	stroke(0);
	line(brush.px, brush.py, brush.x, brush.y);
	stroke(255);
	line(width-brush.px, height-brush.py, width-brush.x, height-brush.y);
}

function splatter(bx,by){

	let c = colors[floor(random(colors.length))];
	bx += random(-15,15);
	by += random(-15,15);
	let mx = 10 * movedX;
	let my = 10 * movedY;

	for(let i=0; i<80; i++){
		seed+=.01;
		let x = bx+mx*(0.5-noise(seed+i));
		let y = by+my*(0.5-noise(seed+2*i));
		let s = 150/dist(bx, by, x, y);
		if(s>20) s=20;
		let a = 255-s*5;
		noStroke();
		c.setAlpha(a);
		fill(c);
		ellipse(x,y,s);
		seed+=.01;
	}
}

function stipple(bx, by, c){
	noStroke();
	fill(c);
	let radius = random(3, 12);
	ellipse(bx+random(-30,30), by+random(30,-30), radius);
	radius = random(3, 12);
	ellipse(bx+random(-30,30), by+random(30,-30), radius);
}

function keyPressed(){
	if(keyCode==32){
		background(180);
	}
}