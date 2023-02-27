import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)', 'p(99.99)', 'count'],
  // stages: [
  //   { duration: '30s', target: 20},
  //   { duration: '1m30s', target: 50},
  //   { duration: '30s', target: 0},
  // ],
  scenarios: {
    publicIdAccess: {
      executor: 'shared-iterations',
      exec: 'publicRequest',
      vus: 1,
      iterations: 1,
      maxDuration: '1s'
    },
    registerJourney: {
      executor: 'shared-iterations',
      exec: 'registerJourney', 
      vus: 1,
      iterations: 1,
      maxDuration: '1s'
    }
  }
}

export function publicRequest() {
  // public crocodile address
  const publicCroc = 'https://test-api.k6.io/public/crocodiles/'
  //initial get request to base url and get info on the page
  const response = http.get(publicCroc);
  // check response code
  check(response, {
    'is status 200': (r) => r.status === 200
  });
  sleep(1);
  // measure response time  
  console.log('Response time was ' + String(response.timings.duration) + ' ms');
  // filters through the json info in the response for values tied to ID and makes an array
  let arrayOfIDs = (response.json("#.id"))
  // uses newly formed array of ids and picks one at "random"
  const randomID = arrayOfIDs[Math.floor(Math.random() * arrayOfIDs.length)];

  // assigns random ID to the end of the url to pull up the new page with specific details
  const randomIdCroc = `https://test-api.k6.io/public/crocodiles/${randomID}`

  //second get request to updated url for randomID
  const detailGrab = http.get(randomIdCroc);
  // second status code check
  check(detailGrab, {
    'is status 200': (r) => r.status === 200
  });
  sleep(1);
  // second response time check    
  console.log('Response time was ' + String(detailGrab.timings.duration) + ' ms');
  // test for output
  // console.log(detailGrab)  
}

export function registerJourney() {
//configuration
const randomNumber= Math.floor(Math.random() * 99999);
const randomEmail = 'Tester' + randomNumber + '@gmail.com';
const randomUsername = 'test-user' + randomNumber
// register crocodile url
const registerCroc = 'https://test-api.k6.io/user/register/'
// token login crocodile url
const loginTokenCroc = 'https://test-api.k6.io/auth/token/login/'

  let body = {
  username: `${randomUsername}`,
  first_name: "ThisIsATest",
  last_name: "CoolCode",
  email: `${randomEmail}`,
  password: "QWerty1234"}

  const register = http.post(registerCroc, body)

  check(register, {
    'is status 201': (r) => r.status === 201});
    sleep(1);


  let loginDetails = {
    username: `${randomUsername}`,
    password: "QWerty1234"}

  const login = http.post(loginTokenCroc, loginDetails)

  check(login, {
    'is status 200': (r) => r.status === 200});
    sleep(1);
}