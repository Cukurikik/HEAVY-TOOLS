import http from 'k6/http';
import { check, sleep } from 'k6';

// Task 98: Local Load testing
export const options = {
  vus: 100, // 100 Concurrent Virtual Users
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/api/plugins/execute';
  const payload = JSON.stringify({
    pluginId: 'omni-video-pro',
    action: 'run',
    payload: { loadTest: true }
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);
  
  // Verify rate limiting and PQueue queue-limiting (worker_threads shouldn't crash Next.js)
  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
  });

  sleep(1);
}
