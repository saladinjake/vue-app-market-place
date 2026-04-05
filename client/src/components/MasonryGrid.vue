<script setup>
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: Array
})
</script>

<template>
  <div class="masonry-grid">
    <ProductCard 
      v-for="p in products" 
      :key="p.id" 
      :product="p" 
    />
  </div>
</template>

<style scoped>
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 450px;
  grid-auto-flow: dense;
  gap: 2rem;
}

@media (max-width: 640px) {
  .masonry-grid {
    grid-template-columns: 1fr;
  }
}
</style>
