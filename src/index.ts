import * as dotenv from "dotenv";
import { LocalDB } from "./localDB/localDB";
import { HttpClient } from "./httpClient/HttpClient";
import { fetchData } from "./utils/fetchData";
import { HtmlParser } from "./Post/htmlParser";
import { VelogPost } from "./Post/VelogPost";
import { CommentGenerator } from "./CommentGenerator/CommentGenerator";
import uris from "./uris";
dotenv.config({ path: __dirname + "/config/.development.env" });

const localDB = new LocalDB();
const targetBlog = process.env.TARGET_VELOG as string;

const main = async () => {
  const sessionedClient = new HttpClient();
  await sessionedClient.login();
  const generator = new CommentGenerator();
  let errorCounter = 0;
  console.log(`Batch job starts for ${uris.length} posts`);

  for await (let uri of uris) {
    try {
      const html = await fetchData(uri);
      const postData = HtmlParser.getPostData(uri, html);
      const targetPost = new VelogPost(postData, sessionedClient, generator);
      await targetPost.generateComment();
      await targetPost.postComment();
      console.log(`Commenting on ${targetPost.title} Succeed!`);
      console.log("URI : ", targetPost.uri);
    } catch (error) {
      console.error(error);
      errorCounter++;
      continue;
    }
  }
  console.log("All Jobs executed. exiting...");

  if (errorCounter) {
    console.log(`Error occured on ${errorCounter} post(s)`);
  } else {
    console.log(`No Error occured during ${uris.length} execution`);
  }
  process.exit(0);
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
