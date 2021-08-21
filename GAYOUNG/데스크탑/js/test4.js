let brush = {x:0, y:0, px:0, py:0}
let colors = [];
let seed;
function setup(){
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
	// background(colors[base]);
	colors.splice(base,1);
}

function draw(){
    stroke(0);

    brush.x += (mouseX-brush.x)/12;
    brush.y += (mouseY-brush.y)/12;

	
    brush.px=brush.x;
 	brush.py=brush.y;

}

function mouseDragged(){
    // line(pmouseX,pmouseY,mouseX,mouseY);
    // console.log(pmouseX+","+pmouseY+","+mouseX+","+mouseY);

    // if(frameCount>40){
		
	// }

    
    drizzle();
}

function drizzle(){
    // let s = 1+30/dist(brush.px, brush.py, brush.x, brush.y);
	// s=min(15,s);
	// strokeWeight(s);
	// stroke(0);
	line(mouseX, mouseY, pmouseX, pmouseY);
	// stroke(255);
	// line(width-brush.px, height-brush.py, width-brush.x, height-brush.y);
	
}