let img = new Image();
img.src = "../images/img_0.jpeg";
// img.crossorigin = "Anonymous";

function getPixelTotalValue(imgData, i, threshold) {
  let pixel_value =
    0.2126 * imgData[i] + 0.7152 * imgData[i + 1] + 0.0722 * imgData[i + 2];
  if (pixel_value > 200) {
    return 255;
  } else if (pixel_value > 150) {
    return 200;
  } else if (pixel_value > 100) {
    return 150;
  } else if (pixel_value > 50) {
    return 0;
  }
  // threshold ? 255 : 0;
}

// 1. r b g
const sP1 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let value = getPixelTotalValue(imgData, i, 100);
    if (value !== 255) {
      imgData[i] = imgData[i + 1] = imgData[i + 2] = value;
    } else {
      let temp1 = imgData[i];
      let temp2 = imgData[i + 1];
      let temp3 = imgData[i + 2];

      imgData[i] = temp1;
      imgData[i + 1] = temp3;
      imgData[i + 2] = temp2;
    }
  }
};

// 2. b r g
const sP2 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];
    let temp3 = imgData[i + 2];

    imgData[i] = temp3;
    imgData[i + 1] = temp1;
    imgData[i + 2] = temp2;
  }
};

// 3. b g r
const sP3 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];
    let temp3 = imgData[i + 2];

    imgData[i] = temp3;
    imgData[i + 1] = temp2;
    imgData[i + 2] = temp1;
  }
};

// 4. g r b
const sP4 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];
    let temp3 = imgData[i + 2];

    imgData[i] = temp2;
    imgData[i + 1] = temp1;
    imgData[i + 2] = temp3;
  }
};

// 5. g b r
const sP5 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];
    let temp3 = imgData[i + 2];

    imgData[i] = temp2;
    imgData[i + 1] = temp3;
    imgData[i + 2] = temp1;
  }
};

// 6. r g 0 (inv)
const sP6 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];

    imgData[i] = temp1 ^ 255;
    imgData[i + 1] = temp2 ^ 255;
  }
};

// 7. 0 r g (inv)
const sP7 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];

    imgData[i + 1] = temp1 ^ 255;
    imgData[i + 2] = temp2 ^ 255;
  }
};

// 8. b r 0 (inv)
const sP8 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp3 = imgData[i + 2];

    imgData[i] = temp3 ^ 255;
    imgData[i + 1] = temp1;
  }
};

// 9. 0 b r (inv)
const sP9 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp3 = imgData[i + 2];

    imgData[i + 1] = temp3 ^ 255;
    imgData[i + 2] = temp1 ^ 255;
  }
};

// 10. b g 0 (inv)
const sP10 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp2 = imgData[i + 1];
    let temp3 = imgData[i + 2];

    imgData[i] = temp3 ^ 255;
    imgData[i + 1] = temp2 ^ 255;
  }
};

// 11. 0 b g (inv)
const sP11 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp2 = imgData[i + 1];
    let temp3 = imgData[i + 2];

    imgData[i + 1] = temp3 ^ 255;
    imgData[i + 2] = temp2 ^ 255;
  }
};

// 12. r g 0 (inv)
const sP12 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];

    imgData[i] = temp1 ^ 255;
    imgData[i + 1] = temp2 ^ 255;
  }
};

// 13. 0 r g (inv)
const sP13 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];

    imgData[i + 1] = temp1 ^ 255;
    imgData[i + 2] = temp2 ^ 255;
  }
};

// 14. g r 0 (inv)
const sP14 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];

    imgData[i] = temp2 ^ 255;
    imgData[i + 1] = temp1 ^ 255;
  }
};

// 15. 0 g r (inv)
const sP15 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp1 = imgData[i];
    let temp2 = imgData[i + 1];

    imgData[i + 1] = temp2 ^ 255;
    imgData[i + 2] = temp1 ^ 255;
  }
};

// 16. g b 0 (inv)
const sP16 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp2 = imgData[i + 1];
    let temp3 = imgData[i + 2];

    imgData[i] = temp2 ^ 255;
    imgData[i + 1] = temp3 ^ 255;
  }
};

// 17. 0 g b (inv)
const sP17 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    let temp2 = imgData[i + 1];
    let temp3 = imgData[i + 2];

    imgData[i + 1] = temp2 ^ 255;
    imgData[i + 2] = temp3 ^ 255;
  }
};

let sP_functions = [
  sP1,
  sP2,
  sP3,
  sP4,
  sP5,
  sP6,
  sP7,
  sP8,
  sP9,
  sP10,
  sP11,
  sP12,
  sP13,
  sP14,
  sP15,
  sP16,
  sP17,
];

img.onload = function () {
  let canvases = document.querySelectorAll("canvas");
  let canvasContexts = [];
  canvases.forEach((el) => {
    el.width = img.width;
    el.height = img.height;
    canvasContexts.push(el.getContext("2d"));
  });
  canvasContexts[4].drawImage(img, 0, 0);
  canvasContexts.forEach((el, i) => {
    if (i !== 4) {
      let imageData = canvasContexts[4].getImageData(
        0,
        0,
        img.width,
        img.height
      );
      let editedImageData = imageData;
      editPixels(editedImageData.data);
      el.putImageData(editedImageData, 0, 0);
    }
  });
};

function editPixels(imgData) {
  const rand_index = Math.floor(Math.random() * sP_functions.length);
  sP_functions[rand_index](imgData);
  sP_functions.splice(rand_index, 1);

  /*
  let value = getPixelTotalValue(imgData, i, 100);
  if (value !== 255) {
    imgData[i] = imgData[i + 1] = imgData[i + 2] = value;
  }
  */
}

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
