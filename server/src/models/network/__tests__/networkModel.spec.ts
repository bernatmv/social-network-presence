import {getSocialNetworkGraph} from '../../../services/socialNetworks';
import networkModel from '../networkModel';

jest.mock('../../../services/socialNetworks');

describe('networkModel', () => {
    const mockGetSocialNetworkGraph = getSocialNetworkGraph as jest.MockedFunction<typeof getSocialNetworkGraph>;

    describe('getIsolatedCountForNetwork', () => {
        beforeEach(() => {
            // Clear all mocks
            jest.clearAllMocks();
        });

        it('should return correct number of isolated users for a network', async () => {
            mockGetSocialNetworkGraph.mockResolvedValue({
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}, {name: 'Gemma'}, {name: 'Bruna'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Marti', endNode: 'Gemma'}
                ]
            });

            const result = await networkModel.getIsolatedCountForNetwork('facebook');

            expect(result).toEqual({
                sn: 'facebook',
                isolated: 1 // Only Bruna is isolated
            });
            expect(mockGetSocialNetworkGraph).toHaveBeenCalledWith('facebook');
            expect(mockGetSocialNetworkGraph).toHaveBeenCalledTimes(1);
        });

        it('should return zero isolated users when everyone is connected', async () => {
            mockGetSocialNetworkGraph.mockResolvedValue({
                sn: 'twitter',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'},
                    {type: 'HasConnection', startNode: 'Marti', endNode: 'Bernat'}
                ]
            });

            const result = await networkModel.getIsolatedCountForNetwork('twitter');

            expect(result).toEqual({
                sn: 'twitter',
                isolated: 0
            });
        });

        it('should return all users as isolated when there are no relationships', async () => {
            mockGetSocialNetworkGraph.mockResolvedValue({
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
                relationships: []
            });

            const result = await networkModel.getIsolatedCountForNetwork('facebook');

            expect(result).toEqual({
                sn: 'facebook',
                isolated: 3 // All users are isolated
            });
        });

        it('should handle empty network data', async () => {
            mockGetSocialNetworkGraph.mockResolvedValue({
                sn: 'twitter',
                people: [],
                relationships: []
            });

            const result = await networkModel.getIsolatedCountForNetwork('twitter');

            expect(result).toEqual({
                sn: 'twitter',
                isolated: 0
            });
        });

        it('should handle null response from service', async () => {
            mockGetSocialNetworkGraph.mockResolvedValue(null);

            const result = await networkModel.getIsolatedCountForNetwork('facebook');

            expect(result).toEqual({
                sn: 'facebook',
                isolated: 0
            });
        });

        it('should handle service errors', async () => {
            mockGetSocialNetworkGraph.mockRejectedValue(new Error('Service error'));

            await expect(networkModel.getIsolatedCountForNetwork('facebook')).rejects.toThrow('Service error');
        });

        it('should consider users as connected if they appear in either startNode or endNode', async () => {
            mockGetSocialNetworkGraph.mockResolvedValue({
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}, {name: 'Gemma'}, {name: 'Bruna'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'}, // Bernat is in startNode
                    {type: 'HasConnection', startNode: 'Marti', endNode: 'Gemma'}, // Gemma is in endNode
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'} // Jana appears in both
                ]
            });

            const result = await networkModel.getIsolatedCountForNetwork('facebook');

            expect(result).toEqual({
                sn: 'facebook',
                isolated: 1 // Only Bruna is isolated, others appear in either startNode or endNode
            });
        });

        it('should not count duplicate connections when calculating isolated users', async () => {
            mockGetSocialNetworkGraph.mockResolvedValue({
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Bernat'}, // Duplicate connection
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'}
                ]
            });

            const result = await networkModel.getIsolatedCountForNetwork('facebook');

            expect(result).toEqual({
                sn: 'facebook',
                isolated: 0 // No isolated users despite duplicate connections
            });
        });

        it('should handle circular connections correctly', async () => {
            mockGetSocialNetworkGraph.mockResolvedValue({
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}, {name: 'Bruna'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'},
                    {type: 'HasConnection', startNode: 'Marti', endNode: 'Bernat'} // Circular connection
                ]
            });

            const result = await networkModel.getIsolatedCountForNetwork('facebook');

            expect(result).toEqual({
                sn: 'facebook',
                isolated: 1 // Only Bruna is isolated, circular connection doesn't affect count
            });
        });
    });

    describe('createNetworkGraph', () => {
        it('should create a network graph with correct connections', () => {
            const graphDto = {
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'}
                ]
            };

            const result = networkModel.createNetworkGraph(graphDto);

            expect(result).toEqual({
                sn: 'facebook',
                people: {
                    Bernat: {
                        name: 'Bernat',
                        visited: false,
                        connections: [
                            {
                                name: 'Jana',
                                visited: false,
                                connections: expect.any(Array)
                            }
                        ]
                    },
                    Jana: {
                        name: 'Jana',
                        visited: false,
                        connections: [
                            {
                                name: 'Bernat',
                                visited: false,
                                connections: expect.any(Array)
                            },
                            {
                                name: 'Marti',
                                visited: false,
                                connections: expect.any(Array)
                            }
                        ]
                    },
                    Marti: {
                        name: 'Marti',
                        visited: false,
                        connections: [
                            {
                                name: 'Jana',
                                visited: false,
                                connections: expect.any(Array)
                            }
                        ]
                    }
                }
            });
        });

        it('should ignore non-HasConnection relationships', () => {
            const graphDto = {
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'OtherType', startNode: 'Bernat', endNode: 'Jana'}
                ]
            };

            const result = networkModel.createNetworkGraph(graphDto);

            expect(result.people['Bernat'].connections).toHaveLength(1);
            expect(result.people['Jana'].connections).toHaveLength(1);
        });

        it('should handle empty graphDto', () => {
            const graphDto = {
                sn: 'facebook',
                people: [],
                relationships: []
            };

            const result = networkModel.createNetworkGraph(graphDto);

            expect(result).toEqual({
                sn: 'facebook',
                people: {}
            });
        });
    });
});
