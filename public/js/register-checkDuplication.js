$(document).ready(function () {
    $(".register-window").find("input:eq(0)").blur(function () {
        var nameNow = $(this).val();
        $.ajax({
            method:"get",
            url:"http://127.0.0.1:8081/checkDuplication?username="+nameNow,
            success:function (data) {
                if(data.existed){
                    $(".reg-alert-bar").text("用户名已存在！");
                    $("#register-submit").attr("disabled","disabled");
                }
                else{
                    $(".reg-alert-bar").text("用户名可以使用");
                    $("#register-submit").removeAttr("disabled");
                }
            }
        })
    });
});