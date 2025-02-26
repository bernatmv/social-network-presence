import {styled} from '@mui/material/styles';

// This could be semantically improved with more meaningful tags
export const Row = styled('div')`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

export const Column = styled('div')`
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const HeaderRow = styled(Row)`
    margin-top: 20px;
`;

export const HeaderColumn = styled(Column)`
    justify-content: center;
    font-weight: bold;
`;
