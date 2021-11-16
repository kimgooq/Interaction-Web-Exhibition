const img = new Image();

const readImage = img_input => {
    // 인풋 태그에 파일이 있는 경우 
    if (img_input.files && img_input.files[0]) {
        // FileReader 인스턴스 생성
        const reader = new FileReader();
        const img_show = document.getElementById('uploaded');
        reader.onload = e => {
            // img 태그의 src 속성으로 설정
            img_show.src = e.target.result;
            img.src = e.target.result;
            console.log(e.target.result);
        }
        reader.readAsDataURL(img_input.files[0]);
    }
}

document.getElementById('img_input').addEventListener("change", e => {
    readImage(e.target);
})

img.addEventListener('load', () => {
  const cnv = document.getElementById('cnv');
  const ctx = cnv.getContext('2d');
  ctx.drawImage(img, 0, 0, cnv.width, cnv.height);
})
