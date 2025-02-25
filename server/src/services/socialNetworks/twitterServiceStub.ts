import {SocialNetwork} from './types';

const stub = {
    sn: 'twitter',
    people: [{name: 'John'}, {name: 'Sarah'}, {name: 'Peter'}, {name: 'Mike'}, {name: 'Lisa'}],
    relationships: [
        {type: 'HasConnection', startNode: 'John', endNode: 'Sarah'},
        {type: 'HasConnection', startNode: 'Sarah', endNode: 'Peter'},
        {type: 'HasConnection', startNode: 'Peter', endNode: 'Mike'},
        {type: 'HasConnection', startNode: 'Mike', endNode: 'Lisa'}
    ]
};

async function getGraph(): Promise<SocialNetwork> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(stub);
        }, 200); // Simulate network delay
    });
}

export default {
    getGraph
};
