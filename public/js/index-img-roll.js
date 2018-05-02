$(document).ready(function () {
    var curRollIndex = 0;
    var imgOffsetLeft = -curRollIndex * 450;

    var setAutoRoll = setInterval(autoRoll,4000);

    $(".select-bar-item").each(function (index,item) {

        $(this).click(function () {
            if($(".img-container").is(":animated")){
                return;
            }
            else{
                clearInterval(setAutoRoll);
                curRollIndex = index;
                setSelectBar(curRollIndex);
                imgOffsetLeft = -curRollIndex*450;
                imgRoll(imgOffsetLeft);
                setAutoRoll = setInterval(autoRoll,4000);
            }
        })
    });

    function imgRoll(leftOffset) {
        $(".img-container").animate({
            marginLeft:leftOffset
        },500);
    }

    function autoRoll() {

        if(curRollIndex<3){
            curRollIndex++;
            imgRoll(-curRollIndex*450);
            setSelectBar(curRollIndex);
        }
        else if(curRollIndex===3){
            curRollIndex++;
            $(".img-container").animate({
                marginLeft:-curRollIndex*450+"px"
            },500,function () {
                $(".img-container").css("margin-left","0");
                curRollIndex = 0;
            });
            setSelectBar(curRollIndex);
        }
    }

    function setSelectBar(index) {
        if(index<4){
            $(".select-bar-item").removeClass("select-bar-active").eq(index).addClass("select-bar-active");
        }
        else if(index===4){
            $(".select-bar-item").removeClass("select-bar-active").eq(0).addClass("select-bar-active");
        }
    }
});