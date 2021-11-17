class Eye {
	constructor(x,y,size) {
		this.x = x;
		this.y = y;
		this.size = size;
		//white is when the position of the black iris is farthest from the origin (size, size)
		this.white = 0;
		//black is when the position of the black iris is at the origin with no offset (0,0) 
		this.black = size;
			// print("creating eye at "+x+", " +y);
	}
	
	draw() {
		noStroke();
		//angle between the mouse and the center of the eye
		let angle;
		let mouseDistance;
		if(!this.target){
			angle = Math.atan2(this.y-mouseY, this.x-mouseX);
			mouseDistance = dist(this.x, this.y, mouseX, mouseY);
		}else{
			angle = Math.atan2(this.y-this.target.y, this.x-this.target.x);
			mouseDistance = dist(this.x, this.y, this.target.x, this.target.y);
		}
		
		let size = this.size;
		let maxOffset = size;
		//if the distance is less than the size of the eye them move the smaller amount to better follow the mouse
		maxOffset = (mouseDistance>maxOffset)?maxOffset:mouseDistance;
		let xOffset = -maxOffset*cos(angle);
		let yOffset = -maxOffset*sin(angle);
		//white
		fill(255);
		ellipse(this.x, this.y, size, size);
		//iris
		// size*=0.75;
		//pupil
		// size*=0.5;
		// size*=1.2;
		fill(0);
		ellipse(this.x+xOffset, this.y+yOffset, size, size);
	}
	
	setColor(percentageBlack = 1){
		noStroke();
		let offset = map(percentageBlack, 0, 1, 0 , this.size);
		//white
		fill(255);
		ellipse(this.x, this.y, this.size, this.size);
		//pupil
		fill(0);
		ellipse(this.x+offset, this.y+offset, ceil(this.size*1.1), ceil(this.size*1.1));
		
	}
	
}