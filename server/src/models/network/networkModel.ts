import {getSocialNetworkGraph} from '../../services/socialNetworks';
import {SocialNetwork} from '../../services/socialNetworks/types';
import {NetworkGraph, NetworkIsolatedCount} from './types';

export function createNetworkGraph(graphDto: SocialNetwork): NetworkGraph {
    const networkGraph: NetworkGraph = {
        sn: graphDto.sn,
        people: {}
    };

    graphDto.people.forEach(person => {
        networkGraph.people[person.name] = {
            name: person.name,
            visited: false,
            connections: []
        };
    });

    graphDto.relationships.forEach(relationship => {
        if (relationship.type !== 'HasConnection') {
            return;
        }

        networkGraph.people[relationship.startNode].connections.push(networkGraph.people[relationship.endNode]);
        networkGraph.people[relationship.endNode].connections.push(networkGraph.people[relationship.startNode]);
    });

    return networkGraph;
}

export async function getIsolatedCountForNetwork(network: string): Promise<NetworkIsolatedCount> {
    const graphDto = await getSocialNetworkGraph(network);

    if (!graphDto) {
        // TODO: Not deciding right now how to deal with the unhappy path/error handling, setting to 0 for now
        return {sn: network, isolated: 0};
    }

    const graph = createNetworkGraph(graphDto);

    const isolated = Object.values(graph.people).filter(person => person.connections.length === 0).length;

    return {sn: network, isolated};
}

export default {
    createNetworkGraph,
    getIsolatedCountForNetwork
};
