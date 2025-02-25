export interface PersonConnections {
    name: string;
    connections: SocialNetworkConnections[];
}

export interface SocialNetworkConnections {
    sn: string;
    firstDegree: number;
    secondDegree: number;
}
