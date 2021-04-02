import IFCPlugin from "../ifcPlugin";
import ccpa from '../crypto-pro-cadesplugin'
import {getCertsListCryptoProCadesPlugin, getCertsListIfcPlugin, signFileCryptoProCadesPlugin} from "./utils";
import {getCertificateListIfcPlugin} from "../ifcPlugin";


export const initSign = async () => {


    try {
        const certsApi = await ccpa()
        return {
            isCadesplugin: true,
            cadesplugin: certsApi,
            isIfcPlugin: extensionIsInstalled,
            ifcPlugin,
            signPlugin: 'cadesplugin'
        }
    } catch (e) {

        return {
            isCadesplugin: false,
            cadesplugin: null,
            isIfcPlugin: extensionIsInstalled,
            ifcPlugin,
            signPlugin: extensionIsInstalled && 'ifcPlugin'
        }
    }
}


export const initSignPlugin = async () => {

    const {signPlugin, cadesplugin, ifcPlugin} = await initSign();

    switch (signPlugin) {
        case 'cadesplugin':
            return {
                getCertsList: getCertsListCryptoProCadesPlugin(cadesplugin),
                signFile: signFileCryptoProCadesPlugin(cadesplugin),
                ifcPluginGetList: getCertificateListIfcPlugin(ifcPlugin)
            }
        case 'ifcPlugin':
            return {
                getCertsList: getCertificateListIfcPlugin(ifcPlugin),
                signFile: signFileCryptoProCadesPlugin(cadesplugin),
                ifcPluginGetList: getCertificateListIfcPlugin(ifcPlugin)

            }
    }

}

//Объект плагина для дальнейшего вызова через него публичный методов библиотеки
var ifcPlugin = null;


let extensionIsInstalled = false;

//Важно!!! Для корректной работы нельзя посылать никакие вызовы в библиотеку пока она не вернет статус о том что работает, лучше вообще скрыть все кнопки через которые пользователь может взаимодействовать с плагином
function handleStatus() {
    console.log(ifcPlugin.status);
    if (ifcPlugin.status == null) {
        return;
    }
    extensionIsInstalled = ifcPlugin.status.extensionIsInstalled

}

function initTestPage() {

    //Создание объекта плагина
    //Если в параметр передается true, то становятся доступны тестовые функции
    ifcPlugin = new IFCPlugin(true);

    //Подпись на события из библиотеки плагина
    //События приходят каждые 5 секунд (В будущем скорее всего частота увеличится)
    ifcPlugin.listenPluginEvent('updatePluginStatus', handleStatus);

    //Инициализация библиотеки
    //Если в параметр передается true, то проверка наличия плагина в системе происходит через определенные промежутки времени в зависимости от браузера
    //В основном это параметр нужен для корректного отображения тробера при первом заходе на страницу. Т.к. браузерам нужно время чтобы понять что плагин установлен.
    ifcPlugin.init(true);
}

function onLoad() {
    if (document.getElementsByTagName("body").length) {
        initTestPage();
    } else {
        setTimeout(onLoad, 4);
    }
}

setTimeout(onLoad, 4);