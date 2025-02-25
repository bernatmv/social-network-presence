import {Router} from 'express';

import peopleRoutes from './peopleRoutes';
import socialNetworkRoutes from './socialNetworkRoutes';

const router = Router();

router.use('/people', peopleRoutes);
router.use('/networks', socialNetworkRoutes);

export default router;
