import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const myTrend = new Trend('waiting_time');
const CounterErrors = new Counter('Errors');
const totalRetries = new Counter('retries');//retries


export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '5m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
      "http_req_duration": ["p(95) < 5000"],
      "waiting_time": ["avg < 3500"],
      "Errors": ["count < 20"],
      "http_req_failed": ["rate < 0.01"],
      "http_req_connecting": ["p(95) < 1000"],
      "http_req_blocked": ["p(95) < 500"],
      "iterations": ["count > 10000"],
      "http_req_waiting": ["p(99) < 10000"]
  }
};

export default function () {
  const url = 'http://localhost:8080/transfer';
  const payload = JSON.stringify({
    senderAccount: '12345',
    recipientAccount: '67890',
    amount: 10.50,
    description: 'Payment for services',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(url, payload, params);

  // Validaciones
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time is less than 500ms': (r) => r.timings.duration < 500,
  });

  let status = response.status === 200;
  myTrend.add(response.timings.waiting);
  CounterErrors.add(!status);

  sleep(1); 
}
