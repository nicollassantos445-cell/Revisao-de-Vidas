/* ===== MÚSICA DE FUNDO ===== */
var MUSICA_ID = "j5ZCckq4ai0"; // código do vídeo do YouTube
/* =========================== */

(function(){
  var tocando = false, pronto = false, querTocar = false, player;
  var desligada = localStorage.getItem("musica") === "off";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "musica";
  document.body.appendChild(btn);

  var box = document.createElement("div");
  box.className = "musica-player";
  box.innerHTML = '<div id="musica-yt"></div>';
  document.body.appendChild(box);

  function atualizar(){
    btn.textContent = tocando ? "♪ Pausar música" : "♪ Tocar música";
    btn.setAttribute("aria-pressed", tocando);
  }
  function tocar(){ querTocar = true; if(pronto) player.playVideo(); }
  function pausar(){ querTocar = false; if(pronto) player.pauseVideo(); }

  window.onYouTubeIframeAPIReady = function(){
    player = new YT.Player("musica-yt", {
      width: 1, height: 1, videoId: MUSICA_ID,
      playerVars: { loop: 1, playlist: MUSICA_ID, controls: 0, playsinline: 1, rel: 0 },
      events: {
        onReady: function(){ pronto = true; player.setVolume(60); if(querTocar) player.playVideo(); },
        onStateChange: function(e){
          if(e.data === YT.PlayerState.ENDED){ player.seekTo(0); player.playVideo(); }
          tocando = e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.BUFFERING;
          atualizar();
        }
      }
    });
  };
  var s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);

  btn.addEventListener("click", function(){
    if(tocando){ pausar(); localStorage.setItem("musica","off"); tocando = false; }
    else { tocar(); localStorage.removeItem("musica"); tocando = true; }
    atualizar();
  });

  // Navegadores só deixam tocar som depois que a pessoa interage com a página
  function primeiraInteracao(e){
    document.removeEventListener("pointerdown", primeiraInteracao, true);
    document.removeEventListener("keydown", primeiraInteracao, true);
    if(desligada || btn.contains(e.target) || (e.target.closest && e.target.closest(".video"))) return;
    tocar(); tocando = true; atualizar();
  }
  document.addEventListener("pointerdown", primeiraInteracao, true);
  document.addEventListener("keydown", primeiraInteracao, true);

  // Pausa a música quando alguém dá play em um vídeo do site
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("button.video")){ pausar(); tocando = false; atualizar(); }
  }, true);

  if(!desligada){ tocar(); } // tenta tocar já (alguns navegadores permitem)
  atualizar();
})();
