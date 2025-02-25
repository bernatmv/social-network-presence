import {Request, Response, Router} from 'express';
import asyncHandler from 'express-async-handler';

import {getNetworkConnections} from '../models/network/networkModel';
import {getSocialNetworkGraph} from '../services/socialNetworks';

const router = Router();

router.get(
    '/:network/graph',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const {network} = req.params;

        const graph = await getSocialNetworkGraph(network);

        res.json({graph});
    })
);

router.get(
    '/:network/isolated',
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const {network} = req.params;

        const networkConnections = await getNetworkConnections(network);

        res.json({count: networkConnections.isolated});
    })
);

export default router;
