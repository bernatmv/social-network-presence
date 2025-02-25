import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '@/store';
import {setSelectedPerson} from '@/store/socialNetworkSlice';
import {Card, Grid} from '@mui/material';
import {useQuery} from '@tanstack/react-query';

import api from '../../services/api';
import PersonAnalysis from './PersonAnalysis';
import PersonConnections from './PersonConnections';

const PersonAnalysisContainer: React.FC = () => {
    const dispatch = useDispatch();
    const {selectedPerson} = useSelector((state: RootState) => state.socialNetwork);
    const [person, setPerson] = useState('');

    const {data: connectionsData} = useQuery({
        queryKey: ['connections', selectedPerson],
        queryFn: () => api.getPersonConnections(selectedPerson),
        enabled: !!selectedPerson
    });

    const changeSelectedPerson = () => {
        if (!person) return;

        dispatch(setSelectedPerson(person));
    };

    const handlePersonChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPerson(event.target.value);
    }, []);

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            changeSelectedPerson();
        }
    };

    return (
        <Grid item xs={12} md={4} lg={4} xl={4}>
            <Card variant="outlined" sx={{p: 3}}>
                <PersonAnalysis
                    person={person}
                    handlePersonChange={handlePersonChange}
                    onKeyDown={onKeyDown}
                    changeSelectedPerson={changeSelectedPerson}
                />
                <Grid container spacing={2}>
                    {connectionsData && connectionsData.map(data => <PersonConnections key={data.sn} {...data} />)}
                </Grid>
            </Card>
        </Grid>
    );
};

export default PersonAnalysisContainer;
