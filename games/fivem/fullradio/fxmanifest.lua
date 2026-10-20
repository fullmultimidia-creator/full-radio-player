-- Full Radio para FiveM — rádio 24h de Brodowski/SP tocando no seu servidor.
-- Instalação: pasta "fullradio" em resources/ e "ensure fullradio" no server.cfg.
-- Página e suporte: https://referencias.xyz/player/gta/
fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'fullradio'
author 'Full Radio (referencias.xyz)'
description 'Full Radio 24h tocando dentro do jogo'
version '1.0.0'

shared_script 'config.lua'
client_script 'client.lua'

ui_page 'html/index.html'
files { 'html/index.html' }
