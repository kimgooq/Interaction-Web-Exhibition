var mouseWheelEvt = function(event) {
    if (document.getElementById("piece").doScroll)
        document.getElementById("piece").doScroll(event.wheelDelta > 0 ? "left" : "right");
    else if ((event.wheelDelta || event.detail) > 0)
        document.getElementById("piece").scrollLeft -= 30;
    else
        document.getElementById("piece").scrollLeft += 30;

    return false;
}


$(document).ready(function() {
    document.getElementById("piece").addEventListener("mousewheel", mouseWheelEvt);
});