export interface ICommentable {
  title: string;
  content: string;
  uri: string;
  tags: string[];
  comment: string;
  generateComment(): void;
  postComment(): void;
}
