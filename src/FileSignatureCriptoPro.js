import React, { useState } from 'react'


import SelectCert from './SelectCert'
import { signFile } from './utils'

const FileSignatureCriptoPro = ({
  callback = (_) => _,
  file = null,
  clear = false,
  SelectComponent,
  ButtonComponent = (props) => (
    <button className="button btn_green btn_sign" {...props}>
      Подписать
    </button>
  ),
  callbackError = (_) => _,
}) => {
  const [thumbprint, setThumbprint] = useState(null)
  const [sign, setSign] = useState(null)
  const [error, setError] = useState(false)
  const [fileNameSign, setFileNameSign] = useState(null)
  const cleanOut = () => {
    setError(false)
    setSign(null)
    setFileNameSign(null)
  }


  const callBackErrorHandler = (error) => {
    let messageError = error.message

    switch (error.message) {
      case 'Lost connection to extension':
        messageError = 'Потеряна связь с плагином'
    }
    setError(true)
    callbackError(messageError)
  }

  if ((clear && (sign || fileNameSign)) || (clear && error)) {
    cleanOut()
  }

  const subscribe = () =>
    signFile({ thumbprint, file })
      .then(({ fileName, blob }) => {
        callback({ fileNameSign: fileName, sign: blob })
        setSign(blob)
        setFileNameSign(fileName)
      })
      .catch(callBackErrorHandler)

  const classError = error ? 'sign__error' : ''
  return (
    !sign &&
    file && (
      <div className={classError}>
        {!error && (
          <SelectCert {...{ setThumbprint, callBackErrorHandler, Component: SelectComponent }} />
        )}
        {!error && <ButtonComponent disabled={!thumbprint} onClick={subscribe} />}
      </div>
    )
  )
}

export default FileSignatureCriptoPro
