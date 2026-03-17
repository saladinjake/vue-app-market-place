<script setup>
import { ref, onMounted, computed } from 'vue'
import { ShoppingCart, User, Search, ChevronDown, Menu, X, Package, Bell, ArrowRight } from 'lucide-vue-next'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'

const productStore = useProductStore()
const cartStore = useCartStore()
const isMenuOpen = ref(false)
const activeMegaMenu = ref(null)
const searchQuery = ref('')
let closeTimer = null

onMounted(() => {
  productStore.fetchMegaMenu()
})

const openMenu = (id) => {
  clearTimeout(closeTimer)
  activeMegaMenu.value = id
}

const closeMenu = () => {
  closeTimer = setTimeout(() => {
    activeMegaMenu.value = null
  }, 120)
}

const keepOpen = () => {
  clearTimeout(closeTimer)
}
</script>

<template>
  <nav class="navbar">
    
    <div class="top-bar">
      <div class="container top-bar-inner">
        <span>Free worldwide shipping on orders over $500 — <strong>Trusted by 10,000+ businesses</strong></span>
        <div class="top-links">
          <router-link to="/seller/signup">Become a Seller</router-link>
          <span class="sep">|</span>
          <router-link to="/admin">Admin Panel</router-link>
          <span class="sep">|</span>
          <a href="#">Help Center</a>
        </div>
      </div>
    </div>

    
    <div class="main-nav">
      <div class="container nav-row">
       
        <router-link to="/" class="logo">
          <div class="logo-mark"><Package :size="18" color="white" /></div>
          <span class="logo-text"><span class="gradient-text">B2B</span>Market</span>
        </router-link>

       
        <div class="search-wrap">
          <Search :size="17" class="s-icon" />
          <input v-model="searchQuery" type="text" placeholder="Search products, suppliers, categories…" />
          <router-link :to="searchQuery ? `/products?search=${searchQuery}` : '/products'" class="s-btn btn-primary">
            Search
          </router-link>
        </div>

        
        <div class="nav-controls">
          <router-link to="/login" class="ctrl-btn">
            <User :size="20" />
            <span>Account</span>
          </router-link>
          <router-link to="/cart" class="ctrl-btn cart-ctrl">
            <ShoppingCart :size="20" />
            <span>Cart</span>
            <transition name="pop">
              <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
            </transition>
          </router-link>
          <button class="ctrl-btn mobile-only" @click="isMenuOpen = !isMenuOpen">
            <component :is="isMenuOpen ? X : Menu" :size="22" />
          </button>
        </div>
      </div>
    </div>

   
    <div class="cat-ribbon">
      <div class="container ribbon-row">
        <div
          v-for="cat in productStore.megaMenu"
          :key="cat.id"
          class="ribbon-item"
          @mouseenter="openMenu(cat.id)"
          @mouseleave="closeMenu"
        >
          <span class="ribbon-link" :class="{ active: activeMegaMenu === cat.id }">
            <span class="cat-icon">{{ cat.icon }}</span>
            {{ cat.name }}
            <ChevronDown :size="13" class="chevron" :class="{ rotated: activeMegaMenu === cat.id }" />
          </span>

         
        </div>

        <router-link to="/products" class="ribbon-link all-link">🔍 All Products</router-link>
      </div>
    </div>

    <transition name="slide-down">
      <div v-if="isMenuOpen" class="mobile-drawer">
        <div v-for="cat in productStore.megaMenu" :key="cat.id" class="m-item">
          <span class="m-cat">{{ cat.icon }} {{ cat.name }}</span>
        </div>
      </div>
    </transition>
  </nav>

  <div style="height: 142px;"></div>
</template>

<style scoped>

.top-bar {
  background: var(--accent-primary);
  color: white;
  font-size: 0.78rem;
  padding: 0.45rem 0;
  line-height: 1;
}
.top-bar-inner { display: flex; justify-content: space-between; align-items: center; }
.top-links { display: flex; align-items: center; gap: 0.6rem; }
.top-links a { color: rgba(255,255,255,0.85); text-decoration: none; }
.top-links a:hover { color: #fff; text-decoration: underline; }
.sep { opacity: 0.4; }


.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 12px rgba(15,23,42,0.08);
}

</style>
