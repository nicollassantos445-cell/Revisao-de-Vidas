/* ===== MÚSICA DE FUNDO ===== */
var MUSICA_ID = "j5ZCckq4ai0"; // código do vídeo do YouTube
/* =========================== */

(function(){
  var tocando = false, pronto = false, querTocar = false, comSom = false, player;
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
    btn.textContent = "♪";
    btn.setAttribute("aria-label", tocando ? "Pausar música" : "Tocar música");
    btn.title = tocando ? "Pausar música" : "Tocar música";
    btn.classList.toggle("ativa", tocando);
    btn.setAttribute("aria-pressed", tocando);
  }
  // No celular o som só é liberado dentro de um toque: por isso desmuta e dá play na hora do toque
  function tocar(){ querTocar = true; comSom = true; if(pronto){ player.unMute(); player.setVolume(60); player.playVideo(); } }
  function pausar(){ querTocar = false; if(pronto) player.pauseVideo(); }

  window.onYouTubeIframeAPIReady = function(){
    player = new YT.Player("musica-yt", {
      // O YouTube bloqueia players menores que 200x200 no celular
      width: 200, height: 200, videoId: MUSICA_ID,
      // Começa mudo (o celular permite tocar mudo sem toque) e o som é ligado no primeiro toque
      playerVars: { autoplay: desligada ? 0 : 1, mute: 1, loop: 1, playlist: MUSICA_ID, controls: 0, playsinline: 1, rel: 0 },
      events: {
        onReady: function(){
          pronto = true;
          if(querTocar){ player.unMute(); player.setVolume(60); player.playVideo(); }
          else if(!desligada){ player.mute(); player.playVideo(); }
        },
        onStateChange: function(e){
          if(e.data === YT.PlayerState.ENDED){ player.seekTo(0); player.playVideo(); }
          var ativo = e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.BUFFERING;
          tocando = ativo && comSom;
          atualizar();
        }
      }
    });
  };
  var s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);

  btn.addEventListener("click", function(){
    if(tocando){ pausar(); localStorage.setItem("musica","off"); desligada = true; tocando = false; }
    else { tocar(); localStorage.removeItem("musica"); desligada = false; tocando = true; }
    atualizar();
  });

  // Navegadores só deixam tocar som depois que a pessoa interage com a página.
  // No celular, "pointerdown" não conta como interação: usa touchend/click/keydown.
  var eventos = ["touchend", "click", "keydown"];
  function primeiraInteracao(e){
    if(btn.contains(e.target)) return; // o próprio botão já cuida disso
    eventos.forEach(function(ev){ document.removeEventListener(ev, primeiraInteracao, true); });
    if(desligada || (e.target.closest && e.target.closest(".video"))) return;
    tocar(); tocando = true; atualizar();
  }
  eventos.forEach(function(ev){ document.addEventListener(ev, primeiraInteracao, true); });

  // Pausa a música quando alguém dá play em um vídeo do site
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("button.video")){ pausar(); tocando = false; atualizar(); }
  }, true);

  // Clicar dentro de um reel do Instagram tira o foco da página: pausa a música
  window.addEventListener("blur", function(){
    setTimeout(function(){
      var el = document.activeElement;
      if(el && el.tagName === "IFRAME" && el.closest(".reel")){ pausar(); tocando = false; atualizar(); }
    }, 0);
  });

  atualizar();
})();
