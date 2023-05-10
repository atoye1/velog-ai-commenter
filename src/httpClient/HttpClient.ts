import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { getLoginCode } from './loginCodeFetcher'


export class HttpClient {
  private jar;
  private client;
  private loginCode:string;
  
  constructor() {
    console.log('new instance of httpclient about to be created!')
    this.jar = new CookieJar()
    this.client = wrapper(axios.create({ jar:this.jar, withCredentials:true }));
    this.loginCode = '';
  }
  
  async requestSendMail() {
    try {
      const result = await this.client.post('https://v2.velog.io/api/v2/auth/sendmail', {email:'ssalssi@naver.com'})
    } catch(err) {
      console.error('request send mail error')
      console.error(err)
    }
  }
  
  async getLoginCode() {
    this.loginCode = await getLoginCode();
    console.log(this.loginCode)
  }
  
  async getLoginSession() {
    if (!this.loginCode) {
      throw new Error('You must get loginCode before login')
    }
    await this.client.get(`https://v2.velog.io/api/v2/auth/code/${this.loginCode}`)
  }
  
  async checkLoginStatus() {
    const response = await this.client.get(`https://velog.io`)
    if (response.data.includes('새 글 작성')) {
      return true
    } else if (response.data.includes('로그인')) {
      return false
    } else {
      throw new Error('Something went wrong while checking login status')
    }
  }
}


async function main() {
  const cl = new HttpClient();
  await cl.requestSendMail()
  await cl.getLoginCode()
  await cl.getLoginSession()
  const result = await cl.checkLoginStatus()
  
  if (result) console.log('success')
  return;
}

// main()

// const jar = new CookieJar();
// const client = wrapper(axios.create({ jar, withCredentials:true }));

// const tokens = {
//   access_token: '',
//   refresh_token: ''
// }

// // Make requests using the Axios instance


// // Prompt the user for input
// rl.question('Enter code: ', (code) => {
//   console.log(`your code is ${code}`);
//   client
//     .get(`https://v2.velog.io/api/v2/auth/code/${code}`)
//     .then(response => {
//       tokens.access_token = response.data.tokens.access_token;
//       tokens.refresh_token = response.data.tokens.refresh_token
//       console.log('내가만든 쿠키~~~~');
//       console.log(response.config.jar.toJSON());
//       console.log('내가만든 쿠키~~~~');
//       const accessToken = tokens.access_token
//       console.log('tokens', tokens)

//       client.get(`https://velog.io`)
//         .then(response => {
//           if (response.data.includes('새 글 작성')) {
//             console.log('logined')
//           } else if (response.data.includes('로그인')) {
//             console.log("NOT login")
//           }
//         })
//         .catch(error => {
//           console.error(error)
//         })

//     // Loop through the cookies and print their details
//     // console.log('Cookies:');
//     // cookies.forEach(cookie => {
//     //   console.log(cookie.toString());
//     // });
//     })
//     .catch(error => {
//       console.error('Error getting session:', error);
//     });
// rl.close();
// });



// // Define the request body (if applicable)
// const data = {
//   key1: 'value1',
//   key2: 'value2'
// };

// // Make a request with headers

