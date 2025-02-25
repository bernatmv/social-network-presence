import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getConnections } from '../models/people/peopleModel';

const router = Router();

router.get(
  '/:name/connections',
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;

    const results = await getConnections(name);

    res.json(results.connections);
  })
);

export default router;
