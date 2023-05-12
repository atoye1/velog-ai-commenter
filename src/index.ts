import * as dotenv from "dotenv";
import { LocalDB } from "./localDB/localDB";
import { HttpClient } from "./httpClient/HttpClient";
import { fetchData } from "./utils/fetchData";
import { HtmlParser } from "./Post/htmlParser";
import { VelogPost } from "./Post/VelogPost";
import { CommentGenerator } from "./CommentGenerator/CommentGenerator";
import uris from "./uris";
import { getTargetVelogs } from "./Velog/getTargetVelogs";
import { Velog } from "./Blog/Velog";
dotenv.config({ path: __dirname + "/config/.development.env" });

const localDB = new LocalDB();

const isCommented = (uri: string) => false;
const isBlacklisted = (uri: string) => false;

const main = async () => {
  const targetVelogs = getTargetVelogs();
  let targetUris = new Set<string>();

  for await (let velogId of targetVelogs) {
    const velog = new Velog(velogId);
    await velog.scrapPosts();
    targetUris = new Set([...targetUris, ...velog.postUris]);
  }

  const sessionedClient = new HttpClient();
  await sessionedClient.login();
  const generator = new CommentGenerator();
  let errorCounter = 0;
  console.log(`Batch job starts for ${uris.length} posts`);

  for await (let uri of targetUris) {
    // TODO: implement this
    if (isCommented(uri)) continue;
    // TODO: implement this
    if (isBlacklisted(uri)) continue;
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
main();
