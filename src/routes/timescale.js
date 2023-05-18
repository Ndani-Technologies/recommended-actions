/* eslint-disable import/extensions */
import express from "express";

import {
  createTimescale,
  deleteTimescale,
  getTimescale,
  getTimescales,
  updateTimescale,
} from "../controllers/timescale.js";

const router = express.Router();

router.route("/").get(getTimescales).post(createTimescale);
router
  .route("/:id")
  .get(getTimescale)
  .patch(updateTimescale)
  .delete(deleteTimescale);

export default router;
