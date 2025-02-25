import {configureStore} from '@reduxjs/toolkit';

import socialNetworkReducer, {SocialNetworkState} from './socialNetworkSlice';

export interface RootState {
    socialNetwork: SocialNetworkState;
}

export const store = configureStore({
    reducer: {
        socialNetwork: socialNetworkReducer
    }
});

export type AppDispatch = typeof store.dispatch;
