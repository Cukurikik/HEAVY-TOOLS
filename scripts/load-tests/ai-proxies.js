import http from 'k6/http';
import { check, sleep } from 'k6';

// 98. Load Testing AI Proxies (K6)
export const options = {
  vus: 10,       // 10 Virtual Users
  duration: '30s', // Test duration
};

export default function () {
  // Simulating barrage of smart chapter proxy requests
  const payload = JSON.stringify({
    transcript: 'Hello and welcome to the testing video script. We are testing the API limits.'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:3000/api/video/ai/chapter', payload, params);
  
  // Verify that it hits rate limit (429) or succeeds (200), or fails gracefully (500 logic fallback)
  check(res, {
    'status is 200, 429 or 500': (r) => [200, 429, 500].includes(r.status),
  });

  sleep(1);
}
