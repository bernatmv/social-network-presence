import {getAllSocialNetworksGraphs} from '../../../services/socialNetworks';
import {getConnections} from '../peopleModel';

jest.mock('../../../services/socialNetworks');

describe('peopleModel', () => {
    const mockGetAllSocialNetworksGraphs = getAllSocialNetworksGraphs as jest.MockedFunction<
        typeof getAllSocialNetworksGraphs
    >;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate first and second degree connections correctly', async () => {
        mockGetAllSocialNetworksGraphs.mockResolvedValue([
            {
                sn: 'facebook',
                people: [
                    {name: 'Bernat'},
                    {name: 'Jana'},
                    {name: 'Marti'},
                    {name: 'Gemma'},
                    {name: 'Bruna'},
                    {name: 'Pere'}
                ],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'},
                    {type: 'HasConnection', startNode: 'Marti', endNode: 'Gemma'},
                    {type: 'HasConnection', startNode: 'Pere', endNode: 'Bruna'}
                ]
            }
        ]);

        const result = await getConnections('Bernat');

        expect(result).toEqual({
            name: 'Bernat',
            connections: [
                {
                    sn: 'facebook',
                    firstDegree: 1, // Jana
                    secondDegree: 1 // Marti (Gemma is third degree)
                }
            ]
        });
    });

    it('should handle multiple social networks', async () => {
        mockGetAllSocialNetworksGraphs.mockResolvedValue([
            {
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
                relationships: [{type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'}]
            },
            {
                sn: 'twitter',
                people: [{name: 'Bernat'}, {name: 'Pere'}, {name: 'Gemma'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Pere'},
                    {type: 'HasConnection', startNode: 'Pere', endNode: 'Gemma'}
                ]
            }
        ]);

        const result = await getConnections('Bernat');

        expect(result).toEqual({
            name: 'Bernat',
            connections: [
                {
                    sn: 'facebook',
                    firstDegree: 1, // Jana
                    secondDegree: 0
                },
                {
                    sn: 'twitter',
                    firstDegree: 1, // Pere
                    secondDegree: 1 // Gemma
                }
            ]
        });
    });

    it('should handle users with no connections', async () => {
        mockGetAllSocialNetworksGraphs.mockResolvedValue([
            {
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
                relationships: [{type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'}]
            }
        ]);

        const result = await getConnections('Bernat');

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

    it('should handle users that do not exist in the network', async () => {
        mockGetAllSocialNetworksGraphs.mockResolvedValue([
            {
                sn: 'facebook',
                people: [{name: 'Jana'}, {name: 'Marti'}],
                relationships: [{type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'}]
            }
        ]);

        const result = await getConnections('Bernat');

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

        const result = await getConnections('Bernat');

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

        await expect(getConnections('Bernat')).rejects.toThrow('Service error');
    });

    it('should not count the same person twice in first degree connections', async () => {
        mockGetAllSocialNetworksGraphs.mockResolvedValue([
            {
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Bernat'} // Duplicate connection
                ]
            }
        ]);

        const result = await getConnections('Bernat');

        expect(result).toEqual({
            name: 'Bernat',
            connections: [
                {
                    sn: 'facebook',
                    firstDegree: 1, // Jana should only be counted once
                    secondDegree: 0
                }
            ]
        });
    });

    it('should not count first degree connections as second degree', async () => {
        mockGetAllSocialNetworksGraphs.mockResolvedValue([
            {
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'},
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Marti'} // Direct connection to Marti
                ]
            }
        ]);

        const result = await getConnections('Bernat');

        expect(result).toEqual({
            name: 'Bernat',
            connections: [
                {
                    sn: 'facebook',
                    firstDegree: 2, // Jana and Marti are first degree
                    secondDegree: 0 // No second degree as Marti is already first degree
                }
            ]
        });
    });

    it('should not count the person themselves in any degree', async () => {
        mockGetAllSocialNetworksGraphs.mockResolvedValue([
            {
                sn: 'facebook',
                people: [{name: 'Bernat'}, {name: 'Jana'}, {name: 'Marti'}],
                relationships: [
                    {type: 'HasConnection', startNode: 'Bernat', endNode: 'Jana'},
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Bernat'}, // Circular connection
                    {type: 'HasConnection', startNode: 'Jana', endNode: 'Marti'}
                ]
            }
        ]);

        const result = await getConnections('Bernat');

        expect(result).toEqual({
            name: 'Bernat',
            connections: [
                {
                    sn: 'facebook',
                    firstDegree: 1, // Only Jana
                    secondDegree: 1 // Only Marti (Bernat is not counted)
                }
            ]
        });
    });
});
