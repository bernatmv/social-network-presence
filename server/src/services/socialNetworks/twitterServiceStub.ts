import {SocialNetwork} from './types';

const stub = {
    sn: 'twitter',
    people: [{name: 'Bernat'}, {name: 'Gemma'}, {name: 'Marti'}, {name: 'Jana'}, {name: 'Bruna'}],
    relationships: [
        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Gemma'},
        {type: 'HasConnection', startNode: 'Gemma', endNode: 'Marti'},
        {type: 'HasConnection', startNode: 'Marti', endNode: 'Jana'},
        {type: 'HasConnection', startNode: 'Jana', endNode: 'Bruna'}
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
