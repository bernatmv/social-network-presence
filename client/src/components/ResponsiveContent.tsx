import React from 'react';

import {Container, Grid} from '@mui/material';

import EmptyColumn from './EmptyColumn';
import SocialNetworkAnalysisContainer from './networkAnalysis/SocialNetworkAnalysisContainer';
import PersonAnalysisContainer from './personAnalysis/PersonAnalysisContainer';

const ResponsiveContent: React.FC = () => (
    <Container maxWidth={false} sx={{py: 4}}>
        <Grid container spacing={3}>
            <SocialNetworkAnalysisContainer />
            <EmptyColumn />
            <PersonAnalysisContainer />
        </Grid>
    </Container>
);

export default ResponsiveContent;
