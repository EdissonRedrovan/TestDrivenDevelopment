package edu.ups.transfer;


import jakarta.ws.rs.core.Response;

public interface TransferService {

    Response transfer(TransferRequest request);
}
