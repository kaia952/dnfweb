$(document).ready(function () {
    $(".header-register").click(function () {
        $(".register-window").fadeToggle(100);
        $(".cover").fadeToggle(100);
    });
    $(".header-login").click(function () {
        $(".login-window").fadeToggle(100);
        $(".cover").fadeToggle(100);
    });

});