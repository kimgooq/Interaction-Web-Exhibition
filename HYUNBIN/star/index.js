window.addEventListener("load", () => {
  const logo = document.querySelectorAll("#logo path");
  for (let i = 0; i < logo.length; i++) {
    logo[i].style.strokeDasharray = `${Math.round(logo[i].getTotalLength())}`;
    logo[i].style.strokeDashoffset = `${Math.round(logo[i].getTotalLength())}`;
    logo[i].style.strokeWidth = "2";
    logo[i].style.animationName = "line_animation";
    logo[i].style.animationDuration = "3s";
    logo[i].style.animationTimingFunction = "ease-in-out";
    logo[i].style.animationDirection = "forward";
    logo[i].style.animationIterationCount = "infinite";
    logo[i].style.animationDelay = "3s";
  }
});
