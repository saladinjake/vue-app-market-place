import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrderStore } from '../stores/orders'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import axios from 'axios'

const mockOrder = { success: true, orderId: 42 }
const mockOrders = [
  { id: 1, total_amount: 49.99, shipping_details: '{}', user_id: 1 },
  { id: 2, total_amount: 99.99, shipping_details: '{}', user_id: 1 },
]
const mockOrderDetail = { id: 1, total_amount: 49.99, shipping_details: '{}', items: [] }

describe('Orders Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initial state is empty', () => {
    const store = useOrderStore()
    expect(store.orders).toEqual([])
    expect(store.currentOrder).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  describe('placeOrder()', () => {
    it('sets currentOrder on success', async () => {
      axios.post.mockResolvedValueOnce({ data: mockOrder })
      const store = useOrderStore()
      const result = await store.placeOrder({ userId: 1, total: 49.99, items: [] })
      expect(store.currentOrder).toEqual(mockOrder)
      expect(result).toEqual(mockOrder)
      expect(store.loading).toBe(false)
    })

    it('sets error and throws on failure', async () => {
      axios.post.mockRejectedValueOnce(new Error('Payment failed'))
      const store = useOrderStore()
      await expect(store.placeOrder({})).rejects.toThrow('Payment failed')
      expect(store.error).toBe('Payment failed')
    })
  })

  describe('fetchOrders()', () => {
    it('populates orders list on success', async () => {
      axios.get.mockResolvedValueOnce({ data: mockOrders })
      const store = useOrderStore()
      await store.fetchOrders(1)
      expect(store.orders).toEqual(mockOrders)
      expect(store.loading).toBe(false)
    })

    it('calls the correct URL with userId param', async () => {
      axios.get.mockResolvedValueOnce({ data: [] })
      const store = useOrderStore()
      await store.fetchOrders(7)
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/orders'),
        expect.objectContaining({ params: { userId: 7 } })
      )
    })

    it('sets error on failure', async () => {
      axios.get.mockRejectedValueOnce(new Error('Unauthorized'))
      const store = useOrderStore()
      await store.fetchOrders(1)
      expect(store.error).toBe('Unauthorized')
    })
  })

  describe('fetchOrderById()', () => {
    it('sets currentOrder on success', async () => {
      axios.get.mockResolvedValueOnce({ data: mockOrderDetail })
      const store = useOrderStore()
      const result = await store.fetchOrderById(1)
      expect(store.currentOrder).toEqual(mockOrderDetail)
      expect(result).toEqual(mockOrderDetail)
    })

    it('sets error when fetch fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('Not found'))
      const store = useOrderStore()
      await store.fetchOrderById(999)
      expect(store.error).toBe('Not found')
    })
  })
})
