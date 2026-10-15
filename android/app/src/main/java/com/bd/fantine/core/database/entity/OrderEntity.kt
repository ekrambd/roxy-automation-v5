package com.bd.fantine.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "orders")
data class OrderEntity(
    @PrimaryKey
    val id: String,
    val customerName: String,
    val phone: String,
    val address: String,
    val district: String,
    val totalAmount: Double,
    val deliveryCharge: Double,
    val paymentMethod: String,
    val status: String,
    val createdAt: String,
    val itemsSummary: String,
    val notes: String
)
