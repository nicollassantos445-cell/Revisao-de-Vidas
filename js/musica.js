/* ===== MÚSICA DE FUNDO ===== */
var MUSICA_ID = "j5ZCckq4ai0"; // código do vídeo do YouTube
/* =========================== */

(function(){
  var tocando = false, pronto = false, querTocar = false, comSom = false, player;
  // A escolha de desligar vale só para a visita atual: numa nova visita, qualquer toque liga a música de novo
  localStorage.removeItem("musica");
  var desligada = sessionStorage.getItem("musica") === "off";

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
  var pedidoEm = 0, fade;
  function tocar(){
    querTocar = true; comSom = true;
    if(!pronto) return;
    // Um toque dispara vários eventos (touchend, pointerup, click) quase ao mesmo tempo, e o estado
    // do player só muda depois. Chamar playVideo/unMute de novo nesse intervalo faz o som engasgar:
    // ignora pedidos repetidos enquanto o anterior ainda está começando
    if(Date.now() - pedidoEm < 1500) return;
    var estado = player.getPlayerState();
    if(player.isMuted()){ entrarSuave(); player.unMute(); }
    if(estado === YT.PlayerState.PLAYING) tocando = true;
    else if(estado !== YT.PlayerState.BUFFERING){ pedidoEm = Date.now(); player.playVideo(); }
  }
  // Aumenta o volume aos poucos: o começo, enquanto o áudio ainda está carregando, fica suave em vez de engasgado
  function entrarSuave(){
    clearInterval(fade);
    var v = 0;
    player.setVolume(0);
    fade = setInterval(function(){
      v += 5;
      player.setVolume(Math.min(v, 60));
      if(v >= 60) clearInterval(fade);
    }, 100);
  }
  function pausar(){ querTocar = false; clearInterval(fade); if(pronto) player.pauseVideo(); }

  window.onYouTubeIframeAPIReady = function(){
    player = new YT.Player("musica-yt", {
      // O YouTube bloqueia players menores que 200x200 no celular
      width: 200, height: 200, videoId: MUSICA_ID,
      // Começa mudo (o celular permite tocar mudo sem toque) e o som é ligado no primeiro toque
      playerVars: { autoplay: desligada ? 0 : 1, mute: 1, controls: 0, playsinline: 1, rel: 0 },
      events: {
        onReady: function(){
          pronto = true;
          if(querTocar){ entrarSuave(); player.unMute(); pedidoEm = Date.now(); player.playVideo(); }
          else if(!desligada){ player.mute(); player.playVideo(); }
        },
        onStateChange: function(e){
          // Repete a música voltando ao início (mais suave que o loop do YouTube, que recarrega o vídeo)
          if(e.data === YT.PlayerState.ENDED){ player.seekTo(0); player.playVideo(); }
          if(e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.PAUSED) pedidoEm = 0;
          var ativo = e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.BUFFERING;
          tocando = ativo && comSom && querTocar;
          atualizar();
        }
      }
    });
  };
  var s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);

  btn.addEventListener("click", function(){
    if(tocando){ pausar(); sessionStorage.setItem("musica","off"); desligada = true; tocando = false; }
    else { tocar(); sessionStorage.removeItem("musica"); desligada = false; tocando = true; }
    atualizar();
  });

  // Navegadores só deixam tocar som depois que a pessoa interage com a página.
  // No celular, "pointerdown"/"touchstart" não contam como interação: usa touchend/pointerup/click/keydown.
  // Continua ouvindo os toques até a música realmente tocar com som (se o player ainda não
  // estava pronto ou o navegador bloqueou, o próximo toque em qualquer lugar tenta de novo).
  var eventos = ["touchend", "pointerup", "click", "keydown"];
  function tocarNoToque(e){
    if(tocando || desligada) return;
    if(btn.contains(e.target)) return; // o próprio botão já cuida disso
    if(e.target.closest && e.target.closest(".video, .reel")) return;
    tocar(); atualizar();
  }
  eventos.forEach(function(ev){ document.addEventListener(ev, tocarNoToque, true); });

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
