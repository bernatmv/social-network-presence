import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface SocialNetworkState {
    selectedPerson: string;
    selectedNetwork: string;
}

const initialState: SocialNetworkState = {
    selectedPerson: '',
    selectedNetwork: 'facebook' // default network
};

// We could really work just with local data on the components,
// but I'm keeping this as a demonstration of how to use Redux Toolkit
const socialNetworkSlice = createSlice({
    name: 'socialNetwork',
    initialState,
    reducers: {
        setSelectedPerson: (state, action: PayloadAction<string>) => {
            state.selectedPerson = action.payload;
        },
        setSelectedNetwork: (state, action: PayloadAction<string>) => {
            state.selectedNetwork = action.payload;
        }
    }
});

export const {setSelectedPerson, setSelectedNetwork} = socialNetworkSlice.actions;

export default socialNetworkSlice.reducer;
