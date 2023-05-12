import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { fetchLoginCode } from "./fetchLoginCode";

export class HttpClient {
  private jar;
  private client;
  public loginCode: string;

  constructor() {
    this.jar = new CookieJar();
    this.client = wrapper(
      axios.create({ jar: this.jar, withCredentials: true })
    );
    this.loginCode = "";
    console.log("New instance of httpClient created!");
  }

  async requestSendMail() {
    try {
      // TODO: make env variable
      const email = "ssalssi@naver.com";
      const result = await this.client.post(
        "https://v2.velog.io/api/v2/auth/sendmail",
        { email }
      );
      console.log(`Login mail sent to ${email}`);
    } catch (err) {
      console.error("request send mail error");
      console.error(err);
    }
  }

  async setLoginCode(retry: number = 3) {
    for (let i = 0; i < retry; i++) {
      try {
        const loginCode = await fetchLoginCode();
        if (!loginCode) {
          throw new Error("Invalid login Code");
        }
        console.log("LoginCode : ", loginCode);
        this.loginCode = loginCode;
        return;
      } catch (error) {
        console.error(error);
        console.error(
          `Attempt ${i + 1} to get login code failed, retrying after 2seconds`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    throw new Error(`Failed to get login code after ${retry} times`);
  }

  async getLoginSession() {
    if (this.loginCode === undefined || this.loginCode === "") {
      throw new Error("You must get loginCode before login");
    }
    await this.client.get(
      `https://v2.velog.io/api/v2/auth/code/${this.loginCode}`
    );
  }

  async checkLoginStatus() {
    const response = await this.client.get(`https://velog.io`);
    if (response.data.includes("새 글 작성")) {
      return true;
    } else if (response.data.includes("로그인")) {
      return false;
    } else {
      throw new Error("Something went wrong while checking login status");
    }
  }

  async login(retry: number = 5) {
    console.log("Login called");
    await this.requestSendMail();
    console.log("Waiting 10 seconds for login email arrival");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    for (let i = 0; i < retry; i++) {
      try {
        await this.setLoginCode();
        await this.getLoginSession();
        const result = await this.checkLoginStatus();
        if (result) {
          console.log(`success! login code is ${this.loginCode}`);
          return this;
        }
        throw new Error("Login attempt Failed, retrying after 5 seconds");
      } catch (error) {
        console.error(error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
    throw new Error(`Login failed after ${retry} trials`);
  }

  async postComment(post_id: string, comment: string) {
    const text = comment;
    const query = `
       mutation WriteComment($post_id: ID!, $text: String!, $comment_id: ID) {
        writeComment(post_id: $post_id, text: $text, comment_id: $comment_id) {
          id
          user {
            id
            username
            profile {
              id
              thumbnail
              __typename
            }
            __typename
          }
          text
          replies_count
          __typename
        }
      }
    `;
    const result = await this.client.post("https://v2cdn.velog.io/graphql", {
      operationName: "WriteComment",
      query,
      variables: {
        post_id,
        text,
      },
    });
  }
}
