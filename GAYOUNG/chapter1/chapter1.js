/*
Magical trail shader

Author: Jason Labbe

Site: jasonlabbe3d.com

Controls:
	- Move the mouse to create particles.
	- Hold the middle mouse button to fade away particles.
	- Press the right mouse button to display the underlying particle system.
*/

/* 
  Concept : 깜깜한 동굴 속 벽화를 불빛을 비추어 해당 벽화를 확인할 수 있는 그런 느낌

  첫번째 시도 : Magical trail shader 예시를 통해 뒤에 마우스를 무브하면 불빛이 흔들리는 효과를 준다
  하지만.. 한 캔버스에 Shader가 하나만 적용되다 보니 이미지를 동시에 적용하기 어려워보임

  두번째 시도 : 클리핑 마스크를 이용하여 마우스 무브한 곳은 다 지워지는 것

*/

// If you get an error about max uniforms then you can decrease these 2 values :(
const MAX_PARTICLE_COUNT = 70;
const MAX_TRAIL_COUNT = 30;

let colorScheme = ["#E69F66", "#DF843A", "#D8690F", "#B1560D", "#8A430A"];
let shaded = true;
let theShader;
let shaderTexture;

let simpleShader;
let simpleShaderTexture;

let trail = [];
let particles = [];
let img;

function preload() {
  // img = loadImage("cow.jpg");
  theShader = new p5.Shader(this.renderer, vertShader, fragShader);

  simpleShader = loadShader("assets/basic.vert", "assets/basic.frag");

  img = loadImage("cow.jpg");
}

function setup() {
  pixelDensity(1);

  let canvas = createCanvas(
    min(windowWidth, windowHeight),
    min(windowWidth, windowHeight),
    WEBGL
  );

  img.resize(min(windowWidth, windowHeight), min(windowWidth, windowHeight));

  canvas.canvas.oncontextmenu = () => false; // Removes right-click menu.
  noCursor();

  shaderTexture = createGraphics(width, height, WEBGL);
  shaderTexture.noStroke();
}

function draw() {
  background(1);
  noStroke();

  //   snap = createGraphics(100, 100);
  //   snap.copy(img, 300, 300, 50, 50, 0, 0, 100, 100);
  //   texture(snap);
  //   push();
  //   translate(-100, -100, 0);
  //   quad(58, 51, 106, 40, 89, 83, 50, 96);
  //   pop();

  // Trim end of trail.
  trail.push([mouseX, mouseY]);
  //   console.log(trail);

  let removeCount = 1;
  if (mouseIsPressed && mouseButton == CENTER) {
    removeCount++;
  }

  for (let i = 0; i < removeCount; i++) {
    if (trail.length == 0) {
      break;
    }

    if (mouseIsPressed || trail.length > MAX_TRAIL_COUNT) {
      trail.splice(0, 1);
    }
  }

  // Spawn particles.
  if (trail.length > 1 && particles.length < MAX_PARTICLE_COUNT) {
    let mouse = new p5.Vector(mouseX, mouseY);
    mouse.sub(pmouseX, pmouseY);
    if (mouse.mag() > 10) {
      mouse.normalize();
      particles.push(new Particle(pmouseX, pmouseY, mouse.x, mouse.y));
    }
  }

  translate(-width / 2, -height / 2);

  // Move and kill particles.
  for (let i = particles.length - 1; i > -1; i--) {
    particles[i].move();
    if (particles[i].vel.mag() < 0.1) {
      particles.splice(i, 1);
    }
  }

  if (shaded) {
    // **** Apply Shader **** //
    // Display shader.
    // shaderTexture.shader(simpleShader);
    shaderTexture.shader(theShader);

    let data = serializeSketch();
    theShader.setUniform("resolution", [width, height]);
    theShader.setUniform("trailCount", trail.length);
    theShader.setUniform("trail", data.trails);
    theShader.setUniform("particleCount", particles.length);
    theShader.setUniform("particles", data.particles);
    theShader.setUniform("colors", data.colors);
    theShader.setUniform("image", img);
    // theShader.setUniform("colorBackground", [0, 1, 0]);
    // theShader.setUniform("uTexture", img);

    // simpleShader.setUniform("uTexture", img);
    shaderTexture.rect(0, 0, width, height);
    // shaderTexture.rect(0, 0, width, height);
    background(153);
    texture(img);
    texture(shaderTexture);

    // box(200, 200, 200);

    rect(0, 0, width, height);
  } else {
    // image(img, 0, 0);
    // Display points.
    stroke(255, 200, 0);
    for (let i = 0; i < particles.length; i++) {
      point(particles[i].pos.x, particles[i].pos.y);
    }

    // stroke(100, 255, 255);
    stroke("#FF0000");
    for (let i = 0; i < trail.length; i++) {
      point(trail[i][0], trail[i][1]);
    }
  }
}

function mousePressed() {
  if (mouseButton == RIGHT) {
    shaded = !shaded;
  }
}

function serializeSketch() {
  data = { trails: [], particles: [], colors: [] };

  for (let i = 0; i < trail.length; i++) {
    data.trails.push(
      map(trail[i][0], 0, width, 0.0, 1.0),
      map(trail[i][1], 0, height, 1.0, 0.0)
    );
  }

  for (let i = 0; i < particles.length; i++) {
    data.particles.push(
      map(particles[i].pos.x, 0, width, 0.0, 1.0),
      map(particles[i].pos.y, 0, height, 1.0, 0.0),
      (particles[i].mass * particles[i].vel.mag()) / 100
    );

    let itsColor = colorScheme[particles[i].colorIndex];
    data.colors.push(red(itsColor), green(itsColor), blue(itsColor));
    // console.log(itsColor);
  }

  return data;
}

function Particle(x, y, vx, vy) {
  this.pos = new p5.Vector(x, y);
  this.vel = new p5.Vector(vx, vy);
  this.vel.mult(random(10));
  this.vel.rotate(radians(random(-25, 25)));
  this.mass = random(1, 20);
  this.airDrag = random(0.92, 0.98);
  this.colorIndex = int(random(colorScheme.length));

  this.move = function () {
    this.vel.mult(this.airDrag);
    this.pos.add(this.vel);
  };
}

let vertShader = `
	precision highp float;

	attribute vec3 aPosition;

	void main() {
		vec4 positionVec4 = vec4(aPosition, 1.0);
		positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
		gl_Position = positionVec4;
	}
`;

let fragShader = `
	precision highp float;
  
	uniform vec2 resolution;
	uniform int trailCount;
	uniform vec2 trail[${MAX_TRAIL_COUNT}];
	uniform int particleCount;
	uniform vec3 particles[${MAX_PARTICLE_COUNT}];
	uniform vec3 colors[${MAX_PARTICLE_COUNT}];

  

	void main() {
			vec2 st = gl_FragCoord.xy / resolution.xy;  // Warning! This is causing non-uniform scaling.

			float r = 0.0;
			float g = 0.0;
			float b = 0.0;


			for (int i = 0; i < ${MAX_TRAIL_COUNT}; i++) {
				if (i < trailCount) {
					vec2 trailPos = trail[i];
					float value = float(i) / distance(st, trailPos.xy) * 0.00005;  // Multiplier may need to be adjusted if max trail count is tweaked.
					r += value;
					g += value ;
					b += value * 0.4;
				}
			}

			float mult = 0.00002;

			for (int i = 0; i < ${MAX_PARTICLE_COUNT}; i++) {
				if (i < particleCount) {
					vec3 particle = particles[i];
					vec2 pos = particle.xy;
					float mass = particle.z;
					vec3 color = colors[i];

					r += color.r / distance(st, pos) * mult * mass;
					g += color.g / distance(st, pos) * mult * mass;
					b += color.b / distance(st, pos) * mult * mass;
				}
			}

			gl_FragColor = vec4(r, g, b, 1.0);
	}
`;
