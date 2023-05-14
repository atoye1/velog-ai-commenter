import { HttpClient } from "../httpClient/HttpClient";
import { Post } from "./Post";
import { CommentGenerator } from "../CommentGenerator/CommentGenerator";
import { IPostData } from "./IPostData";

export class VelogPost extends Post {
  public post_id: string;
  public title: string;
  public content: string;
  public uri: string;
  public tags: string[];
  public comment: string;

  constructor(
    data: IPostData,
    private client: HttpClient,
    private generator: CommentGenerator
  ) {
    super();
    this.post_id = data.post_id;
    this.title = data.title;
    this.content = data.content;
    this.uri = data.uri;
    this.tags = data.tags;
    this.comment = "";
  }
  public async generateComment(): Promise<void> {
    this.comment = await this.generator.generateComment();
  }
  public async postComment(): Promise<void> {
    if (!this.comment)
      throw new Error("Comment is empty!, you must generate comment first");
    await this.client.postComment(this.post_id, this.comment);
    return;
  }
}
