import {IFCError} from "../ifcPlugin";
import {DateTime} from "luxon";
import {extract} from "./extract";
import {DATE_FORMAT} from "../../sign-cryptopro-ifcplugin/const";



const add_to_main_log_ln = console.log

export const getCertsList = (plugin) => new Promise((resolve,reject)=>{

    plugin.getCertificateList((msg) => {
        if (IFCError.IFC_OK === msg.error_code) {
            const certsList = msg.certs_list.map(item=>{
                const name = `${extract(item.getSubjectDN().getOneLine(), 'cn=')} ${extract('subjectInfo', 'G=')}`.trim()
                const commaBeforeName = name ? `, ${name}` : ''
                const jSDate = new Date(item.getValidTo())
                const date = DateTime.fromJSDate(jSDate).toFormat(DATE_FORMAT)

                return {
                    // value: item.getSubjectDN().getOneLine()
                    value: item.getContainerId(),
                    label: `${extract('subjectInfo', 'CN=')}${commaBeforeName},  действует до ${date} `,
                }
            });
            resolve(certsList)
        } else {
            reject(msg)
        }
    });
})