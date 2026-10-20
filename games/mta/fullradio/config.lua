Config = {}

-- Endereço da Full Radio (http é o mais compatível com o MTA)
Config.Url = "http://radio.referencias.xyz/listen/full_radio/radio.mp3"

-- Comando para ligar/desligar. "/fullradio 40" muda o volume (0 a 100)
Config.Comando = "fullradio"

-- Volume inicial (0 a 100)
Config.Volume = 30

-- true = só toca dentro de veículos (pausa ao descer e volta ao entrar)
Config.SoNoVeiculo = false

-- true = avisa no chat o nome da música a cada troca
Config.MostrarMusica = true

-- Tecla de atalho para ligar/desligar (ex.: "F7"). Deixe "" para nenhuma.
Config.Tecla = ""
