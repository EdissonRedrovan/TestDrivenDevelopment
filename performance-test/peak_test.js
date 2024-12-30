import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';


//Metyricas personalizadas
const myTrend = new Trend('waiting_time');
const CounterErrors = new Counter('Errors');

export const options = {
  stages: [
    {duration: "1m", target: 5},
    {duration: "30s", target: 300},
    {duration: "1m", target: 10},
    {duration: "30s", target: 0}
  ],
  thresholds: {
      "http_req_duration": ["p(95) < 3000"],
      "waiting_time": ["avg < 2000"],
      "Errors": ["count < 10"],
      "http_req_failed": ["rate < 0.01"],
      "http_req_receiving": ["p(95) < 1000"],
      "http_req_tls_handshaking": ["p(95) < 500"],
      "http_req_blocked": ["p(95) < 300"],
      "iterations": ["count > 3000"],
      "checks": ["rate > 0.95"],
      "http_req_waiting": ["p(95) < 3000"]
  }
};

export default function () {
  const url = 'http://localhost:8080/transfer';
  const payload = JSON.stringify({
    senderAccount: '12345',
    recipientAccount: '67890',
    amount: 100.50,
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

  sleep(1); 
}
