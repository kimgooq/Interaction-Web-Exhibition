function start() {
    window.location.href = "pieces.html"
}

function basic_background() {
    document.body.style.background = "#BADCE4";
}

function event_background(event) {
    thisId = event.target.id;
    thisSrc = document.getElementById(thisId).src;
    document.body.style.background = "url('" + thisSrc + "')";
}
var visiblilty = 0; //0 : hidden, 1 : visible
function expalin_toggle() {
    if (visiblilty == 0) {
        visiblilty = 1;
        $(".explain").fadeIn();
    } else {
        visiblilty = 0;
        $(".explain").fadeOut();
    }
}

function backsite() {
    window.history.back();
}

var btn = 0; //0 = grid, 1 = flow.

function grid_flow_btn(event) {
    if (btn == 0) {
        btn = 1;
        event.target.src = "media/flow_icon.svg";
    } else {
        btn = 0;
        event.target.src = "media/grid_icon.svg";
    }
}

function btn_mouseon(event) {
    event.target.style.width = event.target.style.width + 3;
    event.target.style.height = event.target.style.width + 3;
    event.target.style.transition = "all 0.5s";
}

function btn_mouseout(event) {
    event.target.style.width = event.target.style.width - 3;
    event.target.style.height = event.target.style.width - 3;
    event.target.style.transition = "all 0.5s";
}

$(document).ready(function() {
    setTimeout(function() {
        $(".explain").fadeOut();
    }, 3000);
});