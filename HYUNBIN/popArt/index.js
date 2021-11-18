let img = new Image();
img.src = "../images/img_0.jpeg";
// img.crossorigin = "Anonymous";

let currentIndex = 0; // 현재 마우스 위치
let canvasContexts = []; // 캔버스 이미지 데이터
let imageFilters = []; // 미리 필터된 데이터를 저장

// 빨 0
// 노 0
// 초 0
// 파 0
// 보 0

// 배열로 선언
// 00 01 02
// 10 11 12
// 20 21 22

// (A,B) 와 (C,D)
// 거리 계산 => Math.sqrt( Math.pow( Math.abs(C - A), 2 ) + Math.pow( Math.abs(D - B), 2 ) )
// 0 1 2
// 1 2 3
// 2 3 4

// 매핑하기
// 0 빨
// 1 노
// 2 초
// 3 파
// 4 보

document.querySelectorAll("canvas").forEach((el) => {
  el.addEventListener("mouseover", (e) => {
    console.log(e.target.classList.value);
    let here = e.target.classList.value.split(",");
    // here[1], here[2]

    document.querySelectorAll("canvas").forEach((cnv, i) => {
      let there = cnv.classList.value.split(",");
      let d = Math.round(
        Math.sqrt(
          Math.pow(Math.abs(there[1] - here[1]), 2) +
            Math.pow(Math.abs(there[2] - here[2]), 2)
        )
      );
      console.log(d);
      if (d === 0) {
        canvasContexts[i].putImageData(imageFilters[0], 0, 0);
        // canvasContexts[here[0]].putImageData(imageFilters[here[0]], 0, 0);
      } else if (d === 1) {
        canvasContexts[i].putImageData(imageFilters[1], 0, 0);
        // canvasContexts[here[0]].putImageData(imageFilters[here[0]], 0, 0);
      } else if (d === 2) {
        canvasContexts[i].putImageData(imageFilters[2], 0, 0);
        // canvasContexts[here[0]].putImageData(imageFilters[here[0]], 0, 0);
      } else if (d === 3) {
        canvasContexts[i].putImageData(imageFilters[3], 0, 0);
        // canvasContexts[here[0]].putImageData(imageFilters[here[0]], 0, 0);
      } else if (d === 4) {
        canvasContexts[i].putImageData(imageFilters[4], 0, 0);
        // canvasContexts[here[0]].putImageData(imageFilters[here[0]], 0, 0);
      } else if (d === 5) {
        canvasContexts[i].putImageData(imageFilters[5], 0, 0);
        // canvasContexts[here[0]].putImageData(imageFilters[here[0]], 0, 0);
      }
    });
  });
});

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

// 2. b r g => 빨강으로
const sP2 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    // let temp1 = imgData[i];
    // let temp2 = imgData[i + 1];
    // let temp3 = imgData[i + 2];

    imgData[i] = 255;
    // imgData[i + 1] = temp1;
    // imgData[i + 2] = temp2;
  }
};

// 3. b g r => 초록으로
const sP3 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    // let temp1 = imgData[i];
    // let temp2 = imgData[i + 1];
    // let temp3 = imgData[i + 2];

    // imgData[i] = temp3;
    imgData[i + 1] = 255;
    // imgData[i + 2] = temp1;
  }
};

// 4. g r b => 파랑으로
const sP4 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    // let temp1 = imgData[i];
    // let temp2 = imgData[i + 1];
    // let temp3 = imgData[i + 2];

    // imgData[i] = temp2;
    // imgData[i + 1] = temp1;
    imgData[i + 2] = 255;
  }
};

// 5. g b r => 노랑으로
const sP5 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    // let temp1 = imgData[i];
    // let temp2 = imgData[i + 1];
    // let temp3 = imgData[i + 2];

    imgData[i] = 255;
    imgData[i + 1] = 255;
    // imgData[i + 2] = temp1;
  }
};

// 6. r g 0 (inv) => 보라
const sP6 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    // let temp1 = imgData[i];
    // let temp2 = imgData[i + 1];

    imgData[i] = 128;
    imgData[i + 2] = 128;
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
  // sP1,
  sP2, // 빨
  sP3, // 노
  sP4, // 초
  sP5, // 파
  sP6, // 보
  // sP7,
  // sP8,
  // sP9,
  // sP10,
  // sP11,
  // sP12,
  // sP13,
  // sP14,
  // sP15,
  // sP16,
  // sP17,
];

img.onload = function () {
  let canvases = document.querySelectorAll("canvas");
  canvases.forEach((el) => {
    el.width = img.width;
    el.height = img.height;
    canvasContexts.push(el.getContext("2d"));
  });
  canvasContexts.forEach((el, i) => {
    el.drawImage(img, 0, 0);
    if (i < 6) {
      let imageData = canvasContexts[i].getImageData(
        0,
        0,
        img.width,
        img.height
      );
      let editedImageData = imageData;
      editPixels(editedImageData.data, i);
      imageFilters.push(editedImageData); // 미리 필터 저장
    }
  });

  // canvasContexts[4].drawImage(img, 0, 0);
  // canvasContexts.forEach((el, i) => {
  //   if (i !== 4) {
  //     let imageData = canvasContexts[4].getImageData(
  //       0,
  //       0,
  //       img.width,
  //       img.height
  //     );
  //     let editedImageData = imageData;
  //     editPixels(editedImageData.data);
  //     el.putImageData(editedImageData, 0, 0);
  //   }
  // });
};

function editPixels(imgData, i) {
  const rand_index = Math.floor(Math.random() * sP_functions.length);
  sP_functions[i % 5](imgData);
  // sP_functions.splice(rand_index, 1);

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
