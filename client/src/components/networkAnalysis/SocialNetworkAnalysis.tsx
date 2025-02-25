import React from 'react';

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';

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
        <Typography variant="h6" gutterBottom>
            Find Isolated Users
        </Typography>
        <FormControl fullWidth>
            <InputLabel>Social Network</InputLabel>
            <Select value={selectedNetwork} label="Social Network" onChange={handleNetworkChange}>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
            </Select>
            <Button variant="contained" onClick={analyzeNetwork}>
                Analyze
            </Button>
        </FormControl>
        {isolatedUsers !== undefined && (
            <Box sx={{mt: 2}}>
                <Typography>Number of isolated users: {isolatedUsers}</Typography>
            </Box>
        )}
    </Paper>
);

export default SocialNetworkAnalysis;
