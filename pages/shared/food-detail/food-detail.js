// pages/shared/food-detail/food-detail.js
const storage = require('../../../utils/storage.js')

Page({
  data: {
    food: {},
    isDiner: false
  },

  onLoad(options) {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (options.id) {
      const food = storage.getFoodById(options.id)
      if (food) {
        this.setData({
          food: food,
          isDiner: userInfo && userInfo.role === 'diner'
        })
        
        wx.setNavigationBarTitle({
          title: food.name
        })
      } else {
        wx.showToast({
          title: 'Food not found',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    }
  },

  onAddToCart() {
    const food = this.data.food
    
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

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})