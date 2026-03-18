<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { LayoutDashboard, ShoppingBag, Users, Settings, Package, BarChart3, Plus, ChevronRight } from 'lucide-vue-next'
import { useOrderStore } from '../stores/orders'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const role = ref(authStore.user?.role || 'customer')
const activeTab = ref('overview')
const orderStore = useOrderStore()

onMounted(() => {
  if (authStore.user?.id) {
    orderStore.fetchOrders(authStore.user.id)
  }
})

watch(activeTab, (newTab) => {
  if ((newTab === 'orders' || newTab === 'overview') && authStore.user?.id) {
    orderStore.fetchOrders(authStore.user.id)
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const stats = [
  { label: 'Total Orders', value: '1,284', icon: ShoppingBag, color: 'blue' },
  { label: 'Active Products', value: '42', icon: Package, color: 'emerald' },
  { label: 'Revenue', value: '$48,290', icon: BarChart3, color: 'violet' },
  { label: 'Pending Approvals', value: '3', icon: Settings, color: 'orange' },
]
</script>

<template>
  <div class="dashboard-page">
    <div class="container dash-layout">
      <!-- Sidebar -->
      <aside class="dash-sidebar glass">
        <div class="user-profile">
          <div class="avatar">{{ authStore.user?.name ? authStore.user.name.charAt(0) : (authStore.user?.email ? authStore.user.email.charAt(0).toUpperCase() : 'U') }}</div>
          <div class="profile-info">
            <h4>{{ authStore.user?.name || authStore.user?.email || 'User' }}</h4>
            <span>{{ authStore.user?.role || 'Customer' }}</span>
          </div>
        </div>

        <nav class="dash-nav">
          <button 
            v-for="tab in ['overview', 'products', 'orders', 'customers', 'settings']" 
            :key="tab"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            <component :is="activeTab === tab ? LayoutDashboard : Package" :size="20" />
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </nav>

        <div class="sidebar-footer">
          <button class="btn-logout" @click="handleLogout">Sign Out</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="dash-content">
        <header class="dash-header">
          <div>
            <h1>{{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }}</h1>
            <p>Welcome back, here's what's happening with your store today.</p>
          </div>
          <router-link v-if="role === 'seller'" to="/seller/add-product" class="btn-primary">
            <Plus :size="18" /> Add Product
          </router-link>
        </header>

        <div v-if="activeTab === 'overview'" class="overview-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-card glass-card">
            <div class="stat-icon" :class="stat.color">
              <component :is="stat.icon" :size="24" />
            </div>
            <div class="stat-info">
              <span>{{ stat.label }}</span>
              <h3>{{ stat.value }}</h3>
            </div>
          </div>
        </div>

        <!-- Recent Orders Table -->
        <div v-if="activeTab === 'overview' || activeTab === 'orders'" class="table-container glass">
          <h3>{{ activeTab === 'overview' ? 'Recent Orders' : 'All Orders' }}</h3>
          <table class="dash-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orderStore.orders" :key="order.id">
                <td>#{{ order.id }}</td>
                <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
                <td><span class="status-badge" :class="order.status">{{ order.status }}</span></td>
                <td>${{ order.total_amount }}</td>
                <td>
                  <router-link :to="'/orders/' + order.id" class="btn-view">
                    View Details <ChevronRight :size="14" />
                  </router-link>
                </td>
              </tr>
              <tr v-if="orderStore.orders.length === 0">
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No orders found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  padding-top: 120px;
  background: radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.05), transparent);
}

.dash-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  min-height: 80vh;
}

.dash-sidebar {
  padding: 2rem;
  border-radius: var(--radius-md);
  height: fit-content;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-glass);
}

.avatar {
  width: 50px;
  height: 50px;
  background: var(--accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
}

.profile-info h4 { font-size: 1rem; }
.profile-info span { font-size: 0.8rem; color: var(--text-secondary); }

.dash-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dash-nav button {
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 1rem;
  text-align: left;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition-smooth);
}

.dash-nav button:hover, .dash-nav button.active {
  background: rgba(255,255,255,0.05);
  color: white;
}

.dash-nav button.active {
  border-left: 3px solid var(--accent-primary);
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.dash-header h1 { font-size: 2.5rem; }
.dash-header p { color: var(--text-secondary); }

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.stat-icon.emerald { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.stat-icon.violet { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.stat-icon.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }

.stat-info span { font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; }
.stat-info h3 { font-size: 1.5rem; }

.table-container {
  padding: 2rem;
  border-radius: var(--radius-md);
}

.table-container h3 { margin-bottom: 1.5rem; }

.dash-table {
  width: 100%;
  border-collapse: collapse;
}

.dash-table th {
  text-align: left;
  padding: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  border-bottom: 1px solid var(--border-glass);
}

.dash-table td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border-glass);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.success, .status-badge.delivered { 
    background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge.pending { background: rgba(249, 115, 22, 0.1); color: #f97316; }
.status-badge.shipped { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

.btn-view {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-primary);
  text-decoration: none;
  transition: var(--transition-smooth);
}

.btn-view:hover {
  gap: 0.6rem;
  color: white;
}

@media (max-width: 1200px) {
  .overview-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .dash-layout { grid-template-columns: 1fr; }
  .overview-grid { grid-template-columns: 1fr; }
}
</style>
