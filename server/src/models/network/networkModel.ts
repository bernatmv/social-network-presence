import { getSocialNetworkGraph } from "../../services/socialNetworks";
import { NetworkConnections } from "./types";

export async function getNetworkConnections(network: string): Promise<NetworkConnections> {
  const graphs = await getSocialNetworkGraph(network);

  if (!graphs) {
    // TODO: Not deciding right now how to deal with the unhappy path/error handling, setting to 0 for now
    return {sn: network, isolated: 0};
  }

  const isolated = graphs.people.filter((person) => !graphs.relationships.some((relationship) => relationship.startNode === person.name || relationship.endNode === person.name)).length;

  return {sn: network, isolated};
}

export default {
  getNetworkConnections
}
