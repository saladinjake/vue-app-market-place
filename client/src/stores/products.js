import { defineStore } from 'pinia'
import axios from 'axios'

const API = 'http://localhost:5005'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    megaMenu: [],
    categories: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      try {
        const res = await axios.get(`${API}/api/products`, { params })
        this.products = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async fetchMegaMenu() {
      try {
        const res = await axios.get(`${API}/api/categories/mega`)
        this.megaMenu = res.data
        this.categories = res.data
      } catch (err) {
        console.error(err)
      }
    },
    async fetchCategories() {
      try {
        const res = await axios.get(`${API}/api/categories`)
        this.categories = res.data
      } catch (err) {
        console.error(err)
      }
    }
  }
})
