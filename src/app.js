/* eslint-disable import/extensions */
import express from "express";

import helmet from "helmet";
import cors from "cors";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import healthcheckRoute from "./routes/healthcheck.js";
import userRoutes from "./routes/users.js";
import actionStepsRoutes from "./routes/actionsteps.js";
import weightRoutes from "./routes/weight.js";
import categoryRoutes from "./routes/category.js";
import potentialRoutes from "./routes/potential.js";
import costRoutes from "./routes/cost.js";
import timescaleRoutes from "./routes/timescale.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/healthcheck", healthcheckRoute);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/actionsteps", actionStepsRoutes);
app.use("/api/v1/weights", weightRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/potentials", potentialRoutes);
app.use("/api/v1/costs", costRoutes);
app.use("/api/v1/timescale", timescaleRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
