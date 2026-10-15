/* ===== MÚSICA DE FUNDO ===== */
var MUSICA_ARQUIVO = "/audio/louvor.mp3"; // arquivo de música do site
/* =========================== */

(function(){
  var tocando = false;
  // A escolha de desligar vale só para a visita atual: numa nova visita, qualquer toque liga a música de novo
  localStorage.removeItem("musica");
  var desligada = sessionStorage.getItem("musica") === "off";

  var audio = new Audio(MUSICA_ARQUIVO);
  audio.loop = true;
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "musica";
  document.body.appendChild(btn);

  function atualizar(){
    btn.textContent = "♪";
    btn.setAttribute("aria-label", tocando ? "Pausar música" : "Tocar música");
    btn.title = tocando ? "Pausar música" : "Tocar música";
    btn.classList.toggle("ativa", tocando);
    btn.setAttribute("aria-pressed", tocando);
  }

  // Aumenta o volume aos poucos para a música entrar suave
  var fade;
  function entrarSuave(){
    clearInterval(fade);
    var v = 0;
    audio.volume = 0;
    fade = setInterval(function(){
      v += 0.05;
      audio.volume = Math.min(v, 0.6);
      if(v >= 0.6) clearInterval(fade);
    }, 100);
  }

  function tocar(){
    if(tocando) return;
    tocando = true;
    entrarSuave();
    var p = audio.play();
    // Se o navegador bloquear (ainda sem interação), o próximo toque tenta de novo
    if(p && p.catch) p.catch(function(){ tocando = false; clearInterval(fade); atualizar(); });
  }
  function pausar(){ tocando = false; clearInterval(fade); audio.pause(); }

  audio.addEventListener("play", function(){ tocando = true; atualizar(); });
  audio.addEventListener("pause", function(){ tocando = false; atualizar(); });

  btn.addEventListener("click", function(){
    if(tocando){ pausar(); sessionStorage.setItem("musica","off"); desligada = true; }
    else { tocar(); sessionStorage.removeItem("musica"); desligada = false; }
    atualizar();
  });

  // Navegadores só deixam tocar som depois que a pessoa interage com a página.
  // No celular, "pointerdown"/"touchstart" não contam como interação: usa touchend/pointerup/click/keydown.
  // No computador, "mousedown" já conta como interação.
  var eventos = ["touchend", "pointerup", "mousedown", "click", "keydown"];
  function tocarNoToque(e){
    if(tocando || desligada) return;
    if(btn.contains(e.target)) return; // o próprio botão já cuida disso
    if(e.target.closest && e.target.closest(".video, .reel")) return;
    tocar(); atualizar();
  }
  eventos.forEach(function(ev){ document.addEventListener(ev, tocarNoToque, true); });

  // Pausa a música quando alguém dá play em um vídeo do site
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("button.video")){ pausar(); atualizar(); }
  }, true);

  // Clicar dentro de um reel do Instagram tira o foco da página: pausa a música
  window.addEventListener("blur", function(){
    setTimeout(function(){
      var el = document.activeElement;
      if(el && el.tagName === "IFRAME" && el.closest(".reel")){ pausar(); atualizar(); }
    }, 0);
  });

  atualizar();

  // No computador/notebook, tenta começar sozinha assim que a página abre.
  // Se o navegador bloquear, a música começa na primeira interação (clique, tecla ou toque).
  if(!desligada){
    if(audio.readyState >= 2) tocar();
    else audio.addEventListener("canplay", function(){ if(!desligada) tocar(); }, { once: true });
  }
})();
