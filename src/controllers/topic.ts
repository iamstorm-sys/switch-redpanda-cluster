import { Request, Response } from "express";
import { topic as topicHandlers } from "../handlers/topic.js"
import { ERROR } from "../constants.js";


export const topic = {
    "create": async (req: Request, res: Response) => {

        const response = await topicHandlers.create(req);

        if (response.status === ERROR)
            res.status(501).json(response);
        else
            res.status(200).json(response)
    },
    "update": async (req: Request, res: Response) => {

        const response = await topicHandlers.update(req);

        res.send(response);
    },
    "delete": async (req: Request, res: Response) => {

        const response = await topicHandlers.delete(req);

        res.send(response);
    },
}
