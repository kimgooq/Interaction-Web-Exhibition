var img,
		particles = [],
		bg;
let capture;

// function preload(){
// 	img = loadImage("tree.jpg");
// }

function setup(){
	capture = createCapture(VIDEO);
	createCanvas(windowWidth, windowHeight);
	
	for (let i = 1; i > 0; i -= 0.001) {
		const x = random(width),
					y = random(height),
					size = 40 * Math.pow(random(i), 2) + 8;
		
		if (!particles.some(p => Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2) < Math.pow(size / 2 + p.size / 2 - 2, 2)))
			particles.push(new Particle(x, y, size));
	}
	
	//bg = img.get(0, 0);
	
	noStroke();
}

function draw(){
	// background(bg);
	image(capture, 0, 0);
	
	for (const particle of particles) {
		fill(particle.col);
		const t = 1 - 5e-4 * (Math.pow(particle.pos.x - mouseX, 2) + Math.pow(particle.pos.y - mouseY, 2)),
					p = p5.Vector.mult(particle.pos, 1 - t).add(p5.Vector.mult(particle.tgt, t));
		circle(p.x, p.y, particle.size);
	}
}

class Particle {
	constructor(x, y, size){
		this.pos = new p5.Vector(x, y);
		this.tgt = p5.Vector.random2D().add(this.pos);
		this.size = size;
		this.col = capture.get(x, y);
	}
}