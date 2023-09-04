import { DOCKER, ERROR, FORMAT, OK, RPK, SUCCESSFUL, UNSUCCESSFUL } from "../constants.js";
import { _I_CMD_Response, _I_Process_CMD } from "../interfaces/index.js";
import { spawn, spawnSync, ChildProcessWithoutNullStreams, SpawnSyncReturns } from "child_process";


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
                    statusCode: exit_code,
                    details: cmdResponse
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



export const processCommandInSync = async (

    props: _I_Process_CMD

): Promise<_I_CMD_Response> => {

    const { cmd, options, subject, confirmationConstants } = props;

    return new Promise((resolve, reject) => {

        const childProcess: SpawnSyncReturns<Buffer> = spawnSync(cmd, options)

        let cmdResponse = childProcess.stdout.toString();

        childProcess.status == 1 && reject({
            status: ERROR,
            message: `${subject} : ${UNSUCCESSFUL} 1`,
            statusCode: childProcess.status,
            details: childProcess.stderr.toString()
        })



        if (!getResponseStatus(cmdResponse, confirmationConstants))
            reject({
                status: ERROR,
                message: `${subject} : ${UNSUCCESSFUL}`,
                statusCode: childProcess.status,
                details: childProcess.stderr.toString()
            })
        else
            if (childProcess.status == 0) {
                resolve({
                    status: OK,
                    message: `${subject} : ${SUCCESSFUL}`,
                    statusCode: childProcess.status,
                    details: cmdResponse
                })
            }
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


export function parseMultipleJsonObjects(inputString: string) {

    const jsonArray = inputString
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(jsonStr => JSON.parse(jsonStr));

    return jsonArray;
}

export async function getClusterIDs(options: string[]): Promise<string | undefined> {

    return await processCommandInSync({
        cmd: DOCKER,
        options: options,
        subject: "Collecting Local Clusters",
        confirmationConstants: ["redpanda"]
    })
        .then(result => result.details)
        .then(result => result)
        .catch(error => { return `${ERROR} ${error.message}` });
}