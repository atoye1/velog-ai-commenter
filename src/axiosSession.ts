import readline from 'readline';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials:true }));

const tokens = {
  access_token: '',
  refresh_token: ''
}

// Make requests using the Axios instance
client
  .post('https://v2.velog.io/api/v2/auth/sendmail', {email:'ssalssi@naver.com'})
  .then(response => {
    console.log('email sent')
  })
  .catch(error => {})


// Create an interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for input
rl.question('Enter code: ', (code) => {
  console.log(`your code is ${code}`);
  client
    .get(`https://v2.velog.io/api/v2/auth/code/${code}`)
    .then(response => {
      tokens.access_token = response.data.tokens.access_token;
      tokens.refresh_token = response.data.tokens.refresh_token
      console.log('내가만든 쿠키~~~~');
      console.log(response.config.jar.toJSON());
      console.log('내가만든 쿠키~~~~');
      const accessToken = tokens.access_token
      console.log('tokens', tokens)

      client.get(`https://velog.io`)
        .then(response => {
          if (response.data.includes('새 글 작성')) {
            console.log('logined')
          } else if (response.data.includes('로그인')) {
            console.log("NOT login")
          }
        })
        .catch(error => {
          console.error(error)
        })

    // Loop through the cookies and print their details
    // console.log('Cookies:');
    // cookies.forEach(cookie => {
    //   console.log(cookie.toString());
    // });
    })
    .catch(error => {
      console.error('Error getting session:', error);
    });
rl.close();
});



// Define the request body (if applicable)
const data = {
  key1: 'value1',
  key2: 'value2'
};

// Make a request with headers
