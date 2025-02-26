export interface PersonConnections {
    name: string;
    connections: SocialNetworkConnections[];
}

export interface SocialNetworkConnections {
    sn: string;
    connectionsCount: number[];
}
