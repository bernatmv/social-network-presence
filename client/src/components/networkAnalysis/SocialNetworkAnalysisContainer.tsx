import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Grid, SelectChangeEvent} from '@mui/material';
import {useQuery} from '@tanstack/react-query';

import api from '../../services/api';
import {RootState} from '../../store';
import {setSelectedNetwork} from '../../store/socialNetworkSlice';
import SocialNetworkAnalysis from './SocialNetworkAnalysis';

const SocialNetworkAnalysisContainer: React.FC = () => {
    const dispatch = useDispatch();
    const {selectedNetwork} = useSelector((state: RootState) => state.socialNetwork);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const {data: isolatedUsersData} = useQuery({
        queryKey: ['isolatedUsers', selectedNetwork],
        queryFn: () => api.getIsolatedUsers(selectedNetwork),
        enabled: !!selectedNetwork && showAnalysis
    });

    const handleNetworkChange = (event: SelectChangeEvent) => {
        setShowAnalysis(false);
        dispatch(setSelectedNetwork(event.target.value));
    };

    const analyzeNetwork = () => {
        setShowAnalysis(true);
    };

    return (
        <Grid item xs={12} md={4} lg={4} xl={4}>
            <SocialNetworkAnalysis
                selectedNetwork={selectedNetwork}
                handleNetworkChange={handleNetworkChange}
                analyzeNetwork={analyzeNetwork}
                isolatedUsers={showAnalysis ? isolatedUsersData?.count : undefined}
            />
        </Grid>
    );
};

export default SocialNetworkAnalysisContainer;
