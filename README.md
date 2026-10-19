# Full Radio Player

Embeddable player for **[Full Radio](https://referencias.xyz/radio/)**, a free 24/7 online radio station from Brodowski, Brazil. Shows the song playing now, lets visitors request a track, starts paused, and uses a Shadow DOM so your site's CSS does not touch it. No dependencies, no ads.

Live preview and option builder: **https://referencias.xyz/player/**

## Use it with a script tag

```html
<script src="https://cdn.jsdelivr.net/npm/full-radio-player@1/full.js" data-formato="cartao" async></script>
```

## Use it in a bundler or framework

```js
import 'full-radio-player';
```
```html
<div data-full-radio-lugar data-formato="barra" data-tema="claro"></div>
```
The script draws the player in every `data-full-radio-lugar` element it finds when it loads (so render the element first).

## Options (`data-*` attributes)

| Attribute | Values |
|---|---|
| `data-formato` | `cartao` (card, default) · `barra` (bar) · `botao` (floating button) |
| `data-tema` | `escuro` (dark, default) · `claro` (light) |
| `data-cor` | accent color, e.g. `#ff3b45` |
| `data-lado` | `direita` / `esquerda` (button side) |
| `data-fundo`, `data-texto` | background / text color, or `transparente` |
| `data-raio` | corner radius 0–30 |
| `data-largura` | `320`, `320px` or `100%` |
| `data-tamanho` | `compacto` |
| `data-fonte` | `site` (use your site's font) |
| `data-esconder` | comma list: `capa,volume,pedir,bloco,artista` |

## Other ways

* WordPress: plugin with the `[full_radio]` shortcode, source in [`wordpress-plugin/`](wordpress-plugin/) (GPL-2.0-or-later). Download and install guide: https://referencias.xyz/player/
* npm: `npm i full-radio-player` · CDN: https://cdn.jsdelivr.net/npm/full-radio-player@1/full.js
* Plain audio stream: `https://radio.referencias.xyz/listen/full_radio/radio.mp3`

## About the service

The script loads the now-playing data and audio from `referencias.xyz` and `radio.referencias.xyz`, both run by the author. It tells Full Radio the host name of the site that embeds it, and nothing about visitors. The player keeps a small "Full Radio" link, which is how the free radio gets listeners.

MIT licensed.

## Project layout

* `full.js`: the player (single file, vanilla JS).
* `wordpress-plugin/full-radio-player/`: the WordPress plugin (shortcode `[full_radio]`).
* `package.json`: the npm package `full-radio-player`.

Feedback and pull requests are welcome.
