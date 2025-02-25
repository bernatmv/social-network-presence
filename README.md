# Social Network Presence Analysis

A full-stack application for analyzing social network connections and relationships. The application allows users to explore first and second-degree connections across different social networks, as well as identify isolated users within networks.

## Architecture

### Backend (Node.js + Express + TypeScript)

The server is structured using a modular architecture:

```
server/
├── src/
│   ├── models/          # Business logic and data structures
│   │   ├── network/     # Network graph analysis
│   │   └── people/      # User connections analysis
│   ├── services/        # External service integrations
│   ├── routes/          # API endpoints
│   └── common/          # Shared utilities
```

Key features:

- Network graph analysis for finding isolated users
- First and second-degree connection calculation
- Support for multiple social networks
- Error handling and type safety with TypeScript

### Frontend (React + TypeScript)

The client uses modern React patterns and tools:

```
client/
├── src/
│   ├── components/      # React components (complex components are split into container and presentational components)
│   ├── services/        # API client
│   └── store/          # Redux state management
```

Features:

- Material-UI for modern, responsive design
- Redux for state management
- React Query for API data fetching and caching
- TypeScript for type safety

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/social-network-graph.git
cd social-network-graph
```

2. Install dependencies:

```bash
npm install
```

To run both client and server in development mode:

```bash
npm run dev
```

This will start:

- Server on http://localhost:3001
- Client on http://localhost:3000

### Running Tests

There are 2 test suites which covers the most important part of the server logic:

- Network graph creation and analysis of isolated users
- User connections analysis

There is an additional test suit for a common utility.

Run server tests:

```bash
cd server
npm test
```

## API Endpoints

### GET `/api/people/:name/connections`

Returns first and second-degree connections for a person across all social networks.

Response format:

```json
{
  "name": "string",
  "connections": [
    {
      "sn": "string",
      "firstDegree": number,
      "secondDegree": number
    }
  ]
}
```

### GET `/api/networks/:network/isolated`

Returns the count of isolated users in a specific network.

Response format:

```json
{
  "sn": "string",
  "isolated": number
}
```

## Future Improvements

- Securizing the API: missing authentication and authorization on least access needed, helmet for headers, https certificates...
- Additional tests: increase coverage of unit tests, integration tests and e2e tests
- Add logging
- Error handling: deal with the unhappy path, add error handling in the API to return proper error messages and status codes, error handling on the FE to improve user experience
- Performance: minify, gzip, CDN, cache meta tags, adding caching to the API to improve performance, lazy load if it gets too big...
- Optimize what we retrieve form third party so we don't always work with the full network graph
- Add a CI/CD pipeline
- i18n?
- a11y?
- SEO?
