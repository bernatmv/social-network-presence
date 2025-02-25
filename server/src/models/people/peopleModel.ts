import { getAllSocialNetworksGraphs } from "../../services/socialNetworks";
import { PersonConnections } from "./types";

export async function getConnections(name: string): Promise<PersonConnections> {
  const graphs = await getAllSocialNetworksGraphs();

  // TODO: just 1st level connections, to have something print on first commit
  const connections = graphs.map((graph) => {
    return {
      sn: graph.sn,
      firstDegree: graph.relationships.filter((relationship: any) => relationship.startNode === name || relationship.endNode === name).length,
      secondDegree: 0
    };
  });

  return {name, connections};
}

export default {
  getConnections
}
