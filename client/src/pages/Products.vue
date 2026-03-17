<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'
import { Filter, Search, ChevronRight } from 'lucide-vue-next'

const productStore = useProductStore()
const searchQuery = ref('')
const selectedCategory = ref('all')
const priceRange = ref(500)

onMounted(() => {
  productStore.fetchProducts()
  productStore.fetchCategories()
})

const filteredProducts = computed(() => {
  return productStore.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'all' || p.category_id === parseInt(selectedCategory.value)
    const matchesPrice = p.price <= priceRange.value
    return matchesSearch && matchesCategory && matchesPrice
  })
})
</script>

<template>
  <div class="products-page">
    <div class="container page-layout">
      <!-- Sidebar Filters -->
      <aside class="filters glass">
        <div class="filter-section">
          <h3>Search</h3>
          <div class="search-box">
            <Search :size="18" />
            <input v-model="searchQuery" type="text" placeholder="Search products...">
          </div>
        </div>

        <div class="filter-section">
          <h3>Categories</h3>
          <select v-model="selectedCategory" class="glass-select">
            <option value="all">All Categories</option>
            <option v-for="cat in productStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="filter-section">
          <h3>Price Range (${{ priceRange }})</h3>
          <input type="range" v-model="priceRange" min="0" max="1000" class="range-slider">
        </div>

        <div class="filter-section">
          <h3>Availability</h3>
          <label class="checkbox-container">
            In Stock Only
            <input type="checkbox" checked>
            <span class="checkmark"></span>
          </label>
        </div>
      </aside>

     
      <main class="results">
        <div class="results-header">
          <p>{{ filteredProducts.length }} products found</p>
          <div class="sort-box">
            <span>Sort by:</span>
            <select class="glass-select-sm">
              <option>Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div class="product-grid">
          <ProductCard 
            v-for="p in filteredProducts" 
            :key="p.id" 
            :product="p"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  padding-top: 120px;
  min-height: 100vh;
}

.page-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
}

.filters {
  padding: 2rem;
  height: fit-content;
  position: sticky;
  top: 120px;
  border-radius: var(--radius-md);
  background: #fff;
  
}

.filter-section {
  margin-bottom: 2.5rem;
}

.filter-section h3 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.search-box {
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box input {
  background: none;
  border: 1px solid #eaeaea;
  color: black;
  width: 100%;
  outline: none;
  padding:14px;
}

.glass-select, .glass-select-sm {
  width: 100%;
  background: var(--bg-card);
  color: black;
  border: 1px solid var(--border-glass);
  padding: 0.75rem;
  border-radius: var(--radius-sm);

}

.glass-select-sm {
  width: auto;
  padding: 0.4rem 1rem;
}

.range-slider {
  width: 100%;
  accent-color: var(--accent-primary);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

@media (max-width: 1024px) {
  .page-layout {
    grid-template-columns: 1fr;
  }
  .filters {
    position: relative;
    top: 0;
  }
}
</style>
