import React, { useEffect, useState } from 'react'

import Select from './Select'
import {initSignPlugin} from "./sign-cryptopro-ifcplugin";

const SelectCert = ({ setThumbprint = (_) => _, Component = Select, callBackErrorHandler }) => {
  const [listSert, setListSert] = useState([{ value: 'подпись', label: 'подпись' }])
  const [selectItem, setSelectItem] = useState(null)

  useEffect(() => {
    const fn = async () => {
      const certsApi = await initSignPlugin();
      const certsList = await certsApi.getCertsList();
      setListSert(certsList)
    }
    fn()
  }, [])

  useEffect(() => {
    if (selectItem) {
      setThumbprint(selectItem)
    } else {
      setThumbprint(listSert[0].value)
    }
  }, [selectItem,listSert, setThumbprint])

  const onChange = ({ target: { value } }) => setSelectItem(value)

  return (
    <Component
      defaultValue={listSert[0].value}
      label="Выберите сертификат"
      name="thumbprint"
      options={listSert}
      onChange={onChange}
    />
  )
}

export default SelectCert
