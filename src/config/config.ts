import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.development.env" });

const {
  TARGET_VELOG,
  OPENAI_API_KEY,
  NAVER_ID,
  NAVER_PW,
  TARGET_VELOGS,
  CANDIATES,
} = process.env;

export default {
  TARGET_VELOG,
  OPENAI_API_KEY,
  NAVER_ID,
  NAVER_PW,
  TARGET_VELOGS,
  CANDIATES,
};
