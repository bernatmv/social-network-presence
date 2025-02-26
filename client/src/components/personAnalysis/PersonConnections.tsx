import React from 'react';

import {Grid} from '@mui/material';

import {Column, HeaderColumn, HeaderRow, Row} from './styles/PersonConnections.styles';

interface PersonConnectionsProps {
    connections?: {
        sn: string;
        connectionsCount: number[];
    }[];
}

const PersonConnections: React.FC<PersonConnectionsProps> = ({connections}) => {
    if (!connections) {
        return null;
    }

    const degrees = connections[0]?.connectionsCount?.length ?? 0;

    return (
        <Grid item xs={12}>
            <HeaderRow>
                <HeaderColumn>Network</HeaderColumn>
                {Array.from({length: degrees}).map((_, index) => (
                    <HeaderColumn key={index}>Degree {index + 1}</HeaderColumn>
                ))}
            </HeaderRow>
            {connections.map(({sn, connectionsCount}) => (
                <Row key={sn}>
                    <Column>{sn}</Column>
                    {connectionsCount.map((count, index) => (
                        <Column key={index}>{count}</Column>
                    ))}
                </Row>
            ))}
        </Grid>
    );
};

export default PersonConnections;
