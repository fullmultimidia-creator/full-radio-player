-- Full Radio para MTA:SA: playSound toca o stream; o próprio stream informa a música (onClientSoundChangedMeta).
local som = nil
local volume = Config.Volume

local function aviso(msg)
    outputChatBox("#ff3b45Full Radio #ffffff" .. msg, 255, 255, 255, true)
end

local function dentroDoVeiculo()
    return isPedInVehicle(localPlayer)
end

local function tocar()
    if som then return end
    som = playSound(Config.Url)
    if som then setSoundVolume(som, volume / 100) end
end

local function parar()
    if som then stopSound(som) end
    som = nil
end

local ligado = false

local function alternar(_, arg)
    local v = tonumber(arg or "")
    if v then
        volume = math.max(0, math.min(100, math.floor(v)))
        if som then setSoundVolume(som, volume / 100) end
        aviso("volume " .. volume .. "%")
        return
    end
    ligado = not ligado
    if ligado then
        if Config.SoNoVeiculo and not dentroDoVeiculo() then
            aviso("ligada: entre num veículo para ouvir.")
        else
            tocar()
            aviso("ligada! /" .. Config.Comando .. " 0-100 muda o volume.")
        end
    else
        parar()
        aviso("desligada.")
    end
end
addCommandHandler(Config.Comando, alternar)

if Config.Tecla ~= "" then
    bindKey(Config.Tecla, "down", function() alternar() end)
end

if Config.MostrarMusica then
    addEventHandler("onClientSoundChangedMeta", root, function(titulo)
        if source == som and titulo and titulo ~= "" then
            aviso("tocando: #a9b5dc" .. titulo)
        end
    end)
end

if Config.SoNoVeiculo then
    addEventHandler("onClientPlayerVehicleEnter", localPlayer, function()
        if ligado then tocar() end
    end)
    addEventHandler("onClientPlayerVehicleExit", localPlayer, function()
        parar()
    end)
end
