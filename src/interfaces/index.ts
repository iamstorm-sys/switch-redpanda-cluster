

export interface _I_Process_CMD {
    cmd: string;
    options: string[];
    confirmationConstants: string[]
    subject?: string;
};

export interface _I_CMD_Response {
    statusCode?: number | null;
    status: string;
    message: string;
    details?: string;
}

export interface _I_Cluster {
    clusterId: string;
    brokers?: string[];
}