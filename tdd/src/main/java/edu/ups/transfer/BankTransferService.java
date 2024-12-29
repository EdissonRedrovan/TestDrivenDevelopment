package edu.ups.transfer;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class BankTransferService implements TransferService{


    private static Map<String, Double> accounts = new HashMap<>();

    static {
        // Cargando cuentas con saldo inicial
        accounts.put("12345", 1000.0);  // Cuenta de ejemplo con saldo inicial
        accounts.put("67890", 500.0);   // Cuenta de destino con saldo inicial
    }

    @Override
    public Response transfer(TransferRequest request) {

        double senderBalance = accounts.getOrDefault(request.getSenderAccount(), 0.0);


        accounts.put(request.getSenderAccount(), senderBalance - request.getAmount());
        accounts.put(request.getRecipientAccount(), accounts.getOrDefault(request.getRecipientAccount(), 0.0) + request.getAmount());


        return Response.ok("Transferencia exitosa").build();
    }
}
