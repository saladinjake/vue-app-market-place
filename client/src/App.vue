<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="app-container">
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <footer class="glass-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <h2 class="gradient-text">B2B MARKET</h2>
          <p>The premium global marketplace for high-volume transactions and industrial sourcing.</p>
        </div>
        <div class="footer-links">
          <h4>Marketplace</h4>
          <router-link to="/products">All Products</router-link>
          <router-link to="/seller/signup">Become a Seller</router-link>
          <router-link to="/categories">Categories</router-link>
        </div>
        <div class="footer-links">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Security</a>
          <a href="#">Logistics</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 B2B Marketplace.</p>
      </div>
    </footer>
  </div>
</template>

<style>
.page-enter-active, .page-leave-active {
  transition: all 0.5s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.glass-footer {
  margin-top: 10rem;
  padding: 5rem 0 2rem;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid var(--border-glass);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
}

.footer-brand h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.footer-brand p {
  color: var(--text-secondary);
  max-width: 400px;
}

.footer-links h4 {
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.footer-links a {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: var(--transition-smooth);
}

.footer-links a:hover {
  color: var(--accent-primary);
  padding-left: 5px;
}

.footer-bottom {
  text-align: center;
  margin-top: 5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-glass);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .footer-brand p {
    margin: 0 auto;
  }
}
</style>
