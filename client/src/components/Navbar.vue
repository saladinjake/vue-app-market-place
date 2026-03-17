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

         
          <transition name="mega-fade">
            <div
              v-if="activeMegaMenu === cat.id"
              class="mega-drop"
              @mouseenter="keepOpen"
              @mouseleave="closeMenu"
            >
              <div class="mega-inner">
              
                <div class="mega-cats">
                  <p class="mega-label">{{ cat.icon }} {{ cat.name }}</p>
                  <p class="mega-desc">{{ cat.description }}</p>
                  <ul class="sub-list">
                    <li v-for="sub in cat.subcategories" :key="sub.id">
                      <router-link
                        :to="`/products?category=${sub.id}`"
                        class="sub-link"
                        @click="activeMegaMenu = null"
                      >
                        <span class="sub-dot"></span>
                        {{ sub.name }}
                        <ArrowRight :size="13" class="sub-arrow" />
                      </router-link>
                    </li>
                  </ul>
                  <router-link
                    :to="`/products?category=${cat.id}`"
                    class="see-all-btn btn-primary"
                    @click="activeMegaMenu = null"
                  >
                    View all {{ cat.name }}
                  </router-link>
                </div>

                <div class="mega-divider"></div>

               
                <MegaSlider :slides="cat.slides" />
              </div>
            </div>
          </transition>
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

<script>

import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
const MegaSlider = defineComponent({
  name: 'MegaSlider',
  props: { slides: Array },
  setup(props) {
    const idx = ref(0)
    let timer = null
    const next = () => { idx.value = (idx.value + 1) % props.slides.length }
    onMounted(() => { timer = setInterval(next, 3500) })
    onUnmounted(() => clearInterval(timer))
    return { idx }
  },
  template: `
    <div class="mega-slider" v-if="slides && slides.length">
      <div class="slide-wrap">
        <transition-group name="slide-fade" tag="div" class="slides-container">
          <div v-for="(sl, i) in slides" :key="sl.id || i" v-show="idx === i" class="slide-item">
            <img :src="sl.image" :alt="sl.title" />
            <div class="slide-caption">
              <span class="slide-tag">Featured</span>
              <h4>{{ sl.title }}</h4>
              <p>{{ sl.subtitle }}</p>
              <a :href="sl.cta_link || '#'" class="slide-cta">{{ sl.cta_label }} →</a>
            </div>
          </div>
        </transition-group>
        <div class="slide-dots">
          <button
            v-for="(_, i) in slides"
            :key="i"
            class="s-dot"
            :class="{ active: idx === i }"
            @click="idx = i"
          ></button>
        </div>
      </div>
    </div>
  `
})
</script>

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


.main-nav { padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
.nav-row { display: flex; align-items: center; gap: 1.5rem; }


.logo { display: flex; align-items: center; gap: 0.55rem; text-decoration: none; flex-shrink: 0; }
.logo-mark {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary));
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
}
.logo-text { font-size: 1.3rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }


.search-wrap {
  flex: 1;
  display: flex; align-items: center;
  background: var(--bg-surface);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding-left: 1rem;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-wrap:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
  background: #fff;
}
.s-icon { color: var(--text-muted); flex-shrink: 0; }
.search-wrap input {
  flex: 1; border: none; background: transparent; outline: none;
  font-family: 'Outfit', sans-serif; font-size: 0.88rem;
  color: var(--text-primary); padding: 0.65rem 0.75rem; min-width: 0;
}
.s-btn { border-radius: 0; padding: 0.65rem 1.4rem; box-shadow: none; font-size: 0.88rem; }


.nav-controls { display: flex; gap: 0.35rem; flex-shrink: 0; }
.ctrl-btn {
  display: flex; flex-direction: column; align-items: center; gap: 0.1rem;
  font-size: 0.68rem; font-weight: 600; color: var(--text-secondary);
  text-decoration: none; padding: 0.5rem 0.8rem;
  border: none; background: transparent; cursor: pointer;
  border-radius: 8px; transition: all 0.2s; position: relative;
  font-family: 'Outfit', sans-serif;
}
.ctrl-btn:hover { color: var(--accent-primary); background: var(--accent-primary-light); }
.cart-badge {
  position: absolute; top: 2px; right: 2px;
  background: #ef4444; color: #fff;
  font-size: 0.6rem; font-weight: 800;
  min-width: 17px; height: 17px;
  border-radius: 100px; display: flex; align-items: center; justify-content: center;
  padding: 0 3px; border: 2px solid #fff;
}
.mobile-only { display: none; }
.cat-ribbon { background: #fff; border-top: 1px solid var(--border); }
.ribbon-row {
  display: flex; align-items: stretch;
  overflow-x: auto; scrollbar-width: none;
}
.ribbon-row::-webkit-scrollbar { display: none; }

.ribbon-item { position: relative; }

.ribbon-link {
  display: flex; align-items: center; gap: 0.3rem;
  padding: 0.65rem 0.9rem;
  font-size: 0.85rem; font-weight: 500;
  color: var(--text-secondary); text-decoration: none;
  white-space: nowrap; cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.ribbon-link:hover, .ribbon-link.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}
.all-link { color: var(--accent-primary); font-weight: 700; }
.cat-icon { font-size: 0.9em; }
.chevron { transition: transform 0.25s; flex-shrink: 0; }
.chevron.rotated { transform: rotate(180deg); }

.mega-drop {
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  width: 780px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 0 16px 16px 16px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: 200;
}

.mega-inner {
  display: grid;
  grid-template-columns: 260px 1px 1fr;
  min-height: 320px;
}


.mega-cats {
  padding: 1.75rem 1.5rem;
  display: flex; flex-direction: column;
}
.mega-label {
  font-weight: 800; font-size: 1rem;
  color: var(--text-primary); margin-bottom: 0.3rem;
}
.mega-desc {
  font-size: 0.78rem; color: var(--text-muted);
  margin-bottom: 1.25rem; line-height: 1.4;
}
.sub-list { list-style: none; flex: 1; margin-bottom: 1.25rem; }
.sub-link {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.42rem 0;
  font-size: 0.875rem; color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.18s;
}
.sub-link:hover { color: var(--accent-primary); padding-left: 4px; }
.sub-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--border-strong); flex-shrink: 0;
  transition: background 0.2s;
}
.sub-link:hover .sub-dot { background: var(--accent-primary); }
.sub-arrow {
  margin-left: auto; opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
}
.sub-link:hover .sub-arrow { opacity: 1; transform: translateX(3px); }

.see-all-btn {
  padding: 0.55rem 1.2rem; font-size: 0.82rem;
  text-decoration: none; text-align: center;
}


.mega-divider { background: var(--border); }


</style>
 
<style>
.mega-slider { padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; }
.slide-wrap { position: relative; border-radius: 12px; overflow: hidden; background: var(--bg-surface); }
.slides-container { position: relative; height: 260px; }
.slide-item {
  position: absolute; inset: 0;
  border-radius: 12px; overflow: hidden;
}
.slide-item img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 6s ease;
}
.slide-item:hover img { transform: scale(1.05); }
.slide-caption {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 1.25rem 1.25rem 1rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.75));
  color: white;
}
.slide-tag {
  display: inline-block;
  background: var(--accent-primary);
  color: white; font-size: 0.65rem; font-weight: 700;
  padding: 0.2rem 0.6rem; border-radius: 100px;
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 0.4rem;
}
.slide-caption h4 { font-size: 1rem; font-weight: 700; margin-bottom: 0.2rem; }
.slide-caption p { font-size: 0.78rem; opacity: 0.85; margin-bottom: 0.6rem; }
.slide-cta {
  font-size: 0.8rem; font-weight: 700; color: white;
  text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.5);
  transition: border-color 0.2s;
}
.slide-cta:hover { border-color: white; }
.slide-dots {
  display: flex; justify-content: center; gap: 6px;
  padding: 0.5rem 0 0;
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
}
.s-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,0.45); border: none; cursor: pointer;
  transition: all 0.25s; padding: 0;
}
.s-dot.active { background: white; width: 20px; border-radius: 4px; }

.slide-fade-enter-active { transition: opacity 0.6s ease, transform 0.6s ease; }
.slide-fade-leave-active { transition: opacity 0.4s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(20px); }
.slide-fade-leave-to { opacity: 0; }


.mega-fade-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.mega-fade-leave-active { transition: opacity 0.15s ease; }
.mega-fade-enter-from { opacity: 0; transform: translateY(8px); }
.mega-fade-leave-to { opacity: 0; }

.pop-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.pop-enter-from { opacity: 0; transform: scale(0.4); }

@media (max-width: 768px) {
  .search-wrap { display: none; }
  .mobile-only { display: flex !important; }
  .cat-ribbon { display: none; }
}

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
.mobile-drawer {
  background: #fff; border-top: 1px solid var(--border);
  padding: 0.5rem 1.5rem;
}
.m-item { padding: 0.8rem 0; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
.m-cat { font-weight: 600; color: var(--text-primary); cursor: pointer; }
</style>
