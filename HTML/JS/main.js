$(document).ready(function(){


        // main.js
    $(function () {
    const $content = $("#content");
    const $mainImg = $("#MainPageImage");
    const $nav     = $(".NavBox");

    // 처음: 메인 이미지만 보이기
    $content.hide();
    $mainImg.show();

    // 현재 열려 있는 페이지 키(파일명) 저장
    let currentPage = null;

    // 메인으로 복귀
    function showHome() {
        currentPage = null;
        $content.hide().empty();
        $mainImg.show();
        $nav.find("li").removeClass("active");
        // (선택) 주소의 해시 지우기
        // history.pushState({}, "", location.pathname);
        window.scrollTo(0, 0);
    }

    // 페이지 로드
    function loadPage(pageFile) {
        if (!pageFile) return;

        // 같은 항목을 다시 클릭하면 홈으로
        if (currentPage === pageFile) {
        showHome();
        return;
        }

        currentPage = pageFile;
        $mainImg.hide();
        $nav.find("li").removeClass("active")
            .filter(`[data-page="${pageFile}"]`).addClass("active");

        $content
        .show()
        .attr("aria-busy", "true")
        .html('<div class="loading" role="status">로딩중…</div>')
        .load(pageFile + " .pages", function (res, status) {
            $(this).removeAttr("aria-busy");
            if (status === "error") {
            $(this).html("<p>페이지를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>");
            return;
            }
            window.scrollTo(0, 0);
        });
    }

    // nav 클릭
    $nav.on("click", "li[data-page]", function (e) {
        e.preventDefault();
        const pageFile = $(this).data("page"); // 예: "fanart.html"
        loadPage(pageFile);
    });
});

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