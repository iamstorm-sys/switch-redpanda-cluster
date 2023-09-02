import { ERROR, OK, SUCCESSFUL, UNSUCCESSFUL } from "../constants.js";
import { _I_CMD_Response, _I_Process_CMD } from "../interfaces/index.js";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";


export const processCommand = async (

    props: _I_Process_CMD

): Promise<_I_CMD_Response> => {

    const { cmd, options, subject, confirmationConstants } = props;

    return new Promise((resolve, reject) => {

        const childProcess: ChildProcessWithoutNullStreams = spawn(cmd, options)

        let cmdResponse = '';

        childProcess.stdout.on('data', (data) => { cmdResponse += data })

        childProcess.on('close', (exit_code) => {

            `${exit_code}` == '1' && reject({
                status: ERROR,
                message: `${subject} : ${UNSUCCESSFUL}`,
                statusCode: exit_code
            })

            if (!getResponseStatus(cmdResponse, confirmationConstants))
                reject({
                    status: ERROR,
                    message: `${subject} : ${UNSUCCESSFUL}`,
                    statusCode: exit_code
                })
            else
                resolve({
                    status: OK,
                    message: `${subject} : ${SUCCESSFUL}`,
                    statusCode: exit_code
                })

        })

        childProcess.on('error', () => {
            reject({
                status: ERROR,
                message: `${subject} : ${UNSUCCESSFUL}`
            })
        })
    })
}



export function getResponseStatus(
    responseData: string,
    confirmStrings: string[],
): boolean {

    for (const str of confirmStrings)

        if (!responseData.includes(str)) return false;

    return true;
}
