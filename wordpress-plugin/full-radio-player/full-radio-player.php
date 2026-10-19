<?php
/**
 * Plugin Name: Full Radio Player
 * Plugin URI: https://referencias.xyz/player/
 * Description: Adds the Full Radio online station (24/7, Brodowski, Brazil) to your site with the [full_radio] shortcode. Free, no ads.
 * Version: 1.0.1
 * Requires at least: 6.3
 * Requires PHP: 7.2
 * Author: fullmulti
 * Author URI: https://referencias.xyz/radio/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: full-radio-player
 */
if (!defined('ABSPATH')) exit;

define('FULL_RADIO_PLAYER_VERSION', '1.0.1');

/**
 * [full_radio format="card|bar|button" ...] (Portuguese attribute names also work: formato="cartao|barra|botao", tema, cor, lado, ...)
 * Leaves a placeholder where the shortcode is; the script (enqueued once, in the footer) draws the player there.
 */
function full_radio_player_shortcode($atts) {
    $a = shortcode_atts(array(
        'formato' => 'cartao', 'tema' => 'escuro', 'cor' => '', 'lado' => '', 'fundo' => '', 'texto' => '',
        'raio' => '', 'largura' => '', 'tamanho' => '', 'fonte' => '', 'esconder' => '',
    ), $atts, 'full_radio');
    if (!in_array($a['formato'], array('cartao', 'barra', 'botao'), true)) $a['formato'] = 'cartao';

    // "via=wp" tells the script not to build a player of its own: it only serves the placeholders below
    wp_enqueue_script(
        'full-radio-player',
        'https://referencias.xyz/player/full.js?via=wp',
        array(),
        FULL_RADIO_PLAYER_VERSION,
        array('in_footer' => true, 'strategy' => 'async')
    );

    $attr = '';
    foreach ($a as $k => $v) {
        if ($v === '' || ($k === 'tema' && $v === 'escuro')) continue;
        $attr .= ' data-' . esc_attr($k) . '="' . esc_attr($v) . '"';
    }
    return '<div data-full-radio-lugar' . $attr . '></div>'
        . '<noscript><a href="https://referencias.xyz/radio/">Full Radio: online radio 24/7</a></noscript>';
}
add_shortcode('full_radio', 'full_radio_player_shortcode');
