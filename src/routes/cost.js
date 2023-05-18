/* eslint-disable import/extensions */
import express from "express";

import {
  createCost,
  deleteCost,
  getCost,
  getCosts,
  updateCost,
} from "../controllers/cost.js";

const router = express.Router();

router.route("/").get(getCosts).post(createCost);
router.route("/:id").get(getCost).patch(updateCost).delete(deleteCost);

export default router;
