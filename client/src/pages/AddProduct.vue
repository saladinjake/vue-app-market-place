<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { Package, Plus, Image as ImageIcon, Trash2, Save, X } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const categories = ref([])
const loading = ref(false)
const successMessage = ref('')

const form = ref({
  name: '',
  price: '',
  category_id: '',
  description: '',
  stock: '',
  images: [],
  variants: [{ type: 'Color', value: '' }]
})

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5005/api/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
})

const addVariant = () => {
  form.value.variants.push({ type: 'Size', value: '' })
}

const removeVariant = (index) => {
  form.value.variants.splice(index, 1)
}

const handleImageUpload = () => {
  form.value.images.push('https://picsum.photos/seed/' + Math.random() + '/800/600')
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // find seller id for current user
    const sellerRes = await axios.get('http://localhost:5005/api/sellers')
    const seller = sellerRes.data.find(s => s.user_id === authStore.user.id)
    
    if (!seller) {
      alert('You must be a registered seller to add products.')
      return
    }

    const payload = {
      ...form.value,
      seller_id: seller.id,
      images: JSON.stringify(form.value.images),
      variants: JSON.stringify(form.value.variants)
    }

    await axios.post('http://localhost:5005/api/products', payload)
    successMessage.value = 'Product published and awaiting admin approval!'
    setTimeout(() => {
      router.push('/dashboard')
    }, 2500)
  } catch (err) {
    alert('Failed to publish product: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="add-product-page">
    <div class="container maxWidth-md">
      <div class="page-header">
        <h1 class="gradient-text"><Package /> Add New Product</h1>
        <p>List your industrial component on the global marketplace.</p>
      </div>

      <div class="product-form-container glass">
        <form @submit.prevent="handleSubmit" class="main-form">
          <div v-if="successMessage" class="success-banner">{{ successMessage }}</div>
          <!-- Section 1: Basic Info -->
          <div class="form-section">
            <h3><Package :size="20" /> Basic Information</h3>
            <div class="input-grid">
              <div class="input-group">
                <label>Product Name</label>
                <input v-model="form.name" type="text" placeholder="e.g. Industrial Valve XJ-900" required>
              </div>
              <div class="input-group">
                <label>Category</label>
                <select v-model="form.category_id" class="glass-select" required>
                  <option value="">Select Category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="input-group">
                <label>Unit Price ($)</label>
                <input v-model="form.price" type="number" step="0.01" placeholder="0.00" required>
              </div>
              <div class="input-group">
                <label>Stock Quantity</label>
                <input v-model="form.stock" type="number" placeholder="500" required>
              </div>
            </div>
            <div class="input-group full">
              <label>Description</label>
              <textarea v-model="form.description" rows="4" placeholder="Detailed product specifications..."></textarea>
            </div>
          </div>

          <!-- Section 2: Media -->
          <div class="form-section">
            <h3><ImageIcon :size="20" /> Product Images</h3>
            <div class="image-uploader">
              <div 
                v-for="(img, idx) in form.images" 
                :key="idx" 
                class="uploaded-preview"
                :style="{ backgroundImage: `url(${img})` }"
              >
                <button @click="form.images.splice(idx, 1)" class="remove-img"><X :size="14" /></button>
              </div>
              <button @click="handleImageUpload" type="button" class="upload-btn glass-card">
                <Plus :size="24" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          <!-- Section 3: Variants -->
          <div class="form-section">
            <div class="section-header">
              <h3>Variants & Options</h3>
              <button @click="addVariant" type="button" class="btn-text">+ Add Variant</button>
            </div>
            <div class="variants-list">
              <div v-for="(v, idx) in form.variants" :key="idx" class="variant-row animate-fade-in">
                <select v-model="v.type" class="glass-select-sm">
                  <option>Color</option>
                  <option>Size</option>
                  <option>Material</option>
                  <option>Voltage</option>
                </select>
                <input v-model="v.value" type="text" placeholder="e.g. Stainless Steel" class="glass-input-sm">
                <button @click="removeVariant(idx)" type="button" class="btn-icon danger"><Trash2 :size="18" /></button>
              </div>
            </div>
          </div>

          <div class="form-footer">
            <button class="btn-outline">Cancel</button>
            <button type="submit" class="btn-primary"><Save :size="18" /> Publish Product</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-product-page {
  padding: 120px 0;
  min-height: 100vh;
}

.maxWidth-md { max-width: 900px; }

.page-header { margin-bottom: 3rem; text-align: center; }
.page-header h1 { display: flex;
     align-items: center; 
     justify-content: center; 
     gap: 1rem; font-size: 2.5rem; 
     }

.product-form-container {
  padding: 3rem;
  border-radius: var(--radius-lg);
}

.success-banner {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--accent-secondary);
  color: var(--accent-secondary);
  padding: 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 2.5rem;
  text-align: center;
  font-weight: 600;
}

.form-section {
  margin-bottom: 4rem;
}

.form-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
  font-size: 1.25rem;
  color: var(--accent-primary);
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.input-group input, .input-group textarea, .glass-select {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border-glass);
  padding: 0.8rem 1rem;
  border-radius: var(--radius-sm);
  color: white;
  outline: none;
}

.image-uploader {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.uploaded-preview {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-sm);
  background-size: cover;
  background-position: center;
  position: relative;
}

.remove-img {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.upload-btn {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: none;
  border: 1px dashed var(--border-glass);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.upload-btn:hover {
  border-color: var(--accent-primary);
  color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.variant-row {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 1.5rem;
  margin-bottom: 1rem;
  align-items: center;
}

.glass-select-sm, .glass-input-sm {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border-glass);
  padding: 0.6rem;
  border-radius: var(--radius-sm);
  color: white;
}

.btn-icon.danger { color: #ef4444;
     background: none; border: none;
      cursor: pointer; }

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-glass);
}

.btn-text { background: none;
 border: none; color: var(--accent-primary);
  cursor: pointer; font-weight: 600; }
</style>
