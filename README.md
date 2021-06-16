# cadesplugin

![](https://travis-ci.org/bad4iz/crypto-pro-cadesplugin.svg?branch=main)
![](https://img.shields.io/npm/v/crypto-pro-cadesplugin.svg)
![](https://img.shields.io/npm/dt/crypto-pro-cadesplugin.svg)

![](https://img.shields.io/github/commit-activity/m/bad4iz/crypto-pro-cadesplugin.svg)
![](https://img.shields.io/github/last-commit/bad4iz/crypto-pro-cadesplugin.svg)

[npm crypto-pro-cadesplugin](https://www.npmjs.com/package/crypto-pro-cadesplugin)


Библиотека предоставляет API для работы c cadesplugin и Крипто Про

## API

### about()

Выводит информацию о верисии плагина и так далее

### getCertsList()

Получает массив валидных сертификатов

### currentCadesCert(thumbprint)

Получает сертификат по thumbprint значению сертификата

### getCert(thumbprint)

Получает сертификат по thumbprint значению сертификата.
С помощью этой функции в сертификате доступны методы для парсинга информации о сертификате

### signBase64(thumbprint, base64, type)
Подписать строку в формате base64
> Поддерживаемые КриптоПро ЭЦП Browser plug-in браузеры (IE, Firefox, Opera, Chrome, Safari) не предоставляют простого и надежного способа обработки бинарных данных. Таким образом, невозможно обеспечить корректную передачу бинарных данных из браузера в плагин и обратно.
При подписании произвольных данных рекомендуется предварительно закодировать их в Base64 и использовать свойство ContentEncoding.

> По этой же причине для возвращаемых из КриптоПро ЭЦП Browser plug-in строк, в которых могут содержаться бинарные данные, не поддерживается кодировка CAPICOM_ENCODING_BINARY.


### signXml(thumbprint, xml, cadescomXmlSignatureType)

Подписать строку в формате XML

## Custom certs format API

### friendlySubjectInfo()

Возвращает распаршенную информацию о строке subjectInfo

### friendlyIssuerInfo()

Возвращает распаршенную информацию о строке issuerInfo

### friendlyValidPeriod()

Возвращает распаршенную информацию об объекте validPeriod

### possibleInfo(subjectIssuer)

Функция формирует ключи и значения в зависимости от переданного параметра
Доступные параметры 'subjectInfo' и 'issuerInfo'

### friendlyDate(date)

Формирует дату от переданного пареметра

### isValid()

Прозиводит проверку на валидность сертификата

## Usage

```js
import cadesplugin from 'crypto-pro-cadesplugin';

/**
 * @async
 * @function doCertsList
 * @description формирует массив сертификатов с оригинальными значениями
 */
async function doCertsList() {
  const certsApi = await cadesplugin;
  const certsList = await certsApi.getCertsList();

  return certsList;
}

/**
 * @async
 * @function doFriendlyCustomCertsList
 * @description формирует массив сертификатов с кастомными полями
 */
async function doFriendlyCustomCertsList() {
  const certsApi = await cadesplugin;
  const certsList = await certsApi.getCertsList();

  const friendlyCertsList = certsList.map(cert => {
    const friendlySubjectInfo = cert.friendlySubjectInfo();
    const friendlyIssuerInfo = cert.friendlyIssuerInfo();
    const friendlyValidPeriod = cert.friendlyValidPeriod();
    const {
      to: { ddmmyy, hhmmss }
    } = friendlyValidPeriod;

    return {
      subjectInfo: friendlySubjectInfo,
      issuerInfo: friendlyIssuerInfo,
      validPeriod: friendlyValidPeriod,
      thumbprint: cert.thumbprint,
      title: `${
        friendlySubjectInfo.filter(el => el.value === 'Владелец')[0].text
      }. Сертификат действителен до: ${ddmmyy} ${hhmmss}`
    };
  });
}
```
