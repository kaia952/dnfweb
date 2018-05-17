$(document).ready(function () {
    var totalPages = $("#totalPages").text();
    totalPages = parseInt(totalPages);


    $("#nextPage").click(function () {
        turnPage(1);
    });

    $("#prevPage").click(function () {
        turnPage(-1);
    });
    $("#jumpPage").click(function () {
        var selectPage = document.getElementById("pageInput").value;
        jumpPage(selectPage);
    });

    function turnPage(direction) {
        var hrefNow = location.href;
        var arr=[];
        arr = hrefNow.split("/");
        var pageNext = parseInt(arr[arr.length-1]) +direction;
        if(pageNext<=0){
            alert("已经是第一页！");
            return;
        }
        else if(pageNext>totalPages){
            alert("已经到达最后一页！");
            return;
        }
        arr[arr.length-1]=pageNext;
        location.href = arr.join("/");
    }

    function jumpPage(pageNum) {
        if(pageNum<=0||pageNum>totalPages){
            alert("请输入正确范围之内的页码！");
            return;
        }
        var hrefNow = location.href;
        var arr=[];
        arr = hrefNow.split("/");
        arr[arr.length-1] = pageNum;
        location.href = arr.join("/");
    }
});