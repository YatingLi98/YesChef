// pages/eater/lucky-food/lucky-food.js
const storage = require('../../../utils/storage.js')

Page({
  data: {
    luckyFood: null,
    spinning: false,
    hasChef: false,
    chefId: null,
    history: []
  },

  onLoad() {
    this.checkChefSelection()
    this.loadHistory()
  },

  onShow() {
    this.checkChefSelection()
  },

  checkChefSelection() {
    const chefId = wx.getStorageSync('selectedChefId')
    this.setData({
      hasChef: !!chefId,
      chefId: chefId
    })
  },

  loadHistory() {
    const history = wx.getStorageSync('lucky_history') || []
    this.setData({
      history: history.slice(0, 5) // Show last 5
    })
  },

  onSpin() {
    if (!this.data.chefId) {
      wx.showToast({
        title: 'Please select a chef first',
        icon: 'none'
      })
      return
    }

    // Get all foods from selected chef
    const allFoods = storage.getFoods()
    const chefFoods = allFoods.filter(food => food.chefId === this.data.chefId)

    if (chefFoods.length === 0) {
      wx.showToast({
        title: 'No dishes available',
        icon: 'none'
      })
      return
    }

    // Start spinning animation
    this.setData({ spinning: true })

    // Simulate spinning for 2 seconds
    setTimeout(() => {
      // Pick random food
      const randomIndex = Math.floor(Math.random() * chefFoods.length)
      const luckyFood = chefFoods[randomIndex]

      this.setData({
        luckyFood: luckyFood,
        spinning: false
      })

      // Save to history
      this.saveToHistory(luckyFood)

      // Show success
      wx.showToast({
        title: '✨ Found your lucky food!',
        icon: 'success'
      })
    }, 2000)
  },

  saveToHistory(food) {
    let history = wx.getStorageSync('lucky_history') || []
    
    // Avoid duplicates
    history = history.filter(item => item.id !== food.id)
    
    // Add to front
    history.unshift(food)
    
    // Keep only last 10
    history = history.slice(0, 10)
    
    wx.setStorageSync('lucky_history', history)
    this.loadHistory()
  },

  onAddLuckyFood() {
    const food = this.data.luckyFood
    if (!food) return

    let cart = wx.getStorageSync('cart') || []
    
    // Check if food already in cart
    const existingIndex = cart.findIndex(item => item.foodId === food.id)
    
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

    wx.showToast({
      title: 'Added to cart!',
      icon: 'success'
    })

    // Navigate to menu
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/diner/menu/menu'
      })
    }, 1500)
  },

  onViewDetails() {
    const food = this.data.luckyFood
    if (!food) return

    wx.navigateTo({
      url: `/pages/shared/food-detail/food-detail?id=${food.id}`
    })
  }
})