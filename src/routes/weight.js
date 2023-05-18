/* eslint-disable import/extensions */
import express from "express";

import {
  createWeight,
  deleteWeight,
  getWeight,
  getWeights,
  updateWeight,
} from "../controllers/weight.js";

const router = express.Router();

router.route("/").get(getWeights).post(createWeight);
router.route("/:id").get(getWeight).patch(updateWeight).delete(deleteWeight);

export default router;
