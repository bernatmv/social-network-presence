import { SocialNetwork } from "./types";

const stub = {
  sn: 'facebook',
  people: [
    { name: 'John' },
    { name: 'Harry' },
    { name: 'Peter' },
    { name: 'George' },
    { name: 'Anna' },
  ],
  relationships: [
    { type: 'HasConnection', startNode: 'John', endNode: 'Peter' },
    { type: 'HasConnection', startNode: 'John', endNode: 'George' },
    { type: 'HasConnection', startNode: 'Peter', endNode: 'George' },
    { type: 'HasConnection', startNode: 'Peter', endNode: 'Anna' },
  ],
}

async function getGraph(): Promise<SocialNetwork> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stub);
    }, 200); // Simulate network delay
  });
}

export default {
  getGraph
}
