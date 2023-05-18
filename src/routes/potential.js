/* eslint-disable import/extensions */
import express from "express";

import {
  createPotential,
  deletePotential,
  getPotential,
  getPotentials,
  updatePotential,
} from "../controllers/potential.js";

const router = express.Router();

router.route("/").get(getPotentials).post(createPotential);
router
  .route("/:id")
  .get(getPotential)
  .patch(updatePotential)
  .delete(deletePotential);

export default router;
