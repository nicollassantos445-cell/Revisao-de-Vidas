/* ===== EDITE AQUI A CADA NOVA EDIÇÃO ===== */
var EVENTO = {
  data: "19, 20 e 21 de fevereiro de 2027",  // troque as datas aqui
  horario: "",                               // opcional: ex. "19h"
  whatsapp: "5511942948130",                 // 55 + DDD + número, só dígitos
  contatoTexto: "(11) 94294-8130"
};
/* ========================================= */

document.querySelectorAll("[data-bind]").forEach(function(el){
  var k = el.getAttribute("data-bind");
  el.textContent = k === "quando" ? EVENTO.data + (EVENTO.horario ? " · " + EVENTO.horario : "") : EVENTO[k];
});

document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();
  var nome = document.getElementById("nome").value.trim();
  var fone = document.getElementById("fone").value.replace(/\D/g,"");
  var erro = document.getElementById("erro");
  if(nome.length < 3){ erro.textContent = "Informe seu nome completo."; return; }
  if(fone.length < 10){ erro.textContent = "Informe um WhatsApp com DDD."; return; }
  erro.textContent = "";
  var msg = "Olá! Quero me inscrever na Revisão de Vidas (" + EVENTO.data + ").\nNome: " + nome + "\nWhatsApp: " + fone + "\nPode me informar o local?";
  window.location.href = "https://wa.me/" + EVENTO.whatsapp + "?text=" + encodeURIComponent(msg);
});

var video = document.getElementById("video");
video.addEventListener("click", function(e){
  e.preventDefault();
  if(video.classList.contains("tocando")) return;
  var f = document.createElement("iframe");
  f.src = "https://www.youtube-nocookie.com/embed/" + video.getAttribute("data-id") + "?autoplay=1&rel=0";
  f.title = "Vídeo da Revisão de Vidas";
  f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  f.allowFullscreen = true;
  video.classList.add("tocando");
  video.innerHTML = "";
  video.appendChild(f);
});
