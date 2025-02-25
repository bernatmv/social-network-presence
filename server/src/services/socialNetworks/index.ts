import {tryCatch} from '../../common/tryCatch';
import facebookService from './facebookService';
import facebookServiceStub from './facebookServiceStub';
import twitterService from './twitterService';
import twitterServiceStub from './twitterServiceStub';
import {SocialNetwork} from './types';

// this could come from a .env file, a config file or it could be a parameter of the function/request
const useStubs = true;

const services: Record<string, any> = {
    facebook: useStubs ? facebookServiceStub : facebookService,
    twitter: useStubs ? twitterServiceStub : twitterService
};

const getService = (network: string) => {
    return services[network];
};

export const getSocialNetworkGraph = async (network: string): Promise<SocialNetwork | null> => {
    const service = getService(network);

    if (!service) {
        console.error(`Service for network ${network} not found`);
        return null;
    }

    const result = await tryCatch<SocialNetwork>(service.getGraph());

    if (result.error) {
        return null;
    }

    return result.data;
};

export const getAllSocialNetworksGraphs = async (): Promise<SocialNetwork[]> => {
    const networks = Object.keys(services);

    const graphs = await Promise.all(networks.map(getSocialNetworkGraph));

    // TODO: Not deciding right now how to deal with the unhappy path/error handling, removing errors for now
    return graphs.filter((graph): graph is SocialNetwork => graph !== null);
};

export default {
    getSocialNetworkGraph,
    getAllSocialNetworksGraphs
};
