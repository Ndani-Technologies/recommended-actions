import * as dotenv from "dotenv";

dotenv.config();

const devEnv = {
  host: process.env.HOST,
  port: process.env.PORT,
  dbUrl: process.env.MONGO_URL,
};

export default devEnv;
