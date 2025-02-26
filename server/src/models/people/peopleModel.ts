import {getAllSocialNetworksGraphs} from '../../services/socialNetworks';
import {createNetworkGraph} from '../network/networkModel';
import {PersonNode} from '../network/types';
import {PersonConnections} from './types';

function addNodeAtDegree(node: PersonNode, degree: number, connections: PersonNode[][]) {
    if (node.visited) {
        return;
    }

    node.visited = true;

    connections[degree].push(node);
}

function getNodeConnectionsForDegree(
    node: PersonNode,
    currentDegree: number,
    maxDegree: number,
    connections: PersonNode[][]
) {
    // first traverse all siblings, if we traverse children first we will add some nodes at lower degrees than expected)
    node.connections.forEach(connection => {
        addNodeAtDegree(connection, currentDegree, connections);
    });

    // then traverse children if we still need to go further
    if (currentDegree < maxDegree) {
        node.connections.forEach(connection =>
            getNodeConnectionsForDegree(connection, currentDegree + 1, maxDegree, connections)
        );
    }
}

function getNodeConnectionsUntilDegree(node: PersonNode | undefined, degree: number): PersonNode[][] {
    const connections: PersonNode[][] = Array.from({length: degree + 1}, () => []);

    if (!node) {
        return connections;
    }

    addNodeAtDegree(node, 0, connections);

    getNodeConnectionsForDegree(node, 1, degree, connections);

    return connections;
}

export async function getConnectionsUntilDegree(name: string, degree: number): Promise<PersonConnections> {
    const graphsDtos = await getAllSocialNetworksGraphs();

    const graphs = graphsDtos.map(graphDto => createNetworkGraph(graphDto));

    const connections = graphs.map(graph => {
        const nodeConnections = getNodeConnectionsUntilDegree(graph.people[name], degree);

        return {
            sn: graph.sn,
            connectionsCount: nodeConnections.map(connections => connections.length).slice(1)
        };
    });

    return {name, connections};
}

export default {
    getConnectionsUntilDegree,
    getNodeConnectionsUntilDegree
};
