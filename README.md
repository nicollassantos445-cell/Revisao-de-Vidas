# Revisão de Vidas — Site de convite

Site de convite para o evento cristão **Revisão de Vidas — um encontro face a face com Deus**.
É um site estático (HTML, CSS e JavaScript puros): não precisa instalar nada nem rodar build.

## Funcionalidades

- Página de convite com abertura em foto, texto de apresentação e galeria de fotos.
- Datas do evento em um único lugar, fácil de trocar a cada edição.
- Formulário de inscrição (nome e WhatsApp) que leva a pessoa direto ao WhatsApp da coordenação, com a mensagem já preenchida.
- Botão que abre o vídeo de apresentação no YouTube.
- Layout responsivo (celular e computador).

## Estrutura

```
revisao-de-vidas/
├── index.html        # estrutura da página
├── css/
│   └── style.css     # estilos e cores
├── js/
│   └── main.js       # datas, contato e envio da inscrição
├── images/           # fotos usadas na página
├── .gitignore
└── README.md
```

## Como executar

**Opção 1 — direto no navegador:** dê dois cliques em `index.html`.

**Opção 2 — servidor local** (recomendado), dentro da pasta do projeto:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

> As fontes (Fraunces e Figtree) vêm do Google Fonts, então é preciso internet para vê-las. Sem internet, a página usa fontes do sistema.

## Como atualizar a cada edição

Abra `js/main.js`. No começo do arquivo, no bloco **EDITE AQUI**:

```js
var EVENTO = {
  data: "19, 20 e 21 de fevereiro de 2027",  // datas do evento
  horario: "",                               // opcional, ex.: "19h"
  whatsapp: "5511942948130",                 // 55 + DDD + número, só dígitos
  contatoTexto: "(11) 94294-8130"            // como o número aparece na página
};
```

Para trocar o vídeo, procure por `youtube.com/watch` no `index.html`.
Para trocar fotos, substitua os arquivos na pasta `images/` mantendo os mesmos nomes.

## Publicar com GitHub Pages (gratuito)

1. No repositório, vá em **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)` e clique em **Save**.
4. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
