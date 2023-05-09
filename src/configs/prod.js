import * as dotenv from "dotenv";

dotenv.config();

const prodEnv = {
  host: process.env.HOST,
  port: process.env.PORT,
  dbUrl: process.env.MONGO_URL,
};

export default prodEnv;
