$(document).ready(function() {
    setTimeout(function() {
        $(".explain").fadeOut();
    }, 3000);
});

function backsite() {
    window.history.back();
}

var visiblilty = 0;
function expalin_toggle() {
    if (visiblilty == 0) {
        visiblilty = 1;
        $(".explain").fadeIn();
    } else {
        visiblilty = 0;
        $(".explain").fadeOut();
    }
}