import axios from 'axios';

// TODO: this should come from ENV var
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface NetworkConnections {
    sn: string;
    connectionsCount: number[];
}

export type ConnectionsResponse = NetworkConnections[];

export interface IsolatedUsersResponse {
    sn: string;
    count: number;
}

const api = {
    getIsolatedUsers: async (network: string): Promise<IsolatedUsersResponse> => {
        const response = await axios.get(`${API_BASE_URL}/networks/${network}/isolated`);
        return response.data;
    },

    getPersonConnections: async (name: string, degree: number): Promise<ConnectionsResponse> => {
        const response = await axios.get(`${API_BASE_URL}/people/${name}/connections/${degree}`);
        return response.data;
    }
};

export default api;
