<script setup>
import { ref } from 'vue'
import { Building2, Globe, FileText, CheckCircle, ArrowRight } from 'lucide-vue-next'
const step = ref(1)
const form = ref({
  companyName: '',
  businessReg: '',
  website: '',
  category: '',
  description: ''
})

const nextStep = () => {
  if (step.value < 3) step.value++
  else window.location.href = '/dashboard'
}
</script>

<template>
  <div class="seller-signup-page">
    <div class="container signup-container">
      <div class="stepper">
        <div v-for="i in 3" :key="i" class="step-dot" :class="{ active: step >= i, current: step === i }">
          <span v-if="step > i"><CheckCircle :size="16" /></span>
          <span v-else>{{ i }}</span>
        </div>
      </div>

      <div class="signup-card glass">
        <div v-if="step === 1" class="step-content animate-fade-in">
          <div class="header">
            <h1 class="gradient-text">Business Profile</h1>
            <p>Tell us about your company to start selling globally.</p>
          </div>
          <div class="form-grid">
            <div class="input-group">
              <label><Building2 :size="16" /> Company name</label>
              <input v-model="form.companyName" type="text" placeholder="e.g. Apex Industrial Ltd">
            </div>
            <div class="input-group">
              <label><FileText :size="16" /> Business Registration Number</label>
              <input v-model="form.businessReg" type="text" placeholder="RE-9283-X">
            </div>
            <div class="input-group full">
              <label><Globe :size="16" /> Business Website</label>
              <input v-model="form.website" type="url" placeholder="https://apex-industrial.com">
            </div>
          </div>
        </div>

        <div v-if="step === 2" class="step-content animate-fade-in">
          <div class="header">
            <h1 class="gradient-text">Verification</h1>
            <p>Upload documentation for account verification.</p>
          </div>
          <div class="upload-area">
            <div class="upload-box glass-card">
              <FileText :size="40" />
              <p>Drag and drop certificate of incorporation</p>
              <button class="btn-outline">Browse Files</button>
            </div>
          </div>
        </div>

        <div v-if="step === 3" class="step-content animate-fade-in">
          <div class="header">
            <h1 class="gradient-text">Ready to Go</h1>
            <p>Your application is being processed by our admin team.</p>
          </div>
          <div class="success-illustration">
            <div class="confetti"></div>
            <CheckCircle :size="80" color="var(--accent-secondary)" />
          </div>
        </div>

        <div class="card-footer">
          <button v-if="step > 1" @click="step--" class="btn-text">Back</button>
          <button @click="nextStep" class="btn-primary">
            {{ step === 3 ? 'Go to Dashboard' : 'Next Step' }} <ArrowRight :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seller-signup-page {
  padding: 120px 0;
  min-height: 100vh;
  background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent);
}

.signup-container {
  max-width: 800px;
}

.stepper {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  position: relative;
}

.stepper::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 30%;
  right: 30%;
  height: 2px;
  background: var(--border-glass);
  z-index: 0;
}

.step-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-weight: 700;
  transition: var(--transition-smooth);
}

.step-dot.active {
  background: var(--accent-secondary);
  border-color: var(--accent-secondary);
  color: white;
}

.step-dot.current {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
  transform: scale(1.2);
}

.signup-card {
  padding: 4rem;
  border-radius: var(--radius-lg);
}

.header {
  margin-bottom: 3rem;
  text-align: center;
}

.header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.input-group.full { grid-column: span 2; }

.input-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.input-group input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border-glass);
  padding: 1rem;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  outline: none;
  transition: var(--transition-smooth);
}

.input-group input:focus {
  border-color: var(--accent-secondary);
  background: rgba(255,255,255,0.08);
}

.upload-area {
  padding: 2rem 0;
}

.upload-box {
  border: 2px dashed var(--border-glass);
  padding: 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.upload-box:hover {
  border-color: var(--accent-secondary);
  background: rgba(16, 185, 129, 0.05);
}
.success-illustration {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.card-footer {
  margin-top: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-text {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.btn-outline {
  background: transparent;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-glass);
  cursor: pointer;
}
</style>
