let img;

function preload(){
    img = loadImage("dollar.png");
}

function setup(){
    createCanvas(1000,1000);
    background(255,255,255);
}

function draw(){
    // line(mouseX, mouseY, pmouseX, pmouseY);
    // image(img,0,0,800,400);
    // tint(80, 0, 204);
    // image(img,500,500,800,400);
    // tint(0, 153, 0);
    fill("#E5E5E5");
    // noStrke();
    rect(30, 20, 55, 55, 20, 15, 10, 5);
}