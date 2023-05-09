/* eslint-disable import/extensions */
import express from "express";
import helmet from "helmet";
import cors from "cors";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import healthcheckRoute from "./routes/healthcheck.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/healthcheck", healthcheckRoute);
app.use("/api/v1/users", userRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
