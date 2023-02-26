import http from 'k6/http';
import { check, sleep } from 'k6';
var stringIDs 
const url1 = 'https://test-api.k6.io/public/crocodiles/'


export default function () {

    //initial get request to base url and get info on the page
    const response = http.get(url1);

    // check response code
    check(response, {
      'is status 200': (r) => r.status === 200});
      sleep(1);
    
    // measure response time  
    console.log('Response time was ' + String(response.timings.duration) + ' ms');  
    
    // filters through the json info in the response for values tied to ID and makes an array
    stringIDs = (response.json("#.id"))

    // uses newly formed array of ids and picks one at "random"
    const randomID = stringIDs[Math.floor(Math.random() * stringIDs.length)];
    
    // assigns random ID to the end of the url to pull up the new page with specific details
    const url2 = `https://test-api.k6.io/public/crocodiles/${randomID}`

    //second get request to updated url for randomID
    const detailGrab = http.get(url2);

    check(detailGrab, {
        'is status 200': (r) => r.status === 200});
        sleep(1);

    console.log('Response time was ' + String(detailGrab.timings.duration) + ' ms');  

    // console.log(url2);
    }
