import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10, // Número de usuarios virtuales simultáneos
  duration: '30s', // Duración total de la prueba
};

export default function () {
  const url = 'http://localhost:8080/transfer';
  const payload = JSON.stringify({
    senderAccount: '12345',
    recipientAccount: '67890',
    amount: 500.75,
    description: 'Transferencia de prueba',
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
    'response has correct structure': (r) => r.json().hasOwnProperty('transactionId'),
  });
}
