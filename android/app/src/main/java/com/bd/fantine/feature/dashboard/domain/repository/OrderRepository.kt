package com.bd.fantine.feature.dashboard.domain.repository

import com.bd.fantine.core.common.Resource
import com.bd.fantine.feature.dashboard.domain.model.DashboardMetrics
import com.bd.fantine.feature.dashboard.domain.model.Order
import kotlinx.coroutines.flow.Flow

interface OrderRepository {
    fun observeOrders(): Flow<List<Order>>
    fun observeMetrics(): Flow<DashboardMetrics>
    suspend fun syncOrders(): Resource<List<Order>>
    suspend fun getOrderById(id: String): Order?
    suspend fun updateOrderStatus(id: String, newStatus: String): Resource<Unit>
    suspend fun checkNewOrdersAndNotify(): Int
}
