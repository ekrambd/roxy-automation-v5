package com.bd.fantine.feature.dashboard.presentation

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.PendingActions
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bd.fantine.feature.dashboard.domain.model.Order
import com.bd.fantine.ui.theme.BrandGold
import com.bd.fantine.ui.theme.BrandGoldDark
import com.bd.fantine.ui.theme.BrandGoldLight
import com.bd.fantine.ui.theme.LightSlate
import com.bd.fantine.ui.theme.MutedSlate
import com.bd.fantine.ui.theme.Obsidian
import com.bd.fantine.ui.theme.ObsidianBorder
import com.bd.fantine.ui.theme.ObsidianCard
import com.bd.fantine.ui.theme.PureWhite
import com.bd.fantine.ui.theme.SilkWhite
import com.bd.fantine.ui.theme.StatusCancelledBg
import com.bd.fantine.ui.theme.StatusCancelledText
import com.bd.fantine.ui.theme.StatusConfirmedBg
import com.bd.fantine.ui.theme.StatusConfirmedText
import com.bd.fantine.ui.theme.StatusDeliveredBg
import com.bd.fantine.ui.theme.StatusDeliveredText
import com.bd.fantine.ui.theme.StatusPendingBg
import com.bd.fantine.ui.theme.StatusPendingText
import com.bd.fantine.ui.theme.StatusShippedBg
import com.bd.fantine.ui.theme.StatusShippedText

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel,
    onOrderClick: (String) -> Unit,
    onLogoutNav: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    var showLogoutDialog by remember { mutableStateOf(false) }

    val filterOptions = listOf("All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled")

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .background(BrandGold.copy(alpha = 0.2f), shape = CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "И",
                                color = BrandGold,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                fontFamily = FontFamily.Serif
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "FAИTIИE ADMIN",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 2.sp,
                                color = BrandGoldLight
                            )
                            Text(
                                text = "Live Order Management",
                                fontSize = 10.sp,
                                color = MutedSlate
                            )
                        }
                    }
                },
                actions = {
                    IconButton(
                        onClick = { viewModel.onAction(DashboardAction.Refresh) }
                    ) {
                        if (state.isRefreshing) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = BrandGold,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = BrandGold)
                        }
                    }

                    IconButton(
                        onClick = { showLogoutDialog = true }
                    ) {
                        Icon(Icons.Default.ExitToApp, contentDescription = "Logout", tint = MutedSlate)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Obsidian,
                    titleContentColor = PureWhite
                )
            )
        },
        containerColor = Obsidian
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Metrics Summary Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = "Total Sales",
                    value = "৳${String.format("%,.0f", state.metrics.totalRevenue)}",
                    icon = Icons.Default.ShoppingCart,
                    tint = BrandGold
                )
                MetricCard(
                    title = "Pending Orders",
                    value = state.metrics.pendingOrders.toString(),
                    icon = Icons.Default.PendingActions,
                    tint = StatusPendingText
                )
                MetricCard(
                    title = "Delivered",
                    value = state.metrics.deliveredOrders.toString(),
                    icon = Icons.Default.CheckCircle,
                    tint = StatusDeliveredText
                )
                MetricCard(
                    title = "Total Orders",
                    value = state.metrics.totalOrders.toString(),
                    icon = Icons.Default.LocalShipping,
                    tint = LightSlate
                )
            }

            // Search Bar
            OutlinedTextField(
                value = state.searchQuery,
                onValueChange = { viewModel.onAction(DashboardAction.SearchChanged(it)) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                placeholder = { Text("Search by customer, phone, order #", color = MutedSlate, fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = BrandGold) },
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = BrandGold,
                    unfocusedBorderColor = ObsidianBorder,
                    focusedTextColor = PureWhite,
                    unfocusedTextColor = PureWhite,
                    cursorColor = BrandGold
                )
            )

            // Status Filter Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                filterOptions.forEach { status ->
                    val isSelected = state.selectedStatusFilter == status
                    FilterChip(
                        selected = isSelected,
                        onClick = { viewModel.onAction(DashboardAction.FilterSelected(status)) },
                        label = {
                            Text(
                                text = status,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = BrandGold,
                            selectedLabelColor = Obsidian,
                            containerColor = ObsidianCard,
                            labelColor = LightSlate
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = isSelected,
                            borderColor = if (isSelected) BrandGold else ObsidianBorder
                        )
                    )
                }
            }

            // Order List Content
            if (state.isLoading && state.orders.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = BrandGold)
                }
            } else if (state.filteredOrders.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "No orders found",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = LightSlate
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (state.searchQuery.isNotEmpty()) "Try a different search term" else "Pull down to refresh live orders",
                            fontSize = 12.sp,
                            color = MutedSlate
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(
                        items = state.filteredOrders,
                        key = { it.id }
                    ) { order ->
                        OrderCard(
                            order = order,
                            onOrderClick = { onOrderClick(order.id) },
                            onCallClick = {
                                if (order.phone.isNotBlank()) {
                                    val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${order.phone}"))
                                    context.startActivity(dialIntent)
                                }
                            },
                            onStatusChange = { newStatus ->
                                viewModel.onAction(DashboardAction.UpdateOrderStatus(order.id, newStatus))
                            }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
            }
        }
    }

    // Logout Confirmation Dialog
    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = { Text("Log Out Admin Session?") },
            text = { Text("You will need to re-enter your admin credentials to access the live dashboard.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showLogoutDialog = false
                        viewModel.onAction(DashboardAction.Logout)
                        onLogoutNav()
                    }
                ) {
                    Text("LOG OUT", color = StatusCancelledText, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text("CANCEL", color = LightSlate)
                }
            },
            containerColor = ObsidianCard,
            titleContentColor = PureWhite,
            textContentColor = LightSlate
        )
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    icon: ImageVector,
    tint: Color
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = ObsidianCard),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = Brush.verticalGradient(listOf(tint.copy(alpha = 0.35f), ObsidianBorder))
        ),
        modifier = Modifier.width(140.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = title, fontSize = 11.sp, color = MutedSlate, maxLines = 1)
                Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(16.dp))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = value,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = PureWhite
            )
        }
    }
}

@Composable
fun OrderCard(
    order: Order,
    onOrderClick: () -> Unit,
    onCallClick: () -> Unit,
    onStatusChange: (String) -> Unit
) {
    var showStatusDropdown by remember { mutableStateOf(false) }
    val statuses = listOf("Pending", "Confirmed", "Shipped", "Delivered", "Cancelled")

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onOrderClick() },
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = ObsidianCard),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = Brush.verticalGradient(listOf(ObsidianBorder, ObsidianBorder))
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Card Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "#${order.id}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = BrandGoldLight
                    )
                    Text(
                        text = order.createdAt.take(16).replace("T", " "),
                        fontSize = 11.sp,
                        color = MutedSlate
                    )
                }

                // Status Badge with Dropdown
                Box {
                    StatusBadge(
                        status = order.status,
                        onClick = { showStatusDropdown = true }
                    )
                    DropdownMenu(
                        expanded = showStatusDropdown,
                        onDismissRequest = { showStatusDropdown = false },
                        modifier = Modifier.background(ObsidianCard)
                    ) {
                        statuses.forEach { st ->
                            DropdownMenuItem(
                                text = { Text(st, color = PureWhite, fontSize = 13.sp) },
                                onClick = {
                                    showStatusDropdown = false
                                    onStatusChange(st)
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Customer Name & Quick Call Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = order.customerName,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp,
                        color = PureWhite
                    )
                    Text(
                        text = "${order.address}, ${order.district}",
                        fontSize = 12.sp,
                        color = LightSlate,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                if (order.phone.isNotBlank()) {
                    IconButton(
                        onClick = onCallClick,
                        modifier = Modifier
                            .size(36.dp)
                            .background(BrandGold.copy(alpha = 0.15f), CircleShape)
                    ) {
                        Icon(
                            Icons.Default.Call,
                            contentDescription = "Call Customer",
                            tint = BrandGold,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Items Summary
            if (order.items.isNotEmpty()) {
                val itemText = order.items.joinToString(", ") { "${it.title} × ${it.quantity}" }
                Text(
                    text = itemText,
                    fontSize = 12.sp,
                    color = MutedSlate,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(10.dp))
            }

            // Footer Price & Payment
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = order.paymentMethod,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MutedSlate
                )

                Text(
                    text = "৳${String.format("%,.0f", order.totalAmount)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = BrandGold
                )
            }
        }
    }
}

@Composable
fun StatusBadge(status: String, onClick: () -> Unit) {
    val (bgColor, textColor) = when (status.lowercase()) {
        "pending" -> StatusPendingBg to StatusPendingText
        "confirmed", "packaging", "ready for shipment" -> StatusConfirmedBg to StatusConfirmedText
        "shipped" -> StatusShippedBg to StatusShippedText
        "delivered" -> StatusDeliveredBg to StatusDeliveredText
        "cancelled", "return" -> StatusCancelledBg to StatusCancelledText
        else -> StatusPendingBg to StatusPendingText
    }

    Box(
        modifier = Modifier
            .background(bgColor, RoundedCornerShape(8.dp))
            .clickable { onClick() }
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = "$status ▾",
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold
        )
    }
}
