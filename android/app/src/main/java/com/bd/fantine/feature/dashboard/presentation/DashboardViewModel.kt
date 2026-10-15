package com.bd.fantine.feature.dashboard.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.bd.fantine.core.common.Resource
import com.bd.fantine.feature.auth.domain.repository.AuthRepository
import com.bd.fantine.feature.dashboard.domain.model.Order
import com.bd.fantine.feature.dashboard.domain.repository.OrderRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

class DashboardViewModel(
    private val orderRepository: OrderRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardUiState(isLoading = true))
    val uiState = _uiState.asStateFlow()

    init {
        observeDatabase()
        initialSync()
        startPeriodicSyncTicker()
    }

    private fun observeDatabase() {
        viewModelScope.launch {
            orderRepository.observeOrders().collectLatest { orders ->
                _uiState.update { current ->
                    val filtered = applyFilter(orders, current.selectedStatusFilter, current.searchQuery)
                    current.copy(
                        orders = orders,
                        filteredOrders = filtered,
                        isLoading = false
                    )
                }
            }
        }

        viewModelScope.launch {
            orderRepository.observeMetrics().collectLatest { metrics ->
                _uiState.update { it.copy(metrics = metrics) }
            }
        }
    }

    private fun initialSync() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRefreshing = true) }
            orderRepository.syncOrders()
            _uiState.update { it.copy(isRefreshing = false) }
        }
    }

    // Foreground Ticker: Checks for brand-new orders every 30 seconds and fires system notifications
    private fun startPeriodicSyncTicker() {
        viewModelScope.launch {
            while (isActive) {
                delay(30_000)
                try {
                    orderRepository.checkNewOrdersAndNotify()
                } catch (e: Exception) {
                    // non-blocking
                }
            }
        }
    }

    fun onAction(action: DashboardAction) {
        when (action) {
            DashboardAction.Refresh -> refreshOrders()
            is DashboardAction.FilterSelected -> {
                _uiState.update { current ->
                    val filtered = applyFilter(current.orders, action.status, current.searchQuery)
                    current.copy(selectedStatusFilter = action.status, filteredOrders = filtered)
                }
            }
            is DashboardAction.SearchChanged -> {
                _uiState.update { current ->
                    val filtered = applyFilter(current.orders, current.selectedStatusFilter, action.query)
                    current.copy(searchQuery = action.query, filteredOrders = filtered)
                }
            }
            is DashboardAction.UpdateOrderStatus -> {
                viewModelScope.launch {
                    orderRepository.updateOrderStatus(action.orderId, action.newStatus)
                }
            }
            is DashboardAction.SelectOrder -> {
                val order = _uiState.value.orders.find { it.id == action.orderId }
                _uiState.update { it.copy(selectedOrder = order) }
            }
            DashboardAction.Logout -> {
                viewModelScope.launch {
                    authRepository.logout()
                }
            }
            DashboardAction.DismissError -> {
                _uiState.update { it.copy(errorMessage = null) }
            }
        }
    }

    private fun refreshOrders() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRefreshing = true, errorMessage = null) }
            when (val res = orderRepository.syncOrders()) {
                is Resource.Success -> {
                    _uiState.update { it.copy(isRefreshing = false) }
                }
                is Resource.Error -> {
                    _uiState.update { it.copy(isRefreshing = false, errorMessage = res.message) }
                }
                Resource.Loading -> {}
            }
        }
    }

    private fun applyFilter(orders: List<Order>, status: String, query: String): List<Order> {
        val q = query.trim().lowercase()
        return orders.filter { order ->
            val matchesStatus = if (status == "All") true else {
                order.status.equals(status, ignoreCase = true)
            }
            val matchesQuery = if (q.isEmpty()) true else {
                order.id.lowercase().contains(q) ||
                order.customerName.lowercase().contains(q) ||
                order.phone.contains(q) ||
                order.district.lowercase().contains(q)
            }
            matchesStatus && matchesQuery
        }
    }

    class Factory(
        private val orderRepository: OrderRepository,
        private val authRepository: AuthRepository
    ) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return DashboardViewModel(orderRepository, authRepository) as T
        }
    }
}
