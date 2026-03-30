<script setup>
import { useCartStore } from '../stores/cart'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-vue-next'

const cartStore = useCartStore()
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Shopping Cart</h1>

      <div v-if="cartStore.items.length > 0" class="cart-layout">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item glass-card">
            <img :src="item.images[0]" :alt="item.name" class="item-img">
            
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-meta">Category: Industrial | Supplier: Store {{ item.seller_id }}</p>
              <span class="item-price">${{ item.price }}</span>
            </div>

            <div class="item-quantity">
              <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="qty-btn"><Minus :size="16" /></button>
              <span class="qty-val">{{ item.quantity }}</span>
              <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="qty-btn"><Plus :size="16" /></button>
            </div>

            <div class="item-total">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </div>

            <button @click="cartStore.removeFromCart(item.id)" class="remove-btn">
              <Trash2 :size="20" />
            </button>
          </div>
        </div>

        <aside class="cart-summary glass">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${{ cartStore.totalPrice }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>$45.00</span>
          </div>
          <div class="summary-row">
            <span>Tax (Estimated)</span>
            <span>$12.50</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total">
            <span>Order Total</span>
            <span>${{ (parseFloat(cartStore.totalPrice) + 57.5).toFixed(2) }}</span>
          </div>
          <router-link to="/checkout" class="btn-primary checkout-btn">
            Proceed to Checkout <ArrowRight :size="18" />
          </router-link>
          <p class="b2b-notice">B2B Order: Bulk discounts applied where applicable.</p>
        </aside>
      </div>

      <div v-else class="empty-cart animate-fade-in">
        <ShoppingBag :size="100" class="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any industrial supplies yet.</p>
        <router-link to="/products" class="btn-primary">Start Sourcing</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding-top: 120px;
  min-height: 80vh;
}

.page-title {
  font-size: 3rem;
  margin-bottom: 3rem;
  font-weight: 800;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto 120px auto;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background:#fafafa;
}

.item-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.item-details h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.item-meta {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-price {
  font-weight: 700;
  color: var(--accent-primary);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,255,255,0.05);
  padding: 0.5rem;
  border-radius: var(--radius-sm);
}

.qty-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
}

.qty-val {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.item-total {
  font-weight: 700;
  font-size: 1.1rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.remove-btn:hover {
  transform: scale(1.1);
}

.cart-summary {
  padding: 2.5rem;
  border-radius: var(--radius-md);
  position: sticky;
  top: 120px;
}

.cart-summary h3 {
  margin-bottom: 2rem;
  font-size: 1.25rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.summary-divider {
  height: 1px;
  background: var(--border-glass);
  margin: 1.5rem 0;
}

.total {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 2rem;
}

.checkout-btn {
  width: 100%;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.b2b-notice {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 5rem 0;
}

.empty-icon {
  color: var(--border-glass);
  margin-bottom: 2rem;
}

.empty-cart h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.empty-cart p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}
</style>
