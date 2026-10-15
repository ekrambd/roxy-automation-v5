package com.bd.fantine.core.network

import com.bd.fantine.core.network.dto.LoginRequest
import com.bd.fantine.core.network.dto.LoginResponse
import com.bd.fantine.core.network.dto.MeResponse
import com.bd.fantine.core.network.dto.OrderDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiService {

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("api/auth/me")
    suspend fun getMe(): Response<MeResponse>

    @GET("api/orders")
    suspend fun getOrders(): Response<List<OrderDto>>

    @PUT("api/orders/{id}")
    suspend fun updateOrderStatus(
        @Path("id") id: String,
        @Body body: Map<String, String>
    ): Response<OrderDto>
}
