export interface NetworkIsolatedCount {
    sn: string;
    isolated: number;
}

export interface PersonNode {
    name: string;
    visited: boolean;
    connections: PersonNode[];
}

export interface NetworkGraph {
    sn: string;
    people: Record<string, PersonNode>;
}
