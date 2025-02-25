import React from 'react';

import {Button, TextField, Typography} from '@mui/material';

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
            <Typography variant="h5" gutterBottom>
                Analyze Person&apos;s Connections
            </Typography>
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
