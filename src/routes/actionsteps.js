/* eslint-disable import/extensions */
import express from "express";

import {
  createactionSteps,
  deleteactionSteps,
  getactionStep,
  getactionSteps,
  updateactionSteps,
} from "../controllers/actionsteps.js";

const router = express.Router();

router.route("/").get(getactionSteps).post(createactionSteps);
router
  .route("/:id")
  .get(getactionStep)
  .patch(updateactionSteps)
  .delete(deleteactionSteps);

export default router;
