const app = require("./app");
const env = require("./configs/index");
const logger = require("./middleware/logger");
const { connectClient } = require("./middleware/redisClient");

connectClient();

const { host, port } = env;
app.listen(port, logger.info(`🚀 listening to requests on ${host}:${port}`));
