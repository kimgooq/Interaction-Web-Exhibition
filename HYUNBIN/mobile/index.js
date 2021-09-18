const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");

btn1.addEventListener("click", () => {
  navigator.vibrate(2000);
});

btn2.addEventListener("click", () => {
  navigator.vibrate([300, 100, 500, 100, 300]); // duration, delay, duration ...
});

const box = document.getElementById("testBox");

window.addEventListener("deviceorientation", handlerOrientation, true);

function handlerOrientation(event) {
  let properties = "";
  for (let prop in event) {
    properties += prop + ": " + event[prop] + "<br>";
  }
  box.innerHTML = properties;
}
