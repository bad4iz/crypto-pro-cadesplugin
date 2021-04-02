////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE Imports
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import './src/lib/cadesplugin_api'
import CertificatesApi from './src/сertificatesApi'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE cadesplugin await function
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const cadespluginOnload = () =>
  (async function cadespluginOnload() {
    try {
      await window.cadesplugin

      const {
        getCertsList,
        getCert,
        currentCadesCert,
        signBase64,
        signXml,
        about,
      } = CertificatesApi

      return {
        getCertsList,
        getCert,
        currentCadesCert,
        signBase64,
        signXml,
        about,
      }
    } catch (error) {
      throw new Error(error)
    }
  })()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTE Exports
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default cadespluginOnload
