package edu.ups.transfer;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class TransferServiceTest {

    @Inject
    TransferService transferService;

    @Test
    @DisplayName("Successful transfer when there are funds in the account")
    public void testTransferSuccess(){

        //Datos
        TransferRequest request = new TransferRequest();
        request.setSenderAccount("12345");  // Cuenta de origen con saldo suficiente
        request.setRecipientAccount("67890"); // Cuenta de destino
        request.setAmount(500.0);  // Monto a transferir
        request.setDescription("Pago de servicios");

        Response response =  transferService.transfer(request);

        assertEquals(200, response.getStatus());
        assertEquals("Transferencia exitosa", ((TransferResponse) response.getEntity()).getMessage());

    }


}
