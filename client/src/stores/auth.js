import { defineStore } from 'pinia'
import axios from 'axios'

const API = 'http://localhost:5000'

export const useAuthStore = defineStore('auth ', {
    state: () => ({
        responseLogin: {},
        responseSignup: {},
        loading: false,
        error: null
    }),
    actions: {
        async login(params = {}) {
            this.loading = true
            try {
                const res = await axios.post(`${API}/api/auth/login`, { params })
                console.log(res, ">>>>")
                this.response = res.data
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },
        async signup() {
            this.loading = true
            try {
                const res = await axios.post(`${API}/api/auth/signup`)

                this.responseSignup = res.data
            } catch (err) {
                console.error(err)
            } finally {
                this.loading = false
            }
        },

    }
})
