$(document).ready(function(){
    $(function () {
  // li.id → 이미지 경로 매핑 (index.html 기준 경로로 적으세요)
  const indexImageMap = {
    General:      "./IMAGE/IndexPage/General.png",
    WebDevelop:   "./IMAGE/IndexPage/Webdevelop.png",
    Illustrate:   "./IMAGE/IndexPage/Illustrate.png",
    Composition:  "./IMAGE/indexPage/Composition.png",
    VideoEditing: "./IMAGE/IndexPage/VideoEditing.png",
    Recruiting: "./IMAGE/IndexPage/Recruiting.png",
    // 필요한 항목 계속 추가
  };

  // 이미지 교체 함수 (img#IndexPreview 우선, 없으면 #IndexContainer 배경이미지로)
  function setIndexImage(src, altText) {
    const $img = $("#IndexPreview");      // <img id="IndexPreview">가 있는 경우
    const $box = $("#IndexContainer");    // 아니면 이 div의 배경으로

    $box.css("position", "relative");
    $box.find(".loader").remove(); // 중복 방지
    $box.append(
      '<div class="loader" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.8);padding:6px 12px;border-radius:6px;font-size:14px;color:#333;z-index:10;">로딩중…</div>'
    );

    if ($img.length) {
      // 부드럽게 전환 + 오류 대비
      $img.stop(true, true).fadeTo(120, 0, function () {
        $img
          .attr({ src: src, alt: altText || "" })
          .off("error")
          .on("error", function () {
            $(this).attr("src", "./IMAGE/index/placeholder.png");
          })
          .fadeTo(200, 1, function () {
            // 🔹 로딩중 제거
            $box.find(".loader").remove();
          });
      });
    } else if ($box.length) {
      $box.css({
        "background-image": `url("${src}")`,
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat",
      });
    }
  }

  // 사이드 네비(li) 클릭 핸들러 (위임)
  $("#content").on("click", ".IndexLi", function (e) {
    e.preventDefault();

    const id = this.id;
    const src = indexImageMap[id];
    if (!src) return;

    // 활성 표시
    $(".IndexLi").removeClass("active");
    $(this).addClass("active");

    // 이미지 교체
    setIndexImage(src, $(this).text());
  });

  // (선택) index가 처음 로드되면 '총괄'을 활성화 표시만
  // 기본 이미지는 이미 HTML에서 보여주고 있는 상태라면 아래 두 줄만으로 충분
  const $general = $("#content .IndexLi#General");
  if ($general.length) $general.addClass("active");
});
});