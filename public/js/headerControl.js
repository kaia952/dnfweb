$(document).ready(function () {
    $(".header-register").on("click",function () {
        $(".register-window").fadeToggle(100);
        $(".cover").fadeToggle(100);
    });

    $(".header-login").click(function () {
        $(".login-window").fadeToggle(100);
        $(".cover").fadeToggle(100);
    });

    $(".reg-close-btn").click(function () {
        $(".header-register").click();
    });
    $(".login-close-btn").click(function () {
        $(".header-login").click();
    })
});