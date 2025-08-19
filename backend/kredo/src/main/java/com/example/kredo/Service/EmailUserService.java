package com.example.kredo.Service;

import com.example.kredo.DTO.RequestResponse;

public interface EmailUserService {

    RequestResponse register(RequestResponse registerRequest);
    RequestResponse verifyOtp(String email,String otp);

}