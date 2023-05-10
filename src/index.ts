import cheerio from "cheerio";
import axios from "axios";
import * as dotenv from "dotenv";
import { LocalDB } from "./localDB/localDB";
import { Velog } from "./velog/Velog"
dotenv.config({ path: __dirname + "/config/.development.env" });

const localDB = new LocalDB();
const targetBlog = process.env.TARGET_VELOG as string

const fetchData = async (uri) => {
  try {
    const response = await axios.get(uri);
    const data = response.data;
    // Process the data or perform any additional operations
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const checkPostForComment = () => {
  // if already commented false!
};
const updatePostsDB = () => {
  // update fileDB with informations
};

const preProcessPost = () => {
  // trim body
  // remove images
  // extract title
  // extract content
  // extract tags
  // extract markdown texts
};

const createComment = () => {
  // callAPI()
  // formatCommentToMarkDown()
  // formatResults with more fancy way()
  // return result;
};

const callAPI = () => {
  // 핵심 비즈니스 로직은 여기 들어간다.
  // 프롬프트 엔지니어링으로 만족스러운 결과를 도출해야 한다.
  // 만약 토큰이 4000개가 넘는다면 처리를 해줘야 한다.
  // 길이가 넘어가는 입력이 있으면 나눠서 개별적으로 호출을 한다.
  // 결과를 다시 API에 호출해서 합친다.
  // 최종적으로 여러가지 결과를 도출한다.
};
const postComment = () => {};

// Call the async function
const main = async () => {
  const velog = new Velog(targetBlog, localDB)
  const uri = `https://velog.io/@${}`;
  const html = await fetchData(uri);
  const $ = cheerio.load(html);
  const extractedTags = $("a")
    .filter(function () {
      const href = $(this).attr("href");
      return href.includes("/@atoye1/");
    })
    .map(function (elem) {
      return $(this).attr("href");
    })
    .toArray();
  console.log(extractedTags);
};

// Text for which you want to calculate tokens
const text = "This is a sample text to count tokens.";

// Function to count tokens in a text
async function countTokens() {
  try {
    const response = await open.tools.tiktoken({
      texts: [text],
    });
    const tokenCount = response.data.length;
    console.log("Token count:", tokenCount);
  } catch (error) {
    console.error("Error counting tokens:", error);
  }
}

// Call the function to count tokens
countTokens();

main();
