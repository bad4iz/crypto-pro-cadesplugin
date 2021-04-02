import {IFCError} from "../ifcPlugin";

const add_to_main_log_ln = console.log


export function createIfcPlugin(ifcPlugin) {
    add_to_main_log_ln("js lib version: " + ifcPlugin.getLibVersion());

    return new Promise((resolve, reject) => {
        ifcPlugin.create('', '', function (msg) {
            add_to_main_log_ln("create result: " + IFCError.getErrorDescription(msg.error_code));
            if (IFCError.IFC_OK === msg.error_code) {
                ifcPlugin.getPluginVersion(function (msg) {
                    add_to_main_log_ln("getPluginVersion result: " + IFCError.getErrorDescription(msg.error_code));
                    if (IFCError.IFC_OK === msg.error_code) {
                        add_to_main_log_ln("plugin version: " + msg.version);
                        resolve()
                    }
                });
            }
        });
    })
}

