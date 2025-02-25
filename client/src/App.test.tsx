import React from 'react';

import {render, screen} from '@testing-library/react';

import App from './App';

test('renders social network analysis app', () => {
    render(<App />);
    const titleElement = screen.getByText(/Find Isolated Users/i);
    expect(titleElement).toBeInTheDocument();
});
