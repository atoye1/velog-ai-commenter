// 에이아이 요청은 이 클래스에서 수행한다.
// 입력으로 포스트 데이터와 옵션을 받아서 오픈 에이아이에 요청한 데이터를 수행한다.
// 다른 ai 요청이 가능한지 살펴본다.
// const OPENAI_API_KEY = process.env.OPEN_API_KEY;
// if (!OPENAI_API_KEY) {
//   throw new Error("OPEN_API_KEY must be exist");
// }

export class CommentGenerator {
  constructor() {}
  generateComment() {
    return Promise.resolve("sample mocking comment for api test");
  }
}
