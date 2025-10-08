$(document).ready(function(){
    const bg = document.getElementById('BackgroundMusic');
  let bgWasPlaying = false;     // 배경음이 원래 재생 중이었는지 기억
  let playingCount = 0;         // 재생 중인 유튜브 플레이어 수

  // iframe src에 enablejsapi=1, origin=... 붙여서 API 제어 가능하게 만듦
  function ensureEnableJsApi(iframe) {
    try {
      const url = new URL(iframe.src, location.href);
      if (!url.searchParams.has('enablejsapi')) url.searchParams.set('enablejsapi', '1');
      if (!url.searchParams.has('origin'))      url.searchParams.set('origin', location.origin);
      // src가 이미 같은 값이면 브라우저가 재요청하지 않음
      if (iframe.src !== url.toString()) iframe.src = url.toString();
    } catch (e) {}
  }

  // 페이지 내 유튜브 iframe들을 Player로 래핑
  function attachPlayers(root=document) {
    if (!window.YT || !YT.Player) return; // API 아직 준비 전
    root.querySelectorAll('iframe[src*="youtube.com/embed"]').forEach((iframe) => {
      if (iframe.dataset.ytAttached) return;  // 중복 방지
      ensureEnableJsApi(iframe);
      new YT.Player(iframe, {
        events: {
          onStateChange: function (e) {
            if (!bg) return;
            if (e.data === YT.PlayerState.PLAYING) {
              // 첫 플레이어가 재생 시작할 때 배경음 일시정지
              if (playingCount++ === 0 && !bg.paused) {
                bgWasPlaying = true;
                try { bg.pause(); } catch(_) {}
              }
            } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
              // 모든 플레이어가 멈추면 배경음 재개(원래 재생 중이었을 때만)
              if (playingCount > 0) playingCount--;
              if (playingCount === 0 && bgWasPlaying) {
                bg.play().catch(() => {}); // 브라우저 정책에 따라 실패할 수 있음
                bgWasPlaying = false;
              }
            }
          }
        }
      });
      iframe.dataset.ytAttached = '1';
    });
  }

  // API 로드
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  // API 준비되면 붙이기
  window.onYouTubeIframeAPIReady = function () {
    attachPlayers(document);
  };

  // 동적으로 페이지를 바꿔 끼우는 경우(#content에 video.html 로드 등)도 감지
  const moTarget = document.getElementById('content') || document.body;
  new MutationObserver(() => attachPlayers(moTarget))
    .observe(moTarget, { childList: true, subtree: true });
});