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

    describe('getConnections', () => {
        it('should calculate first and second-degree connections correctly', async () => {
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

            const result = await peopleModel.getConnections('Bernat');

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        firstDegree: 1, // Gemma
                        secondDegree: 2 // Marti and Jana
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

            const result = await peopleModel.getConnections('Bernat');

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        firstDegree: 1, // Gemma
                        secondDegree: 1 // Marti
                    },
                    {
                        sn: 'twitter',
                        firstDegree: 1, // Jana
                        secondDegree: 1 // Bruna (Pere is 3rd degree)
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

            const result = await peopleModel.getConnections('Bernat');

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        firstDegree: 0,
                        secondDegree: 0
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

            const result = await peopleModel.getConnections('Bernat');

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        firstDegree: 0,
                        secondDegree: 0
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

            const result = await peopleModel.getConnections('Bernat');

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        firstDegree: 0,
                        secondDegree: 0
                    }
                ]
            });
        });

        it('should handle service errors', async () => {
            mockGetAllSocialNetworksGraphs.mockRejectedValue(new Error('Service error'));

            await expect(peopleModel.getConnections('Bernat')).rejects.toThrow('Service error');
        });

        it('should not count first-degree connections as second-degree', async () => {
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

            const result = await peopleModel.getConnections('Bernat');

            expect(result).toEqual({
                name: 'Bernat',
                connections: [
                    {
                        sn: 'facebook',
                        firstDegree: 2, // Gemma and Marti are first degree
                        secondDegree: 0 // Marti should not be counted as second degree
                    }
                ]
            });
        });

        // TODO: if the graph can be erroneous:
        // (eg: we can have duplicate relationships Bernat -> Gemma and Gemma -> Bernat)
        // (eg: we can have relantionship to ourselves: Bernat -> Bernat)
        // we will need to handle these cases when creating the graph and expand the test cases
        // for this exercise I didn't feel this level of detail was needed
    });
});
