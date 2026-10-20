/*
    FULL RADIO PARA SA-MP / open.mp
    Rádio 24h de Brodowski/SP tocando no seu servidor.  https://referencias.xyz/player/gta/

    COMO USAR (escolha UM jeito):
    A) Filterscript: salve este arquivo em filterscripts/, compile e adicione "fullradio" na linha filterscripts do server.cfg
       (no open.mp: config.json -> "pawn" -> "side_scripts": ["filterscripts/fullradio"]).
    B) Gamemode: copie o #define, a variável e o trecho do /fullradio para dentro do seu OnPlayerCommandText (ou do seu CMD).

    No jogo: /fullradio liga e desliga.  O áudio usa o "rádio" do próprio SA-MP (volume pelo menu de áudio do jogo).
    O jogador precisa estar com "Rádio" > volume acima de zero e com streams de áudio permitidos (/audiomsg).
*/

#include <a_samp>      // no open.mp pode ser <open.mp>

#define FULLRADIO_URL   "http://radio.referencias.xyz/listen/full_radio/radio.mp3"
#define FULLRADIO_COR   0xFF3B45FF

new bool:FullRadioLigada[MAX_PLAYERS];

public OnFilterScriptInit()
{
    print("  Full Radio carregada: /fullradio");
    return 1;
}

public OnPlayerConnect(playerid)
{
    FullRadioLigada[playerid] = false;
    return 1;
}

public OnPlayerCommandText(playerid, cmdtext[])
{
    if (!strcmp(cmdtext, "/fullradio", true))
    {
        if (FullRadioLigada[playerid])
        {
            StopAudioStreamForPlayer(playerid);
            FullRadioLigada[playerid] = false;
            SendClientMessage(playerid, FULLRADIO_COR, "Full Radio {FFFFFF}desligada.");
        }
        else
        {
            PlayAudioStreamForPlayer(playerid, FULLRADIO_URL);
            FullRadioLigada[playerid] = true;
            SendClientMessage(playerid, FULLRADIO_COR, "Full Radio {FFFFFF}ligada! Use /fullradio de novo para desligar.");
        }
        return 1;
    }
    return 0;
}

/*  Usa ZCMD / Pawn.CMD no seu gamemode? Troque o OnPlayerCommandText acima por:

CMD:fullradio(playerid, params[])
{
    if (FullRadioLigada[playerid]) { StopAudioStreamForPlayer(playerid); FullRadioLigada[playerid] = false; SendClientMessage(playerid, FULLRADIO_COR, "Full Radio {FFFFFF}desligada."); }
    else { PlayAudioStreamForPlayer(playerid, FULLRADIO_URL); FullRadioLigada[playerid] = true; SendClientMessage(playerid, FULLRADIO_COR, "Full Radio {FFFFFF}ligada!"); }
    return 1;
}
*/
