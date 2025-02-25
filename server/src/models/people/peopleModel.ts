import {getAllSocialNetworksGraphs} from '../../services/socialNetworks';
import {SocialNetwork} from '../../services/socialNetworks/types';
import {PersonConnections} from './types';

// IF performance is an issue, we can optimize this by keeping a count of the names saved in a record
function getFirstDegreeConnections(name: string, graph: SocialNetwork): string[] {
    const connections: string[] = [];

    graph.relationships.map((relationship: any) => {
        if (relationship.startNode === name && !connections.includes(relationship.endNode)) {
            connections.push(relationship.endNode);
        }

        if (relationship.endNode === name && !connections.includes(relationship.startNode)) {
            connections.push(relationship.startNode);
        }
    });

    return connections;
}

function getSecondDegreeConnections(name: string, connections: string[], graph: SocialNetwork): string[] {
    const secondDegreeConnections: string[] = [];

    connections.forEach(connection => {
        const firstDegreeConnections = getFirstDegreeConnections(connection, graph);

        secondDegreeConnections.push(...firstDegreeConnections);
    });

    // Remove duplicates and those that are already in the provided connections (because those are already first degree)
    const uniqueSecondDegreeConnections = secondDegreeConnections.filter(
        (connection, index, self) =>
            self.indexOf(connection) === index && !connections.includes(connection) && connection !== name
    );

    return uniqueSecondDegreeConnections;
}

export async function getConnections(name: string): Promise<PersonConnections> {
    const graphs = await getAllSocialNetworksGraphs();

    // TODO: just 1st level connections, to have something print on first commit
    const connections = graphs.map(graph => {
        const firstDegreeConnections = getFirstDegreeConnections(name, graph);
        const secondDegreeConnections = getSecondDegreeConnections(name, firstDegreeConnections, graph);

        return {
            sn: graph.sn,
            firstDegree: firstDegreeConnections.length,
            secondDegree: secondDegreeConnections.length
        };
    });

    return {name, connections};
}

export default {
    getConnections
};
