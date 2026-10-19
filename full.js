/*! Player da Full Radio — https://referencias.xyz/player/
 * Cole no seu site:  <script src="https://referencias.xyz/player/full.js" data-formato="cartao" async></script>
 * data-formato: cartao (padrão) | barra | botao (flutuante no canto)
 * data-tema: escuro (padrão) | claro      data-cor: cor de destaque (ex. #ff3b45)      data-lado: direita | esquerda (botão)
 * Ajustes finos: data-fundo (#cor ou transparente) · data-texto (#cor) · data-raio (0–30) · data-largura (px ou 100%)
 *   data-tamanho="compacto" · data-fonte="site" (usa a fonte do seu site) · data-esconder="capa,volume,pedir,bloco,artista"
 * O player é desenhado dentro de um Shadow DOM: o estilo do seu site não mexe nele e ele não mexe no seu site.
 * Começa pausado: só puxa o áudio quando o visitante aperta play.
 */
(function () {
  'use strict';
  var BASE = 'https://referencias.xyz';
  // lugares marcados (plugin do WordPress): <div data-full-radio-lugar data-formato="..."></div>; o script carrega no rodapé
  var scripts = document.querySelectorAll('script[src*="/player/full.js"]:not([data-fr-ok]):not([src*="via=wp"]),script[src*="full-radio-player"][src$="full.js"]:not([data-fr-ok]),[data-full-radio-lugar]:not([data-fr-ok])');
  Array.prototype.forEach.call(scripts, function (s) { s.setAttribute('data-fr-ok', '1'); monta(s); });

  function monta(s) {
    var o = {
      formato: ({ barra: 1, botao: 1, cartao: 1 })[s.dataset.formato] ? s.dataset.formato : 'cartao',
      tema: s.dataset.tema === 'claro' ? 'claro' : 'escuro',
      cor: /^#[0-9a-f]{3,8}$/i.test(s.dataset.cor || '') ? s.dataset.cor : '',
      lado: s.dataset.lado === 'esquerda' ? 'esquerda' : 'direita',
      fundo: s.dataset.fundo === 'transparente' ? 'transparent' : (/^#[0-9a-f]{3,8}$/i.test(s.dataset.fundo || '') ? s.dataset.fundo : ''),
      texto: /^#[0-9a-f]{3,8}$/i.test(s.dataset.texto || '') ? s.dataset.texto : '',
      raio: /^\d{1,2}$/.test(s.dataset.raio || '') ? Math.min(30, +s.dataset.raio) : null,
      largura: /^(\d{2,4}(px)?|100%)$/.test(s.dataset.largura || '') ? (s.dataset.largura === '100%' ? '100%' : parseInt(s.dataset.largura, 10) + 'px') : '',
      compacto: s.dataset.tamanho === 'compacto',
      fonteSite: s.dataset.fonte === 'site',
      esconder: (s.dataset.esconder || '').split(',').map(function (x) { return x.trim(); })
    };
    var host = document.createElement('div');
    host.setAttribute('data-full-radio', o.formato);
    if (o.formato === 'botao') document.body.appendChild(host); else s.parentNode.insertBefore(host, s);
    var raiz = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    var utm = 'utm_source=player&utm_medium=embed&utm_campaign=' + encodeURIComponent(location.hostname || 'site');

    if (o.fonteSite) try { o.familia = getComputedStyle(host).fontFamily; } catch (e) {}
    raiz.innerHTML = '<style>' + css(o) + '</style>' + html(o, utm);
    var $ = function (sel) { return raiz.querySelector(sel); };
    var audio = null, dados = null, tocando = false, timer = null;

    // dados da rádio (programação e endereços)
    fetch(BASE + '/player/dados.php').then(function (r) { return r.json(); }).then(function (d) { dados = d; atualiza(); }).catch(function () {});
    // avisa a rádio de qual site o player está tocando (aparece na vitrine "Sites que tocam a Full")
    try { new Image().src = BASE + '/player/ping.php?f=' + o.formato + '&s=' + encodeURIComponent(location.origin) + '&p=' + encodeURIComponent(location.pathname); } catch (e) {}

    $('.play').addEventListener('click', function () { tocando ? para() : toca(); });
    if (o.formato === 'botao') {
      $('.fab').addEventListener('click', function () { raiz.querySelector('.fr').classList.toggle('aberto'); });
      $('.fecha').addEventListener('click', function () { raiz.querySelector('.fr').classList.remove('aberto'); });
    }
    var vol = $('.vol');
    if (vol) vol.addEventListener('input', function () { if (audio) audio.volume = vol.value / 100; });

    function toca() {
      var url = (dados && dados.stream) || 'https://radio.referencias.xyz/listen/full_radio/radio.mp3';
      audio = new Audio(url + '?t=' + Date.now());   // sempre ao vivo, nunca do cache
      audio.volume = vol ? vol.value / 100 : 1;
      raiz.querySelector('.fr').classList.add('carregando');
      audio.play().then(function () {
        tocando = true; raiz.querySelector('.fr').classList.remove('carregando'); raiz.querySelector('.fr').classList.add('tocando');
        $('.play').setAttribute('aria-label', 'Pausar a Full Radio');
      }).catch(function () { raiz.querySelector('.fr').classList.remove('carregando'); });
      audio.addEventListener('error', para);
      agenda(20000);
    }
    function para() {
      if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); audio = null; }   // solta a conexão: não gasta banda pausado
      tocando = false; raiz.querySelector('.fr').classList.remove('tocando', 'carregando');
      $('.play').setAttribute('aria-label', 'Tocar a Full Radio');
      agenda(60000);
    }
    function agenda(ms) { clearTimeout(timer); timer = setTimeout(atualiza, ms); }

    // bloco da grade no ar, sempre pelo horário de Brasília (o site pode estar em outro fuso)
    function bloco() {
      if (!dados || !dados.blocos) return null;
      var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var g = {}; p.forEach(function (x) { g[x.type] = x.value; });
      var d = ({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 })[g.weekday], ontem = d === 1 ? 7 : d - 1;
      var m = (+g.hour % 24) * 60 + (+g.minute), mi = function (t) { var a = t.split(':'); return +a[0] * 60 + +a[1]; };
      for (var i = 0; i < dados.blocos.length; i++) {
        var b = dados.blocos[i], ini = mi(b.ini), fim = mi(b.fim);
        if (fim > ini ? (b.dias.indexOf(d) > -1 && m >= ini && m < fim) : ((b.dias.indexOf(d) > -1 && m >= ini) || (b.dias.indexOf(ontem) > -1 && m < fim))) return b;
      }
      return null;
    }
    function atualiza() {
      var api = (dados && dados.api) || 'https://radio.referencias.xyz/api/nowplaying/full_radio';
      fetch(api).then(function (r) { return r.json(); }).then(function (n) {
        var s = (n.now_playing && n.now_playing.song) || {};
        $('.tit').textContent = s.title || 'Full Radio';
        $('.art').textContent = s.artist || 'Rádio 24h de Brodowski/SP';
        if (s.art) { $('.capa').style.backgroundImage = 'url("' + s.art.replace(/"/g, '') + '")'; $('.capa').style.backgroundSize = 'cover'; }
        var b = bloco(), ouv = n.listeners ? n.listeners.current : 0;
        $('.bloco').textContent = (b ? b.nome : 'Ao vivo') + (ouv ? ' · ' + ouv + ' ouvindo' : '');
        var t = (s.artist ? s.artist + ' – ' : '') + (s.title || '');
        $('.play').title = t ? 'Tocando agora: ' + t : 'Full Radio';
      }).catch(function () {}).then(function () { agenda(tocando ? 20000 : 60000); });
    }
  }

  function html(o, utm) {
    var radio = BASE + '/radio/?' + utm, pedir = BASE + '/radio/?' + utm + '#pedir';
    var corpo =
      '<button class="play" type="button" aria-label="Tocar a Full Radio"><span class="ic-play"></span><span class="ic-pause"></span><span class="spin"></span></button>' +
      '<div class="capa" aria-hidden="true"></div>' +
      '<div class="txt"><div class="bloco">Full Radio</div><div class="tit">Full Radio</div><div class="art">Rádio 24h de Brodowski/SP</div></div>' +
      '<div class="acoes">' +
        (o.formato !== 'barra' ? '<input class="vol" type="range" min="0" max="100" value="80" aria-label="Volume">' : '') +
        '<a class="pedir" href="' + pedir + '" target="_blank" rel="noopener">Pedir música</a>' +
        '<a class="marca" href="' + radio + '" target="_blank" rel="noopener" title="Full Radio: rádio 24h"><span class="logo"></span>Full Radio</a>' +
      '</div>';
    if (o.formato === 'botao')
      return '<div class="fr botao ' + o.lado + '"><div class="painel" role="dialog" aria-label="Full Radio">' +
        '<button class="fecha" type="button" aria-label="Fechar">×</button>' + corpo + '</div>' +
        '<button class="fab" type="button" aria-label="Abrir o player da Full Radio"><span class="logo"></span><span class="eq"><i></i><i></i><i></i></span></button></div>';
    return '<div class="fr ' + o.formato + '">' + corpo + '</div>';
  }

  function css(o) {
    var claro = o.tema === 'claro';
    var bg = claro ? '#ffffff' : '#0b1430', bg2 = claro ? '#f1f4fb' : '#16265c', tx = claro ? '#0b1430' : '#f2f5ff', mu = claro ? '#5d6680' : '#a9b5dc';
    if (o.fundo) bg = o.fundo; if (o.texto) { tx = o.texto; mu = o.texto; }
    var ln = claro ? 'rgba(11,20,48,.12)' : 'rgba(255,255,255,.1)', cor = o.cor || '#ff3b45';
    var raio = o.raio === null ? 16 : o.raio, fam = o.familia ? o.familia.replace(/[<>{}]/g, '') : 'Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
    var some = { capa: '.capa', volume: '.vol', pedir: '.pedir', bloco: '.bloco', artista: '.art' }, esc = '';
    o.esconder.forEach(function (k) { if (some[k]) esc += some[k] + '{display:none!important}'; });
    var logo = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cdefs%3E%3CclipPath id='c'%3E%3Ccircle cx='20' cy='20' r='20'/%3E%3C/clipPath%3E%3C/defs%3E%3Cg clip-path='url(%23c)'%3E%3Cpath fill='%231e5be6' d='M0 0h22L14 40H0z'/%3E%3Cpath fill='%23e3262e' d='M22 0h18v40H14z'/%3E%3C/g%3E%3Cpath fill='%23fff' d='M11 11h12l-1 4h-7l-1 4h6l-1 4h-6l-2 7H7z'/%3E%3Cpath fill='none' stroke='%23fff' stroke-width='2.4' stroke-linecap='round' d='M27 15c2 3 2 7 0 10M31 12c3.5 5 3.5 11 0 16'/%3E%3C/svg%3E\")";
    return ':host{all:initial;display:block' + (o.largura && o.formato !== 'botao' ? ';width:' + o.largura + ';max-width:100%' : '') + '}' +
      '*{box-sizing:border-box;margin:0;padding:0;font-family:' + fam + '}' +
      '.fr{--cor:' + cor + ';color:' + tx + ';background:' + bg + ';border:1px solid ' + ln + ';border-radius:16px;display:flex;align-items:center;gap:12px;padding:12px;' +
        'box-shadow:0 12px 32px -14px rgba(0,0,0,.45);line-height:1.25;position:relative;overflow:hidden;max-width:100%}' +
      '.fr::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#1e5be6 50%,#e3262e 50%)}' +
      '.fr,.painel{border-radius:' + raio + 'px}' +
      (o.fundo === 'transparent' ? '.fr:not(.botao){box-shadow:none}' : '') +
      '.cartao{width:' + (o.largura ? '100%' : '380px') + ';flex-wrap:wrap}.cartao .acoes{width:100%;padding-left:0}' +
      '.barra{width:100%;border-radius:12px;padding:8px 14px}.barra .capa{width:40px;height:40px}.barra .play{width:40px;height:40px}' +
      '.play{flex:none;width:48px;height:48px;border-radius:50%;border:0;background:var(--cor);color:#fff;cursor:pointer;display:grid;place-items:center;position:relative;transition:transform .15s}' +
      '.play:hover{transform:scale(1.07)}.play:focus-visible,.pedir:focus-visible,.marca:focus-visible,.fab:focus-visible{outline:3px solid #2f6bff;outline-offset:2px}' +
      '.ic-play{width:0;height:0;border-left:14px solid #fff;border-top:9px solid transparent;border-bottom:9px solid transparent;margin-left:4px}' +
      '.ic-pause{display:none;width:14px;height:16px;border-left:5px solid #fff;border-right:5px solid #fff}' +
      '.tocando .ic-play{display:none}.tocando .ic-pause{display:block}' +
      '.spin{display:none;position:absolute;inset:-4px;border-radius:50%;border:3px solid transparent;border-top-color:var(--cor);animation:g 1s linear infinite}.carregando .spin{display:block}' +
      '@keyframes g{to{transform:rotate(360deg)}}' +
      '.capa{flex:none;width:52px;height:52px;border-radius:10px;background:' + bg2 + ' ' + logo + ' center/60% no-repeat}' +
      '.txt{flex:1;min-width:0}' +
      '.bloco{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--cor);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.tit{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}' +
      '.art{font-size:13px;color:' + mu + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.acoes{display:flex;align-items:center;gap:10px;flex:none;font-size:12.5px}' +
      '.vol{flex:1;min-width:60px;accent-color:var(--cor);height:4px}' +
      '.pedir{color:' + tx + ';border:1px solid ' + ln + ';border-radius:999px;padding:6px 11px;text-decoration:none;font-weight:700;white-space:nowrap}.pedir:hover{border-color:var(--cor)}' +
      '.marca{display:inline-flex;align-items:center;gap:6px;color:' + mu + ';text-decoration:none;font-weight:700;white-space:nowrap}.marca:hover{color:' + tx + '}' +
      '.logo{display:inline-block;width:18px;height:18px;border-radius:50%;background:' + logo + ' center/cover}' +
      '@media(max-width:520px){.barra .pedir{display:none}.barra .marca{font-size:0;gap:0}.barra .marca .logo{width:22px;height:22px}}' +
      // botão flutuante
      '.botao{position:fixed;bottom:18px;z-index:2147483000;background:none;border:0;box-shadow:none;padding:0;overflow:visible;display:block}' +
      '.botao::before{display:none}.botao.direita{right:18px}.botao.esquerda{left:18px}' +
      '.fab{width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;background:' + bg + ';box-shadow:0 10px 26px -6px rgba(0,0,0,.5);display:grid;place-items:center;position:relative}' +
      '.fab .logo{width:40px;height:40px}.fab .eq{display:none;position:absolute;right:-2px;top:-2px;background:var(--cor);border-radius:999px;padding:3px 5px;gap:2px;align-items:flex-end;height:16px}' +
      '.fab .eq i{display:block;width:3px;background:#fff;border-radius:2px;animation:eq .8s ease-in-out infinite alternate}.fab .eq i:nth-child(2){animation-delay:-.3s}.fab .eq i:nth-child(3){animation-delay:-.55s}' +
      '@keyframes eq{from{height:3px}to{height:10px}}.tocando .fab .eq{display:flex}' +
      '.painel{display:none;position:absolute;bottom:70px;width:340px;max-width:calc(100vw - 36px);flex-wrap:wrap;align-items:center;gap:12px;padding:14px;color:' + tx + ';background:' + bg + ';border:1px solid ' + ln + ';border-radius:16px;box-shadow:0 18px 40px -12px rgba(0,0,0,.55)}' +
      '.direita .painel{right:0}.esquerda .painel{left:0}.aberto .painel{display:flex}.painel .acoes{width:100%}' +
      '.fecha{position:absolute;right:8px;top:4px;background:none;border:0;color:' + mu + ';font-size:22px;cursor:pointer;line-height:1}' +
      '@media(prefers-reduced-motion:reduce){.spin,.fab .eq i{animation:none}}' +
      (o.compacto ? '.fr{padding:7px 10px;gap:9px}.play{width:36px;height:36px}.capa{width:36px;height:36px;border-radius:7px}.tit{font-size:13.5px}.art{font-size:12px}.bloco{font-size:10px}.acoes{font-size:11.5px;gap:8px}.pedir{padding:4px 9px}.ic-play{border-left-width:11px;border-top-width:7px;border-bottom-width:7px}.ic-pause{width:11px;height:13px;border-left-width:4px;border-right-width:4px}' : '') +
      esc;
  }
})();
