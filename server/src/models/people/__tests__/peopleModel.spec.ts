import {getAllSocialNetworksGraphs} from '../../../services/socialNetworks';
import peopleModel from '../peopleModel';

jest.mock('../../../services/socialNetworks');

describe('peopleModel', () => {
    const mockGetAllSocialNetworksGraphs = getAllSocialNetworksGraphs as jest.MockedFunction<
        typeof getAllSocialNetworksGraphs
    >;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getConnectionsUntilDegree', () => {
        it('should calculate connections up to specified degree correctly', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [{name: 'Bernat'}, {name: 'Gemma'}, {name: 'Marti'}, {name: 'Jana'}, {name: 'Bruna'}],
                    relationships: [
                        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Gemma'},
                        {type: 'HasConnection', startNode: 'Gemma', endNode: 'Marti'},
                        {type: 'HasConnection', startNode: 'Gemma', endNode: 'Jana'}
                    ]
                }
            ]);

            const result = await peopleModel.getConnectionsUntilDegree('Bernat', 2);

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [1, 2] // [1st degree = Gemma, 2nd degree = Marti and Jana]
                    }
                ]
            });
        });

        it('should handle multiple social networks', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [{name: 'Bernat'}, {name: 'Gemma'}, {name: 'Marti'}],
                    relationships: [
                        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Gemma'},
                        {type: 'HasConnection', startNode: 'Gemma', endNode: 'Marti'}
                    ]
                },
                {
                    sn: 'twitter',
                    people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Bruna'}, {name: 'Pere'}],
                    relationships: [
                        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                        {type: 'HasConnection', startNode: 'Jana', endNode: 'Bruna'},
                        {type: 'HasConnection', startNode: 'Bruna', endNode: 'Pere'}
                    ]
                }
            ]);

            const result = await peopleModel.getConnectionsUntilDegree('Bernat', 2);

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [1, 1] // [1st = Gemma, 2nd = Marti]
                    },
                    {
                        sn: 'twitter',
                        connectionsCount: [1, 1] // [1st = Jana, 2nd = Bruna]
                    }
                ]
            });
        });

        it('should handle person with no connections', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [{name: 'Bernat'}, {name: 'Gemma'}, {name: 'Marti'}],
                    relationships: [{type: 'HasConnection', startNode: 'Gemma', endNode: 'Marti'}]
                }
            ]);

            const result = await peopleModel.getConnectionsUntilDegree('Bernat', 2);

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [0, 0] // No connections at any degree
                    }
                ]
            });
        });

        it('should handle person that does not exist in the network', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [{name: 'Gemma'}, {name: 'Marti'}],
                    relationships: [{type: 'HasConnection', startNode: 'Gemma', endNode: 'Marti'}]
                }
            ]);

            const result = await peopleModel.getConnectionsUntilDegree('Bernat', 2);

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [0, 0] // Person doesn't exist
                    }
                ]
            });
        });

        it('should handle empty networks', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [],
                    relationships: []
                }
            ]);

            const result = await peopleModel.getConnectionsUntilDegree('Bernat', 2);

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [0, 0] // Empty network
                    }
                ]
            });
        });

        it('should handle service errors', async () => {
            mockGetAllSocialNetworksGraphs.mockRejectedValue(new Error('Service error'));

            await expect(peopleModel.getConnectionsUntilDegree('Bernat', 2)).rejects.toThrow('Service error');
        });

        it('should not count connections multiple times', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [{name: 'Bernat'}, {name: 'Gemma'}, {name: 'Marti'}],
                    relationships: [
                        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Gemma'},
                        {type: 'HasConnection', startNode: 'Gemma', endNode: 'Marti'},
                        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Marti'} // Direct connection to Marti
                    ]
                }
            ]);

            const result = await peopleModel.getConnectionsUntilDegree('Bernat', 2);

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [2, 0] // [Gemma and Marti as 1st degree, none as 2nd degree]
                    }
                ]
            });
        });

        it('should handle different degrees of connections', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [{name: 'Bernat'}, {name: 'Gemma'}, {name: 'Marti'}, {name: 'Jana'}, {name: 'Pere'}],
                    relationships: [
                        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Gemma'},
                        {type: 'HasConnection', startNode: 'Gemma', endNode: 'Marti'},
                        {type: 'HasConnection', startNode: 'Marti', endNode: 'Jana'},
                        {type: 'HasConnection', startNode: 'Jana', endNode: 'Pere'}
                    ]
                }
            ]);

            // Test with degree 1
            const result1 = await peopleModel.getConnectionsUntilDegree('Bernat', 1);
            expect(result1).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [1] // [Gemma]
                    }
                ]
            });

            // Test with degree 3
            const result3 = await peopleModel.getConnectionsUntilDegree('Bernat', 3);
            expect(result3).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [1, 1, 1] // [Gemma, Marti, Jana]
                    }
                ]
            });

            // Test with degree 4
            const result4 = await peopleModel.getConnectionsUntilDegree('Bernat', 4);
            expect(result4).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [1, 1, 1, 1] // [Gemma, Marti, Jana, Pere]
                    }
                ]
            });
        });

        it('should handle circular relationships', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [{name: 'Bernat'}, {name: 'Gemma'}, {name: 'Marti'}, {name: 'Jana'}],
                    relationships: [
                        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Gemma'},
                        {type: 'HasConnection', startNode: 'Gemma', endNode: 'Marti'},
                        {type: 'HasConnection', startNode: 'Marti', endNode: 'Jana'},
                        {type: 'HasConnection', startNode: 'Jana', endNode: 'Bernat'} // Creates circular reference
                    ]
                }
            ]);

            const result = await peopleModel.getConnectionsUntilDegree('Bernat', 2);

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [2, 1]
                    }
                ]
            });
        });

        it('should ignore invalid relationship types', async () => {
            mockGetAllSocialNetworksGraphs.mockResolvedValue([
                {
                    sn: 'facebook',
                    people: [{name: 'Bernat'}, {name: 'Gemma'}, {name: 'Marti'}],
                    relationships: [
                        {type: 'HasConnection', startNode: 'Bernat', endNode: 'Gemma'},
                        {type: 'OtherType', startNode: 'Bernat', endNode: 'Marti'},
                        {type: 'InvalidType', startNode: 'Gemma', endNode: 'Marti'}
                    ]
                }
            ]);

            const result = await peopleModel.getConnectionsUntilDegree('Bernat', 2);

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        connectionsCount: [1, 0]
                    }
                ]
            });
        });
    });
});
