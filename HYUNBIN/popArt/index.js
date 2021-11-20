// const img = new Image();
// let currentIndex = 0; // 현재 마우스 위치
// let canvasContexts = []; // 캔버스 이미지 데이터
// let imageFilters = []; // 미리 필터된 데이터를 저장
// let container = document.getElementById("container");
// let cnv_width;
// let cnv_height;
// cnv_width;
// cnv_height;

const file_icon = document.getElementById("file-icon");
file_icon.onclick = () => {
  document.getElementById("img_input").click();
};

file_icon.onmouseover = () => {
  icon_status(0);
};

file_icon.onmouseout = () => {
  icon_status(1);
};

document.getElementById("img_input").addEventListener("change", (e) => {
  img = new Image();
  currentIndex = 0; // 현재 마우스 위치
  canvasContexts = []; // 캔버스 이미지 데이터
  imageFilters = []; // 미리 필터된 데이터를 저장
  container = document.getElementById("container");
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
  icon_status(1);
  readImage(e.target);
  img.addEventListener("load", () => {
    addCanvases(img.width, img.height);
    let canvases = document.querySelectorAll("canvas");
    canvases.forEach((el) => {
      el.width = cnv_width;
      el.height = cnv_height;
      canvasContexts.push(el.getContext("2d"));
    });
    canvasContexts.forEach((el, i) => {
      el.drawImage(img, 0, 0, cnv_width, cnv_height);
    });
    addFilters();
    addEventOnCanvas();
  });
});

const icon_status = (flag) => {
  if (flag === 0) {
    file_icon.style.color = "black";
    file_icon.style.opacity = 1;
    file_icon.style.transform = "scale(120%)";
  } else if (flag === 1) {
    file_icon.style.color = "lightgray";
    file_icon.style.opacity = 0.5;
    file_icon.style.transform = "scale(100%)";
  }
};

const readImage = (img_input) => {
  // 인풋 태그에 파일이 있는 경우
  if (img_input.files && img_input.files[0]) {
    // FileReader 인스턴스 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(img_input.files[0]);
  }
};

const addCanvases = (width, height) => {
  cnv_width = Math.floor(window.innerWidth / 9);
  console.log(cnv_width);
  cnv_height = Math.floor((height * cnv_width) / width);
  for (
    let i = 0;
    i <= Math.floor(9 * Math.floor(window.innerHeight / cnv_height) + 8);
    i++
  ) {
    let temp_canvas = document.createElement("canvas");
    temp_canvas.width = cnv_width;
    temp_canvas.height = cnv_height;
    temp_canvas.classList.add(`${i},${Math.floor(i / 9)},${i % 9}`);
    container.appendChild(temp_canvas);
  }
};

const addFilters = () => {
  canvasContexts.forEach((el, i) => {
    if (i < 10) {
      let imageData = el.getImageData(0, 0, cnv_width, cnv_height);
      let editedImageData = imageData;
      editPixels(editedImageData.data, i);
      imageFilters.push(editedImageData); // 미리 필터 저장
    }
  });
  console.log(imageFilters);
};

const addEventOnCanvas = () => {
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
        } else if (d === 1) {
          canvasContexts[i].putImageData(imageFilters[1], 0, 0);
        } else if (d === 2) {
          canvasContexts[i].putImageData(imageFilters[2], 0, 0);
        } else if (d === 3) {
          canvasContexts[i].putImageData(imageFilters[3], 0, 0);
        } else if (d === 4) {
          canvasContexts[i].putImageData(imageFilters[4], 0, 0);
        } else if (d === 5) {
          canvasContexts[i].putImageData(imageFilters[5], 0, 0);
        } else if (d === 6) {
          canvasContexts[i].putImageData(imageFilters[6], 0, 0);
        } else if (d === 7) {
          canvasContexts[i].putImageData(imageFilters[7], 0, 0);
        } else if (d === 8) {
          canvasContexts[i].putImageData(imageFilters[8], 0, 0);
        } else if (d === 9) {
          canvasContexts[i].putImageData(imageFilters[9], 0, 0);
        }
      });
    });
  });
};

/*
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
*/

/*
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
*/

const sP1 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    imgData[i] = 195;
    // imgData[i + 1] = 9;
    imgData[i + 2] = 31;
  }
};

const sP2 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    imgData[i] = 195;
    // imgData[i + 1] = 9;
    imgData[i + 2] = 125;
  }
};

const sP3 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    imgData[i] = 172;
    // imgData[i + 1] = 9;
    imgData[i + 2] = 199;
  }
};

const sP4 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    imgData[i] = 80;
    // imgData[i + 1] = 9;
    imgData[i + 2] = 195;
  }
};

const sP5 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    // imgData[i] = 10;
    imgData[i + 1] = 31;
    imgData[i + 2] = 197;
  }
};

const sP6 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    // imgData[i] = 10;
    imgData[i + 1] = 124;
    imgData[i + 2] = 196;
  }
};

const sP7 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    // imgData[i] = 8;
    imgData[i + 1] = 196;
    imgData[i + 2] = 80;
  }
};

const sP8 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    imgData[i] = 125;
    imgData[i + 1] = 196;
    // imgData[i + 2] = 9;
  }
};

const sP9 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    imgData[i] = 198;
    imgData[i + 1] = 174;
    // imgData[i + 2] = 5;
  }
};

const sP10 = (imgData) => {
  for (let i = 0; i < imgData.length; i += 4) {
    imgData[i] = 196;
    imgData[i + 1] = 81;
    // imgData[i + 2] = 8;
  }
};

let sP_functions = [sP1, sP2, sP3, sP4, sP5, sP6, sP7, sP8, sP9, sP10];

const editPixels = (imgData, i) => {
  const rand_index = Math.floor(Math.random() * sP_functions.length);
  sP_functions[i % sP_functions.length](imgData);

  /*
  let value = getPixelTotalValue(imgData, i, 100);
  if (value !== 255) {
    imgData[i] = imgData[i + 1] = imgData[i + 2] = value;
  }
  */
};

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
