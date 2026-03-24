import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 }, // Ramp up to 50 users
    { duration: '30s', target: 50 }, // Stay at 50 users
    { duration: '10s', target: 0 },  // Ramp down
  ],
};

// 92. K6 Load Testing AI Proxies (Audio)
export default function () {
  const payload = JSON.stringify({
    audioUrl: 'https://example.com/mock.mp3',
    stems: 4
  });

  const headers = { 'Content-Type': 'application/json' };

  // Testing the Stem Splitter Proxy limits
  const res = http.post('http://localhost:3000/api/audio/ai/stem-splitter', payload, { headers });

  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    'returns jobId': (r) => r.json('jobId') !== undefined || r.status === 429,
  });

  sleep(1);
}
