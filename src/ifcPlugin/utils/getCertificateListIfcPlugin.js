import {createIfcPlugin} from "./createIfcPlugin";
import {getCertsList} from "./getCertsList";

export const getCertificateListIfcPlugin = (plugin) => async () => {
    await createIfcPlugin(plugin)
    return await getCertsList(plugin)

}

