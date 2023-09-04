import { Request, Response } from "express";
import { getClusterIDs, parseMultipleJsonObjects, processCommand, processCommandInSync } from "../utils/index.js";
import { DOCKER, ERROR, FORMAT, OK, RPK, UNSUCCESSFUL } from "../constants.js";
import fs from "fs";
import * as yaml from "js-yaml";
import { _I_Cluster } from "../interfaces/index.ts";

export const cluster = {

    "list": async (_: Request, res: Response) => {

        try {
            const yamlData = fs.readFileSync('src/local-cluster.yaml', 'utf8');

            const jsonObject = yaml.load(yamlData);

            res.status(200).json(jsonObject)

        } catch (error: any) { res.status(200).json({ status: ERROR, res: error.message }) }
    },

    "registerLocalClusters": async (_: Request, res: Response) => {

        const response = await processCommand({
            cmd: DOCKER,
            options: ['ps', FORMAT, 'json'],
            subject: "Listing Container",
            confirmationConstants: []
        })

        const clusterBrokerObject: { [key: string]: string[] } = {};

        if (response.status == OK && response.details !== undefined) {

            const containers: string[] = parseMultipleJsonObjects(response.details).map(container => container.ID)

            for (const container of containers) {

                let cluster_id = await getClusterIDs(['exec', container, RPK, 'cluster', 'info', '-c']);

                if (cluster_id?.includes(UNSUCCESSFUL)) continue;

                cluster_id = cluster_id?.split('\n')[0];

                if (cluster_id !== undefined) {

                    if (!clusterBrokerObject[cluster_id]) clusterBrokerObject[cluster_id] = [];

                    clusterBrokerObject[cluster_id].push(container);
                }
            }

            try {

                const yamlData = yaml.dump(clusterBrokerObject);

                fs.writeFileSync(`src/local-cluster.yaml`, yamlData);

            } catch (error) { res.status(501).json(response) }

            res.status(200).json({ status: OK, message: "All clusters loaded successfully" });

        } else res.status(501).json(response);
    }
}