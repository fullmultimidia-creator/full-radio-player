-- Full Radio para FiveM: o som toca na NUI (html/index.html); aqui ficam o comando, o volume e o modo "só no veículo".
local ligado, volume, pausadoFora = false, Config.Volume, false

local function aviso(msg)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(msg)
    EndTextCommandThefeedPostTicker(false, false)
end

local function nui(acao)
    SendNUIMessage({ acao = acao, url = Config.Url, volume = volume / 100, musica = Config.MostrarMusica })
end

local function dentroDoVeiculo()
    return IsPedInAnyVehicle(PlayerPedId(), false)
end

RegisterCommand(Config.Comando, function(_, args)
    local v = tonumber(args[1] or '')
    if v then
        volume = math.max(0, math.min(100, math.floor(v)))
        nui('volume')
        aviso('~b~Full Radio~s~: volume ' .. volume .. '%')
        return
    end
    ligado = not ligado
    if ligado then
        if Config.SoNoVeiculo and not dentroDoVeiculo() then
            pausadoFora = true
            aviso('~b~Full Radio~s~ ligada: entre num veículo para ouvir.')
        else
            pausadoFora = false
            nui('tocar')
            aviso('~b~Full Radio~s~ ligada! ~c~/' .. Config.Comando .. ' 0-100~s~ muda o volume.')
        end
    else
        nui('parar')
        aviso('~b~Full Radio~s~ desligada.')
    end
end, false)

TriggerEvent('chat:addSuggestion', '/' .. Config.Comando, 'Liga ou desliga a Full Radio', {
    { name = 'volume', help = 'opcional: 0 a 100' }
})

if Config.Tecla ~= '' then
    RegisterKeyMapping(Config.Comando, 'Ligar/desligar a Full Radio', 'keyboard', Config.Tecla)
end

-- modo "só no veículo": confere uma vez por segundo
if Config.SoNoVeiculo then
    CreateThread(function()
        while true do
            Wait(1000)
            if ligado then
                local dentro = dentroDoVeiculo()
                if dentro and pausadoFora then
                    pausadoFora = false
                    nui('tocar')
                elseif not dentro and not pausadoFora then
                    pausadoFora = true
                    nui('parar')
                end
            end
        end
    end)
end
