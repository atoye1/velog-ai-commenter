import imaps from "imap-simple";
import { ImapSimpleOptions } from "imap-simple";
import Connection from "imap";
import config from "../config/config";

const { NAVER_ID, NAVER_PW } = config;
console.log(".ENV from fetchLoginCode ", process.env);

function checkEnv() {
  if (!NAVER_ID || !NAVER_PW)
    throw new Error("Both naver_id and naver_pw required!");
}

function getImapConfig(): ImapSimpleOptions {
  if (!NAVER_ID || !NAVER_PW)
    throw new Error("Both naver_id and naver_pw required!");

  let imapConfig: ImapSimpleOptions = {
    imap: {
      user: NAVER_ID,
      password: NAVER_PW,
      host: "imap.naver.com",
      port: 993,
      tls: true,
    },
  };
  return imapConfig;
}

function getSearchDateString() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  // Format as IMAP date string
  return today.toISOString().split("T")[0];
}

function extractCodeFromBody(body: string): string {
  let regex = /https:\/\/velog\.io\/email-login\?code=([a-zA-Z0-9_\-]+)/g;
  let match = regex.exec(body);
  if (!match || !match[0]) {
    throw new Error("Login Code Not Found From Email Body");
  }
  return match[0].split("3D")[1];
}

async function getMailWithRetry(
  searchCriteria: any[],
  fetchOptions: Connection.FetchOptions
): Promise<imaps.Message[]> {
  const retry = 5;
  let connection;
  let searchedMails;
  for (let i = 0; i < retry; i++) {
    try {
      connection = await imaps.connect(getImapConfig());
      await connection.openBox("INBOX");
      searchedMails = await connection.search(searchCriteria, fetchOptions);
      if (searchedMails.length > 0) {
        return searchedMails;
      }
      throw new Error(
        `Could not find email from velog, retrying...${i}times tried.`
      );
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw new Error("Could not get login Email from velog after 5 retry");
}

export async function fetchLoginCode(): Promise<string> {
  checkEnv();
  const searchCriteria = [
    ["SINCE", getSearchDateString()],
    ["FROM", "verify@velog.io"],
  ];
  const fetchOptions = {
    bodies: ["HEADER", "TEXT"],
    markSeen: false,
  };
  const searchedMails = await getMailWithRetry(searchCriteria, fetchOptions);
  let bodies = searchedMails.map((res: any) => {
    return res.parts.filter((part: any) => part.which === "TEXT")[0].body;
  });
  const body = bodies[bodies.length - 1];
  return extractCodeFromBody(body);
}
