import {getSocialNetworkGraph} from '../../../services/socialNetworks';
import {getNetworkConnections} from '../networkModel';

jest.mock('../../../services/socialNetworks');

describe('networkModel', () => {
    const mockSocialNetworkGraph = getSocialNetworkGraph as jest.MockedFunction<typeof getSocialNetworkGraph>;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
    });

    it('should return correct number of isolated users for a network', async () => {
        mockSocialNetworkGraph.mockResolvedValue({
            sn: 'facebook',
            people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}, {name: 'Gemma'}, {name: 'Bruna'}],
            relationships: [
                {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                {type: 'HasConnection', startNode: 'Marti', endNode: 'Gemma'}
            ]
        });

        const result = await getNetworkConnections('facebook');

        expect(result).toEqual({
            sn: 'facebook',
            isolated: 1 // Bruna is isolated (pobre Bruna!)
        });
        expect(mockSocialNetworkGraph).toHaveBeenCalledWith('facebook');
        expect(mockSocialNetworkGraph).toHaveBeenCalledTimes(1);
    });

    it('should return zero isolated users when everyone is connected', async () => {
        mockSocialNetworkGraph.mockResolvedValue({
            sn: 'twitter',
            people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
            relationships: [
                {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'},
                {type: 'HasConnection', startNode: 'Marti', endNode: 'Bernat'}
            ]
        });

        const result = await getNetworkConnections('twitter');

        expect(result).toEqual({
            sn: 'twitter',
            isolated: 0
        });
    });

    it('should return all users as isolated when there are no relationships', async () => {
        mockSocialNetworkGraph.mockResolvedValue({
            sn: 'facebook',
            people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
            relationships: []
        });

        const result = await getNetworkConnections('facebook');

        expect(result).toEqual({
            sn: 'facebook',
            isolated: 3
        });
    });

    it('should handle empty network data', async () => {
        mockSocialNetworkGraph.mockResolvedValue({
            sn: 'twitter',
            people: [],
            relationships: []
        });

        const result = await getNetworkConnections('twitter');

        expect(result).toEqual({
            sn: 'twitter',
            isolated: 0
        });
    });

    it('should handle null response from service', async () => {
        mockSocialNetworkGraph.mockResolvedValue(null);

        const result = await getNetworkConnections('facebook');

        expect(result).toEqual({
            sn: 'facebook',
            isolated: 0
        });
    });

    it('should handle service errors', async () => {
        mockSocialNetworkGraph.mockRejectedValue(new Error('Service error'));

        await expect(getNetworkConnections('facebook')).rejects.toThrow('Service error');
    });

    it('should consider users as connected if they appear in either startNode or endNode', async () => {
        mockSocialNetworkGraph.mockResolvedValue({
            sn: 'facebook',
            people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}, {name: 'Gemma'}],
            relationships: [
                {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'}, // Bernat is in startNode
                {type: 'HasConnection', startNode: 'Marti', endNode: 'Gemma'} // Gemma is in endNode
            ]
        });

        const result = await getNetworkConnections('facebook');

        expect(result).toEqual({
            sn: 'facebook',
            isolated: 0 // No isolated users as all appear in either startNode or endNode
        });
    });
});
