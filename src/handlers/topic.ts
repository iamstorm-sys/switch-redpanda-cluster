import { Request } from "express";
import { processCommand } from "../utils/index.js";
import { CREATE, ERROR, RPK, TOPIC } from "../constants.js";
import { _I_CMD_Response } from "../interfaces/index.js";


export const topic = {
    "create": async (req: Request): Promise<_I_CMD_Response> => {

        const { topicName, clusterid } = req.body;

        const options: string[] = [];

        options.push(TOPIC, CREATE, topicName);

        return processCommand({ cmd: RPK, options: options, subject: "TOPIC CREATION", confirmationConstants: [] })
            .then((result) => result)
            .catch((error) => { return { status: ERROR, message: `${error.message}` } });
    },

    "update": async (req: Request) => {
        return "delete";
    },

    "delete": async (req: Request) => {
        return "delete";
    }
}