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

window.onload = function() {
    var strCook = document.cookie;
    if (strCook.indexOf("!~") != 0) {
        var intS = strCook.indexOf("!~");
        var intE = strCook.indexOf("~!");
        var strPos = strCook.substring(intS + 2, intE);
        document.getElementById("piece").scrollLeft = strPos;
    }
}

function SetDivPosition() {
    var intY = document.getElementById("piece").scrollLeft;
    document.title = intY;
    document.cookie = "xPos=!~" + intY + "~!";
}