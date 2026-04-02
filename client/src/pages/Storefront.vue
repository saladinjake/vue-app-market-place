<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'
import { MapPin, ShieldCheck, Star } from 'lucide-vue-next'

const route = useRoute()
const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})

const sellerProducts = computed(() => {
  return productStore.products.filter(p => p.seller_id === parseInt(route.params.id))
})
</script>

<template>
  <div class="storefront-page">
    <div class="store-banner">
      <div class="container banner-inner">
        <div class="store-profile glass">
          <img src="https://picsum.photos/200" alt="Store Logo" class="store-logo">
          <div class="store-meta">
            <h1>Industrial Solutions Ltd.</h1>
            <div class="meta-row">
              <span><MapPin :size="16" /> Germany</span>
              <span><ShieldCheck :size="16" /> Verified Supplier</span>
              <span><Star :size="16" /> 4.9 (1.2k Reviews)</span>
            </div>
            <p>Leader in industrial pump manufacturing and global distribution since 1995.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container store-content">
      <div class="content-header">
        <h2>Seller Products</h2>
        <div class="tabs">
          <button class="active">All Products</button>
          <button>New Arrivals</button>
          <button>Certification</button>
        </div>
      </div>

      <div class="product-grid">
        <ProductCard v-for="p in sellerProducts" :key="p.id" :product="p" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-banner {
  height: 400px;
  background: url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000') center/cover;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding-bottom: 3rem;
}

.store-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent, var(--bg-main));
}

.banner-inner {
  position: relative;
  z-index: 10;
  width: 100%;
}

.store-profile {
  display: flex;
  gap: 2rem;
  padding: 3rem;
  border-radius: var(--radius-lg);
}

.store-logo {
  width: 150px;
  height: 150px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.store-meta h1 { font-size: 3rem; margin-bottom: 0.5rem; }

.meta-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.meta-row span { display: flex; align-items: center; gap: 5px; }

.store-content {
  padding: 5rem 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.tabs { display: flex; gap: 1rem; }
.tabs button {
  background: none;
  border: 1px solid var(--border-glass);
  color: var(--text-secondary);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
}
.tabs button.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .store-profile { flex-direction: column; text-align: center; }
  .meta-row { justify-content: center; flex-wrap: wrap; }
}
</style>
