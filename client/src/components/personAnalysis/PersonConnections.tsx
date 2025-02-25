import React from 'react';

import {Grid, Typography} from '@mui/material';

interface PersonConnectionsProps {
    sn: string;
    firstDegree: number;
    secondDegree: number;
}

const PersonConnections: React.FC<PersonConnectionsProps> = ({sn, firstDegree, secondDegree}) => {
    return (
        <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
                Social network: {sn}
            </Typography>
            <Typography>First degree connections: {firstDegree}</Typography>
            <Typography>Second degree connections: {secondDegree}</Typography>
        </Grid>
    );
};

export default PersonConnections;
