/* ===== EDITE AQUI OS VÍDEOS DE TESTEMUNHO ===== */
// Cole o código do vídeo do YouTube (o que vem depois de "watch?v=" ou "youtu.be/")
var VIDEOS = [
  { id: "", titulo: "Testemunho 1" },
  { id: "", titulo: "Testemunho 2" },
  { id: "", titulo: "Testemunho 3" }
];
/* ============================================== */

var atual = 0;
var player = document.getElementById("player");
var contador = document.getElementById("contador");

function mostrar(i){
  var v = VIDEOS[i];
  contador.textContent = v.titulo + " · " + (i + 1) + " de " + VIDEOS.length;
  player.innerHTML = "";
  if(!v.id){
    var vazio = document.createElement("div");
    vazio.className = "video";
    vazio.innerHTML = '<span class="breve">Vídeo em breve</span>';
    player.appendChild(vazio);
    return;
  }
  var btn = document.createElement("button");
  btn.className = "video";
  btn.type = "button";
  btn.innerHTML = '<span><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#f0c27a"/><path d="M26 20l20 12-20 12z" fill="#2a1d05"/></svg>Assistir ao ' + v.titulo.toLowerCase() + '</span>';
  btn.style.backgroundImage = "linear-gradient(rgba(18,22,42,.35),rgba(18,22,42,.8)),url(https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg)";
  btn.style.backgroundSize = "cover";
  btn.style.backgroundPosition = "center";
  btn.addEventListener("click", function(){
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + v.id + "?autoplay=1&rel=0&playsinline=1";
    f.title = v.titulo;
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    var box = document.createElement("div");
    box.className = "video";
    box.appendChild(f);
    btn.replaceWith(box);
  });
  player.appendChild(btn);
}

document.getElementById("proximo").addEventListener("click", function(){
  atual = (atual + 1) % VIDEOS.length;
  mostrar(atual);
});

mostrar(0);
