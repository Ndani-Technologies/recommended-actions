const env = require("./configs/index");
const logger = require("./middleware/logger");
const app = require("./app");

const { HOST, PORT } = process.env;
app.listen(PORT, logger.info(`🚀 listening to requests on ${HOST}:${PORT}`));
