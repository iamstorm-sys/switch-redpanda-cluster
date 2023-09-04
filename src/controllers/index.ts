import { cluster } from "./cluster.js";
import { topic } from "./topic.js";


export const controllers = {
    "cluster": { ...cluster },
    "topic": { ...topic }
    // we can add controllers here for different features
}
