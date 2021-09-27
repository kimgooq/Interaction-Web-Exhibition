let img = new Image();
img.src = "../images/img_3.jpeg";
// img.crossorigin = "Anonymous";
let canvases = document.querySelectorAll("canvas");
let canvasContexts = [];
canvases.forEach((el) => {
  el.width = 728;
  el.height = 525;
  canvasContexts.push(el.getContext("2d"));
});

img.onload = function () {
  canvasContexts[4].drawImage(img, 0, 0);
  canvasContexts.forEach((el, i) => {
    if (i !== 4) {
      let imageData = canvasContexts[4].getImageData(0, 0, 728, 525);
      let editedImageData = imageData;
      editPixels(editedImageData.data, i);
      el.putImageData(editedImageData, 0, 0);
    }
  });
};

function editPixels(imgData, flag) {
  if (flag === 8) {
    // grayscale
    for (let i = 0; i < imgData.length; i += 4) {
      let value = getPixelTotalValue(imgData, i, 100);
      imgData[i] = imgData[i + 1] = imgData[i + 2] = value;
    }
  } else if (flag < 4) {
    for (let i = 0; i < imgData.length; i += 4) {
      // imgData[i] = imgData[i] ^ 255;
      // imgData[i + 1] = imgData[i + 1] ^ 255;
      // imgData[i + 2] = imgData[i + 2] ^ 255;
      let [r, g, b] = switchPixels(
        imgData[i],
        imgData[i + 1],
        imgData[i + 2],
        flag
      );
      imgData[i] = r;
      imgData[i + 1] = b;
      imgData[i + 2] = g;
      // [imgData[i], imgData[i + 1], imgData[i + 2]] = switchPixels(
      //   imgData[i],
      //   imgData[i + 1],
      //   imgData[i + 2],
      //   flag
      // );
    }
  } else if (flag > 5 || flag !== 8) {
    for (let i = 0; i < imgData.length; i += 4) {
      let value = getPixelTotalValue(imgData, i, 100);
      if (value !== 255) {
        imgData[i] = imgData[i + 1] = imgData[i + 2] = value;
      } else {
        let temp1 = imgData[i];
        let temp2 = imgData[i + 1];
        let temp3 = imgData[i + 2];

        imgData[i] = temp3;
        imgData[i + 1] = temp1;
        imgData[i + 2] = temp2;
      }
    }
  }
}

function getPixelTotalValue(imgData, i, threshold) {
  return 0.2126 * imgData[i] +
    0.7152 * imgData[i + 1] +
    0.0722 * imgData[i + 2] >=
    threshold
    ? 255
    : 0;
}

function switchPixels(r, g, b, flag) {
  let rand = Math.floor(Math.random() * 100);
  if (rand % 2 === 0) {
    // r = b ^ 255;
    // g = g ^ 255;
    // b = b ^ 255;
    return [r ^ 255, g ^ 255, b ^ 255];
  } else if (rand % 3 === 0) {
    // r = r ^ 255;
    // g = g ^ 255;
    // b = b ^ 255;
    return [g ^ 255, b ^ 255, r ^ 255];
  } else {
    // r = r ^ 255;
    // g = g ^ 255;
    // b = b ^ 255;
    return [b ^ 255, r ^ 255, g ^ 255];
  }
}

/*
invert color
imgData[i] = imgData[i] ^ 255 // XOR operation
*/

/* grayscale 
function grayscale (pixels, args) {
  let d = pixels.data;
  for ( let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    let value = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    d[i] = d[i + 1] = d[i + 2] = value;
  }
  return pixels;
}
*/

/* brightness 
function brightness (pixels, adjustment) {
  let d = pixels.data;
  for ( let i = 0 ; i < d.length; i += 4 ) {
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
  return pixels;
}
*/

/* threshold
function threshold (pixels, threshold) {
  let d = pixels.data;
  for ( let i = 0; i < d.length; i += 4 ) {
    let r = d[i];
    let g = d[i+1];
    let b = d[i+2];
    let value = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
    d[i] = d[i+1] = d[i+2] = value;
  }
}
*/
