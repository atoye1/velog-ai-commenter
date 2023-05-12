import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { fetchLoginCode } from "./loginCodeFetcher";

export class HttpClient {
  private jar;
  private client;
  public loginCode: string;

  constructor() {
    console.log("new instance of httpclient about to be created!");
    this.jar = new CookieJar();
    this.client = wrapper(
      axios.create({ jar: this.jar, withCredentials: true })
    );
    this.loginCode = "";
  }

  async requestSendMail() {
    try {
      const result = await this.client.post(
        "https://v2.velog.io/api/v2/auth/sendmail",
        { email: "ssalssi@naver.com" }
      );
    } catch (err) {
      console.error("request send mail error");
      console.error(err);
    }
  }

  async setLoginCode(retry: number = 3) {
    for (let i = 0; i < retry; i++) {
      try {
        const loginCode = await fetchLoginCode();
        console.log("loginCode : ", loginCode);
        if (!loginCode) {
          throw new Error("Invalid login Code");
        }
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
    if (!this.loginCode) {
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
}

async function main(retry: number = 5): Promise<HttpClient> {
  const cl = new HttpClient();
  await cl.requestSendMail();
  await new Promise((resolve) => setTimeout(resolve, 100000));

  for (let i = 0; i < retry; i++) {
    try {
      await cl.setLoginCode();
      await cl.getLoginSession();
      const result = await cl.checkLoginStatus();
      if (result) {
        console.log(`success! login code is ${cl.loginCode}`);
        return cl;
      }
      throw new Error("Login attempt Failed, retrying after 5seconds");
    } catch (error) {
      console.error(error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  throw new Error(`Fail to make logined HttpClient after ${retry} trials`);
}
