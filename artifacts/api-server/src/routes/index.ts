import { Router, type IRouter } from "express";
import healthRouter from "./health";
import tripsRouter from "./trips";
import destinationsRouter from "./destinations";
import budgetRouter from "./budget";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/trips", tripsRouter);
router.use("/destinations", destinationsRouter);
router.use("/budget", budgetRouter);

export default router;
