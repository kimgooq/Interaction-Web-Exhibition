let photo, maskImage, canvas, count;

function preload() {
  photo = loadImage("cow.jpg");
  maskImage = loadImage("mask2.png");
  matches = loadImage("m.png");
}

function setup() {
  canvas = createCanvas(photo.width, photo.height);

  //create an image that will mask canvas(at the same size as the canvas)
  mask = createGraphics(photo.width, photo.height);
  //So brush is centered on the mouse position when we draw

  mask.imageMode(CENTER);

  //Save a copy of the cow image
  copyImage = photo.get();

  //Apply a mask to the to the copied image
  copyImage.mask(mask.get());

  // console.log(photo);
  // console.log(copyImage);

  //draw the rect
  fill(51);
  rect(0, 0, photo.width, photo.height);
  matches.resize(300 * 0.4, 400 * 0.4);

  count = 0;
  // canvas.mouseMoved(mouseMatches);
}

function draw() {
  // Draw the masked cow image over the top of the rect(see setup function)
  image(copyImage, 0, 0, 740, 439);
  canvas.mouseMoved(makeClipping);

  canvas.mouseClicked(() => {
    count += 1;
    console.log(count);
  });
}

function mouseMatches() {
  image(matches, mouseX - 100, mouseY);
}
function makeClipping() {
  if (count >= 3) {
    // Then draw the brush image onto the mask
    mask.image(maskImage, mouseX, mouseY - 20, 50, 50);

    // now that the mask has changed, re-apply the mask
    // same lines from above
    copyImage = photo.get();
    copyImage.mask(mask.get());
  }
}
