const express = require("express");
const path = require("path");

require("dotenv/config");

const app = express();
const cors = require("cors");

const expresssession = require("express-session");
const MongoStore = require("connect-mongo");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const mongoose = require("mongoose");
const healthcheckRoute = require("./routes/healthcheck");

const env = require("./configs/index");
const logger = require("./middleware/logger");
const actionStepsRoutes = require("./routes/actionsteps");
const answerRelationshipRoutes = require("./routes/answer_relationship");
const categoryRoutes = require("./routes/category");
const potentialRoutes = require("./routes/potential");
const costRoutes = require("./routes/cost");
const timescaleRoutes = require("./routes/timescale");
const relationshipRoutes = require("./routes/relationship");
const statusRoutes = require("./routes/status");

const resourceLinkRouter = require("./routes/resource_link");
const steps = require("./routes/stepRouter");

const url = env.mongoUrl;

const connect = mongoose.connect(url);

connect
  .then(() => {
    console.log("connected Correctly");
  })
  .catch((err) => console.log("mongo error", err));

app.use(
  expresssession({
    secret: env.secrectKey,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: url }),
  })
);

app.use(cors({ origin: "*" }));
app.use(express.static("./assets"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// app.use(responseTime);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Green-Me Official",
      version: "0.1.0",
      description: "API Routes and Database Schema for GreenMe-Official",
    },
    servers: [
      {
        url: `http://${env.host}/${env.port}`,
      },
    ],
  },
  apis: ["src/routes/actionsteps.js"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
app.use((req, res, next) => {
  // Log the request
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});
app.use("/api/v1/ra/healthcheck", healthcheckRoute);
app.use("/api/v1/ra/actionsteps", actionStepsRoutes);
app.use("/api/v1/ra/answer_relationship", answerRelationshipRoutes);
app.use("/api/v1/ra/categories", categoryRoutes);
app.use("/api/v1/ra/potentials", potentialRoutes);
app.use("/api/v1/ra/costs", costRoutes);
app.use("/api/v1/ra/timescales", timescaleRoutes);
app.use("/api/v1/ra/relationships", relationshipRoutes);
app.use("/api/v1/ra/status", statusRoutes);
app.use("/api/v1/ra/resourceLink", resourceLinkRouter);
app.use("/api/v1/ra/steps", steps);

app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = "Route not found";
  next(err);
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "internal server error",
  });
  next();
});

module.exports = app;
