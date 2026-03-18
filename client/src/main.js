import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'
import App from './App.vue'


const routes = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/login', component: () => import('./pages/Login.vue') },
  { path: '/signup', component: () => import('./pages/Signup.vue') },
  { path: '/products', component: () => import('./pages/Products.vue') },
  { path: '/cart', component: () => import('./pages/Cart.vue') },
  { path: '/checkout', component: () => import('./pages/Checkout.vue') },
  { path: '/orders/:id', component: () => import('./pages/OrderDetail.vue') },
  { path: '/dashboard', component: () => import('./pages/Dashboard.vue') },
  { path: '/orders', component: () => import('./pages/Dashboard.vue') }, //same page 

  { path: '/seller/signup', component: () => import('./pages/SellerSignup.vue') },
  { path: '/seller/setup', component: () => import('./pages/SellerSignup.vue') },



]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
