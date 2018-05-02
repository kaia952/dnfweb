$(document).ready(function () {
    $(document).keydown(function (event) {
        if(event.keyCode===8){
            window.history.back();
        }
    })
});