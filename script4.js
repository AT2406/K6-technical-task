import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
    let id = 1
    const response = http.get(`https://test-api.k6.io/public/crocodiles/${id}/`);

    check(response, {
        'is status 200': (r) => r.status === 200,
      });
      sleep(1);

      console.log('Response time was ' + String(response.timings.duration) + ' ms');  
    }
    
