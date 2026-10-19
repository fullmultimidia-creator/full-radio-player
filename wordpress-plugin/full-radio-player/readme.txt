=== Full Radio Player ===
Contributors: fullmulti
Tags: radio, player, audio, streaming, web radio
Requires at least: 6.3
Tested up to: 7.1
Requires PHP: 7.2
Stable tag: 1.0.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add the Full Radio online station (24/7, from Brodowski, Brazil) to your site with a shortcode. Free and ad-free.

== Description ==
Use the `[full_radio]` shortcode in any page, post or text widget. The player loads from referencias.xyz, shows the song that is playing now and lets visitors request a track. Audio only starts when the visitor presses play.

Examples:

* `[full_radio]`: card, dark theme.
* `[full_radio formato="barra" tema="claro"]`: slim bar, light theme.
* `[full_radio formato="botao" lado="esquerda"]`: floating button in the corner of the screen.
* `[full_radio cor="#1e5be6" raio="8" esconder="volume,artista"]`: accent color, corner radius and hidden parts.

The attribute names are in Portuguese (formato = format: cartao/barra/botao = card/bar/button, tema = theme: escuro/claro = dark/light, cor = color, lado = side: direita/esquerda = right/left, raio = corner radius, largura = width, esconder = hide).

Generate the options with a live preview at https://referencias.xyz/player/

== Installation ==
1. Upload the `full-radio-player` folder to `/wp-content/plugins/` (or install the zip at Plugins > Add New).
2. Activate it under Plugins.
3. Write `[full_radio]` where you want the player.

== External services ==
This plugin loads the player script from https://referencias.xyz/player/full.js and the audio stream from https://radio.referencias.xyz. Both are operated by the plugin author.

The script runs only on pages that contain the shortcode, and the audio is requested only when the visitor presses play. The script tells Full Radio the host name of the site where the player is embedded; it sends no personal data about visitors.

Privacy policy: https://referencias.xyz/privacidade/

== Changelog ==
= 1.0.1 =
* The script is now loaded through wp_enqueue_script, once per page, in the footer.

= 1.0.0 =
* First release.
