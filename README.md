# Full Radio Player

**English** · [Português](#português-brasil)

Ways to put **[Full Radio](https://referencias.xyz/radio/)**, a free 24/7 online radio station from Brodowski, Brazil, on your site, blog, app or stream. No ads, no account, no dependencies.

Live preview and option builder: **https://referencias.xyz/player/**

<p>
<img src="https://raw.githubusercontent.com/fullmultimidia-creator/full-radio-player/main/docs/cartao-escuro.png" alt="Full Radio Player: dark card" width="49%">
<img src="https://raw.githubusercontent.com/fullmultimidia-creator/full-radio-player/main/docs/cartao-claro.png" alt="Full Radio Player: light card" width="49%">
<img src="https://raw.githubusercontent.com/fullmultimidia-creator/full-radio-player/main/docs/barra-escura.png" alt="Full Radio Player: dark bar" width="49%">
<img src="https://raw.githubusercontent.com/fullmultimidia-creator/full-radio-player/main/docs/barra-clara.png" alt="Full Radio Player: light bar" width="49%">
</p>

| Option | What it is | Best for |
|---|---|---|
| [Full Radio Player](#1-full-radio-player-the-script) | Our own player: card, bar or floating button. Shows what's playing, lets visitors request a song, themeable. | Any site that accepts a script tag |
| [WordPress plugin](#2-wordpress-plugin) | The same player through the `[full_radio]` shortcode. | WordPress |
| [Simple player (iframe)](#3-simple-player-iframe) | The station's own player, requests page and "recently played" list, as iframes. | Notion, Wix, Google Sites, anywhere only iframes work |
| [Audio stream](#4-audio-stream--now-playing-api) | Plain MP3 stream and a JSON "now playing" API. | Your own player, VLC, OBS, apps |

## 1. Full Radio Player (the script)

Single file, vanilla JS, Shadow DOM (your CSS does not touch it, it does not touch yours). Starts paused: audio only loads when the visitor presses play.

```html
<script src="https://cdn.jsdelivr.net/npm/full-radio-player@1/full.js" data-formato="cartao" async></script>
```

In a bundler or framework:

```js
import 'full-radio-player';
```
```html
<div data-full-radio-lugar data-formato="barra" data-tema="claro"></div>
```
The player is drawn in every `data-full-radio-lugar` element present when the script loads, so render the element first.

### Options (`data-*` attributes)

| Attribute | Values |
|---|---|
| `data-formato` | `cartao` (card, default) · `barra` (bar) · `botao` (floating button) |
| `data-tema` | `escuro` (dark, default) · `claro` (light) |
| `data-cor` | accent color, e.g. `#ff3b45` |
| `data-lado` | `direita` / `esquerda` (side of the floating button) |
| `data-fundo`, `data-texto` | background / text color, or `transparente` |
| `data-raio` | corner radius, 0–30 |
| `data-largura` | `320`, `320px` or `100%` |
| `data-tamanho` | `compacto` (compact) |
| `data-fonte` | `site` (use your site's font) |
| `data-esconder` | comma list of parts to hide: `capa,volume,pedir,bloco,artista` |

## 2. WordPress plugin

Source in [`wordpress-plugin/`](wordpress-plugin/) (GPL-2.0-or-later). Use the shortcode in any page, post or text widget:

```
[full_radio]
[full_radio formato="barra" tema="claro"]
[full_radio formato="botao" lado="esquerda" cor="#1e5be6"]
```
Same options as above, without the `data-` prefix. Without the plugin you can also paste the script tag into a "Custom HTML" block.

## 3. Simple player (iframe)

The station's own AzuraCast pages. Fewer options, but works where scripts are blocked (for example Notion: type `/embed` and paste the URL).

```html
<!-- player -->
<iframe src="https://radio.referencias.xyz/public/full_radio/embed?theme=dark" frameborder="0" allowtransparency="true" style="width:100%;min-height:150px;border:0"></iframe>
<!-- song requests -->
<iframe src="https://radio.referencias.xyz/public/full_radio/embed-requests?theme=dark" frameborder="0" style="width:100%;min-height:420px;border:0"></iframe>
<!-- recently played -->
<iframe src="https://radio.referencias.xyz/public/full_radio/history?theme=dark" frameborder="0" style="width:100%;min-height:300px;border:0"></iframe>
```
Use `theme=light` for the light version.

**Full Radio Player inside Notion:** Notion does not run scripts, but it accepts our player as an embed. Type `/embed`, paste the address and drag the edge to resize (about 90 px tall for the bar, 150 px for the card):

```
https://referencias.xyz/player/embed/?f=barra&tema=claro
https://referencias.xyz/player/embed/?f=cartao&tema=escuro&cor=1e5be6
```
`f` = `cartao` or `barra`, `tema` = `escuro` or `claro`, `cor` = accent color in 6-digit hex without `#`.

## 4. Audio stream & now-playing API

* MP3 stream (192 kbps): `https://radio.referencias.xyz/listen/full_radio/radio.mp3`
  `<audio controls src="https://radio.referencias.xyz/listen/full_radio/radio.mp3"></audio>`
  Also works in VLC, Winamp, radio apps and as an OBS media source.
* Now playing (JSON): `https://radio.referencias.xyz/api/nowplaying/full_radio`

## 5. Game servers: GTA RP (FiveM, MTA, SA-MP)

Ready-made packages in [`games/`](games/). Players type `/fullradio` to turn the radio on and off (`/fullradio 40` sets the volume on FiveM and MTA). Downloads and step-by-step guide (pt-BR): https://referencias.xyz/player/gta/

* **FiveM (GTA V):** copy `games/fivem/fullradio` to `resources/` and add `ensure fullradio` to `server.cfg`. Audio plays in NUI; a card shows the current song. Options in `config.lua` (vehicle-only mode, key binding, volume).
* **MTA:SA:** copy `games/mta/fullradio` to `server/mods/deathmatch/resources/` (or zip its contents as `fullradio.zip`), then `refresh` and `start fullradio`. Song titles show in chat.
* **SA-MP / open.mp:** `games/samp/fullradio.pwn` is a filterscript using `PlayAudioStreamForPlayer` (a ZCMD/Pawn.CMD version is in the file).

## 6. Retro hotels & private servers (Habbo, Club Penguin, Tibia, Ragnarok)

Web-based games and server sites use the regular script from section 1: paste it before `</body>` in the hotel client page (e.g. Nitro `index.html`), the CPPS play page, MyAAC/Gesior templates or FluxCP themes. Guide (pt-BR): https://referencias.xyz/player/retro/

## About the service

The script loads the now-playing data and audio from `referencias.xyz` and `radio.referencias.xyz`, both run by the author. It tells Full Radio the host name of the site that embeds it, and nothing about visitors. The player keeps a small "Full Radio" link, which is how the free radio gets listeners. If you use the stream directly, please link back to https://referencias.xyz/radio/.

## Project layout

* `full.js`: the player (single file, vanilla JS).
* `wordpress-plugin/full-radio-player/`: the WordPress plugin.
* `games/`: FiveM and MTA resources and the SA-MP filterscript.
* `package.json`: the npm package [`full-radio-player`](https://www.npmjs.com/package/full-radio-player).

MIT licensed (the WordPress plugin is GPL-2.0-or-later). Issues and pull requests are welcome.

---

# Português (Brasil)

Formas de colocar a **[Full Radio](https://referencias.xyz/radio/)**, rádio online 24h de Brodowski/SP, no seu site, blog, app ou live. Grátis, sem anúncio, sem cadastro e sem dependências.

Prévia ao vivo e gerador de código: **https://referencias.xyz/player/**

| Opção | O que é | Ideal para |
|---|---|---|
| [Player da Full](#1-player-da-full-o-script) | Player próprio: cartão, barra ou botão flutuante. Mostra o que está tocando, aceita pedido de música e muda de cor e tema. | Qualquer site que aceite uma tag de script |
| [Plugin do WordPress](#2-plugin-do-wordpress) | O mesmo player pelo shortcode `[full_radio]`. | WordPress |
| [Player simples (iframe)](#3-player-simples-iframe) | O player da própria rádio, a página de pedidos e a lista "últimas tocadas", em iframe. | Notion, Wix, Google Sites e onde só iframe funciona |
| [Áudio ao vivo](#4-áudio-ao-vivo-e-api-do-que-está-tocando) | Stream MP3 e API em JSON da música atual. | Seu próprio player, VLC, OBS, apps |

## 1. Player da Full (o script)

Um arquivo só, JavaScript puro, Shadow DOM (o CSS do seu site não mexe nele, e ele não mexe no seu). Começa pausado: o áudio só carrega quando o visitante aperta play.

```html
<script src="https://cdn.jsdelivr.net/npm/full-radio-player@1/full.js" data-formato="cartao" async></script>
```

Com bundler ou framework:

```js
import 'full-radio-player';
```
```html
<div data-full-radio-lugar data-formato="barra" data-tema="claro"></div>
```
O player é desenhado em cada elemento `data-full-radio-lugar` que existir quando o script carregar, então renderize o elemento antes.

### Opções (atributos `data-*`)

| Atributo | Valores |
|---|---|
| `data-formato` | `cartao` (padrão) · `barra` · `botao` (flutuante no canto) |
| `data-tema` | `escuro` (padrão) · `claro` |
| `data-cor` | cor de destaque, ex.: `#ff3b45` |
| `data-lado` | `direita` / `esquerda` (lado do botão flutuante) |
| `data-fundo`, `data-texto` | cor do fundo / do texto, ou `transparente` |
| `data-raio` | arredondamento das bordas, 0–30 |
| `data-largura` | `320`, `320px` ou `100%` |
| `data-tamanho` | `compacto` |
| `data-fonte` | `site` (usa a fonte do seu site) |
| `data-esconder` | lista separada por vírgula: `capa,volume,pedir,bloco,artista` |

## 2. Plugin do WordPress

Código em [`wordpress-plugin/`](wordpress-plugin/) (GPL-2.0-or-later). Use o shortcode em qualquer página, post ou widget de texto:

```
[full_radio]
[full_radio formato="barra" tema="claro"]
[full_radio formato="botao" lado="esquerda" cor="#1e5be6"]
```
As opções são as mesmas de cima, sem o prefixo `data-`. Sem o plugin, também dá para colar a tag de script num bloco "HTML personalizado".

## 3. Player simples (iframe)

As páginas do AzuraCast da própria rádio. Tem menos ajustes, mas funciona onde script é bloqueado (no Notion: digite `/embed` e cole o endereço).

```html
<!-- player -->
<iframe src="https://radio.referencias.xyz/public/full_radio/embed?theme=dark" frameborder="0" allowtransparency="true" style="width:100%;min-height:150px;border:0"></iframe>
<!-- pedidos de música -->
<iframe src="https://radio.referencias.xyz/public/full_radio/embed-requests?theme=dark" frameborder="0" style="width:100%;min-height:420px;border:0"></iframe>
<!-- últimas tocadas -->
<iframe src="https://radio.referencias.xyz/public/full_radio/history?theme=dark" frameborder="0" style="width:100%;min-height:300px;border:0"></iframe>
```
Use `theme=light` para a versão clara.

**Player da Full dentro do Notion:** o Notion não roda script, mas aceita o nosso player como embed. Digite `/embed`, cole o endereço e arraste a borda para ajustar (uns 90 px de altura para a barra e 150 px para o cartão):

```
https://referencias.xyz/player/embed/?f=barra&tema=claro
https://referencias.xyz/player/embed/?f=cartao&tema=escuro&cor=1e5be6
```
`f` = `cartao` ou `barra`, `tema` = `escuro` ou `claro`, `cor` = cor de destaque em hexadecimal de 6 dígitos, sem `#`.

## 4. Áudio ao vivo e API do que está tocando

* Stream MP3 (192 kbps): `https://radio.referencias.xyz/listen/full_radio/radio.mp3`
  `<audio controls src="https://radio.referencias.xyz/listen/full_radio/radio.mp3"></audio>`
  Também funciona no VLC, Winamp, apps de rádio e como fonte de mídia no OBS.
* Música atual (JSON): `https://radio.referencias.xyz/api/nowplaying/full_radio`

## 5. Servidores de jogo: GTA RP (FiveM, MTA, SA-MP)

Pacotes prontos em [`games/`](games/). O jogador digita `/fullradio` para ligar e desligar (`/fullradio 40` muda o volume no FiveM e no MTA). Downloads e passo a passo: https://referencias.xyz/player/gta/

* **FiveM (GTA V):** copie `games/fivem/fullradio` para `resources/` e adicione `ensure fullradio` no `server.cfg`. O som toca na NUI e um cartão mostra a música no ar. Ajustes no `config.lua` (só no veículo, tecla de atalho, volume).
* **MTA:SA:** copie `games/mta/fullradio` para `server/mods/deathmatch/resources/` (ou compacte o conteúdo como `fullradio.zip`) e rode `refresh` e `start fullradio`. O nome da música aparece no chat.
* **SA-MP / open.mp:** `games/samp/fullradio.pwn` é um filterscript com `PlayAudioStreamForPlayer` (a versão para ZCMD/Pawn.CMD está no arquivo).

## 6. Hotéis retrô e servidores privados (Habbo, Club Penguin, Tibia, Ragnarok)

Jogos que rodam no navegador e sites de servidor usam o mesmo script da seção 1: cole antes do `</body>` na página do client do hotel (ex.: `index.html` do Nitro), na página "Jogar" do CPPS, nos templates do MyAAC/Gesior ou nos temas do FluxCP. Guia: https://referencias.xyz/player/retro/

## Sobre o serviço

O script busca os dados e o áudio em `referencias.xyz` e `radio.referencias.xyz`, os dois mantidos pelo autor. Ele avisa a Full Radio o endereço do site onde está embutido e nada sobre os visitantes. O player mantém um link pequeno "Full Radio", que é como a rádio gratuita ganha ouvintes. Se usar o stream direto, deixe um link para https://referencias.xyz/radio/.

## Estrutura

* `full.js`: o player (um arquivo, JavaScript puro).
* `wordpress-plugin/full-radio-player/`: o plugin do WordPress.
* `games/`: recursos para FiveM e MTA e o filterscript do SA-MP.
* `package.json`: o pacote npm [`full-radio-player`](https://www.npmjs.com/package/full-radio-player).

Licença MIT (o plugin do WordPress é GPL-2.0-or-later). Issues e pull requests são bem-vindos.
