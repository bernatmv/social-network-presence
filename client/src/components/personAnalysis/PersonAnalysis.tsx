import React from 'react';

import {Button, TextField} from '@mui/material';

import {StyledTypography} from './styles/PersonAnalysis.styles';

interface PersonAnalysisProps {
    person: string;
    handlePersonChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    changeSelectedPerson: () => void;
}

const PersonAnalysis: React.FC<PersonAnalysisProps> = ({
    person,
    handlePersonChange,
    onKeyDown,
    changeSelectedPerson
}) => {
    return (
        <>
            <StyledTypography variant="h5" gutterBottom>
                Person&apos;s Presence
            </StyledTypography>
            <TextField
                fullWidth
                label="Person Name"
                value={person}
                onChange={handlePersonChange}
                onKeyDown={onKeyDown}
                sx={{mb: 2}}
            />
            <Button variant="contained" onClick={changeSelectedPerson} disabled={!person}>
                Analyze
            </Button>
        </>
    );
};

export default PersonAnalysis;
