// pages/diner/menu/menu.js
const storage = require('../../../utils/storage.js')

Page({
  data: {
    selectedChefId: null,
    chefName: '',
    foodList: [],
    cart: []
  },

  onLoad() {
    // Check if chef ID is passed (from sharing)
    const chefId = wx.getStorageSync('selectedChefId')
    if (chefId) {
      this.loadChefMenu(chefId)
    }
  },

  onShow() {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (!userInfo) {
      // Not logged in, redirect to login
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    // Reload cart from storage
    const cart = wx.getStorageSync('cart') || []
    this.setData({ cart })
  },

  loadChefMenu(chefId) {
    const allFoods = storage.getFoods()
    const chefFoods = allFoods.filter(food => food.chefId === chefId)
    
    const chefName = chefFoods.length > 0 ? chefFoods[0].chefName : 'Unknown Chef'

    this.setData({
      selectedChefId: chefId,
      chefName: chefName,
      foodList: chefFoods
    })

    wx.setStorageSync('selectedChefId', chefId)
  },

  onSearchChef() {
    wx.showModal({
      title: 'Find Chef',
      content: 'Enter Chef ID to view their menu',
      editable: true,
      placeholderText: 'Chef ID',
      success: (res) => {
        if (res.confirm && res.content) {
          const chefId = res.content.trim()
          const allFoods = storage.getFoods()
          const chefFoods = allFoods.filter(food => food.chefId === chefId)
          
          if (chefFoods.length === 0) {
            wx.showToast({
              title: 'Chef not found or has no dishes',
              icon: 'none'
            })
            return
          }

          this.loadChefMenu(chefId)
        }
      }
    })
  },

  onChangeChef() {
    wx.showModal({
      title: 'Change Chef',
      content: 'Your cart will be cleared. Continue?',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('selectedChefId')
          wx.removeStorageSync('cart')
          this.setData({
            selectedChefId: null,
            chefName: '',
            foodList: [],
            cart: []
          })
        }
      }
    })
  },

  onViewFood(e) {
    const foodId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/shared/food-detail/food-detail?id=${foodId}`
    })
  },

  onAddToCart(e) {
    const foodId = e.currentTarget.dataset.id
    const food = storage.getFoodById(foodId)
    
    if (!food) return

    let cart = wx.getStorageSync('cart') || []
    
    // Check if food already in cart
    const existingIndex = cart.findIndex(item => item.foodId === foodId)
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1
    } else {
      cart.push({
        foodId: food.id,
        foodName: food.name,
        chefId: food.chefId,
        chefName: food.chefName,
        image: food.images[0],
        quantity: 1
      })
    }

    wx.setStorageSync('cart', cart)
    this.setData({ cart })

    wx.showToast({
      title: 'Added to cart',
      icon: 'success'
    })
  },

  onViewCart() {
    if (this.data.cart.length === 0) {
      wx.showToast({
        title: 'Cart is empty',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: 'Your Cart',
      content: this.getCartSummary(),
      confirmText: 'Place Order',
      cancelText: 'Continue Shopping',
      success: (res) => {
        if (res.confirm) {
          this.placeOrder()
        }
      }
    })
  },

  getCartSummary() {
    let summary = ''
    this.data.cart.forEach(item => {
      summary += `${item.foodName} × ${item.quantity}\n`
    })
    return summary
  },

  placeOrder() {
    wx.showModal({
      title: 'Add Note',
      content: 'Any special instructions?',
      editable: true,
      placeholderText: 'Optional note...',
      success: (res) => {
        const note = res.confirm ? res.content : ''
        this.submitOrder(note)
      }
    })
  },

  submitOrder(note) {
    const app = getApp()
    const userInfo = app.globalData.userInfo
    const cart = this.data.cart

    const order = {
      userId: userInfo.id,
      userName: userInfo.nickname,
      chefId: this.data.selectedChefId,
      items: cart,
      note: note,
      status: 'pending'
    }

    storage.addOrder(order)

    wx.showToast({
      title: 'Order placed successfully!',
      icon: 'success'
    })

    // Clear cart
    wx.removeStorageSync('cart')
    this.setData({ cart: [] })

    // Navigate to order history
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/diner/order-history/order-history'
      })
    }, 1500)
  }
})