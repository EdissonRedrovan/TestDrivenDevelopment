import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

//Metyricas personalizadas
const myTrend = new Trend('waiting_time');
const CounterErrors = new Counter('Errors');
const transactionsPerSecond = new Trend('transactions_per_second');

export const options = {
  stages: [
    {duration: "30s",target: 150},
    {duration: "2m",target: 150},
    {duration: "30s",target: 0}
  ],
  thresholds: {
      'http_req_duration': ["p(95) < 2000"], // Tiempo total de una solicitud HTTP hasta recibir completamente la respuesta.
      'http_req_failed': ["rate < 0.01"], // Proporción de solicitudes HTTP fallidas respecto al total.
      "waiting_time": ["avg < 1500"], // Tiempo promedio de espera del cliente por la respuesta del servidor.
      "Errors": ["count < 5"], // Número total de errores ocurridos durante la prueba.
      "iterations": ["count > 3000"], // Total de iteraciones completas ejecutadas en la prueba.
      "http_req_waiting": ["p(95) < 500"], // Tiempo entre el envío de la solicitud y recepción del primer byte (TTFB).
      "http_req_blocked": ["p(95) < 300"], // Tiempo en procesar la solicitud debido a DNS lookup o bloqueos.
      "http_req_connecting": ["p(95) < 200"], // Tiempo para establecer la conexión TCP con el servidor.
      "transactions_per_second": ["avg >= 50"] // Promedio de transacciones procesadas por segundo.
  }
};

export default function () {
  const url = 'http://localhost:8080/transfer';
  const payload = JSON.stringify({
    senderAccount: '12345',
    recipientAccount: '67890',
    amount: 100.50,
    description: 'Transferencia de prueba',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const start = Date.now();
  const response = http.post(url, payload, params);

  // Validaciones
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time is less than 500ms': (r) => r.timings.duration < 500,
  });

  myTrend.add(response.timings.waiting);
  let status = response.status === 200;
  CounterErrors.add(!status);

  sleep(1); 
}
