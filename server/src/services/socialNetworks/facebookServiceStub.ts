import {SocialNetwork} from './types';

const stub = {
    sn: 'facebook',
    people: [{name: 'Bernat'}, {name: 'Marti'}, {name: 'Jana'}, {name: 'Bruna'}, {name: 'Gemma'}],
    relationships: [
        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Bruna'},
        {type: 'HasConnection', startNode: 'Jana', endNode: 'Bruna'},
        {type: 'HasConnection', startNode: 'Jana', endNode: 'Gemma'}
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
