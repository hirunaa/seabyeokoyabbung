$(document).ready(function(){
    // 처음에는 MainPageImage 보여주고, 다른 컨텐츠 영역은 비워둠
    $("#content").hide(); // nav 밑에 붙일 영역( index.html 안에 div#content 만들어야 함 )


    // nav li 클릭 이벤트
    $("nav li").on("click", function () {
        const page = $(this).data("page"); // li에 data-page="main.html" 같은 값 넣어야 함

        // MainPageImage 숨기기
        $("#MainPageImage").hide();

        // content 영역 보이게 하고, 선택한 html 불러오기
        $("#content")
            .show()
            .load(page + " .pages"); // 각 html 안 section.pages 불러오기
    });
});