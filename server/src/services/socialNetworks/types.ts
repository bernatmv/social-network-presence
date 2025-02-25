export interface Person {
    name: string;
}

export interface Relationship {
    type: string;
    startNode: string;
    endNode: string;
}

export interface SocialNetwork {
    sn: string;
    people: Person[];
    relationships: Relationship[];
}
