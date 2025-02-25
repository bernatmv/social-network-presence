import React from 'react';

import {Box, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography} from '@mui/material';

import {StyledButton, StyledTypography} from './styles/SocialNetworkAnalysis.styles';

interface SocialNetworkAnalysisProps {
    selectedNetwork: string;
    handleNetworkChange: (event: SelectChangeEvent) => void;
    analyzeNetwork: () => void;
    isolatedUsers?: number;
}

const SocialNetworkAnalysis: React.FC<SocialNetworkAnalysisProps> = ({
    selectedNetwork,
    handleNetworkChange,
    analyzeNetwork,
    isolatedUsers
}) => (
    <Paper sx={{p: 3}}>
        <StyledTypography variant="h6" gutterBottom>
            Available Networks
        </StyledTypography>
        <FormControl fullWidth>
            <InputLabel>Network Name</InputLabel>
            <Select value={selectedNetwork} label="Name" onChange={handleNetworkChange}>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
            </Select>
            <StyledButton variant="contained" onClick={analyzeNetwork}>
                Analyze
            </StyledButton>
        </FormControl>
        {isolatedUsers !== undefined && (
            <Box sx={{mt: 2}}>
                <Typography>Number of isolated users: {isolatedUsers}</Typography>
            </Box>
        )}
    </Paper>
);

export default SocialNetworkAnalysis;
