import {getAllSocialNetworksGraphs} from '../../services/socialNetworks';
import {createNetworkGraph} from '../network/networkModel';
import {NetworkGraph, PersonNode} from '../network/types';
import {PersonConnections} from './types';

function getFirstDegreeConnections(name: string, graph: NetworkGraph): PersonNode[] {
    if (!graph.people[name]) {
        return [];
    }

    return graph.people[name].connections;
}

function getSecondDegreeConnections(name: string, graph: NetworkGraph): PersonNode[] {
    if (!graph.people[name]) {
        return [];
    }

    const secondDegreeConnections: PersonNode[] = [];

    graph.people[name].visited = true;
    graph.people[name].connections.forEach(connection => {
        connection.visited = true;
    });
    graph.people[name].connections.forEach(connection => {
        connection.connections.forEach(secondDegreeConnection => {
            if (secondDegreeConnection.visited) {
                return;
            }

            secondDegreeConnection.visited = true;

            secondDegreeConnections.push(secondDegreeConnection);
        });
    });

    return secondDegreeConnections;
}

export async function getConnections(name: string): Promise<PersonConnections> {
    const graphsDtos = await getAllSocialNetworksGraphs();

    const graphs = graphsDtos.map(graphDto => createNetworkGraph(graphDto));

    const connections = graphs.map(graph => {
        const firstDegreeConnections = getFirstDegreeConnections(name, graph);
        const secondDegreeConnections = getSecondDegreeConnections(name, graph);

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
