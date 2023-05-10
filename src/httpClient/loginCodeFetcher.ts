import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import path from 'path'

import imaps from 'imap-simple';
import {ImapSimpleOptions } from 'imap-simple'
import { simpleParser} from 'mailparser';

dotenv.config({path : __dirname + '/.development.env'});

const { NAVER_ID, NAVER_PW } = process.env;
// Fetch environment variables

function checkEnv() {
  if (!NAVER_ID || !NAVER_PW)
    throw new Error('Both naver_id and naver_pw required!')
}

// Create a Nodemailer transporter using SMTP
function getImapConfig () : ImapSimpleOptions {
  if (!NAVER_ID || !NAVER_PW)
    throw new Error('Both naver_id and naver_pw required!')
  
  let imapConfig :ImapSimpleOptions = {
    imap: {
      user: NAVER_ID,
      password: NAVER_PW,
      host: 'imap.naver.com',
      port: 993,
      tls: true
    }
  };
  return imapConfig;
}

function getSearchDateString() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  // Format as IMAP date string
  return today.toISOString().split('T')[0];
}

function extractCodeFromBody(body: string) : string {
  let regex = /https:\/\/velog\.io\/email-login\?code=([a-zA-Z0-9_]+)/g;
  let match = regex.exec(body);
  if (!match || !match[0]) {
    throw new Error("Login Code Not Found From Email Body")
  }
  return match[0].split('3D')[1]
}

export async function getLoginCode(): Promise<string> {
  checkEnv()
  const searchCriteria = [ ['SINCE', getSearchDateString()], ['FROM', 'verify@velog.io']];
  const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false
  };
  const connection = await imaps.connect(getImapConfig())
  const box = await connection.openBox('INBOX')
  const searchedMails = await connection.search(searchCriteria, fetchOptions)
  
  let bodies = searchedMails.map((res: any) => {
          return res.parts.filter((part: any) => part.which === 'TEXT')[0].body;
  });
  const body = bodies[bodies.length - 1]
  return extractCodeFromBody(body)
}

const code = getLoginCode()
code.then(res => console.log(res))

// imaps.connect(imapConfig).then(function (connection) {

//     return connection.openBox('INBOX').then(function () {
//         var searchCriteria = [ ['SINCE', todayString], ['FROM', 'verify@velog.io']];

//         var fetchOptions = {
//             bodies: ['HEADER', 'TEXT'],
//             markSeen: false
//         };

//         return connection.search(searchCriteria, fetchOptions).then(function (results) {
//             var subjects = results.map(function (res: any) {
//                 return res.parts.filter(function (part : any) {
//                     return part.which === 'HEADER';
//                 })[0].body.subject[0];
//             });

//             console.log(subjects);
//         });
//     });
// });