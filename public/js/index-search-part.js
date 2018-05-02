$(document).ready(function () {
    $("#searchType1").change(function () {
        if($("#searchType1 option:selected").attr("value")==="character"){
            $("#searchTypeCharacter").css("display","inline-block").removeAttr("disabled");
        }
        else{
            $("#searchTypeCharacter").css("display","none").attr("disabled","disabled");
        }
    });
});