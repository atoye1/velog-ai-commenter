import { HttpClient } from "../httpClient/HttpClient";
import { ICommentable } from "./ICommentable";
import { CommentGenerator } from "../CommentGenerator/CommentGenerator";

export interface PostData {
  post_id: string;
  uri: string;
  title: string;
  content: string;
  tags: string[];
}

export class VelogPost implements ICommentable {
  public post_id: string;
  public title: string;
  public content: string;
  public uri: string;
  public tags: string[];
  public comment: string;

  constructor(
    data: PostData,
    private client: HttpClient,
    private generator: CommentGenerator
  ) {
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
