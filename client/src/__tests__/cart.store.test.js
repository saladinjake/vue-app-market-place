import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts with an empty cart when localStorage is clear', () => {
    const cart = useCartStore()
    expect(cart.items).toEqual([])
  })

  it('addToCart – adds a new product with quantity 1', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'Widget', price: 9.99 })
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0]).toMatchObject({ id: 1, name: 'Widget', quantity: 1 })
  })

  it('addToCart – increments quantity for existing product', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'Widget', price: 9.99 })
    cart.addToCart({ id: 1, name: 'Widget', price: 9.99 })
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].quantity).toBe(2)
  })

  it('addToCart – adds different products separately', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'A', price: 1 })
    cart.addToCart({ id: 2, name: 'B', price: 2 })
    expect(cart.items).toHaveLength(2)
  })

  it('removeFromCart – removes the correct item', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'A', price: 1 })
    cart.addToCart({ id: 2, name: 'B', price: 2 })
    cart.removeFromCart(1)
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].id).toBe(2)
  })

  it('updateQuantity – clamps to minimum 1', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'A', price: 1 })
    cart.updateQuantity(1, 0)
    expect(cart.items[0].quantity).toBe(1)
  })

  it('updateQuantity – sets a positive quantity', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'A', price: 5 })
    cart.updateQuantity(1, 3)
    expect(cart.items[0].quantity).toBe(3)
  })

  it('clearCart – empties the cart', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'A', price: 1 })
    cart.clearCart()
    expect(cart.items).toHaveLength(0)
  })

  it('totalItems getter – sums all quantities', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'A', price: 1 })
    cart.addToCart({ id: 1, name: 'A', price: 1 }) // quantity → 2
    cart.addToCart({ id: 2, name: 'B', price: 2 })
    expect(cart.totalItems).toBe(3)
  })

  it('totalPrice getter – calculates total correctly', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'A', price: 10 })
    cart.addToCart({ id: 1, name: 'A', price: 10 }) // quantity → 2
    cart.addToCart({ id: 2, name: 'B', price: 5 })
    // total = 10*2 + 5*1 = 25.00
    expect(cart.totalPrice).toBe('25.00')
  })

  it('persists cart to localStorage on change', () => {
    const cart = useCartStore()
    cart.addToCart({ id: 1, name: 'A', price: 1 })
    const stored = JSON.parse(localStorage.getItem('cart'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(1)
  })
})
