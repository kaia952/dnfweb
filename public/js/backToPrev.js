//按backspace键返回上一页
$(document).keydown(function (event) {
    if(event.keyCode===37){
        window.history.back();
    }
})