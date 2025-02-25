import React from 'react';
import {Provider} from 'react-redux';

import {CssBaseline} from '@mui/material';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

import ResponsiveContent from './components/ResponsiveContent';
import {store} from './store';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <CssBaseline />
                <ResponsiveContent />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
