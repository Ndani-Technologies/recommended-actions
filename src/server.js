/* eslint-disable import/extensions */
import app from "./app.js";
import connectDB from "./configs/db.js";
import env from "./configs/dev.js";
import logger from "./middleware/logger.js";

const { host, port, dbUrl } = env;

(async () => {
  try {
    await connectDB(dbUrl);
    logger.info("✌️  DB loaded and connected!");

    app.listen(
      port,
      logger.info(`🚀 listening to requests on ${host}:${port}`)
    );
  } catch (error) {
    logger.error(error.stack);
  }
})();
