import {Request, Response, Router} from 'express';
import asyncHandler from 'express-async-handler';

import {getConnectionsUntilDegree} from '../models/people/peopleModel';

const router = Router();

router.get(
    '/:name/connections/:degree',
    asyncHandler(async (req: Request, res: Response) => {
        const {name, degree} = req.params;

        const results = await getConnectionsUntilDegree(name, Number.parseInt(degree));

        res.json(results.connections);
    })
);

export default router;
