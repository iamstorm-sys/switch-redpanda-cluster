import { NextFunction, Request, Response } from "express";
import { DOCKER, ERROR, FORMAT, MODE } from "../constants.ts";
import { processCommand } from "../utils/index.ts";

export const middlewares = {

    /**
     * @function devOrProd
     * @param req 
     * @param res 
     * @param next 
     * @description Will stop the request from proceeding to the controller, if
     * the req object doesn't contain a valid MODE ['local', 'remote']
     */
    "devOrProd": async (req: Request, res: Response, next: NextFunction) => {
        const { mode } = req.body;
        if (MODE.includes(mode)) {
            next();
        } else {
            res.status(501).json({
                status: ERROR,
                message: `Wrong Mode : ${mode}`
            })
        }
    },

    /**
     * @function isDockerLive
     * @param req 
     * @param res 
     * @param next 
     * @description
     */
    "isDockerLive": async (req: Request, res: Response, next: NextFunction) => {

        const response = await processCommand({
            cmd: DOCKER,
            options: ['ps', FORMAT, 'json'],
            confirmationConstants: ['Is the docker daemon running?'],
            subject: "Is Docker Running"
        })

        if (response.status == "ERROR") {
            res.status(501).json(response)
        } else {
            next();
        }
    }
}