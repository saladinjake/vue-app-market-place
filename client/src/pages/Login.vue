<script setup>
import { ref } from 'vue'
import { Mail, Lock, ArrowRight } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const useAuth = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  console.log(email.value, password.value)
 //await useAuth.login({ body: {email, password}})
 //mocked up auth bcus fix needs doubl chk
  setTimeout(() => {
    loading.value = false
    window.location.href = '/'
  }, 1500)
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card glass">
      <div class="auth-header">
        <h1 class="gradient-text">Welcome Back</h1>
        <p>Login to your B2B account</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>Email Address</label>
          <div class="input-wrapper">
            <Mail :size="20" />
            <input v-model="email" type="email" placeholder="name@company.com" required>
          </div>
        </div>

        <div class="input-group">
          <label>Password</label>
          <div class="input-wrapper">
            <Lock :size="20" />
            <input v-model="password" type="password" placeholder="••••••••" required>
          </div>
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            Remember me
            <input type="checkbox">
            <span class="checkmark"></span>
          </label>
          <router-link to="/forgot-password" class="forgot-link">Forgot password?</router-link>
        </div>

        <button type="submit" class="btn-primary auth-submit" :disabled="loading">
          <span v-if="!loading">Sign In <ArrowRight :size="18" /></span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <div class="auth-footer">
        <p>New to our platform? <router-link to="/signup">Create account</router-link></p>
        <div class="divider"><span>OR</span></div>
        <router-link to="/seller/signup" class="seller-cta">Become a verified Seller</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent);
}

.auth-card {
  width: 100%;
  max-width: 450px;
  padding: 3rem;
  border-radius: var(--radius-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--text-secondary);
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.input-wrapper {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: var(--transition-smooth);
}

.input-wrapper:focus-within {
  border-color: var(--accent-primary);
  background: rgba(255,255,255,0.08);
}

.input-wrapper input {
  background: none;
  border: none;
  color: var(--text-primary);
  width: 100%;
  outline: none;
  font-size: 1rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.forgot-link {
  color: var(--accent-primary);
  text-decoration: none;
}

.auth-submit {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
}

.auth-footer a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
}

.divider {
  margin: 2rem 0;
  position: relative;
  height: 1px;
  background: var(--border-glass);
}

.divider span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #15151a; /* Match card bg approx */
  padding: 0 10px;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.seller-cta {
  display: block;
  padding: 0.75rem;
  border: 1px dashed var(--accent-secondary);
  border-radius: var(--radius-sm);
  color: var(--accent-secondary) !important;
  transition: var(--transition-smooth);
}

.seller-cta:hover {
  background: rgba(16, 185, 129, 0.1);
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
