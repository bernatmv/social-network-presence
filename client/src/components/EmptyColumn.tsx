import React from 'react';

import {Grid} from '@mui/material';

const EmptyColumn: React.FC = () => {
    return <Grid item xs={0} md={4} lg={4} xl={4} />;
};

export default EmptyColumn;
