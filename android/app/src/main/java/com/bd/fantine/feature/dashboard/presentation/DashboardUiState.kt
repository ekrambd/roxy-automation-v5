package com.bd.fantine.feature.dashboard.presentation

import com.bd.fantine.feature.dashboard.domain.model.DashboardMetrics
import com.bd.fantine.feature.dashboard.domain.model.Order

data class DashboardUiState(
    val orders: List<Order> = emptyList(),
    val filteredOrders: List<Order> = emptyList(),
    val metrics: DashboardMetrics = DashboardMetrics(),
    val selectedStatusFilter: String = "All",
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val errorMessage: String? = null,
    val selectedOrder: Order? = null
)

sealed interface DashboardAction {
    data object Refresh : DashboardAction
    data class FilterSelected(val status: String) : DashboardAction
    data class SearchChanged(val query: String) : DashboardAction
    data class UpdateOrderStatus(val orderId: String, val newStatus: String) : DashboardAction
    data class SelectOrder(val orderId: String) : DashboardAction
    data object Logout : DashboardAction
    data object DismissError : DashboardAction
}
